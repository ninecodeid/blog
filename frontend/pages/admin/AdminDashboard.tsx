import { useQuery } from "@tanstack/react-query";
import { FileText, Eye, Calendar, Tag, TrendingUp, Users, BarChart3 } from "lucide-react";
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
      title: "Total Articles",
      value: allArticles?.total || 0,
      icon: FileText,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/30",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "Published",
      value: publishedArticles?.total || 0,
      icon: Eye,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/30",
      gradient: "from-green-500 to-green-600"
    },
    {
      title: "Drafts",
      value: (allArticles?.total || 0) - (publishedArticles?.total || 0),
      icon: Calendar,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/30",
      gradient: "from-yellow-500 to-yellow-600"
    },
    {
      title: "Categories",
      value: categoriesData?.total || 0,
      icon: Tag,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/30",
      gradient: "from-purple-500 to-purple-600"
    },
  ];

  if (allLoading || publishedLoading) {
    return (
      <div className="p-8">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-300 mt-6 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Welcome back to EndieTech Admin
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="group bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 dark:hover:border-blue-600"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-2">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white group-hover:scale-105 transition-transform duration-200">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-4 rounded-2xl ${stat.bgColor} group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <div className={`mt-4 h-1 bg-gradient-to-r ${stat.gradient} rounded-full opacity-20 group-hover:opacity-100 transition-opacity duration-300`}></div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Recent Articles */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Recent Articles
            </h3>
          </div>
          <div className="space-y-4">
            {allArticles?.articles && allArticles.articles.length > 0 ? (
              allArticles.articles.slice(0, 5).map((article, index) => (
                <div
                  key={article.id}
                  className="group flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInLeft 0.6s ease-out forwards'
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 dark:text-white font-medium truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                      {article.title}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {new Date(article.createdAt).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <div className="ml-4">
                    {article.published ? (
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full font-medium">
                        Published
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs rounded-full font-medium">
                        Draft
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No articles yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Categories Overview */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Tag className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Categories
            </h3>
          </div>
          <div className="space-y-4">
            {categoriesData?.categories && categoriesData.categories.length > 0 ? (
              categoriesData.categories.map((category, index) => {
                const count = allArticles?.articles?.filter(
                  (article) => article.categoryId === category.id
                ).length || 0;
                
                return (
                  <div
                    key={category.id}
                    className="group flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all duration-200 hover:scale-[1.02]"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'fadeInRight 0.6s ease-out forwards'
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-6 h-6 rounded-full shadow-lg"
                        style={{ backgroundColor: category.color }}
                      />
                      <div>
                        <span className="text-gray-900 dark:text-white font-medium group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200">
                          {category.name}
                        </span>
                        {category.description && (
                          <p className="text-gray-500 dark:text-gray-400 text-sm truncate max-w-48">
                            {category.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                        {count}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        articles
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <Tag className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No categories yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
