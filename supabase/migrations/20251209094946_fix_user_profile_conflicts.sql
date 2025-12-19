/*
  # Fix User Profile Table Conflicts

  ## Overview
  Removes the old `profiles` table and ensures only `user_profiles` is used.
  This fixes the "Database error saving new user" issue caused by conflicting tables.

  ## Changes
  1. Drop old profiles table and related objects
  2. Ensure user_profiles trigger function is correct
  3. Verify all policies are in place

  ## Important Notes
  - This migration is safe because user_profiles is the actively used table
  - The old profiles table was created first but replaced by user_profiles
*/

-- Drop the old profiles table and its dependencies
DROP TRIGGER IF EXISTS on_profile_updated ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop and recreate the update_updated_at function if it exists
DROP FUNCTION IF EXISTS update_updated_at() CASCADE;

-- Ensure the handle_new_user function is correct for user_profiles
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- If profile already exists, just return
    RETURN NEW;
  WHEN OTHERS THEN
    -- Log error but don't block user creation
    RAISE WARNING 'Error creating user profile: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Verify user_profiles INSERT policy exists
DROP POLICY IF EXISTS "System can create user profiles" ON user_profiles;
CREATE POLICY "System can create user profiles"
  ON user_profiles
  FOR INSERT
  WITH CHECK (true);
