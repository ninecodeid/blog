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
      title: "Software Solutions",
      description: "Panduan lengkap pengembangan software dan aplikasi modern",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Cpu,
      title: "Hardware Insights",
      description: "Review dan tips seputar perangkat keras komputer terbaru",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Lightbulb,
      title: "Tech Tips",
      description: "Tips dan trik praktis untuk memaksimalkan teknologi Anda",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20 py-20 sm:py-32">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 dark:bg-blue-400/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 dark:bg-purple-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-full blur-3xl animate-spin" style={{ animationDuration: '20s' }}></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-blue-200 dark:border-blue-700">
              <Sparkles className="w-4 h-4" />
              <span>Welcome to the Future of Technology</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient bg-300% bg-size-200">
                EndieTech
              </span>
              <br />
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-700 dark:text-gray-300">
                Solutions
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Jelajahi dunia teknologi dengan panduan lengkap, tips praktis, dan solusi inovatif 
              untuk semua kebutuhan digital Anda. Dari hardware hingga software, kami siap membantu.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group border-0"
                onClick={() => document.getElementById('articles')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore Articles
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 px-8 py-4 text-lg font-medium rounded-xl transition-all duration-300 hover:scale-105 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Browse Categories
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              What We Offer
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover our comprehensive range of technology solutions and insights
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="group p-8 bg-gray-50 dark:bg-gray-700 rounded-2xl hover:bg-white dark:hover:bg-gray-600 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500"
                  style={{
                    animationDelay: `${index * 200}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
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
      <section id="categories" className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Latest by Category
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Explore our newest articles organized by technology categories
            </p>
          </div>

          {categories.map((category, categoryIndex) => (
            <div key={category.id} className="mb-20">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-6 h-6 rounded-full shadow-lg"
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
                  className="border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover:scale-105 w-fit"
                  onClick={() => setSelectedCategoryId(category.id)}
                >
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <CategoryArticles categoryId={category.id} startIndex={categoryIndex * 3} />
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Articles */}
      <section className="py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                Trending Now
              </h2>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Most popular articles that our readers love
            </p>
          </div>

          <RecommendedArticles />
        </div>
      </section>

      {/* Random Recommendations */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Shuffle className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                Discover More
              </h2>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Random picks from our extensive technology library
            </p>
          </div>

          <RandomArticles />
        </div>
      </section>

      {/* All Articles Section */}
      <section id="articles" className="py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              All Articles
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Browse our complete collection of technology articles
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
              <p className="text-gray-600 dark:text-gray-300 mt-6 text-lg">Loading amazing content...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-red-600 dark:text-red-400 text-lg mb-2">Failed to load articles</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {error instanceof Error ? error.message : "Unknown error"}
              </p>
            </div>
          )}

          {articlesData && articlesData.articles && articlesData.articles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {articlesData.articles.map((article, index) => (
                <ArticleCard key={article.id} article={article} index={index} />
              ))}
            </div>
          )}

          {articlesData && articlesData.articles && articlesData.articles.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                No articles found for the selected category.
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
        <p className="text-gray-500 dark:text-gray-400">No articles available for this category yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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
        <p className="text-gray-500 dark:text-gray-400">No articles available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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
        <p className="text-gray-500 dark:text-gray-400">No articles available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {data.articles.map((article, index) => (
        <ArticleCard key={article.id} article={article} index={index} />
      ))}
    </div>
  );
}
