import { Navbar } from "./Navbar";
import { BottomNav } from "./BottomNav";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 pb-20 md:pb-6">{children}</main>
      <BottomNav />
    </div>
  );
}
