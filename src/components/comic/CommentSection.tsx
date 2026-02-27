import { useState } from "react";
import { useComments, Comment } from "@/hooks/useComments";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, ThumbsUp, Reply, Trash2, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface Props {
  comicSlug: string;
  chapterNumber: number;
}

function CommentItem({
  comment,
  onReply,
  onLike,
  onDelete,
  userId,
  depth = 0,
}: {
  comment: Comment;
  onReply: (id: string) => void;
  onLike: (id: string) => void;
  onDelete: (id: string) => void;
  userId?: string;
  depth?: number;
}) {
  return (
    <div className={`${depth > 0 ? "ml-8 border-l border-border pl-4" : ""}`}>
      <div className="bg-card rounded-lg p-3 border border-border/50 mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-foreground">{comment.username}</span>
          <span className="text-[10px] text-muted-foreground">
            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: id })}
          </span>
        </div>
        <p className="text-sm text-foreground/80 mb-2">{comment.content}</p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onLike(comment.id)}
            className={`flex items-center gap-1 text-xs transition-colors ${
              comment.user_liked ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ThumbsUp className="h-3 w-3" />
            {comment.likes_count > 0 && comment.likes_count}
          </button>
          {depth === 0 && (
            <button
              onClick={() => onReply(comment.id)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <Reply className="h-3 w-3" /> Reply
            </button>
          )}
          {userId === comment.user_id && (
            <button
              onClick={() => onDelete(comment.id)}
              className="flex items-center gap-1 text-xs text-destructive/70 hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
      {comment.replies?.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          onReply={onReply}
          onLike={onLike}
          onDelete={onDelete}
          userId={userId}
          depth={1}
        />
      ))}
    </div>
  );
}

export function CommentSection({ comicSlug, chapterNumber }: Props) {
  const { user } = useAuth();
  const { comments, loading, addComment, toggleLike, deleteComment } = useComments(comicSlug, chapterNumber);
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleSubmit = async () => {
    if (!text.trim()) return;
    await addComment(text.trim());
    setText("");
  };

  const handleReply = async () => {
    if (!replyText.trim() || !replyTo) return;
    await addComment(replyText.trim(), replyTo);
    setReplyText("");
    setReplyTo(null);
  };

  return (
    <div className="mt-8 mb-20">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="h-5 w-5 text-foreground" />
        <h2 className="text-lg font-display font-bold text-foreground">
          Komentar ({comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0)})
        </h2>
      </div>

      {user ? (
        <div className="flex gap-2 mb-6">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tulis komentar..."
            className="bg-muted/50 border-border/50 resize-none min-h-[60px]"
          />
          <Button onClick={handleSubmit} size="icon" className="shrink-0 self-end">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="text-center py-4 mb-4 bg-card rounded-lg border border-border/50">
          <p className="text-sm text-muted-foreground">
            <Link to="/login" className="text-primary hover:underline">Login</Link> untuk berkomentar
          </p>
        </div>
      )}

      {replyTo && (
        <div className="mb-4 p-3 bg-muted/30 rounded-lg border border-border/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Membalas komentar...</span>
            <button onClick={() => setReplyTo(null)} className="text-xs text-destructive">Batal</button>
          </div>
          <div className="flex gap-2">
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Tulis balasan..."
              className="bg-muted/50 border-border/50 resize-none min-h-[50px]"
              autoFocus
            />
            <Button onClick={handleReply} size="icon" className="shrink-0 self-end">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground text-center py-8">Memuat komentar...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">Belum ada komentar. Jadilah yang pertama!</p>
      ) : (
        <div className="space-y-2">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={(id) => setReplyTo(id)}
              onLike={toggleLike}
              onDelete={deleteComment}
              userId={user?.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
