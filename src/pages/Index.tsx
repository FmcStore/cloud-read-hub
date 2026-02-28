import { Layout } from "@/components/layout/Layout";
import { HeroBanner } from "@/components/home/HeroBanner";
import { PopularToday } from "@/components/home/PopularToday";
import { LatestRelease } from "@/components/home/LatestRelease";
import { useLatestComics, usePopularComics, useRecommendations } from "@/hooks/useComicApi";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { data: latest = [], isLoading: latestLoading } = useLatestComics();
  const { data: popular = [], isLoading: popularLoading } = usePopularComics();
  const { data: recommendations = [] } = useRecommendations();

  const isLoading = latestLoading || popularLoading;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <HeroBanner comics={recommendations.slice(0, 5)} />
      <PopularToday comics={popular} />
      <LatestRelease comics={latest} />
    </Layout>
  );
};

export default Index;
