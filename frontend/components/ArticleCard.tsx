import { Link } from "react-router-dom";
import { Calendar, ExternalLink, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Article } from "~backend/blog/types";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-blue-300 hover:-translate-y-1">
      {article.imageUrl && (
        <div className="aspect-video overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
          {article.category && (
            <Badge 
              className="text-white border-0 w-fit text-xs sm:text-sm"
              style={{ backgroundColor: article.category.color }}
            >
              {article.category.name}
            </Badge>
          )}
          <div className="flex items-center text-xs sm:text-sm text-gray-500">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span className="truncate">{formatDate(article.createdAt)}</span>
          </div>
        </div>
        
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
          <Link to={`/article/${article.id}`}>
            {article.title}
          </Link>
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3 text-sm sm:text-base leading-relaxed">
          {article.description}
        </p>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Link to={`/article/${article.id}`} className="w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-blue-200 text-blue-600 hover:bg-blue-50 w-full sm:w-auto text-sm"
            >
              Baca Selengkapnya
            </Button>
          </Link>
          
          <div className="flex space-x-2 justify-center sm:justify-end">
            {article.link && (
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                title="Link Eksternal"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            {article.downloadLink && (
              <a
                href={article.downloadLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                title="Download"
              >
                <Download className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
