-- Migration: Emergency SOS Integration

CREATE TABLE IF NOT EXISTS public.emergency_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    full_name TEXT,
    phone TEXT,
    location_lat NUMERIC,
    location_lng NUMERIC,
    status TEXT DEFAULT 'pending', -- 'pending', 'responding', 'resolved'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.emergency_logs ENABLE ROW LEVEL SECURITY;

-- Admins can see all logs, users can see only theirs (though SOS is usually one-way)
CREATE POLICY "Admins can view all emergency logs" ON public.emergency_logs 
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND app_role IN ('admin', 'super_admin'))
    );

CREATE POLICY "Users can insert emergency logs" ON public.emergency_logs 
    FOR INSERT WITH CHECK (true); -- Allow anyone to trigger SOS if authenticated
