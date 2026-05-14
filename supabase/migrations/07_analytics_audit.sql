-- Migration: Analytics & Audit Logs
-- System for tracking events and audit trails

CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles (id) ON DELETE SET NULL,
    event_name TEXT NOT NULL,
    event_data JSONB DEFAULT '{}',
    page_url TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles (id) ON DELETE SET NULL,
    action_type TEXT NOT NULL, -- 'create', 'update', 'delete', 'login'
    entity_type TEXT NOT NULL, -- 'booking', 'tour', 'profile'
    entity_id TEXT,
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Analytics: Allow authenticated users to insert events
CREATE POLICY "analytics_insert" 
ON public.analytics_events FOR INSERT 
WITH CHECK (true); -- Anyone can send analytics (IP/UA will be captured)

-- Audit: Only admins can view
CREATE POLICY "audit_view_admin" 
ON public.audit_logs FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin')
    )
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_analytics_event ON public.analytics_events (event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_user ON public.analytics_events (user_id);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON public.audit_logs (actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON public.audit_logs (entity_type, entity_id);
