-- Production: profiles (RBAC + FCM), wallet ledger, payment audit, booking extras
-- Apply after 01_schema.sql. Grant admin in SQL: UPDATE public.profiles SET app_role = 'admin' WHERE id = '<auth user uuid>';

-- ---------------------------------------------------------------------------
-- Profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
    full_name TEXT,
    app_role TEXT NOT NULL DEFAULT 'traveler',
    fcm_token TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT profiles_app_role_check CHECK (
        app_role IN (
            'traveler',
            'agency',
            'hotel_owner',
            'guide',
            'partner',
            'moderator',
            'admin',
            'super_admin'
        )
    )
);

CREATE INDEX IF NOT EXISTS idx_profiles_app_role ON public.profiles (app_role);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Optional self-insert if trigger did not run (e.g. legacy users)
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, app_role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        'traveler'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Bookings: payment + structured extras (JSON)
-- ---------------------------------------------------------------------------
ALTER TABLE public.bookings
    ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'pending';

ALTER TABLE public.bookings
    ADD COLUMN IF NOT EXISTS extras JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON public.bookings (payment_status);

-- ---------------------------------------------------------------------------
-- Payment transactions (idempotency via val_id when present)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings (id) ON DELETE SET NULL,
    user_id TEXT NOT NULL,
    gateway TEXT NOT NULL DEFAULT 'sslcommerz',
    tran_id TEXT,
    val_id TEXT,
    amount NUMERIC(12, 2),
    payment_status TEXT NOT NULL,
    gateway_response JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS payment_transactions_val_id_key
    ON public.payment_transactions (val_id)
    WHERE val_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_payment_transactions_booking_id ON public.payment_transactions (booking_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON public.payment_transactions (user_id);

ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "payment_transactions_select_own" ON public.payment_transactions;
CREATE POLICY "payment_transactions_select_own" ON public.payment_transactions
    FOR SELECT
    USING (user_id = auth.uid()::text);

-- ---------------------------------------------------------------------------
-- Wallets + ledger (read from app; writes prefer Edge/service role)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users (id) ON DELETE CASCADE,
    current_balance NUMERIC(12, 2) NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'BDT',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.wallet_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL REFERENCES public.wallets (id) ON DELETE CASCADE,
    transaction_type TEXT NOT NULL,
    reference_type TEXT,
    reference_id UUID,
    debit NUMERIC(12, 2) NOT NULL DEFAULT 0,
    credit NUMERIC(12, 2) NOT NULL DEFAULT 0,
    balance_after NUMERIC(12, 2),
    remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wallet_ledger_wallet_id ON public.wallet_ledger (wallet_id);

ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_ledger ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "wallets_select_own" ON public.wallets;
CREATE POLICY "wallets_select_own" ON public.wallets FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "wallets_insert_own" ON public.wallets;
CREATE POLICY "wallets_insert_own" ON public.wallets FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "wallet_ledger_select_own" ON public.wallet_ledger;
CREATE POLICY "wallet_ledger_select_own" ON public.wallet_ledger
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.wallets w
            WHERE w.id = wallet_ledger.wallet_id AND w.user_id = auth.uid()
        )
    );
