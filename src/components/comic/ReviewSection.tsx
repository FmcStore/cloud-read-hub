import { useState } from "react";
import { useReviews } from "@/hooks/useReviews";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Trash2, Edit2, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface Props {
  comicSlug: string;
}

function StarRating({ value, onChange, readonly = false }: { value: number; onChange?: (v: number) => void; readonly?: boolean }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          className={`${readonly ? "cursor-default" : "cursor-pointer"} transition-colors`}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
        >
          <Star
            className={`h-5 w-5 transition-colors ${
              star <= (hover || value)
                ? "text-amber fill-amber"
                : "text-muted-foreground/30"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export function ReviewSection({ comicSlug }: Props) {
  const { user } = useAuth();
  const { reviews, userReview, avgRating, loading, submitReview, deleteReview } = useReviews(comicSlug);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [editing, setEditing] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    await submitReview(rating, reviewText);
    setRating(0);
    setReviewText("");
    setEditing(false);
  };

  const startEdit = () => {
    if (userReview) {
      setRating(userReview.rating);
      setReviewText(userReview.review || "");
      setEditing(true);
    }
  };

  const showForm = !userReview || editing;

  return (
    <div className="mt-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-amber fill-amber" />
          <h2 className="text-lg font-display font-bold text-foreground">
            Rating & Review
          </h2>
        </div>
        {reviews.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-bold text-amber">{avgRating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({reviews.length} review)</span>
          </div>
        )}
      </div>

      {user ? (
        showForm ? (
          <div className="bg-card rounded-lg p-4 border border-border/50 mb-4">
            <p className="text-xs text-muted-foreground mb-2">{userReview ? "Edit review kamu" : "Beri rating & review"}</p>
            <StarRating value={rating} onChange={setRating} />
            <Textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Tulis review (opsional)..."
              className="mt-3 bg-muted/50 border-border/50 resize-none min-h-[60px]"
            />
            <div className="flex gap-2 mt-3">
              <Button onClick={handleSubmit} disabled={rating === 0} size="sm">
                <Send className="h-3.5 w-3.5 mr-1" /> {userReview ? "Update" : "Kirim"}
              </Button>
              {editing && (
                <Button variant="outline" size="sm" onClick={() => setEditing(false)}>Batal</Button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-lg p-3 border border-primary/20 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Review kamu</p>
                <StarRating value={userReview!.rating} readonly />
                {userReview!.review && <p className="text-sm text-foreground/80 mt-1">{userReview!.review}</p>}
              </div>
              <div className="flex gap-1">
                <button onClick={startEdit} className="p-1.5 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground">
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button onClick={deleteReview} className="p-1.5 rounded hover:bg-muted/50 text-destructive/70 hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="text-center py-4 mb-4 bg-card rounded-lg border border-border/50">
          <p className="text-sm text-muted-foreground">
            <Link to="/login" className="text-primary hover:underline">Login</Link> untuk memberi rating
          </p>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground text-center py-4">Memuat review...</p>
      ) : reviews.filter(r => r.user_id !== user?.id).length === 0 && !userReview ? (
        <p className="text-sm text-muted-foreground text-center py-4">Belum ada review.</p>
      ) : (
        <div className="space-y-2">
          {reviews.filter(r => r.user_id !== user?.id).map((r) => (
            <div key={r.id} className="bg-card rounded-lg p-3 border border-border/50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-foreground">{r.username}</span>
                <span className="text-[10px] text-muted-foreground">
                  {formatDistanceToNow(new Date(r.created_at), { addSuffix: true, locale: id })}
                </span>
              </div>
              <StarRating value={r.rating} readonly />
              {r.review && <p className="text-sm text-foreground/70 mt-1">{r.review}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
