import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useHistory } from "@/hooks/useHistory";
import { getComicBySlug } from "@/data/comics";
import { Clock, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function History() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { history, removeHistory, clearAll } = useHistory();

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading]);

  if (loading || !user) return null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-cyan" />
            <h1 className="text-2xl font-display font-bold text-foreground">Riwayat Baca</h1>
          </div>
          {history.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAll} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-1" /> Hapus Semua
            </Button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-20">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Belum ada riwayat baca</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => {
              const comic = getComicBySlug(item.comic_slug);
              if (!comic) return null;
              return (
                <div key={item.comic_slug} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50">
                  <Link to={`/comic/${comic.slug}`}>
                    <img src={comic.cover} alt={comic.title} className="w-16 h-20 rounded-lg object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/comic/${comic.slug}`}>
                      <h3 className="text-sm font-semibold text-foreground line-clamp-1">{comic.title}</h3>
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      Terakhir baca: Chapter {item.chapter_number}
                    </p>
                    <Link
                      to={`/comic/${comic.slug}/${item.chapter_number}`}
                      className="text-xs text-primary hover:underline"
                    >
                      Lanjut baca →
                    </Link>
                  </div>
                  <button onClick={() => removeHistory(item.comic_slug)} className="p-2 rounded-lg hover:bg-destructive/20">
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
