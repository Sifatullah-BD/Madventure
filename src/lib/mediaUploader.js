// src/lib/mediaUploader.js
// Utility to upload image/video files to Supabase Storage and return a public URL.
// Assumes a Supabase client instance is exported from '@/lib/db'.

/**
 * Upload a file to a Supabase storage bucket with validation.
 *
 * @param {object} supabase - Supabase client (created via createClient).
 * @param {File|Blob|Uint8Array|ArrayBuffer} file - The file/bytes to upload.
 * @param {string} fileName - Desired filename (including any folder prefix, e.g., "posts/abc123.jpg").
 * @param {string} [bucket='media'] - Storage bucket name (must exist in Supabase project).
 * @returns {Promise<string>} - Public URL of the uploaded file.
 * @throws {Error} - If validation fails or upload encounters an error.
 */
export const uploadMedia = async (supabase, file, fileName, bucket = 'media') => {
  // ----- Validation -----
  const mimeType = file && typeof file.type === 'string' ? file.type : null;
  const size = file && typeof file.size === 'number' ? file.size : null; // bytes

  if (mimeType) {
    const isImage = mimeType.startsWith('image/');
    const isVideo = mimeType.startsWith('video/');
    if (isImage && size !== null && size > 10 * 1024 * 1024) {
      throw new Error('Image files must be 10 MB or smaller');
    }
    if (isVideo && size !== null && size > 50 * 1024 * 1024) {
      throw new Error('Video files must be 50 MB or smaller');
    }
    if (!isImage && !isVideo) {
      throw new Error(`Unsupported media type "${mimeType}". Only images and videos are allowed.`);
    }
  }

  // ----- Bucket existence check -----
  const { error: bucketError } = await supabase.storage.from(bucket).list('', { limit: 1 });
  if (bucketError) {
    throw new Error(`Supabase storage bucket "${bucket}" not accessible: ${bucketError.message}`);
  }

  // ----- Upload -----
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      upsert: false,
      contentType: mimeType || undefined,
    });

  if (uploadError) {
    throw new Error(`Failed to upload media: ${uploadError.message}`);
  }

  // ----- Public URL -----
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(uploadData.path);
  if (!urlData?.publicUrl) {
    throw new Error('Unable to get public URL');
  }
  return urlData.publicUrl;
};
