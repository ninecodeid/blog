import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Settings, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Artikel",
    href: "/admin/articles",
    icon: FileText,
  },
  {
    name: "Pengaturan",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-700">
      <div className="p-6">
        <Link to="/" className="flex items-center space-x-2">
          <Monitor className="h-8 w-8 text-emerald-400" />
          <span className="text-xl font-bold text-white">TeknisPro Admin</span>
        </Link>
      </div>
      
      <nav className="mt-8">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center space-x-3 px-6 py-3 text-gray-300 hover:bg-slate-800 hover:text-emerald-400 transition-colors",
                isActive && "bg-slate-800 text-emerald-400 border-r-2 border-emerald-400"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
