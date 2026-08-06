-- Enums
CREATE TYPE public.tour_status AS ENUM ('draft', 'pending', 'published', 'suspended', 'archived');
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE public.payment_status AS ENUM ('unpaid', 'partial', 'paid', 'refunded');

-- Places / Destinations
CREATE TABLE IF NOT EXISTS public.places (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    division VARCHAR(100),
    district VARCHAR(100),
    description TEXT,
    images JSONB DEFAULT '[]'::jsonb,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tours
CREATE TABLE IF NOT EXISTS public.tours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID REFERENCES public.user_profiles(id) NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    place_id UUID REFERENCES public.places(id),
    base_price DECIMAL(10, 2) NOT NULL,
    max_capacity INT NOT NULL,
    status public.tour_status DEFAULT 'draft'::public.tour_status,
    images JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tour Schedules
CREATE TABLE IF NOT EXISTS public.tour_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tour_id UUID REFERENCES public.tours(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    available_seats INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT check_dates CHECK (end_date >= start_date),
    CONSTRAINT check_seats CHECK (available_seats >= 0)
);

-- Bookings
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    tour_schedule_id UUID REFERENCES public.tour_schedules(id) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    seats_booked INT NOT NULL CHECK (seats_booked > 0),
    booking_status public.booking_status DEFAULT 'pending'::public.booking_status,
    payment_status public.payment_status DEFAULT 'unpaid'::public.payment_status,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tours_agency ON public.tours(agency_id);
CREATE INDEX IF NOT EXISTS idx_tours_status ON public.tours(status);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON public.bookings(user_id);

-- Updated_at triggers
CREATE TRIGGER places_updated_at BEFORE UPDATE ON public.places FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER tours_updated_at BEFORE UPDATE ON public.tours FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER tour_schedules_updated_at BEFORE UPDATE ON public.tour_schedules FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- RLS
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Places: Anyone can read
CREATE POLICY "Places are public" ON public.places FOR SELECT USING (true);

-- Tours: Public can view published
CREATE POLICY "Published tours are public" ON public.tours FOR SELECT USING (status = 'published');
-- Agency can manage their own tours
CREATE POLICY "Agency can manage own tours" ON public.tours FOR ALL USING (auth.uid() = agency_id);

-- Schedules: Public can view
CREATE POLICY "Schedules are public" ON public.tour_schedules FOR SELECT USING (true);
-- Agency can manage their own schedules
CREATE POLICY "Agency can manage own schedules" ON public.tour_schedules FOR ALL USING (
    auth.uid() IN (SELECT agency_id FROM public.tours WHERE id = tour_id)
);

-- Bookings: Users can view their own
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
-- Users can create their own booking
CREATE POLICY "Users can create booking" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
