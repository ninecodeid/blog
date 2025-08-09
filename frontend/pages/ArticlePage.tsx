import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, ExternalLink, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import backend from "~backend/client";

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();

  const { data: article, isLoading, error } = useQuery({
    queryKey: ["article", id],
    queryFn: async () => {
      if (!id) throw new Error("Article ID is required");
      try {
        return await backend.blog.get({ id: parseInt(id) });
      } catch (err) {
        console.error("Failed to fetch article:", err);
        throw err;
      }
    },
    enabled: !!id,
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Hardware":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Software":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "Tips":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
          <p className="text-gray-300 mt-4">Memuat artikel...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-400">Artikel tidak ditemukan.</p>
          {error && (
            <p className="text-gray-400 text-sm mt-2">
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
          )}
          <Link to="/">
            <Button variant="outline" className="mt-4 border-emerald-500/50 text-emerald-400">
              Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/">
          <Button variant="ghost" className="mb-6 text-gray-300 hover:text-emerald-400">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Beranda
          </Button>
        </Link>

        <article className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
          {article.imageUrl && (
            <div className="aspect-video overflow-hidden">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <Badge className={getCategoryColor(article.category)}>
                {article.category}
              </Badge>
              <div className="flex items-center text-sm text-gray-400">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(article.createdAt)}
              </div>
            </div>

            <h1 className="text-4xl font-bold text-white mb-4">
              {article.title}
            </h1>

            <p className="text-xl text-gray-300 mb-8">
              {article.description}
            </p>

            <div className="prose prose-invert max-w-none">
              <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {article.content}
              </div>
            </div>

            {(article.link || article.downloadLink) && (
              <div className="mt-8 pt-8 border-t border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Link Terkait
                </h3>
                <div className="flex flex-wrap gap-4">
                  {article.link && (
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Link Eksternal
                      </Button>
                    </a>
                  )}
                  {article.downloadLink && (
                    <a
                      href={article.downloadLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
