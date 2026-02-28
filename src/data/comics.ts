// Types kept for backward compatibility
export interface Comic {
  slug: string;
  title: string;
  cover: string;
  genres: string[];
  type: "Manhwa" | "Manga" | "Manhua";
  status: "Ongoing" | "Completed";
  rating: number;
  synopsis: string;
  author: string;
  artist: string;
  released: number;
  chapters: Chapter[];
  popular?: boolean;
  featured?: boolean;
}

export interface Chapter {
  number: number;
  title: string;
  date: string;
  pages: string[];
}

// Static data kept as fallback
const placeholderPages = (count: number, seed: string, chNum: number) =>
  Array.from({ length: count }, (_, i) =>
    `https://picsum.photos/seed/${seed}-ch${chNum}-p${i + 1}/800/1200`
  );

export const comics: Comic[] = [];

export const genres = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy",
  "Isekai", "Martial Arts", "Mystery", "Romance", "School",
  "Sci-Fi", "Supernatural",
];

export function getComicBySlug(slug: string): Comic | undefined {
  return comics.find((c) => c.slug === slug);
}

export function getComicsByStatus(status: "Ongoing" | "Completed"): Comic[] {
  return comics.filter((c) => c.status === status);
}

export function getPopularComics(): Comic[] {
  return comics.filter((c) => c.popular);
}

export function getFeaturedComics(): Comic[] {
  return comics.filter((c) => c.featured);
}

export function searchComics(query: string): Comic[] {
  const q = query.toLowerCase();
  return comics.filter(
    (c) =>
      c.title.toLowerCase().includes(q) ||
      c.genres.some((g) => g.toLowerCase().includes(q))
  );
}
