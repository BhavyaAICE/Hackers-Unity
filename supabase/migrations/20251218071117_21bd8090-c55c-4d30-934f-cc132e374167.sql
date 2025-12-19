-- Create contact_queries table
CREATE TABLE public.contact_queries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_queries ENABLE ROW LEVEL SECURITY;

-- Public can insert contact queries (anyone can submit the form)
CREATE POLICY "Anyone can submit contact queries"
ON public.contact_queries
FOR INSERT
WITH CHECK (true);

-- Admins can view all contact queries
CREATE POLICY "Admins can view contact queries"
ON public.contact_queries
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM user_profiles
  WHERE user_profiles.id = auth.uid() AND user_profiles.is_admin = true
));

-- Admins can update contact queries (mark as done)
CREATE POLICY "Admins can update contact queries"
ON public.contact_queries
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM user_profiles
  WHERE user_profiles.id = auth.uid() AND user_profiles.is_admin = true
));

-- Admins can delete contact queries
CREATE POLICY "Admins can delete contact queries"
ON public.contact_queries
FOR DELETE
USING (EXISTS (
  SELECT 1 FROM user_profiles
  WHERE user_profiles.id = auth.uid() AND user_profiles.is_admin = true
));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_contact_queries_updated_at
BEFORE UPDATE ON public.contact_queries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();