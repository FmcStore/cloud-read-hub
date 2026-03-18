import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useHistory } from "@/hooks/useHistory";
import { fetchComicDetail } from "@/lib/api/comic-api";
import { Clock, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function History() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { history, removeHistory, clearAll } = useHistory();

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading]);

  const comicQueries = useQueries({
    queries: history.map((item) => ({
      queryKey: ["api-comic-detail", item.comic_slug],
      queryFn: () => fetchComicDetail(item.comic_slug),
      staleTime: 10 * 60 * 1000,
      enabled: !!item.comic_slug,
    })),
  });

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
            {history.map((item, index) => {
              const query = comicQueries[index];
              const comic = query?.data;
              const isItemLoading = query?.isLoading;

              return (
                <div key={item.comic_slug} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50">
                  {isItemLoading ? (
                    <>
                      <Skeleton className="w-16 h-20 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </>
                  ) : (
                    <>
                      <Link to={`/comic/${item.comic_slug}`}>
                        <img
                          src={comic?.imageSrc || "/placeholder.svg"}
                          alt={comic?.title || item.comic_slug}
                          className="w-16 h-20 rounded-lg object-cover"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link to={`/comic/${item.comic_slug}`}>
                          <h3 className="text-sm font-semibold text-foreground line-clamp-1">
                            {comic?.title || item.comic_slug}
                          </h3>
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          Terakhir baca: Chapter {item.chapter_number}
                        </p>
                        {(() => {
                          // Find the matching chapter slug from fetched comic data
                          const matchedChapter = comic?.chapters?.find((ch) => {
                            const match = ch.title.match(/Chapter\s+(\d+)/i);
                            return match && parseInt(match[1]) === item.chapter_number;
                          });
                          const chapterSlug = matchedChapter?.slug || `chapter-${item.chapter_number}`;
                          return (
                            <Link
                              to={`/comic/${item.comic_slug}/read/${chapterSlug}`}
                              className="text-xs text-primary hover:underline"
                            >
                              Lanjut baca →
                            </Link>
                          );
                        })()}
                      </div>
                    </>
                  )}
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
