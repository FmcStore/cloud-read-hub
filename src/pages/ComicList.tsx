import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { ComicCard } from "@/components/comic/ComicCard";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { useLatestComics, useSearchComics } from "@/hooks/useComicApi";

interface ComicListProps {
  status?: "Ongoing" | "Completed";
}

export default function ComicList({ status }: ComicListProps) {
  const [query, setQuery] = useState("");
  const { data: latestComics = [], isLoading: latestLoading } = useLatestComics();
  const { data: searchResults = [], isLoading: searchLoading, isFetching: searchFetching } = useSearchComics(query);

  const isSearching = query.trim().length >= 2;
  const isLoading = isSearching ? searchLoading : latestLoading;

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

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : isSearching ? (
          <>
            {searchFetching && (
              <div className="flex justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            )}
            {searchResults.length === 0 && !searchFetching ? (
              <p className="text-center text-muted-foreground py-12">Tidak ada komik ditemukan.</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
                {searchResults.map((comic, i) => (
                  <ComicCard
                    key={comic.slug}
                    comic={{
                      slug: comic.slug,
                      title: comic.title,
                      cover: comic.image,
                      rating: comic.rating,
                      chapter: comic.latestChapter,
                    }}
                    index={i}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {latestComics.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">Tidak ada komik ditemukan.</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
                {latestComics.map((comic, i) => (
                  <ComicCard
                    key={comic.slug}
                    comic={{
                      slug: comic.slug,
                      title: comic.title,
                      cover: comic.imageSrc,
                      rating: comic.rating,
                      chapter: comic.chapter,
                    }}
                    index={i}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
