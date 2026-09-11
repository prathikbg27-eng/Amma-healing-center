# Amma Healing Centre — Complete Deployment & Setup Guide

This guide covers everything required to connect your Supabase database, configure authentication, test the appointment booking system, and deploy the production website to **Vercel** (while maintaining static preview compatibility on **GitHub Pages**).

---

## 1. Create Your Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and log in or sign up.
2. Click **New Project**.
3. Choose an Organization, provide a Project Name (e.g. `amma-healing-center`), choose a strong database password, and select the region closest to your visitors (e.g. `ap-south-1` Mumbai / India).
4. Click **Create new project** and wait for the database provisioning to complete (1–2 minutes).

---

## 2. Create the Appointments Table & Security Policies

1. In your Supabase Project dashboard, open the **SQL Editor** from the left navigation.
2. Click **New query**.
3. Copy and paste the entire contents of `supabase/schema.sql` located in this repository:

```sql
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

-- 2. Create Indexes for High Performance
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON public.appointments (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments (status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments (appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_phone ON public.appointments (phone);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policy 1: Allow public / anonymous users to insert appointment requests
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
```

4. Click **Run** (or `Ctrl`+`Enter`). You should see `Success. No rows returned`.

---

## 3. Create the First Admin Account

1. In the Supabase dashboard, navigate to **Authentication** -> **Users**.
2. Click **Add User** -> **Create user**.
3. Enter your desired Admin Email (e.g. `admin@ammahealingcenter.com`) and a secure password.
4. Toggle **Auto Confirm User?** to **ON** (so email verification is not required for your initial admin login).
5. Click **Create user**.

---

## 4. Configure Frontend Supabase Credentials

1. In the Supabase dashboard, go to **Project Settings** -> **API**.
2. Locate the following keys:
   - **Project URL** (e.g. `https://xyzabcdefg.supabase.co`)
   - **Project API Keys** -> `anon` / `public` key (e.g. `eyJhbGciOi...`)
3. Open `js/config.js` in your project and update the `supabaseUrl` and `supabaseAnonKey` fields:

```javascript
// In js/config.js:
supabaseUrl: "https://xyzabcdefg.supabase.co",
supabaseAnonKey: "eyJhbGciOi...",
```

> [!WARNING]
> **Never** put the `service_role` (secret) key into `js/config.js` or client-side files. The public `anon` key is strictly protected by the Row Level Security (RLS) policies you created.

---

## 5. Verify & Update Business WhatsApp Numbers

In `js/config.js`, verify or update your business WhatsApp numbers:

```javascript
whatsappNumber: "919731138761",   // Primary WhatsApp business number
whatsappNumber2: "919880502058",  // Secondary WhatsApp business number
```

*(Numbers must include the country code without plus sign or leading zeros, e.g. `91` for India followed by 10 digits).*

---

## 6. Deploy to Vercel

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "Add Supabase appointment booking system and admin portal"
   git push origin main
   ```
2. Log in to [Vercel](https://vercel.com).
3. Click **Add New...** -> **Project**.
4. Import your `Amma-healing-center` GitHub repository.
5. Framework Preset: Choose **Other** (standard HTML/JS).
6. Click **Deploy**.
7. Vercel will deploy your website in seconds and provide a production HTTPS URL.
8. The `vercel.json` included in this repo automatically sets up `/admin` clean routing and strict security headers.

---

## 7. Admin Dashboard Access & Usage

1. Open `https://your-domain.vercel.app/admin` (or `/admin/index.html` locally).
2. Enter the admin email and password you created in Step 3.
3. The dashboard allows you to:
   - View live booking metrics (Total, Pending, Confirmed, Completed, Cancelled, Today).
   - Filter bookings by status (All, Pending, Confirmed, Completed, Cancelled).
   - Instant search by customer name, phone number, or therapy.
   - Click **View** to inspect full customer concerns.
   - Click **Confirm**, **Complete**, or **Cancel** to update appointment status.
   - Click **WhatsApp Customer** to open a pre-filled WhatsApp message with appointment details directly to the customer.

---

## 8. Verification Checklist

- [x] **Desktop Booking**: Opens modal, validates 10-digit Indian phone, checks required date/therapy, submits to Supabase, generates formatted WhatsApp message.
- [x] **Mobile Booking**: Modal fits mobile viewports without horizontal scrolling, touch targets are comfortable, sticky close button works.
- [x] **Validation**: Prevents past dates, invalid phone formats, or missing therapy selections.
- [x] **Security**: Anon users can only insert records; authenticated admin can read/update/delete via RLS.
- [x] **Admin Actions**: Real-time status update, deletion with confirmation, customer WhatsApp direct link.
