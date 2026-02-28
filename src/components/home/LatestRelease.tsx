import { comics } from "@/data/comics";
import { ComicCard } from "@/components/comic/ComicCard";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function LatestRelease() {
  const latest = comics.slice(0, 8);

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-foreground" />
          <h2 className="text-xl font-display font-bold text-foreground">Rilis Terbaru</h2>
        </div>
        <Link to="/ongoing" className="text-sm text-muted-foreground hover:text-foreground hover:underline">
          Lihat Semua →
        </Link>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
        {latest.map((comic, i) => (
          <ComicCard key={comic.slug} comic={comic} index={i} />
        ))}
      </div>
    </section>
  );
}
