CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT _user_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.user_roles AS ur
      WHERE ur.user_id = _user_id
        AND ur.role = _role
    )
    AND EXISTS (
      SELECT 1
      FROM public.users AS u
      WHERE u.auth_id = _user_id
        AND u.status = true
    );
$$;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;