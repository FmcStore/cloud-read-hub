import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, Clock, Heart, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/ongoing", icon: BookOpen, label: "Ongoing" },
  { to: "/history", icon: Clock, label: "History", auth: true },
  { to: "/bookmarks", icon: Heart, label: "Bookmark", auth: true },
  { to: "/profile", icon: User, label: "Profil", auth: true },
];

export function BottomNav() {
  const location = useLocation();
  const { user } = useAuth();

  const items = navItems.map((item) => {
    if (item.auth && !user) {
      return { ...item, to: "/login" };
    }
    return item;
  });

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.label}
              to={item.to}
              className="relative flex flex-col items-center gap-0.5 py-1 px-3"
            >
              {isActive && (
                <motion.div
                  layoutId="bottomnav-active"
                  className="absolute -top-1 w-8 h-1 rounded-full bg-foreground"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <item.icon
                className={`h-5 w-5 transition-colors ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
