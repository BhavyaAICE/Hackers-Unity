/*
  # Fix User Profiles Insert Policy
  
  1. Security Changes
    - Add INSERT policy for user_profiles to allow the trigger function to create profiles
    - This is required for automatic profile creation when users sign up
*/

-- Allow the trigger function to insert into user_profiles
CREATE POLICY "System can create user profiles"
  ON user_profiles
  FOR INSERT
  WITH CHECK (true);
