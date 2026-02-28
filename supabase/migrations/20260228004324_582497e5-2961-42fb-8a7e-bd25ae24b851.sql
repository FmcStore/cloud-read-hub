
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS: anyone can read roles (needed for UI checks)
CREATE POLICY "Anyone can view roles" ON public.user_roles FOR SELECT USING (true);

-- RLS: only admins can manage roles
CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Assign admin role to user Fmc
INSERT INTO public.user_roles (user_id, role)
VALUES ('c66da902-7a57-4c38-a1b7-6722673acbd9', 'admin');
