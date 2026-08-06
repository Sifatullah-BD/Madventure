// src/lib/__tests__/mediaUploader.test.js
// Jest unit tests for src/lib/mediaUploader.js

import { uploadMedia } from '@/lib/mediaUploader';

// Helper to create a mock Supabase client
const createMockSupabase = (options = {}) => {
  const { bucketListError, uploadError, publicUrlError } = options;
  return {
    storage: {
      from: (bucket) => ({
        // list used to verify bucket existence
        list: async () => ({ error: bucketListError ? { message: bucketListError } : null }),
        // upload simulated upload
        upload: async (fileName, file, config) => {
          if (uploadError) return { data: null, error: { message: uploadError } };
          return { data: { path: `${bucket}/${fileName}` }, error: null };
        },
        // getPublicUrl returns a URL
        getPublicUrl: (path) => {
          if (publicUrlError) return { publicURL: null, error: { message: publicUrlError } };
          return { publicURL: `https://example.com/${path}`, error: null };
        },
      }),
    },
  };
};

describe('uploadMedia', () => {
  const bucket = 'media';
  const fileName = 'test/image.jpg';

  test('successfully uploads a valid image and returns public URL', async () => {
    const mockFile = new File(['dummy'], 'image.jpg', { type: 'image/jpeg', lastModified: Date.now() });
    // Set size under limit (5 MB)
    Object.defineProperty(mockFile, 'size', { value: 5 * 1024 * 1024 });
    const supabase = createMockSupabase();
    const url = await uploadMedia(supabase, mockFile, fileName, bucket);
    expect(url).toBe(`https://example.com/${bucket}/${fileName}`);
  });

  test('rejects image files larger than 10 MB', async () => {
    const mockFile = new File(['large'], 'big.jpg', { type: 'image/png' });
    Object.defineProperty(mockFile, 'size', { value: 12 * 1024 * 1024 }); // 12 MB
    const supabase = createMockSupabase();
    await expect(uploadMedia(supabase, mockFile, fileName, bucket)).rejects.toThrow('Image files must be 10 MB or smaller');
  });

  test('rejects video files larger than 50 MB', async () => {
    const mockFile = new File(['large'], 'big.mp4', { type: 'video/mp4' });
    Object.defineProperty(mockFile, 'size', { value: 55 * 1024 * 1024 }); // 55 MB
    const supabase = createMockSupabase();
    await expect(uploadMedia(supabase, mockFile, fileName, bucket)).rejects.toThrow('Video files must be 50 MB or smaller');
  });

  test('rejects unsupported mime types', async () => {
    const mockFile = new File(['data'], 'doc.pdf', { type: 'application/pdf' });
    Object.defineProperty(mockFile, 'size', { value: 1000 });
    const supabase = createMockSupabase();
    await expect(uploadMedia(supabase, mockFile, fileName, bucket)).rejects.toThrow('Unsupported media type "application/pdf"');
  });

  test('propagates bucket access error', async () => {
    const mockFile = new File(['data'], 'image.jpg', { type: 'image/jpeg' });
    Object.defineProperty(mockFile, 'size', { value: 1000 });
    const supabase = createMockSupabase({ bucketListError: 'Bucket missing' });
    await expect(uploadMedia(supabase, mockFile, fileName, bucket)).rejects.toThrow('Supabase storage bucket "media" not accessible: Bucket missing');
  });

  test('propagates upload error', async () => {
    const mockFile = new File(['data'], 'image.jpg', { type: 'image/jpeg' });
    Object.defineProperty(mockFile, 'size', { value: 1000 });
    const supabase = createMockSupabase({ uploadError: 'Network failure' });
    await expect(uploadMedia(supabase, mockFile, fileName, bucket)).rejects.toThrow('Failed to upload media: Network failure');
  });

  test('propagates public URL error', async () => {
    const mockFile = new File(['data'], 'image.jpg', { type: 'image/jpeg' });
    Object.defineProperty(mockFile, 'size', { value: 1000 });
    const supabase = createMockSupabase({ publicUrlError: 'Signed URL failed' });
    await expect(uploadMedia(supabase, mockFile, fileName, bucket)).rejects.toThrow('Unable to get public URL: Signed URL failed');
  });
});
