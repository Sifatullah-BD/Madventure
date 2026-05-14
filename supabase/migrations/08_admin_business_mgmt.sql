-- Migration: Admin & Business Management Enhancements
-- Tools for managing partners and auditing

-- Add verification details to agencies
ALTER TABLE public.tour_agencies 
ADD COLUMN IF NOT EXISTS trade_license_id TEXT,
ADD COLUMN IF NOT EXISTS contact_person TEXT,
ADD COLUMN IF NOT EXISTS business_address TEXT;

-- Create a view for admin to see user stats (if needed)
-- But we can just use the profiles table

-- Ensure audit logs capture role changes
CREATE OR REPLACE FUNCTION public.log_role_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.app_role IS DISTINCT FROM NEW.app_role THEN
        INSERT INTO public.audit_logs (actor_id, action, entity_type, entity_id, metadata)
        VALUES (
            auth.uid(),
            'update_role',
            'profile',
            NEW.id,
            jsonb_build_object('old_role', OLD.app_role, 'new_role', NEW.app_role)
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_log_role_change ON public.profiles;
CREATE TRIGGER trigger_log_role_change
AFTER UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.log_role_change();
