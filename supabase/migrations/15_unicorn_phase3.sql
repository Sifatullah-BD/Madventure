-- Migration: Unicorn Upgrade Phase 3 (Communication & CMS)
-- Implements Chat Rooms, Messages, and CMS System

-- 1. Chat System
CREATE TABLE IF NOT EXISTS public.chat_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255),
    type VARCHAR(30) DEFAULT 'direct', -- 'direct', 'group', 'support'
    entity_type VARCHAR(50), -- 'tour', 'booking'
    entity_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.chat_participants (
    room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(30) DEFAULT 'member',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (room_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id),
    message TEXT,
    message_type VARCHAR(20) DEFAULT 'text', -- 'text', 'image', 'system'
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CMS System
CREATE TABLE IF NOT EXISTS public.cms_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    content JSONB NOT NULL, -- Flexible content structure
    seo_metadata JSONB DEFAULT '{}',
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cms_banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255),
    image_url TEXT NOT NULL,
    link_url TEXT,
    placement VARCHAR(50), -- 'home_hero', 'tour_listing'
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RLS
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_banners ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Participants can view their rooms" ON public.chat_rooms
    FOR SELECT USING (EXISTS (SELECT 1 FROM public.chat_participants WHERE room_id = id AND user_id = auth.uid()));

CREATE POLICY "Participants can view messages" ON public.chat_messages
    FOR SELECT USING (EXISTS (SELECT 1 FROM public.chat_participants WHERE room_id = chat_messages.room_id AND user_id = auth.uid()));

CREATE POLICY "Participants can send messages" ON public.chat_messages
    FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.chat_participants WHERE room_id = chat_messages.room_id AND user_id = auth.uid()));

CREATE POLICY "Allow public read on published CMS" ON public.cms_pages FOR SELECT USING (is_published = true);
CREATE POLICY "Allow public read on active banners" ON public.cms_banners FOR SELECT USING (is_active = true);
