-- Create storage bucket for optimized images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif', 'image/svg+xml']
);

-- Create RLS policies for the images bucket

-- Anyone can view images (public bucket)
CREATE POLICY "Public can view images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'images');

-- Only admins can upload images
CREATE POLICY "Admins can upload images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'images' AND
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.is_admin = true
  )
);

-- Only admins can update images
CREATE POLICY "Admins can update images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'images' AND
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.is_admin = true
  )
);

-- Only admins can delete images
CREATE POLICY "Admins can delete images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'images' AND
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.is_admin = true
  )
);

-- Create a table to track uploaded images and their optimized variants
CREATE TABLE public.image_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  alt_text TEXT,
  width INTEGER,
  height INTEGER,
  file_size INTEGER,
  mime_type TEXT DEFAULT 'image/webp',
  variants JSONB DEFAULT '{}', -- Stores paths to different sizes
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.image_assets ENABLE ROW LEVEL SECURITY;

-- Anyone can view image assets
CREATE POLICY "Anyone can view image assets"
ON public.image_assets
FOR SELECT
USING (true);

-- Only admins can manage image assets
CREATE POLICY "Admins can insert image assets"
ON public.image_assets
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.is_admin = true
  )
);

CREATE POLICY "Admins can update image assets"
ON public.image_assets
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.is_admin = true
  )
);

CREATE POLICY "Admins can delete image assets"
ON public.image_assets
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.is_admin = true
  )
);

-- Add trigger for updated_at
CREATE TRIGGER update_image_assets_updated_at
BEFORE UPDATE ON public.image_assets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();