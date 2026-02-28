import { useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, MessageSquare, Home, Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/admin", icon: Home, label: "Dashboard" },
  { to: "/admin/comics", icon: BookOpen, label: "Komik" },
  { to: "/admin/comments", icon: MessageSquare, label: "Komentar" },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useAdmin();
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
    if (!authLoading && !loading && user && !isAdmin) navigate("/");
  }, [user, authLoading, isAdmin, loading]);

  if (authLoading || loading || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-60 bg-card border-r border-border hidden md:flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-display font-bold text-foreground">Admin Panel</span>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border space-y-2">
          <Link to="/" className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50">
            <Home className="h-4 w-4" /> Kembali ke Site
          </Link>
          <button
            onClick={() => signOut().then(() => navigate("/"))}
            className="flex items-center gap-2 px-3 py-2 text-sm text-destructive/70 hover:text-destructive rounded-lg hover:bg-muted/50 w-full"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex-1 flex flex-col">
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-display font-bold text-foreground text-sm">Admin</span>
          </div>
          <div className="flex gap-1">
            {navItems.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link key={item.to} to={item.to} className={`p-2 rounded-lg ${active ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}>
                  <item.icon className="h-4 w-4" />
                </Link>
              );
            })}
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
