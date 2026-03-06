import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import ComicList from "./pages/ComicList";
import ComicDetail from "./pages/ComicDetail";
import ComicReader from "./pages/ComicReader";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Bookmarks from "./pages/Bookmarks";
import History from "./pages/History";
import Install from "./pages/Install";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminComics from "./pages/admin/AdminComics";
import AdminComments from "./pages/admin/AdminComments";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/ongoing" element={<ComicList status="Ongoing" />} />
              <Route path="/completed" element={<ComicList status="Completed" />} />
              <Route path="/comic/:slug" element={<ComicDetail />} />
              <Route path="/comic/:slug/read/:chapter" element={<ComicReader />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
              <Route path="/history" element={<History />} />
              <Route path="/install" element={<Install />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/comics" element={<AdminComics />} />
              <Route path="/admin/comments" element={<AdminComments />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
