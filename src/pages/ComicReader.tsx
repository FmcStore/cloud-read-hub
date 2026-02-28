import { useParams, Link, useNavigate } from "react-router-dom";
import { getComicBySlug } from "@/data/comics";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Home, Maximize, Minimize, List } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useHistory } from "@/hooks/useHistory";
import { motion, AnimatePresence } from "framer-motion";
import { CommentSection } from "@/components/comic/CommentSection";
export default function ComicReader() {
  const { slug, chapter } = useParams<{ slug: string; chapter: string }>();
  const navigate = useNavigate();
  const comic = getComicBySlug(slug || "");
  const chapterNum = parseInt(chapter || "1");
  const { user } = useAuth();
  const { updateHistory } = useHistory();

  const [showUI, setShowUI] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const currentChapter = comic?.chapters.find((c) => c.number === chapterNum);
  const hasPrev = chapterNum > 1;
  const hasNext = comic ? chapterNum < comic.chapters.length : false;

  // Track reading history
  useEffect(() => {
    if (user && comic) {
      updateHistory(comic.slug, chapterNum);
    }
  }, [user, comic?.slug, chapterNum]);

  // Scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  if (!comic || !currentChapter) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Chapter tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" onClick={() => setShowUI(!showUI)}>
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Progress value={scrollProgress} className="h-1 rounded-none" />
      </div>

      {/* Top bar */}
      <AnimatePresence>
        {showUI && (
          <motion.div
            initial={{ y: -60 }}
            animate={{ y: 0 }}
            exit={{ y: -60 }}
            className="fixed top-1 left-0 right-0 z-40 glass"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between h-14 px-4">
              <div className="flex items-center gap-2">
                <Link to={`/comic/${comic.slug}`} className="p-2 rounded-lg hover:bg-muted/50">
                  <ChevronLeft className="h-5 w-5 text-foreground" />
                </Link>
                <div>
                  <p className="text-sm font-medium text-foreground line-clamp-1">{comic.title}</p>
                  <p className="text-xs text-muted-foreground">Chapter {chapterNum}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Link to={`/comic/${comic.slug}`} className="p-2 rounded-lg hover:bg-muted/50">
                  <List className="h-5 w-5 text-foreground/70" />
                </Link>
                <button onClick={toggleFullscreen} className="p-2 rounded-lg hover:bg-muted/50">
                  {isFullscreen ? (
                    <Minimize className="h-5 w-5 text-foreground/70" />
                  ) : (
                    <Maximize className="h-5 w-5 text-foreground/70" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pages */}
      <div className="max-w-3xl mx-auto" onClick={(e) => e.stopPropagation()}>
        {currentChapter.pages.map((page, i) => (
          <img
            key={i}
            src={page}
            alt={`Page ${i + 1}`}
            className="w-full"
            loading="lazy"
            onClick={() => setShowUI(!showUI)}
          />
        ))}

        {/* Comment Section */}
        <div className="px-4 py-6" onClick={(e) => e.stopPropagation()}>
          <CommentSection comicSlug={comic.slug} chapterNumber={chapterNum} />
        </div>
      </div>

      {/* Bottom nav */}
      <AnimatePresence>
        {showUI && (
          <motion.div
            initial={{ y: 60 }}
            animate={{ y: 0 }}
            exit={{ y: 60 }}
            className="fixed bottom-0 left-0 right-0 z-40 glass"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between h-14 px-4">
              <button
                disabled={!hasPrev}
                onClick={() => navigate(`/comic/${comic.slug}/${chapterNum - 1}`)}
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-foreground/10 text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </button>
              <Link to="/" className="p-2 rounded-lg hover:bg-muted/50">
                <Home className="h-5 w-5 text-foreground/70" />
              </Link>
              <button
                disabled={!hasNext}
                onClick={() => navigate(`/comic/${comic.slug}/${chapterNum + 1}`)}
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-foreground/10 text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
