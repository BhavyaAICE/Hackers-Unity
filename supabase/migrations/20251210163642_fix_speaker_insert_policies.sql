/*
  # Fix Speaker and Event Speaker RLS Policies

  ## Problem
  - INSERT operations are failing for speakers, event_speakers, and schedule_items
  - Policies have USING clause but missing WITH CHECK clause
  - Benefits field exists but may not be displaying correctly

  ## Changes
  1. Drop and recreate policies for speakers with proper WITH CHECK
  2. Drop and recreate policies for event_speakers with proper WITH CHECK
  3. Drop and recreate policies for schedule_items with proper WITH CHECK
  4. Ensure benefits_text field is properly saved

  ## Security
  - Maintain admin-only access for modifications
  - Keep public read access for all users
*/

-- Fix speakers table policies
DROP POLICY IF EXISTS "Admins can manage speakers" ON speakers;
DROP POLICY IF EXISTS "Speakers are viewable by everyone" ON speakers;

CREATE POLICY "Speakers are viewable by everyone"
  ON speakers FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can insert speakers"
  ON speakers FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update speakers"
  ON speakers FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete speakers"
  ON speakers FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Fix event_speakers table policies
DROP POLICY IF EXISTS "Admins can manage event speakers" ON event_speakers;
DROP POLICY IF EXISTS "Event speakers are viewable by everyone" ON event_speakers;

CREATE POLICY "Event speakers are viewable by everyone"
  ON event_speakers FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can insert event speakers"
  ON event_speakers FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update event speakers"
  ON event_speakers FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete event speakers"
  ON event_speakers FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Fix schedule_items table policies
DROP POLICY IF EXISTS "Admins can manage schedule items" ON schedule_items;
DROP POLICY IF EXISTS "Schedule items are viewable by everyone" ON schedule_items;

CREATE POLICY "Schedule items are viewable by everyone"
  ON schedule_items FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can insert schedule items"
  ON schedule_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update schedule items"
  ON schedule_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete schedule items"
  ON schedule_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );
