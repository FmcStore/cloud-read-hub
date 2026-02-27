import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface HistoryItem {
  comic_slug: string;
  chapter_number: number;
  last_read_at: string;
}

export function useHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("reading_history")
      .select("comic_slug, chapter_number, last_read_at")
      .eq("user_id", user.id)
      .order("last_read_at", { ascending: false });
    setHistory((data as HistoryItem[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const updateHistory = async (slug: string, chapterNumber: number) => {
    if (!user) return;
    const { data: existing } = await supabase
      .from("reading_history")
      .select("id")
      .eq("user_id", user.id)
      .eq("comic_slug", slug)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("reading_history")
        .update({ chapter_number: chapterNumber, last_read_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .eq("comic_slug", slug);
    } else {
      await supabase
        .from("reading_history")
        .insert({ user_id: user.id, comic_slug: slug, chapter_number: chapterNumber });
    }
    fetchHistory();
  };

  const removeHistory = async (slug: string) => {
    if (!user) return;
    await supabase.from("reading_history").delete().eq("user_id", user.id).eq("comic_slug", slug);
    setHistory((prev) => prev.filter((h) => h.comic_slug !== slug));
  };

  const clearAll = async () => {
    if (!user) return;
    await supabase.from("reading_history").delete().eq("user_id", user.id);
    setHistory([]);
  };

  return { history, loading, updateHistory, removeHistory, clearAll, refetch: fetchHistory };
}
