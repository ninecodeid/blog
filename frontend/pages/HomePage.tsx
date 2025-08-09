import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Settings, TrendingUp, Clock, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import backend from "~backend/client";
import ArticleCard from "../components/ArticleCard";
import CategoryFilter from "../components/CategoryFilter";

export default function HomePage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "All">("All");

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

  const { data: latestArticles } = useQuery({
    queryKey: ["latest-articles"],
    queryFn: async () => {
      try {
        return await backend.blog.list({ published: true, limit: 6 });
      } catch (err) {
        console.error("Failed to fetch latest articles:", err);
        throw err;
      }
    },
  });

  const { data: recommendedArticles } = useQuery({
    queryKey: ["recommended-articles"],
    queryFn: async () => {
      try {
        const allArticles = await backend.blog.list({ published: true, limit: 100 });
        // Shuffle articles for random recommendations
        const shuffled = [...(allArticles.articles || [])].sort(() => 0.5 - Math.random());
        return { articles: shuffled.slice(0, 6), total: shuffled.length };
      } catch (err) {
        console.error("Failed to fetch recommended articles:", err);
        throw err;
      }
    },
  });

  const categories = categoriesData?.categories || [];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Solusi Komputer{" "}
            <span className="text-blue-600">Terpercaya</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Dapatkan panduan lengkap, tips praktis, dan solusi terbaik untuk semua kebutuhan teknologi komputer Anda. 
            Dari hardware hingga software, kami siap membantu.
          </p>
          
          {/* Admin Access Button */}
          <div className="mb-12">
            <Link to="/admin">
              <Button 
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              >
                <Settings className="h-5 w-5 mr-2" />
                Akses Admin Panel
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Articles by Category */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Artikel Terbaru
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Temukan artikel terbaru sesuai kategori yang Anda minati
            </p>
          </div>

          {categories.map((category) => (
            <div key={category.id} className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <h3 className="text-2xl font-bold text-gray-900">{category.name}</h3>
                </div>
                <Link to={`/?category=${category.id}`}>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-600 hover:border-blue-300">
                    Lihat Semua
                  </Button>
                </Link>
              </div>

              <CategoryArticles categoryId={category.id} />
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Articles */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Rekomendasi Terbaru
              </h2>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Artikel pilihan yang mungkin menarik untuk Anda
            </p>
          </div>

          {recommendedArticles && recommendedArticles.articles && recommendedArticles.articles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedArticles.articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Random Recommendations */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Shuffle className="h-8 w-8 text-purple-600" />
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Rekomendasi Random
              </h2>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Jelajahi artikel menarik lainnya secara acak
            </p>
          </div>

          <RandomArticles />
        </div>
      </section>

      {/* All Articles Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Semua Artikel
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Jelajahi semua artikel berdasarkan kategori
            </p>
          </div>
          
          <CategoryFilter
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onCategoryChange={setSelectedCategoryId}
          />

          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-4">Memuat artikel...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-600">Gagal memuat artikel. Silakan coba lagi.</p>
              <p className="text-gray-500 text-sm mt-2">
                {error instanceof Error ? error.message : "Unknown error"}
              </p>
            </div>
          )}

          {articlesData && articlesData.articles && articlesData.articles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articlesData.articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}

          {articlesData && articlesData.articles && articlesData.articles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">
                Tidak ada artikel untuk kategori yang dipilih.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// Component for category-specific articles
function CategoryArticles({ categoryId }: { categoryId: number }) {
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
      <div className="text-center py-8">
        <p className="text-gray-500">Belum ada artikel untuk kategori ini.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}

// Component for random articles
function RandomArticles() {
  const { data } = useQuery({
    queryKey: ["random-articles", Math.random()], // Add random to force refresh
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
    refetchInterval: 30000, // Refresh every 30 seconds for new random articles
  });

  if (!data || !data.articles || data.articles.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Belum ada artikel.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
