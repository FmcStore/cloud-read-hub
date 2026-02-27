import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Comment {
  id: string;
  user_id: string;
  comic_slug: string;
  chapter_number: number;
  parent_id: string | null;
  content: string;
  created_at: string;
  username?: string;
  likes_count: number;
  user_liked: boolean;
  replies?: Comment[];
}

export function useComments(comicSlug: string, chapterNumber: number) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    // Fetch comments
    const { data: commentsData } = await supabase
      .from("comments")
      .select("*")
      .eq("comic_slug", comicSlug)
      .eq("chapter_number", chapterNumber)
      .order("created_at", { ascending: false });

    if (!commentsData) { setLoading(false); return; }

    // Fetch likes counts
    const commentIds = commentsData.map(c => c.id);
    const { data: likesData } = await supabase
      .from("comment_likes")
      .select("comment_id, user_id")
      .in("comment_id", commentIds.length > 0 ? commentIds : ["none"]);

    // Fetch usernames from profiles
    const userIds = [...new Set(commentsData.map(c => c.user_id))];
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("user_id, username")
      .in("user_id", userIds.length > 0 ? userIds : ["none"]);

    const profileMap = new Map(profilesData?.map(p => [p.user_id, p.username]) || []);

    const enriched: Comment[] = commentsData.map(c => {
      const commentLikes = likesData?.filter(l => l.comment_id === c.id) || [];
      return {
        ...c,
        username: profileMap.get(c.user_id) || "User",
        likes_count: commentLikes.length,
        user_liked: user ? commentLikes.some(l => l.user_id === user.id) : false,
      };
    });

    // Build tree
    const topLevel = enriched.filter(c => !c.parent_id);
    const replies = enriched.filter(c => c.parent_id);
    topLevel.forEach(c => {
      c.replies = replies.filter(r => r.parent_id === c.id);
    });

    setComments(topLevel);
    setLoading(false);
  }, [comicSlug, chapterNumber, user?.id]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  const addComment = async (content: string, parentId?: string) => {
    if (!user) return;
    await supabase.from("comments").insert({
      user_id: user.id,
      comic_slug: comicSlug,
      chapter_number: chapterNumber,
      parent_id: parentId || null,
      content,
    });
    fetchComments();
  };

  const toggleLike = async (commentId: string) => {
    if (!user) return;
    const existing = comments.flatMap(c => [c, ...(c.replies || [])]).find(c => c.id === commentId);
    if (existing?.user_liked) {
      await supabase.from("comment_likes").delete().eq("user_id", user.id).eq("comment_id", commentId);
    } else {
      await supabase.from("comment_likes").insert({ user_id: user.id, comment_id: commentId });
    }
    fetchComments();
  };

  const deleteComment = async (commentId: string) => {
    if (!user) return;
    await supabase.from("comments").delete().eq("id", commentId).eq("user_id", user.id);
    fetchComments();
  };

  return { comments, loading, addComment, toggleLike, deleteComment, refetch: fetchComments };
}
