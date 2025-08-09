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
        ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm' 
        : 'bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700'
    }`}>
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Monitor className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400 transition-transform duration-300 group-hover:scale-110" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                EndieTech
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1 hidden sm:block">
                Technology Solutions
              </span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <div className="w-64">
              <SearchBar />
            </div>
            <Link 
              to="/" 
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <ThemeToggle />
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
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
          isMenuOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <nav className="pt-4 pb-2 border-t border-gray-200 dark:border-gray-700 mt-4">
            <div className="mb-4">
              <SearchBar />
            </div>
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium py-2 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
