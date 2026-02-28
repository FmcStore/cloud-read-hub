import { useQuery } from "@tanstack/react-query";
import {
  fetchLatest,
  fetchPopular,
  fetchRecommendations,
  fetchSearch,
  fetchComicDetail,
  fetchChapter,
} from "@/lib/api/comic-api";

export function useLatestComics() {
  return useQuery({
    queryKey: ["api-latest"],
    queryFn: fetchLatest,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePopularComics() {
  return useQuery({
    queryKey: ["api-popular"],
    queryFn: fetchPopular,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRecommendations() {
  return useQuery({
    queryKey: ["api-recommendations"],
    queryFn: fetchRecommendations,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSearchComics(query: string) {
  return useQuery({
    queryKey: ["api-search", query],
    queryFn: () => fetchSearch(query),
    enabled: query.trim().length >= 2,
    staleTime: 2 * 60 * 1000,
  });
}

export function useComicDetail(slug: string) {
  return useQuery({
    queryKey: ["api-comic-detail", slug],
    queryFn: () => fetchComicDetail(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useChapterRead(comicSlug: string, chapterSlug: string) {
  return useQuery({
    queryKey: ["api-chapter", comicSlug, chapterSlug],
    queryFn: () => fetchChapter(comicSlug, chapterSlug),
    enabled: !!comicSlug && !!chapterSlug,
    staleTime: 10 * 60 * 1000,
  });
}
