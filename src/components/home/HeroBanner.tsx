import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { ApiComicListItem } from "@/lib/api/comic-api";
import { useState, useEffect, useCallback } from "react";

interface HeroBannerProps {
  comics: ApiComicListItem[];
}

export function HeroBanner({ comics }: HeroBannerProps) {
  const slides = comics.slice(0, 6);
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  if (slides.length === 0) return null;
  const comic = slides[current];

  return (
    <section className="relative w-full h-[55vh] md:h-[65vh] overflow-hidden">
      {/* Background image with crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={comic.slug}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <img
            src={comic.imageSrc}
            alt={comic.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative container mx-auto h-full flex items-end pb-16 md:pb-20 px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={comic.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="max-w-xl"
          >
            {/* Badges */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {comic.chapter && (
                <span className="px-3 py-1 text-xs font-bold rounded-full bg-secondary text-secondary-foreground border border-border">
                  {comic.chapter}
                </span>
              )}
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-amber fill-amber" />
                <span className="text-sm font-semibold text-amber">{comic.rating}</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4 leading-tight">
              {comic.title}
            </h1>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Link
                to={`/comic/${comic.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-semibold hover:bg-foreground/90 transition-colors shadow-lg"
              >
                <BookOpen className="h-4 w-4" /> Baca Sekarang
              </Link>
              <Link
                to={`/comic/${comic.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card/50 text-foreground font-semibold hover:bg-card transition-colors"
              >
                Detail
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
        <button
          onClick={prev}
          className="p-2 rounded-full border border-border bg-card/60 hover:bg-card text-foreground transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all duration-300 rounded-full ${
                i === current
                  ? "w-8 h-2.5 bg-foreground"
                  : "w-2.5 h-2.5 bg-muted-foreground/40 hover:bg-muted-foreground/70"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="p-2 rounded-full border border-border bg-card/60 hover:bg-card text-foreground transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
