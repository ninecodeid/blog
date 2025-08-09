import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, ExternalLink, Download, Clock, Share2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import backend from "~backend/client";

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();

  const { data: article, isLoading, error } = useQuery({
    queryKey: ["article", id],
    queryFn: async () => {
      if (!id) throw new Error("ID artikel diperlukan");
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

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  };

  const handleShare = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-gray-600 dark:text-gray-300 mt-6 text-lg">Memuat artikel...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Artikel Tidak Ditemukan</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Artikel yang Anda cari tidak ada atau telah dihapus.</p>
            {error && (
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                {error instanceof Error ? error.message : "Kesalahan tidak diketahui"}
              </p>
            )}
            <Link to="/">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/">
              <Button variant="ghost" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover:scale-105">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Beranda
              </Button>
            </Link>
            
            <Button
              variant="ghost"
              onClick={handleShare}
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover:scale-105"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Bagikan
            </Button>
          </div>

          <article className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-2xl transition-colors duration-300">
            {article.imageUrl && (
              <div className="aspect-video overflow-hidden relative">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                {article.category && (
                  <div className="absolute bottom-6 left-6">
                    <Badge 
                      className="text-white border-0 backdrop-blur-sm text-lg px-4 py-2"
                      style={{ backgroundColor: `${article.category.color}CC` }}
                    >
                      {article.category.name}
                    </Badge>
                  </div>
                )}
              </div>
            )}

            <div className="p-8 lg:p-12">
              {!article.imageUrl && article.category && (
                <div className="mb-6">
                  <Badge 
                    className="text-white border-0 shadow-lg text-lg px-4 py-2"
                    style={{ backgroundColor: article.category.color }}
                  >
                    {article.category.name}
                  </Badge>
                </div>
              )}

              {/* Article Meta */}
              <div className="flex flex-wrap items-center gap-6 text-gray-500 dark:text-gray-400 mb-8">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span className="text-lg">{formatDate(article.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span className="text-lg">{estimateReadTime(article.content)} menit baca</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span className="text-lg">Artikel</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                {article.title}
              </h1>

              {/* Description */}
              <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed font-light">
                {article.description}
              </p>

              {/* Content */}
              <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-lg sm:text-xl">
                  {article.content}
                </div>
              </div>

              {/* Links Section */}
              {(article.link || article.downloadLink) && (
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Tautan Terkait
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {article.link && (
                      <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                          <ExternalLink className="h-5 w-5 mr-3" />
                          Tautan Eksternal
                        </Button>
                      </a>
                    )}
                    {article.downloadLink && (
                      <a
                        href={article.downloadLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button 
                          className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                          <Download className="h-5 w-5 mr-3" />
                          Unduh
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </article>

          {/* Back to Home CTA */}
          <div className="text-center mt-12">
            <Link to="/">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl border-0"
              >
                Jelajahi Artikel Lainnya
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
