import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, Clock, Heart, User, Search } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const { user } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/ongoing?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery("");
    }
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
        </nav>

        <div className="flex items-center gap-2">
          <AnimatePresence>
            {searchOpen && (
              <motion.form
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 200, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                onSubmit={handleSearch}
              >
                <Input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari komik..."
                  className="h-9 bg-muted/50 border-border/50"
                  onBlur={() => !query && setSearchOpen(false)}
                />
              </motion.form>
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
            <Link to="/login" className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
