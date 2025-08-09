import { api } from "encore.dev/api";
import { blogDB } from "./db";

interface ArticleViewParams {
  id: number;
}

interface ArticleAnalytics {
  id: number;
  title: string;
  views: number;
  createdAt: Date;
  category?: {
    id: number;
    name: string;
    color: string;
  };
}

interface AnalyticsResponse {
  totalViews: number;
  totalArticles: number;
  popularArticles: ArticleAnalytics[];
}

// Track article view.
export const trackView = api<ArticleViewParams, void>(
  { expose: true, method: "POST", path: "/articles/:id/view" },
  async (params) => {
    // Insert or update view count
    await blogDB.rawQueryRow(
      `INSERT INTO article_views (article_id, views, updated_at) 
       VALUES ($1, 1, NOW())
       ON CONFLICT (article_id) 
       DO UPDATE SET views = article_views.views + 1, updated_at = NOW()`,
      params.id
    );
  }
);

// Get analytics data.
export const getAnalytics = api<void, AnalyticsResponse>(
  { expose: true, method: "GET", path: "/analytics" },
  async () => {
    // Get total views
    const totalViewsResult = await blogDB.rawQueryRow<{ total: string }>(
      "SELECT COALESCE(SUM(views), 0) as total FROM article_views"
    );
    const totalViews = parseInt(totalViewsResult?.total || "0");

    // Get total articles
    const totalArticlesResult = await blogDB.rawQueryRow<{ total: string }>(
      "SELECT COUNT(*) as total FROM articles WHERE published = true"
    );
    const totalArticles = parseInt(totalArticlesResult?.total || "0");

    // Get popular articles
    const popularArticlesQuery = `
      SELECT 
        a.id, a.title, a.created_at as "createdAt",
        COALESCE(av.views, 0) as views,
        c.id as "category.id", c.name as "category.name", c.color as "category.color"
      FROM articles a
      LEFT JOIN article_views av ON a.id = av.article_id
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.published = true
      ORDER BY COALESCE(av.views, 0) DESC, a.created_at DESC
      LIMIT 10
    `;

    const rawPopularArticles = await blogDB.rawQueryAll<any>(popularArticlesQuery);

    const popularArticles: ArticleAnalytics[] = rawPopularArticles.map(article => ({
      id: article.id,
      title: article.title,
      views: parseInt(article.views || "0"),
      createdAt: article.createdAt,
      category: article['category.id'] ? {
        id: article['category.id'],
        name: article['category.name'],
        color: article['category.color'],
      } : undefined,
    }));

    return {
      totalViews,
      totalArticles,
      popularArticles,
    };
  }
);