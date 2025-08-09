import { useQuery } from "@tanstack/react-query";
import { FileText, Eye, Calendar, TrendingUp } from "lucide-react";
import backend from "~backend/client";

export default function AdminDashboard() {
  const { data: allArticles } = useQuery({
    queryKey: ["admin-articles-stats"],
    queryFn: () => backend.blog.list({ limit: 1000 }),
  });

  const { data: publishedArticles } = useQuery({
    queryKey: ["admin-published-stats"],
    queryFn: () => backend.blog.list({ published: true, limit: 1000 }),
  });

  const stats = [
    {
      title: "Total Artikel",
      value: allArticles?.total || 0,
      icon: FileText,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
    },
    {
      title: "Artikel Dipublikasi",
      value: publishedArticles?.total || 0,
      icon: Eye,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/20",
    },
    {
      title: "Draft",
      value: (allArticles?.total || 0) - (publishedArticles?.total || 0),
      icon: Calendar,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
    },
    {
      title: "Artikel Bulan Ini",
      value: allArticles?.articles.filter(article => {
        const articleDate = new Date(article.createdAt);
        const now = new Date();
        return articleDate.getMonth() === now.getMonth() && 
               articleDate.getFullYear() === now.getFullYear();
      }).length || 0,
      icon: TrendingUp,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Selamat datang di panel admin TeknisPro</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-slate-900 p-6 rounded-lg border border-slate-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">
            Artikel Terbaru
          </h3>
          <div className="space-y-3">
            {allArticles?.articles.slice(0, 5).map((article) => (
              <div
                key={article.id}
                className="flex items-center justify-between p-3 bg-slate-800 rounded-lg"
              >
                <div>
                  <p className="text-white font-medium truncate">
                    {article.title}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {new Date(article.createdAt).toLocaleDateString("id-ID")}
                  </p>
                </div>
                <div className="flex items-center">
                  {article.published ? (
                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded">
                      Published
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                      Draft
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">
            Kategori Artikel
          </h3>
          <div className="space-y-3">
            {["Hardware", "Software", "Tips"].map((category) => {
              const count = allArticles?.articles.filter(
                (article) => article.category === category
              ).length || 0;
              
              return (
                <div
                  key={category}
                  className="flex items-center justify-between p-3 bg-slate-800 rounded-lg"
                >
                  <span className="text-white font-medium">{category}</span>
                  <span className="text-emerald-400 font-semibold">
                    {count} artikel
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
