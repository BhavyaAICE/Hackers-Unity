-- Create a function to safely get user email
CREATE OR REPLACE FUNCTION public.get_user_email(_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email FROM auth.users WHERE id = _user_id
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_user_email(uuid) TO authenticated;

-- Drop and recreate the problematic policy
DROP POLICY IF EXISTS "Users can view own permissions" ON public.admin_permissions;

CREATE POLICY "Users can view own permissions"
ON public.admin_permissions
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() 
  OR email = public.get_user_email(auth.uid())
);