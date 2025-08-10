import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Shuffle, Sparkles, ArrowRight, Code, Cpu, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import backend from "~backend/client";
import ArticleCard from "../components/ArticleCard";
import CategoryFilter from "../components/CategoryFilter";

export default function HomePage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "All">("All");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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

  const { data: articlesData, isLoading, error } = useQuery({
    queryKey: ["articles", selectedCategoryId],
    queryFn: async () => {
      try {
        const params: any = {
          published: true,
          limit: 20,
        };
        
        if (selectedCategoryId !== "All") {
          params.categoryId = selectedCategoryId;
        }
        
        return await backend.blog.list(params);
      } catch (err) {
        console.error("Failed to fetch articles:", err);
        throw err;
      }
    },
  });

  const categories = categoriesData?.categories || [];

  const features = [
    {
      icon: Code,
      title: "Solusi Software",
      description: "Panduan lengkap untuk pengembangan software modern dan aplikasi terkini",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      icon: Cpu,
      title: "Wawasan Hardware",
      description: "Review dan tips tentang perangkat keras komputer terbaru",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      icon: Lightbulb,
      title: "Tips Teknologi",
      description: "Tips dan trik praktis untuk memaksimalkan teknologi Anda",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-900/20"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10 py-16 sm:py-24 lg:py-32">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-blue-300 dark:from-blue-900/30 dark:to-blue-800/20 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200 to-pink-300 dark:from-purple-900/30 dark:to-pink-900/20 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-gradient-to-br from-green-200 to-teal-300 dark:from-green-900/20 dark:to-teal-900/20 rounded-full blur-3xl opacity-40"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-200 dark:border-blue-700">
              <Sparkles className="w-4 h-4" />
              <span>🚀 Selamat Datang di Masa Depan Teknologi</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-blue-600 dark:text-blue-400">
                EndieTech
              </span>
              <br />
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 dark:from-gray-200 dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                Technology Solutions
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-4xl mx-auto leading-relaxed">
              Jelajahi dunia teknologi dengan panduan lengkap, tips praktis, dan solusi inovatif 
              untuk semua kebutuhan digital Anda. <span className="text-blue-600 dark:text-blue-400 font-semibold">Dari hardware hingga software</span>, kami siap membantu.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
                onClick={() => document.getElementById('articles')?.scrollIntoView({ behavior: 'smooth' })}
              >
                ✨
                Jelajahi Artikel
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 backdrop-blur-sm"
                onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
              >
                📂
                Lihat Kategori
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-800 dark:via-gray-900 dark:to-blue-900/10 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23000000" fill-opacity="0.1"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3Ccircle cx="27" cy="7" r="1"/%3E%3Ccircle cx="47" cy="7" r="1"/%3E%3Ccircle cx="7" cy="27" r="1"/%3E%3Ccircle cx="27" cy="27" r="1"/%3E%3Ccircle cx="47" cy="27" r="1"/%3E%3Ccircle cx="7" cy="47" r="1"/%3E%3Ccircle cx="27" cy="47" r="1"/%3E%3Ccircle cx="47" cy="47" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        </div>
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Layanan Unggulan</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-4">
              Apa yang Kami Tawarkan
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Temukan berbagai solusi teknologi dan wawasan komprehensif kami
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className={`group p-6 lg:p-8 ${feature.bgColor} rounded-2xl hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 backdrop-blur-sm`}
                  style={{
                    animationDelay: `${index * 200}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  <div className={`w-12 h-12 lg:w-16 lg:h-16 ${feature.bgColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                    <Icon className={`w-6 h-6 lg:w-8 lg:h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Articles by Category */}
      <section id="categories" className="py-16 sm:py-20 bg-gradient-to-br from-white via-purple-50/20 to-pink-50/20 dark:from-gray-900 dark:via-purple-900/10 dark:to-pink-900/10 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-gradient-to-br from-blue-200 to-teal-200 dark:from-blue-900/20 dark:to-teal-900/20 rounded-full blur-3xl opacity-50"></div>
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Tag className="w-4 h-4" />
              <span>Eksplorasi Kategori</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 dark:from-purple-400 dark:via-pink-400 dark:to-red-400 bg-clip-text text-transparent mb-4">
              Terbaru Berdasarkan Kategori
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Jelajahi artikel terbaru kami yang diorganisir berdasarkan kategori teknologi
            </p>
          </div>

          {categories.map((category, categoryIndex) => (
            <div key={category.id} className="mb-16 lg:mb-20">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-gray-600 dark:text-gray-400 hidden lg:block">
                      {category.description}
                    </p>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  className="border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 w-fit"
                  onClick={() => setSelectedCategoryId(category.id)}
                >
                  Lihat Semua
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <CategoryArticles categoryId={category.id} startIndex={categoryIndex * 3} />
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Articles */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 via-green-50/20 to-teal-50/20 dark:from-gray-800 dark:via-green-900/10 dark:to-teal-900/10 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-green-300 to-teal-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-20 w-48 h-48 bg-gradient-to-br from-blue-300 to-indigo-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 dark:from-green-400 dark:via-teal-400 dark:to-blue-400 bg-clip-text text-transparent">
                Sedang Trending
              </h2>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Artikel paling populer yang disukai pembaca kami
            </p>
          </div>

          <RecommendedArticles />
        </div>
      </section>

      {/* Random Recommendations */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-white via-orange-50/20 to-yellow-50/20 dark:from-gray-900 dark:via-orange-900/10 dark:to-yellow-900/10 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-gradient-to-br from-orange-200 to-yellow-200 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-full blur-3xl opacity-40"></div>
          <div className="absolute bottom-1/4 left-1/4 w-56 h-56 bg-gradient-to-br from-red-200 to-pink-200 dark:from-red-900/20 dark:to-pink-900/20 rounded-full blur-3xl opacity-30"></div>
        </div>
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <Shuffle className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 dark:from-orange-400 dark:via-red-400 dark:to-pink-400 bg-clip-text text-transparent">
                Temukan Lebih Banyak
              </h2>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Pilihan acak dari perpustakaan teknologi ekstensif kami
            </p>
          </div>

          <RandomArticles />
        </div>
      </section>

      {/* All Articles Section */}
      <section id="articles" className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 via-indigo-50/20 to-purple-50/20 dark:from-gray-800 dark:via-indigo-900/10 dark:to-purple-900/10 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23000000" fill-opacity="0.1" fill-rule="evenodd"%3E%3Cpath d="m0 40l40-40h-40v40zm40 0v-40h-40l40 40z"/%3E%3C/g%3E%3C/svg%3E')]"></div>
        </div>
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FileText className="w-4 h-4" />
              <span>Koleksi Lengkap</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-4">
              Semua Artikel
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Jelajahi koleksi lengkap artikel teknologi kami
            </p>
          </div>
          
          <div className="mb-12">
            <CategoryFilter
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onCategoryChange={setSelectedCategoryId}
            />
          </div>

          {isLoading && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
              <p className="text-gray-600 dark:text-gray-300 mt-6 text-lg">Memuat konten menarik...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-red-600 dark:text-red-400 text-lg mb-2">Gagal memuat artikel</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {error instanceof Error ? error.message : "Kesalahan tidak diketahui"}
              </p>
            </div>
          )}

          {articlesData && articlesData.articles && articlesData.articles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 relative">
              {articlesData.articles.map((article, index) => (
                <ArticleCard key={article.id} article={article} index={index} />
              ))}
            </div>
          )}

          {articlesData && articlesData.articles && articlesData.articles.length === 0 && (
            <div className="text-center py-20 relative">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
                Tidak ada artikel yang ditemukan untuk kategori yang dipilih.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// Component for category-specific articles
function CategoryArticles({ categoryId, startIndex = 0 }: { categoryId: number; startIndex?: number }) {
  const { data } = useQuery({
    queryKey: ["category-articles", categoryId],
    queryFn: async () => {
      try {
        return await backend.blog.list({ categoryId, published: true, limit: 3 });
      } catch (err) {
        console.error("Failed to fetch category articles:", err);
        throw err;
      }
    },
  });

  if (!data || !data.articles || data.articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Belum ada artikel tersedia untuk kategori ini.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
      {data.articles.map((article, index) => (
        <ArticleCard key={article.id} article={article} index={startIndex + index} />
      ))}
    </div>
  );
}

// Component for recommended articles
function RecommendedArticles() {
  const { data } = useQuery({
    queryKey: ["recommended-articles"],
    queryFn: async () => {
      try {
        return await backend.blog.list({ published: true, limit: 6 });
      } catch (err) {
        console.error("Failed to fetch recommended articles:", err);
        throw err;
      }
    },
  });

  if (!data || !data.articles || data.articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Belum ada artikel tersedia.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
      {data.articles.map((article, index) => (
        <ArticleCard key={article.id} article={article} index={index} />
      ))}
    </div>
  );
}

// Component for random articles
function RandomArticles() {
  const { data } = useQuery({
    queryKey: ["random-articles", Math.random()],
    queryFn: async () => {
      try {
        const allArticles = await backend.blog.list({ published: true, limit: 100 });
        const shuffled = [...(allArticles.articles || [])].sort(() => 0.5 - Math.random());
        return { articles: shuffled.slice(0, 6), total: shuffled.length };
      } catch (err) {
        console.error("Failed to fetch random articles:", err);
        throw err;
      }
    },
    refetchInterval: 30000,
  });

  if (!data || !data.articles || data.articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Belum ada artikel tersedia.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
      {data.articles.map((article, index) => (
        <ArticleCard key={article.id} article={article} index={index} />
      ))}
    </div>
  );
}
