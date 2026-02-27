import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useBookmarks } from "@/hooks/useBookmarks";
import { getComicBySlug } from "@/data/comics";
import { Heart, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Bookmarks() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { bookmarks, removeBookmark, clearAll } = useBookmarks();

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading]);

  if (loading || !user) return null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink" />
            <h1 className="text-2xl font-display font-bold text-foreground">Bookmark</h1>
          </div>
          {bookmarks.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAll} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-1" /> Hapus Semua
            </Button>
          )}
        </div>

        {bookmarks.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Belum ada bookmark</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookmarks.map((slug) => {
              const comic = getComicBySlug(slug);
              if (!comic) return null;
              return (
                <div key={slug} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50">
                  <Link to={`/comic/${comic.slug}`}>
                    <img src={comic.cover} alt={comic.title} className="w-16 h-20 rounded-lg object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/comic/${comic.slug}`}>
                      <h3 className="text-sm font-semibold text-foreground line-clamp-1">{comic.title}</h3>
                    </Link>
                    <p className="text-xs text-muted-foreground">{comic.type} · {comic.status}</p>
                  </div>
                  <button onClick={() => removeBookmark(slug)} className="p-2 rounded-lg hover:bg-destructive/20">
                    <X className="h-4 w-4 text-destructive" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
