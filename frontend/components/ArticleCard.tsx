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

  return (
    <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
      {article.imageUrl && (
        <div className="aspect-video overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <Badge className={getCategoryColor(article.category)}>
            {article.category}
          </Badge>
          <div className="flex items-center text-sm text-gray-400">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(article.createdAt)}
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2 hover:text-emerald-400 transition-colors">
          <Link to={`/article/${article.id}`}>
            {article.title}
          </Link>
        </h3>
        
        <p className="text-gray-300 mb-4 line-clamp-3">
          {article.description}
        </p>
        
        <div className="flex items-center justify-between">
          <Link to={`/article/${article.id}`}>
            <Button variant="outline" size="sm" className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10">
              Baca Selengkapnya
            </Button>
          </Link>
          
          <div className="flex space-x-2">
            {article.link && (
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-emerald-400 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            {article.downloadLink && (
              <a
                href={article.downloadLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-emerald-400 transition-colors"
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
