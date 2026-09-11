-- ==============================================================================
-- AMMA HEALING CENTRE - DATABASE SCHEMA & ROW LEVEL SECURITY POLICIES
-- Target Database: Supabase PostgreSQL
-- ==============================================================================

-- 1. Create Appointments Table
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    therapy TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    preferred_time TEXT NOT NULL,
    concern TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON public.appointments (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments (status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments (appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_phone ON public.appointments (phone);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policy 1: Allow public / anonymous users to insert appointment requests
-- Public visitors can submit bookings, but cannot read other customers' data.
CREATE POLICY "Allow public insert appointments"
ON public.appointments
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 5. RLS Policy 2: Allow authenticated admin users to read all appointments
CREATE POLICY "Allow authenticated admin select appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (true);

-- 6. RLS Policy 3: Allow authenticated admin users to update appointment status/records
CREATE POLICY "Allow authenticated admin update appointments"
ON public.appointments
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 7. RLS Policy 4: Allow authenticated admin users to delete appointments
CREATE POLICY "Allow authenticated admin delete appointments"
ON public.appointments
FOR DELETE
TO authenticated
USING (true);

-- ==============================================================================
-- NOTES:
-- - Service role key is never exposed on the frontend.
-- - Authenticated admin users log in via Supabase Auth (email + password).
-- - Anonymous visitors only have INSERT access via the public anon key.
-- ==============================================================================
