import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Star } from "lucide-react";
import { ApiComicListItem } from "@/lib/api/comic-api";

interface HeroBannerProps {
  comics: ApiComicListItem[];
}

export function HeroBanner({ comics }: HeroBannerProps) {
  const comic = comics[0];
  if (!comic) return null;

  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={comic.imageSrc}
          alt={comic.title}
          className="w-full h-full object-cover blur-sm scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-background/50" />
      </div>

      <div className="relative container mx-auto h-full flex items-end pb-12 px-4">
        <div className="flex gap-6 items-end">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden sm:block"
          >
            <img
              src={comic.imageSrc}
              alt={comic.title}
              className="w-40 md:w-52 rounded-xl shadow-2xl shadow-black/50 border-2 border-border"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 max-w-xl"
          >
            <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-amber/20 text-amber border border-amber/30 mb-3">
              ⭐ REKOMENDASI
            </span>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-2">
              {comic.title}
            </h1>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-amber fill-amber" />
                <span className="text-sm font-semibold text-amber">{comic.rating}</span>
              </div>
              {comic.chapter && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-secondary text-secondary-foreground">
                  {comic.chapter}
                </span>
              )}
            </div>
            <Link
              to={`/comic/${comic.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-semibold hover:bg-foreground/90 transition-colors shadow-lg shadow-black/30"
            >
              <BookOpen className="h-4 w-4" /> Baca Sekarang
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
