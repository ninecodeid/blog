import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import backend from "~backend/client";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ onSearch, placeholder = "Cari artikel...", className = "" }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Search results
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery.trim()) return null;
      try {
        return await backend.blog.searchArticles({ 
          q: debouncedQuery, 
          published: true, 
          limit: 5 
        });
      } catch (err) {
        console.error("Search error:", err);
        throw err;
      }
    },
    enabled: debouncedQuery.length > 2,
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (onSearch) {
      onSearch(searchQuery);
    }
    setIsOpen(false);
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    setIsOpen(value.length > 0);
  };

  const clearSearch = () => {
    setQuery("");
    setDebouncedQuery("");
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
        <Input
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && query.trim()) {
              handleSearch(query.trim());
            }
            if (e.key === "Escape") {
              setIsOpen(false);
            }
          }}
          className="pl-10 pr-10 h-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-xl transition-all duration-200"
          placeholder={placeholder}
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (query.length > 2 || searchResults) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading && (
            <div className="p-4 text-center">
              <Loader2 className="h-5 w-5 animate-spin mx-auto text-blue-600 dark:text-blue-400" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Mencari...</p>
            </div>
          )}

          {!isLoading && searchResults && searchResults.articles.length > 0 && (
            <div className="p-2">
              <div className="text-xs text-gray-500 dark:text-gray-400 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                {searchResults.total} hasil ditemukan
              </div>
              {searchResults.articles.map((article) => (
                <Link
                  key={article.id}
                  to={`/article/${article.id}`}
                  onClick={() => setIsOpen(false)}
                  className="block p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  <div className="flex items-start space-x-3">
                    {article.imageUrl && (
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                        {article.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                        {article.description}
                      </p>
                      {article.category && (
                        <div className="flex items-center mt-2">
                          <div 
                            className="w-2 h-2 rounded-full mr-2"
                            style={{ backgroundColor: article.category.color }}
                          />
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {article.category.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
              {searchResults.total > 5 && (
                <button
                  onClick={() => handleSearch(query)}
                  className="w-full p-3 text-center text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
                >
                  Lihat semua {searchResults.total} hasil
                </button>
              )}
            </div>
          )}

          {!isLoading && searchResults && searchResults.articles.length === 0 && (
            <div className="p-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tidak ada artikel yang ditemukan untuk "{query}"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}