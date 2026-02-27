import { Layout } from "@/components/layout/Layout";
import { HeroBanner } from "@/components/home/HeroBanner";
import { PopularToday } from "@/components/home/PopularToday";
import { LatestRelease } from "@/components/home/LatestRelease";

const Index = () => {
  return (
    <Layout>
      <HeroBanner />
      <PopularToday />
      <LatestRelease />
    </Layout>
  );
};

export default Index;
