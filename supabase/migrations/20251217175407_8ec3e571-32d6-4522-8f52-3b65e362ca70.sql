-- Add image_url and detailed_description columns to hackathon_challenges
ALTER TABLE public.hackathon_challenges 
ADD COLUMN IF NOT EXISTS image_url text,
ADD COLUMN IF NOT EXISTS detailed_description text;