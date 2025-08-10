import { Link } from "react-router-dom";
import { Calendar, ExternalLink, Download, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Article } from "~backend/blog/types";

interface ArticleCardProps {
  article: Article;
  index?: number;
}

export default function ArticleCard({ article, index = 0 }: ArticleCardProps) {
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

  return (
    <div 
      className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:-translate-y-2"
      style={{
        animationDelay: `${index * 100}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards'
      }}
    >
      {article.imageUrl && (
        <div className="aspect-video overflow-hidden relative group-hover:shadow-lg">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          {article.category && (
            <div className="absolute top-3 left-3">
              <Badge 
                className="text-white border-0 backdrop-blur-sm shadow-lg"
                style={{ backgroundColor: `${article.category.color}CC` }}
              >
                {article.category.name}
              </Badge>
            </div>
          )}
        </div>
      )}
      
      <div className="p-6">
        {!article.imageUrl && article.category && (
          <div className="flex items-center justify-between mb-4">
            <Badge 
              className="text-white border-0"
              style={{ backgroundColor: article.category.color }}
            >
              {article.category.name}
            </Badge>
          </div>
        )}
        
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
          <div className="flex items-center space-x-1">
            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Calendar className="h-3 w-3 text-blue-600 dark:text-blue-400" />
            </div>
            <span>{formatDate(article.createdAt)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Clock className="h-3 w-3 text-green-600 dark:text-green-400" />
            </div>
            <span>{estimateReadTime(article.content)} min read</span>
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 leading-tight group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
          <Link to={`/article/${article.id}`}>
            {article.title}
          </Link>
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 leading-relaxed text-sm">
          {article.description}
        </p>
        
        <div className="flex items-center justify-between">
          <Link to={`/article/${article.id}`} className="flex-1">
            <Button 
              variant="outline" 
              className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 hover:border-blue-300 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 rounded-xl font-semibold"
            >
              📖
              Read More
            </Button>
          </Link>
          
          {(article.link || article.downloadLink) && (
            <div className="flex space-x-2 ml-4">
              {article.link && (
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:scale-110"
                  title="External Link"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
              {article.downloadLink && (
                <a
                  href={article.downloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 transition-all duration-300 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/30 hover:scale-110"
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
