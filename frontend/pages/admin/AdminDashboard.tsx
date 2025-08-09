import { useQuery } from "@tanstack/react-query";
import { FileText, Eye, Calendar, Tag, TrendingUp, BarChart3 } from "lucide-react";
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
      bgColor: "bg-blue-50 dark:bg-blue-900/30"
    },
    {
      title: "Published",
      value: publishedArticles?.total || 0,
      icon: Eye,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/30"
    },
    {
      title: "Drafts",
      value: (allArticles?.total || 0) - (publishedArticles?.total || 0),
      icon: Calendar,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/30"
    },
    {
      title: "Categories",
      value: categoriesData?.total || 0,
      icon: Tag,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/30"
    },
  ];

  if (allLoading || publishedLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-300 mt-6 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 lg:mb-12">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-base lg:text-lg">
              Welcome back to EndieTech Admin
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-12">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="group bg-white dark:bg-gray-800 p-4 lg:p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600"
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
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 lg:p-4 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 lg:h-6 lg:w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* Recent Articles */}
        <div className="bg-white dark:bg-gray-800 p-6 lg:p-8 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
              Recent Articles
            </h3>
          </div>
          <div className="space-y-4">
            {allArticles?.articles && allArticles.articles.length > 0 ? (
              allArticles.articles.slice(0, 5).map((article, index) => (
                <div
                  key={article.id}
                  className="group flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
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
                  <div className="ml-4 flex-shrink-0">
                    {article.published ? (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full font-medium">
                        Published
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs rounded-full font-medium">
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
        <div className="bg-white dark:bg-gray-800 p-6 lg:p-8 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Tag className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
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
                    className="group flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'fadeInRight 0.6s ease-out forwards'
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-4 h-4 lg:w-6 lg:h-6 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <div className="min-w-0">
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
                    <div className="flex items-center space-x-2 flex-shrink-0">
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
