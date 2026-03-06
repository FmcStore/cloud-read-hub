import { ComicCard } from "@/components/comic/ComicCard";
import { Flame, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ApiComicListItem } from "@/lib/api/comic-api";

interface PopularTodayProps {
  comics: ApiComicListItem[];
}

export function PopularToday({ comics }: PopularTodayProps) {
  if (comics.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-amber" />
          <h2 className="text-xl font-display font-bold text-foreground">Populer</h2>
        </div>
        <Link to="/ongoing" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Lihat Semua <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
        {comics.map((comic, i) => (
          <div key={comic.slug} className="min-w-[160px] max-w-[160px] md:min-w-[200px] md:max-w-[200px]">
            <ComicCard
              comic={{ slug: comic.slug, title: comic.title, cover: comic.imageSrc, rating: comic.rating, chapter: comic.chapter }}
              index={i}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
