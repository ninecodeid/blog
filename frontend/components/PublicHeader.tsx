import { Link } from "react-router-dom";
import { Monitor, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PublicHeader() {
  return (
    <header className="bg-slate-900 border-b border-slate-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Monitor className="h-8 w-8 text-emerald-400" />
            <span className="text-xl font-bold text-white">TeknisPro</span>
          </Link>
          <nav className="flex items-center space-x-6">
            <Link to="/" className="text-gray-300 hover:text-emerald-400 transition-colors">
              Home
            </Link>
            <Link to="/admin">
              <Button 
                variant="outline" 
                size="sm"
                className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
              >
                <Settings className="h-4 w-4 mr-2" />
                Admin Panel
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
