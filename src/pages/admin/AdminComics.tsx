import { useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { Link } from "react-router-dom";
import { Eye, Plus, Pencil, Trash2, X, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  useDbComics,
  useCreateComic,
  useUpdateComic,
  useDeleteComic,
  DbComic,
} from "@/hooks/useComics";

type ComicForm = {
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
};

const emptyComic: ComicForm = {
  slug: "",
  title: "",
  cover: "",
  genres: [],
  type: "Manhwa",
  status: "Ongoing",
  rating: 0,
  synopsis: "",
  author: "",
  artist: "",
  released: new Date().getFullYear(),
  popular: false,
  featured: false,
};

export default function AdminComics() {
  const { data: comics = [], isLoading } = useDbComics();
  const createComic = useCreateComic();
  const updateComic = useUpdateComic();
  const deleteComic = useDeleteComic();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingComic, setEditingComic] = useState<DbComic | null>(null);
  const [deletingComic, setDeletingComic] = useState<DbComic | null>(null);
  const [form, setForm] = useState(emptyComic);
  const [genreInput, setGenreInput] = useState("");

  const openCreate = () => {
    setEditingComic(null);
    setForm(emptyComic);
    setGenreInput("");
    setDialogOpen(true);
  };

  const openEdit = (comic: DbComic) => {
    setEditingComic(comic);
    setForm({
      slug: comic.slug,
      title: comic.title,
      cover: comic.cover,
      genres: comic.genres,
      type: comic.type as "Manhwa" | "Manga" | "Manhua",
      status: comic.status as "Ongoing" | "Completed",
      rating: comic.rating,
      synopsis: comic.synopsis,
      author: comic.author,
      artist: comic.artist,
      released: comic.released,
      popular: comic.popular,
      featured: comic.featured,
    });
    setGenreInput("");
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.slug) {
      toast({ title: "Error", description: "Judul dan slug wajib diisi", variant: "destructive" });
      return;
    }
    try {
      if (editingComic) {
        await updateComic.mutateAsync({ id: editingComic.id, ...form });
        toast({ title: "Komik berhasil diupdate!" });
      } else {
        await createComic.mutateAsync(form);
        toast({ title: "Komik berhasil ditambahkan!" });
      }
      setDialogOpen(false);
    } catch (err: any) {
      toast({ title: "Gagal menyimpan", description: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!deletingComic) return;
    try {
      await deleteComic.mutateAsync(deletingComic.id);
      toast({ title: "Komik berhasil dihapus!" });
      setDeleteDialogOpen(false);
    } catch (err: any) {
      toast({ title: "Gagal menghapus", description: err.message, variant: "destructive" });
    }
  };

  const addGenre = () => {
    const g = genreInput.trim();
    if (g && !form.genres.includes(g)) {
      setForm({ ...form, genres: [...form.genres, g] });
    }
    setGenreInput("");
  };

  const removeGenre = (genre: string) => {
    setForm({ ...form, genres: form.genres.filter((g) => g !== genre) });
  };

  const autoSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const isSaving = createComic.isPending || updateComic.isPending;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Kelola Komik</h1>
        <Button onClick={openCreate} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Tambah Komik
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-3">
          {comics.map((comic) => (
            <div key={comic.id} className="bg-card rounded-xl border border-border/50 p-4 flex items-center gap-4">
              <img src={comic.cover} alt={comic.title} className="w-14 h-20 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{comic.title}</h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className={`px-2 py-0.5 text-[10px] rounded-full font-medium ${
                    comic.type === "Manhwa" ? "tag-manhwa" :
                    comic.type === "Manga" ? "tag-manga" : "tag-manhua"
                  }`}>{comic.type}</span>
                  <span className={`px-2 py-0.5 text-[10px] rounded-full font-medium ${
                    comic.status === "Ongoing" ? "bg-emerald-500/20 text-emerald-400" : "bg-muted text-muted-foreground"
                  }`}>{comic.status}</span>
                  <span className="text-xs text-muted-foreground">⭐ {comic.rating}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{comic.synopsis}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => openEdit(comic)} className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground">
                  <Pencil className="h-4 w-4" />
                </button>
                <Link to={`/comic/${comic.slug}`} className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground">
                  <Eye className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => { setDeletingComic(comic); setDeleteDialogOpen(true); }}
                  className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingComic ? "Edit Komik" : "Tambah Komik Baru"}</DialogTitle>
            <DialogDescription>
              {editingComic ? "Ubah detail komik." : "Isi detail komik yang ingin ditambahkan."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Judul *</label>
              <Input
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setForm({ ...form, title, slug: editingComic ? form.slug : autoSlug(title) });
                }}
                placeholder="Solo Leveling"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Slug</label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="solo-leveling" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Cover URL</label>
              <Input value={form.cover} onChange={(e) => setForm({ ...form, cover: e.target.value })} placeholder="https://..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Tipe</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="Manhwa">Manhwa</option>
                  <option value="Manga">Manga</option>
                  <option value="Manhua">Manhua</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Rating</label>
                <Input type="number" step="0.1" min="0" max="10" value={form.rating} onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) || 0 })} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Tahun Rilis</label>
                <Input type="number" value={form.released} onChange={(e) => setForm({ ...form, released: parseInt(e.target.value) || 2024 })} />
              </div>
              <div className="flex items-end gap-3">
                <label className="flex items-center gap-1.5 text-xs">
                  <input type="checkbox" checked={form.popular} onChange={(e) => setForm({ ...form, popular: e.target.checked })} /> Popular
                </label>
                <label className="flex items-center gap-1.5 text-xs">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Author</label>
                <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Artist</label>
                <Input value={form.artist} onChange={(e) => setForm({ ...form, artist: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Genre</label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={genreInput}
                  onChange={(e) => setGenreInput(e.target.value)}
                  placeholder="Action"
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addGenre(); } }}
                />
                <Button type="button" size="sm" variant="outline" onClick={addGenre}>+</Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {form.genres.map((g) => (
                  <span key={g} className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground flex items-center gap-1">
                    {g}
                    <button onClick={() => removeGenre(g)}><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Sinopsis</label>
              <Textarea value={form.synopsis} onChange={(e) => setForm({ ...form, synopsis: e.target.value })} rows={3} />
            </div>
            <Button onClick={handleSave} disabled={isSaving} className="w-full">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              {editingComic ? "Simpan Perubahan" : "Tambah Komik"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Hapus Komik</DialogTitle>
            <DialogDescription>
              Yakin ingin menghapus <strong>{deletingComic?.title}</strong>? Semua chapter juga akan terhapus. Aksi ini tidak bisa dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteComic.isPending}>
              {deleteComic.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Trash2 className="h-4 w-4 mr-1" />}
              Hapus
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
