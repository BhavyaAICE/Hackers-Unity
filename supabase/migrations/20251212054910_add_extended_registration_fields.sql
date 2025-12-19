/*
  # Add Extended Registration Fields

  ## Problem
  Registration form needs additional fields to match the new design

  ## Changes
  - Add first_name field to store first name separately
  - Add last_name field to store last name separately
  - Add date_of_birth field for date of birth
  - Add gender field for gender selection
  - Add city field for city information
  - Add agree_to_contact boolean field for privacy consent

  ## Security
  - No changes to RLS policies needed
  - All fields nullable except custom_fields

  ## Note
  The form now captures more detailed information while maintaining backward compatibility
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'event_registrations' AND column_name = 'first_name'
  ) THEN
    ALTER TABLE event_registrations ADD COLUMN first_name text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'event_registrations' AND column_name = 'last_name'
  ) THEN
    ALTER TABLE event_registrations ADD COLUMN last_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'event_registrations' AND column_name = 'date_of_birth'
  ) THEN
    ALTER TABLE event_registrations ADD COLUMN date_of_birth date;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'event_registrations' AND column_name = 'gender'
  ) THEN
    ALTER TABLE event_registrations ADD COLUMN gender text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'event_registrations' AND column_name = 'city'
  ) THEN
    ALTER TABLE event_registrations ADD COLUMN city text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'event_registrations' AND column_name = 'agree_to_contact'
  ) THEN
    ALTER TABLE event_registrations ADD COLUMN agree_to_contact boolean DEFAULT false;
  END IF;
END $$;
