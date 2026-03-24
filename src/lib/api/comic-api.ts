const CORS_PROXY = "https://api-proxy-eight-mu.vercel.app/api/tools/proxy";
const BASE_URL = "https://www.sankavollerei.com/comic";

async function fetchApi<T>(endpoint: string): Promise<T> {
  const url = `${CORS_PROXY}?url=${encodeURIComponent(`${BASE_URL}/${endpoint}`)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  if (json.success && json.result?.content) {
    return json.result.content as T;
  }
  // fallback: direct response without proxy wrapper
  if (json.success) return json as T;
  throw new Error("API request failed");
}

// ─── Types ───

export interface ApiComicListItem {
  title: string;
  slug: string;
  chapter: string;
  rating: string;
  imageSrc: string;
}

export interface ApiSearchItem {
  title: string;
  slug: string;
  image: string;
  latestChapter: string;
  rating: string;
}

export interface ApiComicDetail {
  title: string;
  alternative: string;
  imageSrc: string;
  rating: string;
  followedBy: string;
  synopsis: string;
  type: string;
  released: string;
  serialization: string;
  updatedOn: string;
  genres: string[];
  chapters: ApiChapterListItem[];
}

export interface ApiChapterListItem {
  title: string;
  slug: string;
  date: string;
}

export interface ApiChapterRead {
  title: string;
  comicSlug: string;
  images: string[];
  prevSlug: string | null;
  nextSlug: string | null;
}

interface PaginatedResponse<T> {
  success: boolean;
  pagination?: { currentPage: number; hasNextPage: boolean; nextPage: number | null };
  results: T[];
}

interface SearchResponse {
  success: boolean;
  seriesList: ApiSearchItem[];
  nextPage: number | null;
}

// ─── API Functions ───

export async function fetchLatest(): Promise<ApiComicListItem[]> {
  const data = await fetchApi<PaginatedResponse<ApiComicListItem>>("kiryuu/latest");
  return data.results || [];
}

export async function fetchPopular(): Promise<ApiComicListItem[]> {
  const data = await fetchApi<PaginatedResponse<ApiComicListItem>>("kiryuu/popular");
  return data.results || [];
}

export async function fetchRecommendations(): Promise<ApiComicListItem[]> {
  const data = await fetchApi<PaginatedResponse<ApiComicListItem>>("kiryuu/recommendations");
  return data.results || [];
}

export async function fetchSearch(query: string): Promise<ApiSearchItem[]> {
  const data = await fetchApi<SearchResponse>(`kiryuu/search/${encodeURIComponent(query)}`);
  return data.seriesList || [];
}

export async function fetchComicDetail(slug: string): Promise<ApiComicDetail> {
  const data = await fetchApi<ApiComicDetail & { success: boolean }>(`kiryuu/manga/${slug}`);
  return data;
}

export async function fetchChapter(comicSlug: string, chapterSlug: string): Promise<ApiChapterRead> {
  // API sumber kadang tidak konsisten: chapter-1.734045, chapter-1, atau chapter-01.
  // Coba beberapa variasi slug agar halaman reader tetap bisa load.
  const normalized = chapterSlug.trim();
  const cleanSlug = normalized.replace(/\.\d+$/, "");
  const chapterNumberMatch = cleanSlug.match(/chapter-(\d+)/i);
  const chapterNumber = chapterNumberMatch ? parseInt(chapterNumberMatch[1], 10) : null;

  const chapterCandidates = [
    normalized,
    cleanSlug,
    chapterNumber ? `chapter-${chapterNumber}` : null,
    chapterNumber ? `chapter-${String(chapterNumber).padStart(2, "0")}` : null,
    chapterNumber ? `chapter-${String(chapterNumber).padStart(3, "0")}` : null,
  ].filter((v): v is string => Boolean(v));

  const endpointCandidates = Array.from(
    new Set(
      chapterCandidates.map((candidate) =>
        candidate.startsWith(`${comicSlug}-`) ? candidate : `${comicSlug}-${candidate}`
      )
    )
  );

  let lastError: unknown;
  for (const endpointSlug of endpointCandidates) {
    try {
      return await fetchApi<ApiChapterRead & { success: boolean }>(`kiryuu/chapter/${endpointSlug}`);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("API request failed");
}
