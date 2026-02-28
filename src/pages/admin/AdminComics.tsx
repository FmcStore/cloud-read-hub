import { AdminLayout } from "./AdminLayout";
import { comics } from "@/data/comics";
import { Link } from "react-router-dom";
import { Eye, BookOpen } from "lucide-react";

export default function AdminComics() {
  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Kelola Komik</h1>
        <p className="text-sm text-muted-foreground">{comics.length} komik</p>
      </div>

      <div className="space-y-3">
        {comics.map((comic) => (
          <div key={comic.slug} className="bg-card rounded-xl border border-border/50 p-4 flex items-center gap-4">
            <img src={comic.cover} alt={comic.title} className="w-14 h-20 rounded-lg object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">{comic.title}</h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className={`px-2 py-0.5 text-[10px] rounded-full font-medium ${
                  comic.type === "Manhwa" ? "bg-blue-500/20 text-blue-400" :
                  comic.type === "Manga" ? "bg-red-500/20 text-red-400" :
                  "bg-yellow-500/20 text-yellow-400"
                }`}>{comic.type}</span>
                <span className={`px-2 py-0.5 text-[10px] rounded-full font-medium ${
                  comic.status === "Ongoing" ? "bg-emerald-500/20 text-emerald-400" : "bg-muted text-muted-foreground"
                }`}>{comic.status}</span>
                <span className="text-xs text-muted-foreground">{comic.chapters.length} chapter</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{comic.synopsis}</p>
            </div>
            <Link to={`/comic/${comic.slug}`} className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground shrink-0">
              <Eye className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-muted/30 rounded-xl border border-border/30 text-center">
        <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">
          Data komik saat ini disimpan secara lokal (static). <br />
          Untuk menambah/edit komik, ubah file <code className="text-primary">src/data/comics.ts</code>
        </p>
      </div>
    </AdminLayout>
  );
}
