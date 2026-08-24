-- Migration 33: Social connections, safety controls, activity and notification routing

ALTER TABLE public.notifications
    ADD COLUMN IF NOT EXISTS actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS entity_type TEXT,
    ADD COLUMN IF NOT EXISTS entity_id UUID,
    ADD COLUMN IF NOT EXISTS action_url TEXT,
    ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS public.connection_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    responded_at TIMESTAMPTZ,
    CONSTRAINT connection_request_not_self CHECK (sender_id <> receiver_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS connection_requests_pending_pair
    ON public.connection_requests(sender_id, receiver_id) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_connection_requests_receiver ON public.connection_requests(receiver_id, status);
CREATE INDEX IF NOT EXISTS idx_connection_requests_sender ON public.connection_requests(sender_id, status);

CREATE TABLE IF NOT EXISTS public.connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    connected_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT connection_not_self CHECK (user_id <> connected_user_id),
    CONSTRAINT connections_ordered_pair CHECK (user_id < connected_user_id),
    UNIQUE(user_id, connected_user_id)
);

CREATE TABLE IF NOT EXISTS public.user_blocks (
    blocker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    blocked_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (blocker_id, blocked_id),
    CONSTRAINT block_not_self CHECK (blocker_id <> blocked_id)
);

CREATE TABLE IF NOT EXISTS public.content_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('profile', 'post', 'comment', 'group', 'business', 'review', 'message')),
    entity_id UUID NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'reviewing', 'resolved', 'dismissed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_content_reports_status ON public.content_reports(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_reports_entity ON public.content_reports(entity_type, entity_id);

CREATE TABLE IF NOT EXISTS public.activity_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_events_actor ON public.activity_events(actor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_events_entity ON public.activity_events(entity_type, entity_id, created_at DESC);

ALTER TABLE public.connection_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS connection_requests_select_own ON public.connection_requests;
CREATE POLICY connection_requests_select_own ON public.connection_requests
    FOR SELECT USING (auth.uid() IN (sender_id, receiver_id));
DROP POLICY IF EXISTS connection_requests_insert_own ON public.connection_requests;
CREATE POLICY connection_requests_insert_own ON public.connection_requests
    FOR INSERT WITH CHECK (auth.uid() = sender_id);
DROP POLICY IF EXISTS connection_requests_update_participant ON public.connection_requests;
CREATE POLICY connection_requests_update_participant ON public.connection_requests
    FOR UPDATE USING (auth.uid() IN (sender_id, receiver_id));

DROP POLICY IF EXISTS connections_select_member ON public.connections;
CREATE POLICY connections_select_member ON public.connections
    FOR SELECT USING (auth.uid() IN (user_id, connected_user_id));

DROP POLICY IF EXISTS user_blocks_manage_own ON public.user_blocks;
CREATE POLICY user_blocks_manage_own ON public.user_blocks
    FOR ALL USING (auth.uid() = blocker_id) WITH CHECK (auth.uid() = blocker_id);

DROP POLICY IF EXISTS content_reports_insert_own ON public.content_reports;
CREATE POLICY content_reports_insert_own ON public.content_reports
    FOR INSERT WITH CHECK (auth.uid() = reporter_id);
DROP POLICY IF EXISTS content_reports_select_own_or_staff ON public.content_reports;
CREATE POLICY content_reports_select_own_or_staff ON public.content_reports
    FOR SELECT USING (auth.uid() = reporter_id OR public.is_staff());

DROP POLICY IF EXISTS activity_events_select_own ON public.activity_events;
CREATE POLICY activity_events_select_own ON public.activity_events
    FOR SELECT USING (auth.uid() = actor_id);

DROP POLICY IF EXISTS notifications_update_own ON public.notifications;
CREATE POLICY notifications_update_own ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);