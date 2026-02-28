import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Heart, Star, BookOpen, Clock, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useBookmarks } from "@/hooks/useBookmarks";
import { motion } from "framer-motion";
import { ReviewSection } from "@/components/comic/ReviewSection";
import { useDbComic, useDbChapters } from "@/hooks/useComics";

export default function ComicDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: comic, isLoading } = useDbComic(slug || "");
  const { data: chapters = [] } = useDbChapters(comic?.id || "");
  const { user } = useAuth();
  const { isBookmarked, toggleBookmark } = useBookmarks();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (!comic) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-display font-bold text-foreground">Komik tidak ditemukan</h1>
        </div>
      </Layout>
    );
  }

  const bookmarked = isBookmarked(comic.slug);

  return (
    <Layout>
      {/* Banner */}
      <div className="relative w-full h-[40vh] overflow-hidden">
        <img src={comic.cover} alt={comic.title} className="w-full h-full object-cover blur-md scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="flex gap-5">
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            src={comic.cover}
            alt={comic.title}
            className="w-32 md:w-44 rounded-xl shadow-2xl shadow-black/50 border-2 border-border shrink-0"
          />
          <div className="flex-1 pt-8">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">{comic.title}</h1>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-amber fill-amber" />
                <span className="text-sm font-semibold text-amber">{comic.rating}</span>
              </div>
              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                comic.type === "Manhwa" ? "tag-manhwa" :
                comic.type === "Manga" ? "tag-manga" : "tag-manhua"
              }`}>{comic.type}</span>
              <Badge variant={comic.status === "Ongoing" ? "default" : "secondary"}>
                {comic.status}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {comic.genres.map((g) => (
                <span key={g} className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">{g}</span>
              ))}
            </div>
            <div className="flex gap-2">
              {chapters.length > 0 && (
                <Button asChild>
                  <Link to={`/comic/${comic.slug}/1`}>
                    <BookOpen className="h-4 w-4 mr-1" /> Baca Ch.1
                  </Link>
                </Button>
              )}
              {user && (
                <Button
                  variant={bookmarked ? "destructive" : "outline"}
                  onClick={() => toggleBookmark(comic.slug)}
                >
                  <Heart className={`h-4 w-4 mr-1 ${bookmarked ? "fill-current" : ""}`} />
                  {bookmarked ? "Hapus" : "Bookmark"}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Author", value: comic.author },
            { label: "Artist", value: comic.artist },
            { label: "Released", value: comic.released },
            { label: "Chapters", value: chapters.length },
          ].map((item) => (
            <div key={item.label} className="bg-card rounded-lg p-3 border border-border/50">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-sm font-medium text-foreground">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Synopsis */}
        <div className="mt-6">
          <h2 className="text-lg font-display font-bold text-foreground mb-2">Sinopsis</h2>
          <p className="text-sm text-foreground/70 leading-relaxed">{comic.synopsis}</p>
        </div>

        {/* Rating & Review */}
        <ReviewSection comicSlug={comic.slug} />

        {/* Chapters */}
        <div className="mt-6 mb-8">
          <h2 className="text-lg font-display font-bold text-foreground mb-3">Daftar Chapter</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {chapters
              .slice()
              .reverse()
              .map((ch) => (
                <Link
                  key={ch.number}
                  to={`/comic/${comic.slug}/${ch.number}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-card border border-border/50 hover:border-foreground/30 hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground">Chapter {ch.number}</span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{ch.date}</span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
