import { Link } from "react-router-dom";
import { Star, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

interface ComicCardComic {
  slug: string;
  title: string;
  cover: string;
  type?: string;
  rating: string | number;
  chapter?: string;
}

interface ComicCardProps {
  comic: ComicCardComic;
  index?: number;
}

function getTypeClass(type: string) {
  switch (type) {
    case "Manhwa": return "tag-manhwa";
    case "Manga": return "tag-manga";
    case "Manhua": return "tag-manhua";
    default: return "bg-muted text-muted-foreground";
  }
}

export function ComicCard({ comic, index = 0 }: ComicCardProps) {
  // Extract chapter number from string like "Chapter 1120"
  const chapterNum = comic.chapter?.replace(/\D/g, "") || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
    >
      <Link
        to={`/comic/${comic.slug}`}
        className="group block relative overflow-hidden rounded-xl hover:shadow-xl hover:shadow-black/10 transition-all duration-300 hover:-translate-y-1"
      >
        <div className="aspect-[3/4] overflow-hidden rounded-xl">
          <img
            src={comic.cover}
            alt={comic.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        {/* Type & Status badges */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {comic.type && (
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${getTypeClass(comic.type)}`}>
              {comic.type}
            </span>
          )}
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight mb-1.5">
            {comic.title}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-amber fill-amber" />
              <span className="text-xs text-amber font-medium">{comic.rating}</span>
            </div>
            {chapterNum && (
              <div className="flex items-center gap-1 text-white/70">
                <BookOpen className="h-3 w-3" />
                <span className="text-[10px] font-medium">{chapterNum}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
