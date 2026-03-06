import { Link, useLocation } from "react-router-dom";
import { Search, BookOpen, Moon, Sun, LogIn, Menu, X } from "lucide-react";
import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useSearchComics } from "@/hooks/useComicApi";
import { useTheme } from "@/contexts/ThemeContext";

export function Navbar() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { data: results = [] } = useSearchComics(query);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/ongoing?q=${encodeURIComponent(query.trim())}`);
      setMenuOpen(false);
      setQuery("");
    }
  };

  const handleSelect = (slug: string) => {
    navigate(`/comic/${slug}`);
    setMenuOpen(false);
    setQuery("");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-foreground" />
          <span className="text-xl font-display font-bold text-foreground">FmcComic</span>
        </Link>

        {/* Center nav - desktop only */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <Link to="/ongoing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Ongoing</Link>
          <Link to="/completed" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Completed</Link>
          <Link to="/ongoing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Browse</Link>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {/* Desktop search */}
          <div className="hidden md:block relative">
            <form onSubmit={handleSearch}>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari komik..."
                className="h-9 w-[200px] bg-muted/50 border-border/50"
              />
            </form>
            {results.length > 0 && query && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
                {results.slice(0, 5).map((comic) => (
                  <button
                    key={comic.slug}
                    onMouseDown={() => handleSelect(comic.slug)}
                    className="flex items-center gap-3 w-full p-2 hover:bg-muted/50 transition-colors text-left"
                  >
                    <img src={comic.image} alt={comic.title} className="w-8 h-10 rounded object-cover shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{comic.title}</p>
                      <p className="text-[10px] text-muted-foreground">⭐ {comic.rating}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
            {theme === "light" ? (
              <Moon className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Sun className="h-5 w-5 text-muted-foreground" />
            )}
          </button>

          {!user && (
            <Link to="/login" className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-colors">
              <LogIn className="h-4 w-4" /> Login
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            {menuOpen ? <X className="h-5 w-5 text-foreground" /> : <Menu className="h-5 w-5 text-foreground" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-border bg-background"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {/* Mobile search */}
              <div className="relative">
                <form onSubmit={handleSearch}>
                  <Input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Cari komik..."
                    className="h-10 bg-muted/50 border-border/50"
                  />
                </form>
                {results.length > 0 && query && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50 max-h-60 overflow-y-auto">
                    {results.slice(0, 5).map((comic) => (
                      <button
                        key={comic.slug}
                        onMouseDown={() => handleSelect(comic.slug)}
                        className="flex items-center gap-3 w-full p-2 hover:bg-muted/50 transition-colors text-left"
                      >
                        <img src={comic.image} alt={comic.title} className="w-8 h-10 rounded object-cover shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{comic.title}</p>
                          <p className="text-[10px] text-muted-foreground">⭐ {comic.rating}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Nav links */}
              <nav className="flex flex-col gap-1">
                <Link to="/" onClick={() => setMenuOpen(false)} className="py-2 text-sm font-medium text-foreground hover:text-foreground/80 transition-colors">Home</Link>
                <Link to="/ongoing" onClick={() => setMenuOpen(false)} className="py-2 text-sm font-medium text-foreground hover:text-foreground/80 transition-colors">Ongoing</Link>
                <Link to="/completed" onClick={() => setMenuOpen(false)} className="py-2 text-sm font-medium text-foreground hover:text-foreground/80 transition-colors">Completed</Link>
                <Link to="/ongoing" onClick={() => setMenuOpen(false)} className="py-2 text-sm font-medium text-foreground hover:text-foreground/80 transition-colors">Browse</Link>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
