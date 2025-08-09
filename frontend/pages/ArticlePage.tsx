import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, ExternalLink, Download, User } from "lucide-react";
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Memuat artikel...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-600">Artikel tidak ditemukan.</p>
          {error && (
            <p className="text-gray-500 text-sm mt-2">
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
          )}
          <Link to="/">
            <Button variant="outline" className="mt-4 border-blue-200 text-blue-600">
              Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link to="/">
            <Button variant="ghost" className="mb-6 text-gray-600 hover:text-blue-600">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Beranda
            </Button>
          </Link>

          <article className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            {article.imageUrl && (
              <div className="aspect-video overflow-hidden">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                {article.category && (
                  <Badge 
                    className="text-white border-0 w-fit"
                    style={{ backgroundColor: article.category.color }}
                  >
                    {article.category.name}
                  </Badge>
                )}
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(article.createdAt)}
                </div>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {article.title}
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {article.description}
              </p>

              <div className="prose prose-lg max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {article.content}
                </div>
              </div>

              {(article.link || article.downloadLink) && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Link Terkait
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {article.link && (
                      <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
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
                        <Button variant="outline" className="border-green-200 text-green-600 hover:bg-green-50">
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
    </div>
  );
}
