
-- Create ratings/reviews table
CREATE TABLE public.comic_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  comic_slug TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, comic_slug)
);

ALTER TABLE public.comic_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews" ON public.comic_reviews FOR SELECT USING (true);
CREATE POLICY "Auth users can insert reviews" ON public.comic_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.comic_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON public.comic_reviews FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_comic_reviews_slug ON public.comic_reviews(comic_slug);

CREATE TRIGGER update_comic_reviews_updated_at
BEFORE UPDATE ON public.comic_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
