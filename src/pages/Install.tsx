import { Layout } from "@/components/layout/Layout";
import { Download, Smartphone, Globe, Share2 } from "lucide-react";

export default function Install() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-foreground/20 to-foreground/5 mx-auto flex items-center justify-center mb-6">
            <Download className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-display font-bold gradient-text mb-2">Install FmcComic</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Install FmcComic sebagai aplikasi di HP atau PC kamu!
          </p>

          <div className="space-y-4 text-left">
            <div className="bg-card rounded-xl border border-border/50 p-5">
              <div className="flex items-center gap-3 mb-3">
                <Smartphone className="h-5 w-5 text-primary" />
                <h2 className="font-display font-bold text-foreground">Android (Chrome)</h2>
              </div>
              <ol className="space-y-2 text-sm text-foreground/70">
                <li>1. Buka FmcComic di Chrome</li>
                <li>2. Tap tombol menu (⋮) di pojok kanan atas</li>
                <li>3. Pilih "Add to Home Screen" atau "Install App"</li>
                <li>4. Tap "Install"</li>
              </ol>
            </div>

            <div className="bg-card rounded-xl border border-border/50 p-5">
              <div className="flex items-center gap-3 mb-3">
                <Smartphone className="h-5 w-5 text-cyan" />
                <h2 className="font-display font-bold text-foreground">iOS (Safari)</h2>
              </div>
              <ol className="space-y-2 text-sm text-foreground/70">
                <li>1. Buka FmcComic di Safari</li>
                <li>2. Tap tombol Share (kotak dengan panah ke atas)</li>
                <li>3. Scroll ke bawah dan pilih "Add to Home Screen"</li>
                <li>4. Tap "Add"</li>
              </ol>
            </div>

            <div className="bg-card rounded-xl border border-border/50 p-5">
              <div className="flex items-center gap-3 mb-3">
                <Globe className="h-5 w-5 text-amber" />
                <h2 className="font-display font-bold text-foreground">Desktop (Chrome/Edge)</h2>
              </div>
              <ol className="space-y-2 text-sm text-foreground/70">
                <li>1. Buka FmcComic di browser</li>
                <li>2. Klik icon install (⊕) di address bar</li>
                <li>3. Klik "Install"</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
