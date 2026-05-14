-- Notification Logs for WhatsApp and SMS tracking

CREATE TABLE IF NOT EXISTS public.notification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id),
    recipient_phone TEXT NOT NULL,
    notification_type TEXT NOT NULL, -- 'whatsapp', 'sms'
    message_content TEXT,
    status TEXT DEFAULT 'sent', -- 'sent', 'failed', 'delivered'
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    provider TEXT -- 'ssl_wireless', 'twilio', 'simulation'
);

-- RLS
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all notifications" ON public.notification_logs
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.app_role IN ('admin', 'super_admin'))
    );
