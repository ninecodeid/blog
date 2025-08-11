import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, Sparkles, TrendingUp, Clock, Users, Globe, ChevronRight, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ArticleCard from "../components/ArticleCard";
import CategoryFilter from "../components/CategoryFilter";
import backend from "~backend/client";
import type { Article, Category } from "~backend/blog/types";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<number | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 12;

  const { data: articlesData, isLoading: articlesLoading, error: articlesError } = useQuery({
    queryKey: ["articles", selectedCategory, currentPage],
    queryFn: async () => {
      try {
        const params: any = {
          published: true,
          limit: articlesPerPage,
          offset: (currentPage - 1) * articlesPerPage,
        };
        
        if (selectedCategory !== "All") {
          params.categoryId = selectedCategory;
        }
        
        return await backend.blog.list(params);
      } catch (err) {
        console.error("Failed to fetch articles:", err);
        throw err;
      }
    },
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        return await backend.blog.listCategories();
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        throw err;
      }
    },
  });

  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ["search", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return null;
      try {
        return await backend.blog.list({
          published: true,
          limit: 50,
        });
      } catch (err) {
        console.error("Search error:", err);
        return null;
      }
    },
    enabled: searchQuery.length > 2,
  });

  // Filter articles based on search query
  const filteredArticles = searchQuery.length > 2 && searchResults 
    ? searchResults.articles.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : articlesData?.articles || [];

  const totalPages = Math.ceil((articlesData?.total || 0) / articlesPerPage);

  const handleCategoryChange = (categoryId: number | "All") => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
    setSearchQuery("");
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const stats = [
    {
      icon: Globe,
      label: "Artikel Teknologi",
      value: articlesData?.total || 0,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/30"
    },
    {
      icon: Users,
      label: "Kategori",
      value: categoriesData?.categories?.length || 0,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/30"
    },
    {
      icon: TrendingUp,
      label: "Update Rutin",
      value: "24/7",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/30"
    },
    {
      icon: Star,
      label: "Rating",
      value: "5.0",
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/30"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10 transition-colors duration-300 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-200 to-purple-200 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-gradient-to-br from-green-200 to-teal-200 dark:from-green-900/20 dark:to-teal-900/20 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/10 dark:to-purple-900/10 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-16 relative z-10">
        {/* Hero Section */}
        <section className="text-center mb-16 lg:mb-24">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 px-6 py-3 rounded-full mb-8 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-700 dark:text-blue-300 font-semibold">Teknologi Terdepan</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient-x">
                EndieTech
              </span>
              <br />
              <span className="text-gray-900 dark:text-white text-3xl sm:text-4xl lg:text-5xl">
                Technology Solutions
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
              Jelajahi dunia teknologi dengan artikel-artikel terbaru tentang hardware, software, dan tips teknologi terkini
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors duration-200" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-16 pr-6 py-6 text-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 placeholder:text-gray-400"
                  placeholder="Cari artikel teknologi..."
                />
                {searchLoading && (
                  <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 group"
              >
                <Zap className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Mulai Eksplorasi
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
              >
                <Clock className="w-5 h-5 mr-2" />
                Artikel Terbaru
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-16 lg:mb-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 lg:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600 hover:-translate-y-2"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  <div className={`p-4 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300 mb-4`}>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-2">
                      {stat.label}
                    </p>
                    <p className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white group-hover:scale-105 transition-transform duration-300">
                      {stat.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Category Filter */}
        <section className="mb-12">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 lg:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Filter className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Filter Kategori
              </h2>
            </div>
            {categoriesData?.categories && (
              <CategoryFilter
                categories={categoriesData.categories}
                selectedCategoryId={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
            )}
          </div>
        </section>

        {/* Articles Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  {searchQuery ? `Hasil Pencarian: "${searchQuery}"` : 
                   selectedCategory === "All" ? "Semua Artikel" : 
                   categoriesData?.categories?.find(c => c.id === selectedCategory)?.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {searchQuery ? `${filteredArticles.length} artikel ditemukan` :
                   `${articlesData?.total || 0} artikel tersedia`}
                </p>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {(articlesLoading || searchLoading) && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
              <p className="text-gray-600 dark:text-gray-300 mt-6 text-lg">
                {searchQuery ? "Mencari artikel..." : "Memuat artikel..."}
              </p>
            </div>
          )}

          {/* Error State */}
          {articlesError && !searchQuery && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Gagal Memuat Artikel</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Terjadi kesalahan saat memuat artikel. Silakan coba lagi.</p>
              <Button 
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Muat Ulang
              </Button>
            </div>
          )}

          {/* Articles Grid */}
          {!articlesLoading && !searchLoading && filteredArticles.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
                {filteredArticles.map((article, index) => (
                  <ArticleCard key={article.id} article={article} index={index} />
                ))}
              </div>

              {/* Pagination */}
              {!searchQuery && totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl"
                  >
                    Sebelumnya
                  </Button>
                  
                  <div className="flex items-center space-x-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-xl ${
                            currentPage === page
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0"
                              : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-400"
                          }`}
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl"
                  >
                    Selanjutnya
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!articlesLoading && !searchLoading && filteredArticles.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {searchQuery ? "Tidak Ada Hasil" : "Belum Ada Artikel"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {searchQuery 
                  ? `Tidak ditemukan artikel yang cocok dengan "${searchQuery}"`
                  : "Belum ada artikel yang dipublikasikan."
                }
              </p>
              {searchQuery && (
                <Button 
                  onClick={() => setSearchQuery("")}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                >
                  Lihat Semua Artikel
                </Button>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}