-- =====================================================
-- SECURITY FIX MIGRATION
-- Fixes: Email exposure, admin status exposure, function search_path
-- =====================================================

-- 1. Create app_role enum and user_roles table for proper role management
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 2. Create security definer function to check roles (prevents recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 3. Create function to check admin status securely
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.user_profiles WHERE id = _user_id),
    false
  )
$$;

-- 4. Migrate existing admins to user_roles table
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM public.user_profiles
WHERE is_admin = true
ON CONFLICT (user_id, role) DO NOTHING;

-- 5. Create a secure PUBLIC view for user_profiles (without email, is_admin)
DROP VIEW IF EXISTS public.user_profiles_public;
CREATE VIEW public.user_profiles_public
WITH (security_invoker=on) AS
  SELECT 
    id,
    full_name,
    avatar_url,
    created_at,
    updated_at
  FROM public.user_profiles;

-- 6. RLS policies for user_roles table
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- 7. Fix user_profiles RLS - remove public access, only allow authenticated access
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.user_profiles;

-- Only authenticated users can view profiles (their own full, others limited)
CREATE POLICY "Authenticated users can view own full profile"
  ON public.user_profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Admins can view all profiles"
  ON public.user_profiles FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- 8. Fix SECURITY DEFINER functions to have search_path
CREATE OR REPLACE FUNCTION public.update_event_registration_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE events
    SET registration_count = registration_count + 1
    WHERE id = NEW.event_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE events
    SET registration_count = GREATEST(0, registration_count - 1)
    WHERE id = OLD.event_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_registration_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE events 
    SET registration_count = registration_count + 1
    WHERE id = NEW.event_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE events 
    SET registration_count = GREATEST(0, registration_count - 1)
    WHERE id = OLD.event_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 9. Update admin check policies to use is_admin function (prevents recursive lookups)
-- Update event_registrations policies
DROP POLICY IF EXISTS "Admins can view all registrations" ON public.event_registrations;
CREATE POLICY "Admins can view all registrations"
  ON public.event_registrations FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update registrations" ON public.event_registrations;
CREATE POLICY "Admins can update registrations"
  ON public.event_registrations FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- 10. Update storage bucket to remove SVG (security risk) and reduce file size
UPDATE storage.buckets 
SET 
  file_size_limit = 10485760, -- 10MB instead of 50MB
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif']
WHERE id = 'images';
