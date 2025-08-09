import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Cpu, Wrench, Lightbulb } from "lucide-react";
import backend from "~backend/client";
import ArticleCard from "../components/ArticleCard";
import CategoryFilter from "../components/CategoryFilter";
import type { ArticleCategory } from "~backend/blog/types";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | "All">("All");

  const { data, isLoading, error } = useQuery({
    queryKey: ["articles", selectedCategory],
    queryFn: async () => {
      const params = {
        published: true,
        ...(selectedCategory !== "All" && { category: selectedCategory }),
        limit: 20,
      };
      return backend.blog.list(params);
    },
  });

  const features = [
    {
      icon: Cpu,
      title: "Hardware Expert",
      description: "Solusi lengkap untuk masalah hardware komputer Anda",
    },
    {
      icon: Wrench,
      title: "Software Solutions",
      description: "Panduan instalasi dan troubleshooting software terpercaya",
    },
    {
      icon: Lightbulb,
      title: "Tips & Tricks",
      description: "Tips praktis untuk optimasi dan maintenance komputer",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Solusi Komputer{" "}
            <span className="text-emerald-400">Terpercaya</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Dapatkan panduan lengkap, tips praktis, dan solusi terbaik untuk semua kebutuhan teknologi komputer Anda. 
            Dari hardware hingga software, kami siap membantu.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 hover:border-emerald-500/50 transition-all duration-300"
                >
                  <Icon className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Artikel Terbaru
          </h2>
          
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
              <p className="text-gray-300 mt-4">Memuat artikel...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-400">Gagal memuat artikel. Silakan coba lagi.</p>
            </div>
          )}

          {data && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}

          {data && data.articles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-300">
                Tidak ada artikel untuk kategori {selectedCategory === "All" ? "ini" : selectedCategory}.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
