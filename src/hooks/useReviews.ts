import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Review {
  id: string;
  user_id: string;
  comic_slug: string;
  rating: number;
  review: string | null;
  created_at: string;
  username: string;
}

export function useReviews(comicSlug: string) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [avgRating, setAvgRating] = useState(0);

  const fetchReviews = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("comic_reviews")
      .select("*")
      .eq("comic_slug", comicSlug)
      .order("created_at", { ascending: false });

    if (data && data.length > 0) {
      // Fetch usernames
      const userIds = [...new Set(data.map((r) => r.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, username")
        .in("user_id", userIds);

      const profileMap = new Map(profiles?.map((p) => [p.user_id, p.username || "Anonim"]) || []);

      const mapped: Review[] = data.map((r) => ({
        ...r,
        username: profileMap.get(r.user_id) || "Anonim",
      }));

      setReviews(mapped);
      setAvgRating(data.reduce((sum, r) => sum + r.rating, 0) / data.length);

      if (user) {
        setUserReview(mapped.find((r) => r.user_id === user.id) || null);
      }
    } else {
      setReviews([]);
      setAvgRating(0);
      setUserReview(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, [comicSlug, user?.id]);

  const submitReview = async (rating: number, review: string) => {
    if (!user) return;
    if (userReview) {
      await supabase
        .from("comic_reviews")
        .update({ rating, review: review || null })
        .eq("id", userReview.id);
    } else {
      await supabase.from("comic_reviews").insert({
        user_id: user.id,
        comic_slug: comicSlug,
        rating,
        review: review || null,
      });
    }
    await fetchReviews();
  };

  const deleteReview = async () => {
    if (!user || !userReview) return;
    await supabase.from("comic_reviews").delete().eq("id", userReview.id);
    await fetchReviews();
  };

  return { reviews, userReview, avgRating, loading, submitReview, deleteReview };
}
