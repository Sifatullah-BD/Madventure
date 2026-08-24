import { supabase, isSupabaseConfigured } from '../../lib/supabase';

// Mock Data for fallback when Supabase is not configured
const MOCK_POSTS = [
    {
        id: '1',
        title: 'কক্সবাজার ৩ দিনের বাজেট গাইড',
        slug: 'coxs-bazar-3-days-budget-guide',
        cover_image: 'https://images.unsplash.com/photo-1600295628549-05eb823b16d7?auto=format&fit=crop&w=800&q=80',
        excerpt: 'মাত্র ৫ হাজার টাকায় কীভাবে ৩ দিন ২ রাত কক্সবাজার ঘুরে আসবেন তার বিস্তারিত গাইড।',
        content: `<h2>কক্সবাজার কেন যাবেন?</h2><p>কক্সবাজার শুধু বাংলাদেশের নয়, বিশ্বের দীর্ঘতম প্রাকৃতিক সমুদ্রসৈকত...</p>`,
        category: 'Budget Travel',
        tags: ['coxs-bazar', 'budget', 'guide'],
        author_id: 'admin_1',
        status: 'published',
        language: 'bn',
        views: 1250,
        reading_time: 5,
        meta_title: 'কক্সবাজার ৩ দিনের বাজেট গাইড | Madventure',
        meta_description: 'কম খরচে কক্সবাজার ঘোরার কমপ্লিট গাইডলাইন।',
        published_at: new Date().toISOString(),
    },
    {
        id: '2',
        title: 'সাজেক ভ্যালি: মেঘের দেশে হারিয়ে যাওয়া',
        slug: 'sajek-valley-travel-guide',
        cover_image: 'https://images.unsplash.com/photo-1623169822765-a86f9175d713?auto=format&fit=crop&w=800&q=80',
        excerpt: 'রাঙ্গামাটির ছাদ হিসেবে পরিচিত সাজেক ভ্যালিতে যাওয়ার উপায়, খরচ এবং থাকার জায়গার বিস্তারিত তথ্য।',
        content: `<h2>সাজেক ভ্যালি কীভাবে যাবেন?</h2><p>খাগড়াছড়ি হয়ে দীঘিনালা থেকে চান্দের গাড়িতে করে সাজেক যেতে হয়...</p>`,
        category: 'Destination Guide',
        tags: ['sajek', 'hills', 'guide'],
        author_id: 'admin_1',
        status: 'published',
        language: 'bn',
        views: 890,
        reading_time: 4,
        meta_title: 'সাজেক ভ্যালি ট্রাভেল গাইড | Madventure',
        meta_description: 'সাজেক যাওয়ার সম্পূর্ণ গাইড এবং টিপস।',
        published_at: new Date().toISOString(),
    }
];

export const blogService = {
    /**
     * Get all published blog posts
     */
    async getPublishedPosts(lang = 'bn') {
        if (!isSupabaseConfigured) {
            return MOCK_POSTS.filter(p => p.language === lang);
        }

        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('status', 'published')
            .eq('language', lang)
            .order('published_at', { ascending: false });

        if (error) {
            console.error("Error fetching blog posts:", error);
            if (error.code === 'PGRST205') return MOCK_POSTS.filter(p => p.language === lang).length
                ? MOCK_POSTS.filter(p => p.language === lang) : MOCK_POSTS;
            throw error;
        }
        return data;
    },

    /**
     * Get a single post by slug
     */
    async getPostBySlug(slug) {
        if (!isSupabaseConfigured) {
            const post = MOCK_POSTS.find(p => p.slug === slug);
            if (!post) throw new Error("Post not found");
            
            // Simulate view count update
            return { ...post, views: post.views + 1 };
        }

        // Fetch post
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*, author:profiles(id, first_name, last_name, avatar_url)')
            .eq('slug', slug)
            .single();

        if (error) {
            console.error("Error fetching single post:", error);
            throw error;
        }

        // Increment view count asynchronously
        if (data && data.id) {
            supabase.rpc('increment_blog_views', { blog_id: data.id }).catch(console.error);
        }

        return data;
    },

    async getPostById(id) {
        if (!isSupabaseConfigured) {
            const post = MOCK_POSTS.find(item => item.id === id);
            if (!post) throw new Error('Post not found');
            return post;
        }
        const { data, error } = await supabase.from('blog_posts').select('*').eq('id', id).single();
        if (error) throw error;
        return data;
    },

    /**
     * Get posts by category
     */
    async getPostsByCategory(category, lang = 'bn') {
        if (!isSupabaseConfigured) {
            return MOCK_POSTS.filter(p => p.category === category && p.language === lang);
        }

        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('status', 'published')
            .eq('language', lang)
            .eq('category', category)
            .order('published_at', { ascending: false });

        if (error) {
            console.error("Error fetching category posts:", error);
            if (error.code === 'PGRST205') return MOCK_POSTS.filter(p => p.category === category && p.language === lang);
            throw error;
        }
        return data;
    },

    /**
     * Get related posts
     */
    async getRelatedPosts(postId, category, limit = 3) {
        if (!isSupabaseConfigured) {
            return MOCK_POSTS.filter(p => p.id !== postId).slice(0, limit);
        }

        const { data, error } = await supabase
            .from('blog_posts')
            .select('id, title, slug, cover_image, reading_time, published_at')
            .eq('status', 'published')
            .eq('category', category)
            .neq('id', postId)
            .order('published_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data;
    },

    /**
     * Get posts by user (author)
     */
    async getUserPosts(userId, lang = 'bn') {
        if (!isSupabaseConfigured) {
            return MOCK_POSTS.filter(p => p.author_id === userId && p.language === lang);
        }

        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('author_id', userId)
            .order('published_at', { ascending: false });

        if (error) {
            console.error("Error fetching user posts:", error);
            throw error;
        }
        return data;
    },

    /**
     * Save or Update a blog post (Admin only)
     */
    async savePost(postData, id = null) {
        if (!isSupabaseConfigured) {
            console.log("Simulating post save:", postData);
            return { id: `mock_${Date.now()}`, ...postData };
        }

        // Auto-calculate reading time if not provided (approx 200 words per min)
        if (!postData.reading_time && postData.content) {
            const wordCount = postData.content.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
            postData.reading_time = Math.ceil(wordCount / 200);
        }

        if (postData.id || id) {
            // Update
            const { data, error } = await supabase
                .from('blog_posts')
                .update({ ...postData, updated_at: new Date().toISOString() })
                .eq('id', postData.id || id)
                .select()
                .single();
            if (error) throw error;
            return data;
        } else {
            // Insert
            const { data, error } = await supabase
                .from('blog_posts')
                .insert({ ...postData, published_at: postData.status === 'published' ? new Date().toISOString() : null })
                .select()
                .single();
            if (error) throw error;
            return data;
        }
    }
};
