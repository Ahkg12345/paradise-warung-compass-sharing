CREATE OR REPLACE FUNCTION public.reserve_login_attempt(_username text, _ip_address text)
RETURNS TABLE(is_locked boolean, seconds_remaining integer, reserved_attempt_id bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_username text := lower(trim(_username));
  v_ip text := left(coalesce(nullif(trim(_ip_address), ''), 'unknown'), 45);
  v_username_lock bigint;
  v_ip_lock bigint;
  v_username_unlock timestamptz;
  v_ip_unlock timestamptz;
  v_unlock timestamptz;
BEGIN
  IF v_username = '' OR char_length(v_username) > 30 THEN
    RAISE EXCEPTION 'Invalid login identifier';
  END IF;
  v_username_lock := hashtextextended('username:' || v_username, 0);
  v_ip_lock := hashtextextended('ip:' || v_ip, 0);
  IF v_username_lock < v_ip_lock THEN
    PERFORM pg_advisory_xact_lock(v_username_lock);
    PERFORM pg_advisory_xact_lock(v_ip_lock);
  ELSE
    PERFORM pg_advisory_xact_lock(v_ip_lock);
    PERFORM pg_advisory_xact_lock(v_username_lock);
  END IF;

  DELETE FROM public.login_attempts WHERE attempted_at < now() - interval '24 hours';
  SELECT attempted_at + interval '15 minutes' INTO v_username_unlock
  FROM public.login_attempts
  WHERE username = v_username AND attempted_at >= now() - interval '15 minutes'
  ORDER BY attempted_at DESC OFFSET 4 LIMIT 1;
  SELECT attempted_at + interval '15 minutes' INTO v_ip_unlock
  FROM public.login_attempts
  WHERE ip_address = v_ip AND attempted_at >= now() - interval '15 minutes'
  ORDER BY attempted_at DESC OFFSET 4 LIMIT 1;

  v_unlock := greatest(v_username_unlock, v_ip_unlock);
  IF v_unlock IS NOT NULL AND v_unlock > now() THEN
    RETURN QUERY SELECT true, greatest(1, ceil(extract(epoch FROM (v_unlock - now())))::integer), NULL::bigint;
  ELSE
    RETURN QUERY SELECT false, 0, NULL::bigint;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.record_login_failure(_username text, _ip_address text)
RETURNS TABLE(is_locked boolean, seconds_remaining integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_username text := lower(trim(_username));
  v_ip text := left(coalesce(nullif(trim(_ip_address), ''), 'unknown'), 45);
  v_username_lock bigint;
  v_ip_lock bigint;
  v_username_unlock timestamptz;
  v_ip_unlock timestamptz;
  v_unlock timestamptz;
BEGIN
  IF v_username = '' OR char_length(v_username) > 30 THEN
    RAISE EXCEPTION 'Invalid login identifier';
  END IF;
  v_username_lock := hashtextextended('username:' || v_username, 0);
  v_ip_lock := hashtextextended('ip:' || v_ip, 0);
  IF v_username_lock < v_ip_lock THEN
    PERFORM pg_advisory_xact_lock(v_username_lock);
    PERFORM pg_advisory_xact_lock(v_ip_lock);
  ELSE
    PERFORM pg_advisory_xact_lock(v_ip_lock);
    PERFORM pg_advisory_xact_lock(v_username_lock);
  END IF;

  DELETE FROM public.login_attempts WHERE attempted_at < now() - interval '24 hours';
  INSERT INTO public.login_attempts(username, ip_address) VALUES (v_username, v_ip);

  SELECT attempted_at + interval '15 minutes' INTO v_username_unlock
  FROM public.login_attempts
  WHERE username = v_username AND attempted_at >= now() - interval '15 minutes'
  ORDER BY attempted_at DESC OFFSET 4 LIMIT 1;
  SELECT attempted_at + interval '15 minutes' INTO v_ip_unlock
  FROM public.login_attempts
  WHERE ip_address = v_ip AND attempted_at >= now() - interval '15 minutes'
  ORDER BY attempted_at DESC OFFSET 4 LIMIT 1;

  v_unlock := greatest(v_username_unlock, v_ip_unlock);
  IF v_unlock IS NOT NULL AND v_unlock > now() THEN
    RETURN QUERY SELECT true, greatest(1, ceil(extract(epoch FROM (v_unlock - now())))::integer);
  ELSE
    RETURN QUERY SELECT false, 0;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.reserve_login_attempt(text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_login_attempt(text, text) TO service_role;
REVOKE ALL ON FUNCTION public.record_login_failure(text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_login_failure(text, text) TO service_role;

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS public.app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ur.role
  FROM public.user_roles AS ur
  JOIN public.users AS u ON u.auth_id = ur.user_id AND u.status = true
  WHERE ur.user_id = auth.uid()
  ORDER BY CASE WHEN ur.role = 'admin'::public.app_role THEN 0 ELSE 1 END
  LIMIT 1;
$$;
REVOKE ALL ON FUNCTION public.get_current_user_role() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_current_user_role() TO authenticated, service_role;