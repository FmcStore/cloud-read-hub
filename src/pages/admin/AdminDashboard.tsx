import { AdminLayout } from "./AdminLayout";
import { comics } from "@/data/comics";
import { BookOpen, MessageSquare, Star, Users } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Komik", value: comics.length, icon: BookOpen, color: "text-primary" },
    { label: "Ongoing", value: comics.filter(c => c.status === "Ongoing").length, icon: BookOpen, color: "text-emerald-500" },
    { label: "Completed", value: comics.filter(c => c.status === "Completed").length, icon: Star, color: "text-amber-500" },
    { label: "Total Chapter", value: comics.reduce((a, c) => a + c.chapters.length, 0), icon: MessageSquare, color: "text-purple-500" },
  ];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-display font-bold text-foreground mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card rounded-xl border border-border/50 p-4">
            <div className="flex items-center gap-3 mb-2">
              <s.icon className={`h-5 w-5 ${s.color}`} />
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-display font-bold text-foreground mb-4">Daftar Komik</h2>
        <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-muted-foreground font-medium">Judul</th>
                <th className="text-left p-3 text-muted-foreground font-medium hidden sm:table-cell">Tipe</th>
                <th className="text-left p-3 text-muted-foreground font-medium hidden md:table-cell">Status</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Chapter</th>
              </tr>
            </thead>
            <tbody>
              {comics.map((c) => (
                <tr key={c.slug} className="border-b border-border/30 hover:bg-muted/30">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img src={c.cover} alt={c.title} className="w-8 h-10 rounded object-cover" />
                      <span className="font-medium text-foreground">{c.title}</span>
                    </div>
                  </td>
                  <td className="p-3 hidden sm:table-cell">
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      c.type === "Manhwa" ? "bg-blue-500/20 text-blue-400" :
                      c.type === "Manga" ? "bg-red-500/20 text-red-400" :
                      "bg-yellow-500/20 text-yellow-400"
                    }`}>{c.type}</span>
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      c.status === "Ongoing" ? "bg-emerald-500/20 text-emerald-400" : "bg-muted text-muted-foreground"
                    }`}>{c.status}</span>
                  </td>
                  <td className="p-3 text-muted-foreground">{c.chapters.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
