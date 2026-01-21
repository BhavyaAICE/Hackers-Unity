-- Recreate get_user_permissions function with proper security
DROP FUNCTION IF EXISTS public.get_user_permissions(uuid);

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

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_permissions(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_permissions(uuid) TO anon;