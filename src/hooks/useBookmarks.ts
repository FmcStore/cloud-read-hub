import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useBookmarks() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBookmarks = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("bookmarks")
      .select("comic_slug")
      .eq("user_id", user.id);
    setBookmarks(data?.map((b) => b.comic_slug) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBookmarks();
  }, [user]);

  const toggleBookmark = async (slug: string) => {
    if (!user) return;
    if (bookmarks.includes(slug)) {
      await supabase.from("bookmarks").delete().eq("user_id", user.id).eq("comic_slug", slug);
      setBookmarks((prev) => prev.filter((s) => s !== slug));
    } else {
      await supabase.from("bookmarks").insert({ user_id: user.id, comic_slug: slug });
      setBookmarks((prev) => [...prev, slug]);
    }
  };

  const removeBookmark = async (slug: string) => {
    if (!user) return;
    await supabase.from("bookmarks").delete().eq("user_id", user.id).eq("comic_slug", slug);
    setBookmarks((prev) => prev.filter((s) => s !== slug));
  };

  const clearAll = async () => {
    if (!user) return;
    await supabase.from("bookmarks").delete().eq("user_id", user.id);
    setBookmarks([]);
  };

  const isBookmarked = (slug: string) => bookmarks.includes(slug);

  return { bookmarks, loading, toggleBookmark, removeBookmark, clearAll, isBookmarked, refetch: fetchBookmarks };
}
