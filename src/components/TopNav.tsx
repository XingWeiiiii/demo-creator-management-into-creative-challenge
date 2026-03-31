import { Search, Bell, HelpCircle, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Campaigns", path: "/campaigns" },
  { label: "Tools", path: "/" },
  { label: "Analytics", path: "/analytics" },
  { label: "GMV Max", path: "/gmv" },
];

export default function TopNav() {
  const location = useLocation();

  return (
    <header className="h-14 border-b bg-card flex items-center px-4 gap-4 shrink-0">
      <Menu className="w-5 h-5 text-muted-foreground" />
      <div className="flex items-center gap-1.5 mr-4">
        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">T</div>
        <span className="font-semibold text-sm">TikTok</span>
        <span className="text-muted-foreground text-sm">Ads Manager</span>
      </div>

      <nav className="flex items-center gap-1">
        {navItems.map((item) => {
          const active = item.path === "/" ? location.pathname === "/" || location.pathname.startsWith("/brief") : location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${active ? "font-semibold text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="ml-auto flex items-center gap-3">
        <Search className="w-5 h-5 text-muted-foreground" />
        <Bell className="w-5 h-5 text-muted-foreground" />
        <HelpCircle className="w-5 h-5 text-muted-foreground" />
        <div className="flex items-center gap-1.5 border rounded-md px-3 py-1.5 text-sm">
          TTAM Test
        </div>
      </div>
    </header>
  );
}
