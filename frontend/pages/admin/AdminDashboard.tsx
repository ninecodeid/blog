import { useQuery } from "@tanstack/react-query";
import { FileText, Eye, Calendar, Tag } from "lucide-react";
import backend from "~backend/client";

export default function AdminDashboard() {
  const { data: allArticles, isLoading: allLoading } = useQuery({
    queryKey: ["admin-articles-stats"],
    queryFn: async () => {
      try {
        return await backend.blog.list({ limit: 1000 });
      } catch (err) {
        console.error("Failed to fetch all articles:", err);
        throw err;
      }
    },
  });

  const { data: publishedArticles, isLoading: publishedLoading } = useQuery({
    queryKey: ["admin-published-stats"],
    queryFn: async () => {
      try {
        return await backend.blog.list({ published: true, limit: 1000 });
      } catch (err) {
        console.error("Failed to fetch published articles:", err);
        throw err;
      }
    },
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["admin-categories-stats"],
    queryFn: async () => {
      try {
        return await backend.blog.listCategories();
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        throw err;
      }
    },
  });

  const stats = [
    {
      title: "Total Artikel",
      value: allArticles?.total || 0,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Artikel Dipublikasi",
      value: publishedArticles?.total || 0,
      icon: Eye,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Draft",
      value: (allArticles?.total || 0) - (publishedArticles?.total || 0),
      icon: Calendar,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Total Kategori",
      value: categoriesData?.total || 0,
      icon: Tag,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  if (allLoading || publishedLoading) {
    return (
      <div className="p-4 lg:p-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Selamat datang di panel admin TeknisPro</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 sm:mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    {stat.title}
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-2 sm:p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Artikel Terbaru
          </h3>
          <div className="space-y-3">
            {allArticles?.articles && allArticles.articles.length > 0 ? (
              allArticles.articles.slice(0, 5).map((article) => (
                <div
                  key={article.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-medium truncate text-sm sm:text-base">
                      {article.title}
                    </p>
                    <p className="text-gray-500 text-xs sm:text-sm">
                      {new Date(article.createdAt).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <div className="flex items-center ml-4">
                    {article.published ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        Published
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                        Draft
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Belum ada artikel</p>
            )}
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Kategori Artikel
          </h3>
          <div className="space-y-3">
            {categoriesData?.categories && categoriesData.categories.length > 0 ? (
              categoriesData.categories.map((category) => {
                const count = allArticles?.articles?.filter(
                  (article) => article.categoryId === category.id
                ).length || 0;
                
                return (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-gray-900 font-medium text-sm sm:text-base">{category.name}</span>
                    </div>
                    <span className="text-blue-600 font-semibold text-sm">
                      {count} artikel
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500">Belum ada kategori</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
