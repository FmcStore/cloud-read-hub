import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DbComic {
  id: string;
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
  popular: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbChapter {
  id: string;
  comic_id: string;
  number: number;
  title: string;
  date: string;
  pages: string[];
  created_at: string;
}

export function useDbComics() {
  return useQuery({
    queryKey: ["db-comics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comics")
        .select("*")
        .order("title");
      if (error) throw error;
      return data as DbComic[];
    },
  });
}

export function useDbComic(slug: string) {
  return useQuery({
    queryKey: ["db-comic", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comics")
        .select("*")
        .eq("slug", slug)
        .single();
      if (error) throw error;
      return data as DbComic;
    },
    enabled: !!slug,
  });
}

export function useDbChapters(comicId: string) {
  return useQuery({
    queryKey: ["db-chapters", comicId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chapters")
        .select("*")
        .eq("comic_id", comicId)
        .order("number");
      if (error) throw error;
      return data as DbChapter[];
    },
    enabled: !!comicId,
  });
}

export function useCreateComic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (comic: Omit<DbComic, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase.from("comics").insert(comic).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["db-comics"] }),
  });
}

export function useUpdateComic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DbComic> & { id: string }) => {
      const { data, error } = await supabase.from("comics").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["db-comics"] }),
  });
}

export function useDeleteComic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("comics").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["db-comics"] }),
  });
}

export function useCreateChapter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (chapter: { comic_id: string; number: number; title: string; date: string; pages: string[] }) => {
      const { data, error } = await supabase.from("chapters").insert(chapter).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ["db-chapters", vars.comic_id] }),
  });
}

export function useDeleteChapter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, comic_id }: { id: string; comic_id: string }) => {
      const { error } = await supabase.from("chapters").delete().eq("id", id);
      if (error) throw error;
      return comic_id;
    },
    onSuccess: (comic_id) => qc.invalidateQueries({ queryKey: ["db-chapters", comic_id] }),
  });
}
