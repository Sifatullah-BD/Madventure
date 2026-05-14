import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Upload an image sequence to Supabase Storage
 */
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

    const uploadedPaths = [];
    
    for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${Date.now()}_${fileName}`;

        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(filePath, file);

        if (error) {
            console.error('Storage Upload Error:', error);
            return { data: null, error };
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath);

        uploadedPaths.push(publicUrl);
    }

    return { data: uploadedPaths, error: null };
};
