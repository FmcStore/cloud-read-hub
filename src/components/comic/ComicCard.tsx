import { Link } from "react-router-dom";
import { Comic } from "@/data/comics";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface ComicCardProps {
  comic: Comic;
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link
        to={`/comic/${comic.slug}`}
        className="group block relative overflow-hidden rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
      >
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={comic.cover}
            alt={comic.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="absolute top-2 left-2 flex gap-1">
          <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${getTypeClass(comic.type)}`}>
            {comic.type}
          </span>
          {comic.status === "Completed" && (
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-500/20 text-emerald-400">
              END
            </span>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-tight mb-1">
            {comic.title}
          </h3>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-amber fill-amber" />
            <span className="text-xs text-amber font-medium">{comic.rating}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
