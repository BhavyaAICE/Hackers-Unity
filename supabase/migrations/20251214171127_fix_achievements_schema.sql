/*
  # Fix Achievements Table Schema

  1. Issue
    - Table has conflicting columns: `title` and `label`, `icon` and `icon_name`
    - Causing schema cache issues with Supabase client
  
  2. Solution
    - Remove duplicate/old columns: `title`, `icon`
    - Keep: `icon_name`, `label` (what the admin interface expects)
    - Preserve all data and RLS policies
*/

-- Remove old columns that conflict with new schema
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'achievements' AND column_name = 'title'
  ) THEN
    ALTER TABLE achievements DROP COLUMN title;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'achievements' AND column_name = 'icon'
  ) THEN
    ALTER TABLE achievements DROP COLUMN icon;
  END IF;
END $$;

-- Ensure all required columns exist with proper defaults
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'achievements' AND column_name = 'icon_name'
  ) THEN
    ALTER TABLE achievements ADD COLUMN icon_name text NOT NULL DEFAULT 'trophy';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'achievements' AND column_name = 'label'
  ) THEN
    ALTER TABLE achievements ADD COLUMN label text NOT NULL DEFAULT 'Achievement';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'achievements' AND column_name = 'value'
  ) THEN
    ALTER TABLE achievements ADD COLUMN value text NOT NULL DEFAULT '0+';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'achievements' AND column_name = 'gradient'
  ) THEN
    ALTER TABLE achievements ADD COLUMN gradient text NOT NULL DEFAULT 'from-primary to-secondary';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'achievements' AND column_name = 'glow'
  ) THEN
    ALTER TABLE achievements ADD COLUMN glow text NOT NULL DEFAULT 'shadow-primary/30';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'achievements' AND column_name = 'display_order'
  ) THEN
    ALTER TABLE achievements ADD COLUMN display_order integer NOT NULL DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'achievements' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE achievements ADD COLUMN is_active boolean NOT NULL DEFAULT true;
  END IF;
END $$;