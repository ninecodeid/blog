import { Link, useLocation } from "react-router-dom";
import { Monitor, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import SearchBar from "./SearchBar";

export default function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg' 
        : 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700'
    }`}>
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group relative">
            <div className="relative">
              <Monitor className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
              <div className="absolute -inset-2 bg-blue-400/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:via-blue-600 group-hover:to-purple-600 transition-all duration-500">
                EndieTech
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1 hidden sm:block">
                Technology Solutions
              </span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <div className="w-72">
              <SearchBar />
            </div>
            <Link 
              to="/" 
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 font-semibold relative group px-3 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30"
            >
              🏠
              Home
              <span className="absolute -bottom-1 left-3 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-[calc(100%-1.5rem)]"></span>
            </Link>
            <ThemeToggle />
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:scale-110"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="relative w-6 h-6">
                <Menu className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${isMenuOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`} />
                <X className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${isMenuOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <nav className="pt-4 pb-2 border-t border-gray-200 dark:border-gray-700 mt-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl mx-4 px-4 backdrop-blur-sm">
            <div className="mb-4">
              <SearchBar />
            </div>
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 font-semibold py-3 px-4 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>🏠</span>
                Home
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
