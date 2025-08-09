import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Settings, Monitor, Tag, X, Shield, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";

const menuItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Articles",
    href: "/admin/articles",
    icon: FileText,
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: Tag,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ isOpen = true, onClose }: AdminSidebarProps) {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ease-in-out shadow-lg",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0"
      )}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Monitor className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  EndieTech
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                  Admin Panel
                </span>
              </div>
            </Link>
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
          <div className="mt-3 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Shield className="h-4 w-4" />
            <span>Welcome, {user?.username}</span>
          </div>
        </div>
        
        <nav className="mt-6 px-3 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 mx-1 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 mb-1",
                  isActive && "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            onClick={logout}
            className="w-full justify-start text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Logout
          </Button>
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              © 2025 EndieTech
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
