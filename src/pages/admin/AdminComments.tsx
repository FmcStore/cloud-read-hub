import { useState, useEffect } from "react";
import { AdminLayout } from "./AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, MessageSquare, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

interface CommentRow {
  id: string;
  comic_slug: string;
  chapter_number: number;
  content: string;
  created_at: string;
  user_id: string;
  username?: string;
}

export default function AdminComments() {
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchComments = async () => {
    setLoading(true);
    const { data: commentsData } = await supabase
      .from("comments")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (!commentsData) { setLoading(false); return; }

    const userIds = [...new Set(commentsData.map(c => c.user_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, username")
      .in("user_id", userIds.length > 0 ? userIds : ["none"]);

    const profileMap = new Map(profiles?.map(p => [p.user_id, p.username]) || []);

    setComments(commentsData.map(c => ({
      ...c,
      username: profileMap.get(c.user_id) || "User",
    })));
    setLoading(false);
  };

  useEffect(() => { fetchComments(); }, []);

  const deleteComment = async (commentId: string) => {
    const { data, error } = await supabase.functions.invoke("admin-delete-comment", {
      body: { commentId },
    });
    if (error) {
      toast({ title: "Gagal menghapus", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Komentar dihapus" });
      fetchComments();
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Moderasi Komentar</h1>
        <Button variant="outline" size="sm" onClick={fetchComments}>
          <RefreshCw className="h-3.5 w-3.5 mr-1" /> Refresh
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-center py-12">Memuat komentar...</p>
      ) : comments.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">Belum ada komentar.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {comments.map((c) => (
            <div key={c.id} className="bg-card rounded-xl border border-border/50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-semibold text-foreground">{c.username}</span>
                    <span className="text-[10px] text-muted-foreground">
                      di {c.comic_slug} Ch.{c.chapter_number}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatDistanceToNow(new Date(c.created_at), { addSuffix: true, locale: idLocale })}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/80">{c.content}</p>
                </div>
                <button
                  onClick={() => deleteComment(c.id)}
                  className="p-2 rounded-lg hover:bg-destructive/10 text-destructive/50 hover:text-destructive shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
