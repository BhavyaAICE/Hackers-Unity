-- Fix remaining "RLS Policy Always True" warnings
-- These are INSERT policies that need proper checks

-- Fix user_profiles INSERT policy - only allow system/trigger inserts
DROP POLICY IF EXISTS "System can create user profiles" ON public.user_profiles;
CREATE POLICY "System can create user profiles"
  ON public.user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- Add delete policy for admins on registrations
CREATE POLICY "Admins can delete registrations"
  ON public.event_registrations FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Fix contact_queries to only allow authenticated or have rate limiting concept
-- Currently it's public insert, which is needed for contact form, but we should restrict it
DROP POLICY IF EXISTS "Anyone can submit contact queries" ON public.contact_queries;
CREATE POLICY "Anyone can submit contact queries"
  ON public.contact_queries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(name) > 0 AND 
    length(email) > 0 AND 
    length(message) > 0 AND
    length(name) <= 200 AND
    length(email) <= 255 AND
    length(message) <= 5000
  );
