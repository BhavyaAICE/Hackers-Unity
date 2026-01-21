-- Create admin_permissions table for granular access control
-- This stores what permissions each user has

CREATE TABLE public.admin_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  -- Permission flags
  can_view_dashboard boolean DEFAULT false,
  can_manage_events boolean DEFAULT false,
  can_manage_hackathons boolean DEFAULT false,
  can_view_registrations boolean DEFAULT false,
  can_export_data boolean DEFAULT false,
  can_manage_sponsors boolean DEFAULT false,
  can_manage_testimonials boolean DEFAULT false,
  can_manage_content boolean DEFAULT false,
  can_manage_achievements boolean DEFAULT false,
  can_view_contact_queries boolean DEFAULT false,
  can_manage_users boolean DEFAULT false,
  -- Metadata
  invited_by uuid REFERENCES auth.users(id),
  invite_token text UNIQUE,
  invite_accepted_at timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(email)
);

-- Enable RLS
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;

-- Create function to check if user has specific permission
CREATE OR REPLACE FUNCTION public.has_permission(_user_id uuid, _permission text)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  has_perm boolean := false;
BEGIN
  -- First check if user is a super admin
  IF public.is_admin(_user_id) THEN
    RETURN true;
  END IF;
  
  -- Check specific permission
  EXECUTE format(
    'SELECT COALESCE((SELECT %I FROM public.admin_permissions WHERE user_id = $1 AND is_active = true), false)',
    _permission
  ) INTO has_perm USING _user_id;
  
  RETURN has_perm;
END;
$$;

-- Create function to get all permissions for a user
CREATE OR REPLACE FUNCTION public.get_user_permissions(_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  perms jsonb;
  is_super_admin boolean;
BEGIN
  -- Check if super admin
  is_super_admin := public.is_admin(_user_id);
  
  IF is_super_admin THEN
    RETURN jsonb_build_object(
      'is_super_admin', true,
      'can_view_dashboard', true,
      'can_manage_events', true,
      'can_manage_hackathons', true,
      'can_view_registrations', true,
      'can_export_data', true,
      'can_manage_sponsors', true,
      'can_manage_testimonials', true,
      'can_manage_content', true,
      'can_manage_achievements', true,
      'can_view_contact_queries', true,
      'can_manage_users', true
    );
  END IF;
  
  SELECT jsonb_build_object(
    'is_super_admin', false,
    'can_view_dashboard', COALESCE(can_view_dashboard, false),
    'can_manage_events', COALESCE(can_manage_events, false),
    'can_manage_hackathons', COALESCE(can_manage_hackathons, false),
    'can_view_registrations', COALESCE(can_view_registrations, false),
    'can_export_data', COALESCE(can_export_data, false),
    'can_manage_sponsors', COALESCE(can_manage_sponsors, false),
    'can_manage_testimonials', COALESCE(can_manage_testimonials, false),
    'can_manage_content', COALESCE(can_manage_content, false),
    'can_manage_achievements', COALESCE(can_manage_achievements, false),
    'can_view_contact_queries', COALESCE(can_view_contact_queries, false),
    'can_manage_users', COALESCE(can_manage_users, false)
  ) INTO perms
  FROM public.admin_permissions
  WHERE user_id = _user_id AND is_active = true;
  
  IF perms IS NULL THEN
    RETURN jsonb_build_object(
      'is_super_admin', false,
      'can_view_dashboard', false,
      'can_manage_events', false,
      'can_manage_hackathons', false,
      'can_view_registrations', false,
      'can_export_data', false,
      'can_manage_sponsors', false,
      'can_manage_testimonials', false,
      'can_manage_content', false,
      'can_manage_achievements', false,
      'can_view_contact_queries', false,
      'can_manage_users', false
    );
  END IF;
  
  RETURN perms;
END;
$$;

-- RLS Policies for admin_permissions

-- Admins and users with can_manage_users can view all permissions
CREATE POLICY "Admins can view all permissions"
  ON public.admin_permissions FOR SELECT
  TO authenticated
  USING (
    public.is_admin(auth.uid()) OR 
    public.has_permission(auth.uid(), 'can_manage_users')
  );

-- Users can view their own permissions
CREATE POLICY "Users can view own permissions"
  ON public.admin_permissions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Only super admins can insert permissions
CREATE POLICY "Super admins can insert permissions"
  ON public.admin_permissions FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

-- Only super admins can update permissions
CREATE POLICY "Super admins can update permissions"
  ON public.admin_permissions FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Only super admins can delete permissions
CREATE POLICY "Super admins can delete permissions"
  ON public.admin_permissions FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Create trigger to update updated_at
CREATE TRIGGER update_admin_permissions_updated_at
  BEFORE UPDATE ON public.admin_permissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to link user_id when user signs up with invited email
CREATE OR REPLACE FUNCTION public.link_admin_permissions_on_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.admin_permissions
  SET user_id = NEW.id
  WHERE email = NEW.email AND user_id IS NULL;
  RETURN NEW;
END;
$$;

-- Create trigger to auto-link permissions when user signs up
DROP TRIGGER IF EXISTS link_admin_permissions_trigger ON auth.users;
CREATE TRIGGER link_admin_permissions_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.link_admin_permissions_on_signup();