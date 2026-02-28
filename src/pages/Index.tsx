import { Layout } from "@/components/layout/Layout";
import { HeroBanner } from "@/components/home/HeroBanner";
import { PopularToday } from "@/components/home/PopularToday";
import { LatestRelease } from "@/components/home/LatestRelease";
import { useDbComics } from "@/hooks/useComics";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { data: comics = [], isLoading } = useDbComics();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  const featured = comics.filter((c) => c.featured);
  const popular = comics.filter((c) => c.popular);

  return (
    <Layout>
      <HeroBanner comics={featured} />
      <PopularToday comics={popular} />
      <LatestRelease comics={comics} />
    </Layout>
  );
};

export default Index;
