-- Fix: Restrict user_roles SELECT to own roles only
-- The has_role() SECURITY DEFINER function will still work for RLS policy checks
DROP POLICY "Anyone can view roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);
