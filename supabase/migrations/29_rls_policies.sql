-- 1. Enable RLS on core tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

-- 2. Profiles Policies
-- Users can read their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Public can read basic profile info (if needed for community, e.g., name/avatar)
-- This is optional depending on requirements, but generally needed for social features
CREATE POLICY "Public can view basic profiles" 
ON public.profiles FOR SELECT 
USING (true);

-- 3. Bookings Policies
-- Users can see their own bookings
CREATE POLICY "Users can view own bookings" 
ON public.bookings FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own bookings
CREATE POLICY "Users can create own bookings" 
ON public.bookings FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 4. Payment Transactions Policies
-- Users can see their own payment transactions
CREATE POLICY "Users can view own transactions" 
ON public.payment_transactions FOR SELECT 
USING (auth.uid() = user_id);

-- 5. Wallets Policies
-- Users can see their own wallet
CREATE POLICY "Users can view own wallet" 
ON public.wallets FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own wallet (initial creation)
CREATE POLICY "Users can create own wallet" 
ON public.wallets FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Admins bypass all RLS inherently if they are using Service Role key on the backend
-- To allow an admin role (app_role='admin') to bypass via client key (not recommended, better to use Edge Functions for admin tasks)
-- But if needed:
-- CREATE POLICY "Admins have full access to bookings" ON public.bookings FOR ALL USING ( (select (auth.jwt() -> 'user_metadata' ->> 'app_role')) = 'admin' );
