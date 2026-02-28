import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ComicCard } from "@/components/comic/ComicCard";
import { genres } from "@/data/comics";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2 } from "lucide-react";
import { useDbComics, DbComic } from "@/hooks/useComics";

interface ComicListProps {
  status?: "Ongoing" | "Completed";
}

export default function ComicList({ status }: ComicListProps) {
  const { data: allComics = [], isLoading } = useDbComics();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result: DbComic[] = allComics;
    if (status) result = result.filter((c) => c.status === status);
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.genres.some((g) => g.toLowerCase().includes(q))
      );
    }
    if (selectedGenre) result = result.filter((c) => c.genres.includes(selectedGenre));
    if (selectedType) result = result.filter((c) => c.type === selectedType);
    return result;
  }, [allComics, status, query, selectedGenre, selectedType]);

  const title = status === "Completed" ? "Komik Tamat" : status === "Ongoing" ? "Komik Ongoing" : "Semua Komik";

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-display font-bold text-foreground mb-4">{title}</h1>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari komik..."
            className="pl-10 bg-muted/50 border-border/50"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-2">
          {["Manhwa", "Manga", "Manhua"].map((t) => (
            <button
              key={t}
              className={`px-3 py-1 text-xs font-semibold rounded-full shrink-0 transition-all ${
                selectedType === t
                  ? t === "Manhwa" ? "tag-manhwa ring-2 ring-[hsl(var(--tag-manhwa)/0.5)]" :
                    t === "Manga" ? "tag-manga ring-2 ring-[hsl(var(--tag-manga)/0.5)]" :
                    "tag-manhua ring-2 ring-[hsl(var(--tag-manhua)/0.5)]"
                  : "bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
              onClick={() => setSelectedType(selectedType === t ? null : t)}
            >
              {t}
            </button>
          ))}
          {genres.map((g) => (
            <Badge
              key={g}
              variant={selectedGenre === g ? "default" : "secondary"}
              className="cursor-pointer shrink-0"
              onClick={() => setSelectedGenre(selectedGenre === g ? null : g)}
            >
              {g}
            </Badge>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">Tidak ada komik ditemukan.</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
            {filtered.map((comic, i) => (
              <ComicCard key={comic.slug} comic={comic} index={i} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
