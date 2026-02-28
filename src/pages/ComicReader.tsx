import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Home, Maximize, Minimize, List, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useHistory } from "@/hooks/useHistory";
import { motion, AnimatePresence } from "framer-motion";
import { CommentSection } from "@/components/comic/CommentSection";
import { useChapterRead } from "@/hooks/useComicApi";

export default function ComicReader() {
  const { slug, chapter } = useParams<{ slug: string; chapter: string }>();
  const navigate = useNavigate();
  const comicSlugParam = slug || "";
  const chapterSlug = chapter || "";
  const { data: chapterData, isLoading } = useChapterRead(comicSlugParam, chapterSlug);
  const { user } = useAuth();
  const { updateHistory } = useHistory();

  const [showUI, setShowUI] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const comicSlug = chapterData?.comicSlug || comicSlugParam;

  // Extract chapter number from title for history
  useEffect(() => {
    if (user && chapterData && comicSlug) {
      const match = chapterData.title.match(/Chapter\s+(\d+)/i);
      const chNum = match ? parseInt(match[1]) : 1;
      updateHistory(comicSlug, chNum);
    }
  }, [user, chapterData?.title, comicSlug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [chapterSlug]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!chapterData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Chapter tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" onClick={() => setShowUI(!showUI)}>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Progress value={scrollProgress} className="h-1 rounded-none" />
      </div>

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
                <Link to={`/comic/${comicSlug}`} className="p-2 rounded-lg hover:bg-muted/50">
                  <ChevronLeft className="h-5 w-5 text-foreground" />
                </Link>
                <div>
                  <p className="text-sm font-medium text-foreground line-clamp-1">{chapterData.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Link to={`/comic/${comicSlug}`} className="p-2 rounded-lg hover:bg-muted/50">
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

      <div className="max-w-3xl mx-auto" onClick={(e) => e.stopPropagation()}>
        {chapterData.images.map((page, i) => (
          <img
            key={i}
            src={page}
            alt={`Page ${i + 1}`}
            className="w-full"
            loading="lazy"
            onClick={() => setShowUI(!showUI)}
          />
        ))}

        <div className="px-4 py-6" onClick={(e) => e.stopPropagation()}>
          <CommentSection comicSlug={comicSlug} chapterNumber={1} />
        </div>
      </div>

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
                disabled={!chapterData.prevSlug}
                onClick={() => navigate(`/comic/${comicSlug}/read/${chapterData.prevSlug}`)}
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-foreground/10 text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </button>
              <Link to="/" className="p-2 rounded-lg hover:bg-muted/50">
                <Home className="h-5 w-5 text-foreground/70" />
              </Link>
              <button
                disabled={!chapterData.nextSlug}
                onClick={() => navigate(`/comic/${comicSlug}/read/${chapterData.nextSlug}`)}
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
