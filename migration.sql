-- =========================================================================
-- Complete Supabase Database Schema Migration
-- Project: Comic Reader App
-- Order: Extensions → Types → Functions → Tables → Indexes → RLS → Triggers
-- =========================================================================

-- -------------------------------------------------------------------------
-- 1. EXTENSIONS
-- -------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -------------------------------------------------------------------------
-- 2. ENUMS / CUSTOM TYPES
-- -------------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- -------------------------------------------------------------------------
-- 3. FUNCTIONS (created first because triggers/policies depend on them)
-- -------------------------------------------------------------------------

-- Auto-update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Auto-create profile when a new auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', NEW.email));
  RETURN NEW;
END;
$$;

-- Role checker (SECURITY DEFINER to avoid recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- -------------------------------------------------------------------------
-- 4. TABLES
-- -------------------------------------------------------------------------

-- profiles
CREATE TABLE public.profiles (
  id          uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL UNIQUE,
  username    text,
  avatar_url  text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- user_roles
CREATE TABLE public.user_roles (
  id       uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  user_id  uuid NOT NULL,
  role     public.app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- comics
CREATE TABLE public.comics (
  id         uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  slug       text NOT NULL UNIQUE,
  title      text NOT NULL,
  cover      text NOT NULL DEFAULT '',
  genres     text[] NOT NULL DEFAULT '{}',
  type       text NOT NULL DEFAULT 'Manhwa',
  status     text NOT NULL DEFAULT 'Ongoing',
  rating     numeric NOT NULL DEFAULT 0,
  synopsis   text NOT NULL DEFAULT '',
  author     text NOT NULL DEFAULT '',
  artist     text NOT NULL DEFAULT '',
  released   integer NOT NULL DEFAULT 2024,
  popular    boolean NOT NULL DEFAULT false,
  featured   boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- chapters
CREATE TABLE public.chapters (
  id         uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  comic_id   uuid NOT NULL REFERENCES public.comics(id) ON DELETE CASCADE,
  number     integer NOT NULL,
  title      text NOT NULL DEFAULT '',
  date       text NOT NULL DEFAULT '',
  pages      text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (comic_id, number)
);

-- bookmarks
CREATE TABLE public.bookmarks (
  id         uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL,
  comic_slug text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, comic_slug)
);

-- reading_history
CREATE TABLE public.reading_history (
  id             uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL,
  comic_slug     text NOT NULL,
  chapter_number integer NOT NULL DEFAULT 1,
  last_read_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, comic_slug)
);

-- comic_reviews
CREATE TABLE public.comic_reviews (
  id         uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL,
  comic_slug text NOT NULL,
  rating     integer NOT NULL,
  review     text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, comic_slug)
);

-- comments
CREATE TABLE public.comments (
  id             uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL,
  comic_slug     text NOT NULL,
  chapter_number integer NOT NULL,
  content        text NOT NULL,
  parent_id      uuid REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

-- comment_likes
CREATE TABLE public.comment_likes (
  id         uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL,
  comment_id uuid NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, comment_id)
);

-- -------------------------------------------------------------------------
-- 5. INDEXES (non-PK / non-unique-constraint indexes)
-- -------------------------------------------------------------------------
CREATE INDEX idx_comic_reviews_slug   ON public.comic_reviews USING btree (comic_slug);
CREATE INDEX idx_comment_likes_comment ON public.comment_likes USING btree (comment_id);
CREATE INDEX idx_comments_chapter      ON public.comments USING btree (comic_slug, chapter_number);
CREATE INDEX idx_comments_parent       ON public.comments USING btree (parent_id);

-- -------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY
-- -------------------------------------------------------------------------
ALTER TABLE public.profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comics          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comic_reviews   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_likes   ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "Authenticated users can view profiles" ON public.profiles
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can insert roles" ON public.user_roles
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete roles" ON public.user_roles
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- comics
CREATE POLICY "Anyone can view comics" ON public.comics
  FOR SELECT USING (true);
CREATE POLICY "Admins can insert comics" ON public.comics
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update comics" ON public.comics
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete comics" ON public.comics
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- chapters
CREATE POLICY "Anyone can view chapters" ON public.chapters
  FOR SELECT USING (true);
CREATE POLICY "Admins can insert chapters" ON public.chapters
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update chapters" ON public.chapters
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete chapters" ON public.chapters
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- bookmarks
CREATE POLICY "Users can view their own bookmarks" ON public.bookmarks
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own bookmarks" ON public.bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own bookmarks" ON public.bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- reading_history
CREATE POLICY "Users can view their own history" ON public.reading_history
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own history" ON public.reading_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own history" ON public.reading_history
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own history" ON public.reading_history
  FOR DELETE USING (auth.uid() = user_id);

-- comic_reviews
CREATE POLICY "Anyone can view reviews" ON public.comic_reviews
  FOR SELECT USING (true);
CREATE POLICY "Auth users can insert reviews" ON public.comic_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.comic_reviews
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON public.comic_reviews
  FOR DELETE USING (auth.uid() = user_id);

-- comments
CREATE POLICY "Anyone can view comments" ON public.comments
  FOR SELECT USING (true);
CREATE POLICY "Auth users can insert comments" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.comments
  FOR DELETE USING (auth.uid() = user_id);

-- comment_likes
CREATE POLICY "Anyone can view likes" ON public.comment_likes
  FOR SELECT USING (true);
CREATE POLICY "Auth users can like" ON public.comment_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike" ON public.comment_likes
  FOR DELETE USING (auth.uid() = user_id);

-- -------------------------------------------------------------------------
-- 7. TRIGGERS
-- -------------------------------------------------------------------------

-- updated_at maintenance
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_comics_updated_at
  BEFORE UPDATE ON public.comics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_comic_reviews_updated_at
  BEFORE UPDATE ON public.comic_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup (attached to auth.users)
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- -------------------------------------------------------------------------
-- 8. STORAGE BUCKETS
-- -------------------------------------------------------------------------
-- No storage buckets are configured for this project.

-- -------------------------------------------------------------------------
-- 9. SEED DATA
-- -------------------------------------------------------------------------
-- No seed data. To grant the first admin role after signup, run:
--   INSERT INTO public.user_roles (user_id, role) VALUES ('<auth-user-uuid>', 'admin');

-- =========================================================================
-- END OF MIGRATION
-- =========================================================================
