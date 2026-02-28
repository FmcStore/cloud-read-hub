import { getFeaturedComics } from "@/data/comics";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Star } from "lucide-react";

export function HeroBanner() {
  const featured = getFeaturedComics();
  const comic = featured[0];
  if (!comic) return null;

  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={comic.cover}
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
              src={comic.cover}
              alt={comic.title}
              className="w-40 md:w-52 rounded-xl shadow-2xl shadow-primary/20 border-2 border-primary/30"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 max-w-xl"
          >
            <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-primary/20 text-primary border border-primary/30 mb-3">
              ⭐ FEATURED
            </span>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-2">
              {comic.title}
            </h1>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-amber fill-amber" />
                <span className="text-sm font-semibold text-amber">{comic.rating}</span>
              </div>
              <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                comic.type === "Manhwa" ? "tag-manhwa" :
                comic.type === "Manga" ? "tag-manga" : "tag-manhua"
              }`}>{comic.type}</span>
              {comic.genres.slice(0, 3).map((g) => (
                <span key={g} className="px-2 py-0.5 text-xs rounded-full bg-secondary text-secondary-foreground">
                  {g}
                </span>
              ))}
            </div>
            <p className="text-sm text-foreground/60 line-clamp-2 mb-4">{comic.synopsis}</p>
            <Link
              to={`/comic/${comic.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
            >
              <BookOpen className="h-4 w-4" /> Baca Sekarang
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
