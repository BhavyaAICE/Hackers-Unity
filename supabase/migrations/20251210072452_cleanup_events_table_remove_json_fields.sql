/*
  # Clean up events table - Remove JSON and old speaker fields
  
  1. Changes
    - Remove `benefits` JSONB column (using benefits_text instead)
    - Remove old speaker columns (speaker1_name, speaker2_name, etc.)
    - Remove `schedule_json` column
    - Remove `speakers` and `schedule` columns if they exist
    
  2. Notes
    - These fields are replaced by proper relational tables:
      - speakers table + event_speakers table for speakers
      - schedule_items table for schedule
      - benefits_text for benefits (simple text field)
*/

-- Remove old speaker fields
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'speaker1_name') THEN
    ALTER TABLE events DROP COLUMN IF EXISTS speaker1_name;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'speaker1_title') THEN
    ALTER TABLE events DROP COLUMN IF EXISTS speaker1_title;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'speaker1_image') THEN
    ALTER TABLE events DROP COLUMN IF EXISTS speaker1_image;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'speaker1_linkedin') THEN
    ALTER TABLE events DROP COLUMN IF EXISTS speaker1_linkedin;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'speaker2_name') THEN
    ALTER TABLE events DROP COLUMN IF EXISTS speaker2_name;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'speaker2_title') THEN
    ALTER TABLE events DROP COLUMN IF EXISTS speaker2_title;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'speaker2_image') THEN
    ALTER TABLE events DROP COLUMN IF EXISTS speaker2_image;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'speaker2_linkedin') THEN
    ALTER TABLE events DROP COLUMN IF EXISTS speaker2_linkedin;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'speaker3_name') THEN
    ALTER TABLE events DROP COLUMN IF EXISTS speaker3_name;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'speaker3_title') THEN
    ALTER TABLE events DROP COLUMN IF EXISTS speaker3_title;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'speaker3_image') THEN
    ALTER TABLE events DROP COLUMN IF EXISTS speaker3_image;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'speaker3_linkedin') THEN
    ALTER TABLE events DROP COLUMN IF EXISTS speaker3_linkedin;
  END IF;
END $$;

-- Remove old JSON fields
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'schedule_json') THEN
    ALTER TABLE events DROP COLUMN IF EXISTS schedule_json;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'benefits') THEN
    ALTER TABLE events DROP COLUMN IF EXISTS benefits;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'speakers') THEN
    ALTER TABLE events DROP COLUMN IF EXISTS speakers;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'schedule') THEN
    ALTER TABLE events DROP COLUMN IF EXISTS schedule;
  END IF;
END $$;
