import { Link, useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Heart, User } from "lucide-react";
import { useSearchComics } from "@/hooks/useComicApi";

export function Navbar() {
  const { user } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: results = [] } = useSearchComics(query);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/ongoing?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery("");
    }
  };

  const handleSelect = (slug: string) => {
    navigate(`/comic/${slug}`);
    setSearchOpen(false);
    setQuery("");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-display font-bold gradient-text">FmcComic</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">Home</Link>
          <Link to="/ongoing" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">Ongoing</Link>
          <Link to="/completed" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">Completed</Link>
          <Link to="/ongoing" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">Browse</Link>
        </nav>

        <div className="flex items-center gap-2 relative">
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 250, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="relative"
              >
                <form onSubmit={handleSearch}>
                  <Input
                    ref={inputRef}
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Cari komik..."
                    className="h-9 bg-muted/50 border-border/50"
                    onBlur={() => setTimeout(() => { if (!query) setSearchOpen(false); }, 200)}
                  />
                </form>
                {results.length > 0 && (
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
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
            <Search className="h-5 w-5 text-foreground/70" />
          </button>
          {user ? (
            <>
              <Link to="/bookmarks" className="p-2 rounded-lg hover:bg-muted/50 transition-colors hidden md:block">
                <Heart className="h-5 w-5 text-foreground/70" />
              </Link>
              <Link to="/profile" className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <User className="h-5 w-5 text-foreground/70" />
              </Link>
            </>
          ) : (
            <Link to="/login" className="px-4 py-2 text-sm font-medium rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-colors">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
