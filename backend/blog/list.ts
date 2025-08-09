import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { blogDB } from "./db";
import type { Article, ArticleCategory, ListArticlesResponse } from "./types";

interface ListArticlesParams {
  category?: Query<ArticleCategory>;
  published?: Query<boolean>;
  limit?: Query<number>;
  offset?: Query<number>;
}

// Retrieves all articles with optional filtering and pagination.
export const list = api<ListArticlesParams, ListArticlesResponse>(
  { expose: true, method: "GET", path: "/articles" },
  async (params) => {
    const limit = params.limit || 10;
    const offset = params.offset || 0;
    
    let whereClause = "WHERE 1=1";
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (params.category) {
      whereClause += ` AND category = $${paramIndex}`;
      queryParams.push(params.category);
      paramIndex++;
    }

    if (params.published !== undefined) {
      whereClause += ` AND published = $${paramIndex}`;
      queryParams.push(params.published);
      paramIndex++;
    }

    const countQuery = `SELECT COUNT(*) as total FROM articles ${whereClause}`;
    const countResult = await blogDB.rawQueryRow<{ total: string }>(countQuery, ...queryParams);
    const total = parseInt(countResult?.total || "0");

    const articlesQuery = `
      SELECT 
        id, title, description, content, image_url as "imageUrl", 
        link, download_link as "downloadLink", category, published, 
        created_at as "createdAt", updated_at as "updatedAt"
      FROM articles 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    
    const articles = await blogDB.rawQueryAll<Article>(
      articlesQuery, 
      ...queryParams, 
      limit, 
      offset
    );

    return { articles, total };
  }
);
