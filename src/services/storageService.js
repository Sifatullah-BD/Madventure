import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Upload an image sequence to Supabase Storage
 */
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml'];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB per image

export const uploadImages = async (bucketName, files) => {
    if (!isSupabaseConfigured) {
        // Fallback: Return mock relative paths simulating a successful upload
        return new Promise(resolve => {
            setTimeout(() => {
                const mockPaths = files.map(f => `/mock-storage/${bucketName}/${Date.now()}_${f.name}`);
                resolve({ data: mockPaths, error: null });
            }, 800);
        });
    }

    // Validate all files first so partial uploads never happen for invalid input
    for (const file of files) {
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
            return { data: null, error: new Error(`"${file.name}" is not an accepted image type (${ACCEPTED_IMAGE_TYPES.join(', ')}).`) };
        }
        if (file.size > MAX_IMAGE_SIZE) {
            return { data: null, error: new Error(`"${file.name}" is larger than 10 MB.`) };
        }
    }

    const uploadedPaths = [];
    
    for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${Date.now()}_${fileName}`;

        const { error } = await supabase.storage
            .from(bucketName)
            .upload(filePath, file, {
                upsert: false,
                contentType: file.type || undefined,
            });

        if (error) {
            console.error('Storage Upload Error:', error);
            return { data: null, error };
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath);

        uploadedPaths.push(urlData?.publicUrl || null);
    }

    return { data: uploadedPaths, error: null };
};
