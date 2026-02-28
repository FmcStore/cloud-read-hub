
-- Allow public to view profiles (needed for showing usernames on reviews/comments)
DROP POLICY "Users can view their own profile" ON public.profiles;
CREATE POLICY "Anyone can view profiles" ON public.profiles FOR SELECT USING (true);
