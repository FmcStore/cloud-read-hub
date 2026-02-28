import { ComicCard } from "@/components/comic/ComicCard";
import { TrendingUp } from "lucide-react";
import { ApiComicListItem } from "@/lib/api/comic-api";

interface PopularTodayProps {
  comics: ApiComicListItem[];
}

export function PopularToday({ comics }: PopularTodayProps) {
  if (comics.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp className="h-5 w-5 text-foreground" />
        <h2 className="text-xl font-display font-bold text-foreground">Populer Hari Ini</h2>
      </div>
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
        {comics.map((comic, i) => (
          <div key={comic.slug} className="min-w-[150px] max-w-[150px] md:min-w-[180px] md:max-w-[180px]">
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
