import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { blogDB } from "./db";
import type { Article, ListArticlesResponse } from "./types";

interface SearchArticlesParams {
  q?: Query<string>;
  categoryId?: Query<number>;
  published?: Query<boolean>;
  limit?: Query<number>;
  offset?: Query<number>;
}

// Search articles with full-text search capability.
export const searchArticles = api<SearchArticlesParams, ListArticlesResponse>(
  { expose: true, method: "GET", path: "/articles/search" },
  async (params) => {
    const limit = params.limit || 10;
    const offset = params.offset || 0;
    const searchQuery = params.q?.trim();
    
    let whereClause = "WHERE 1=1";
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (params.categoryId) {
      whereClause += ` AND a.category_id = $${paramIndex}`;
      queryParams.push(params.categoryId);
      paramIndex++;
    }

    if (params.published !== undefined) {
      whereClause += ` AND a.published = $${paramIndex}`;
      queryParams.push(params.published);
      paramIndex++;
    }

    // Add full-text search if query is provided
    if (searchQuery) {
      whereClause += ` AND (
        LOWER(a.title) LIKE LOWER($${paramIndex}) OR 
        LOWER(a.description) LIKE LOWER($${paramIndex + 1}) OR 
        LOWER(a.content) LIKE LOWER($${paramIndex + 2})
      )`;
      const searchPattern = `%${searchQuery}%`;
      queryParams.push(searchPattern, searchPattern, searchPattern);
      paramIndex += 3;
    }

    const countQuery = `SELECT COUNT(*) as total FROM articles a ${whereClause}`;
    const countResult = await blogDB.rawQueryRow<{ total: string }>(countQuery, ...queryParams);
    const total = parseInt(countResult?.total || "0");

    const articlesQuery = `
      SELECT 
        a.id, a.title, a.description, a.content, a.image_url as "imageUrl", 
        a.link, a.download_link as "downloadLink", a.category_id as "categoryId", a.published, 
        a.created_at as "createdAt", a.updated_at as "updatedAt",
        c.id as "category.id", c.name as "category.name", c.description as "category.description", c.color as "category.color",
        c.created_at as "category.createdAt", c.updated_at as "category.updatedAt"
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      ${whereClause}
      ORDER BY 
        ${searchQuery ? `
          CASE 
            WHEN LOWER(a.title) LIKE LOWER($${queryParams.length - 2}) THEN 1
            WHEN LOWER(a.description) LIKE LOWER($${queryParams.length - 1}) THEN 2
            ELSE 3
          END,
        ` : ''}
        a.created_at DESC 
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    
    const rawArticles = await blogDB.rawQueryAll<any>(
      articlesQuery, 
      ...queryParams, 
      limit, 
      offset
    );

    // Transform flat results to nested structure
    const articles: Article[] = rawArticles.map(article => {
      const result: Article = {
        id: article.id,
        title: article.title,
        description: article.description,
        content: article.content,
        imageUrl: article.imageUrl,
        link: article.link,
        downloadLink: article.downloadLink,
        categoryId: article.categoryId,
        published: article.published,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
      };

      if (article['category.id']) {
        result.category = {
          id: article['category.id'],
          name: article['category.name'],
          description: article['category.description'],
          color: article['category.color'],
          createdAt: article['category.createdAt'],
          updatedAt: article['category.updatedAt'],
        };
      }

      return result;
    });

    return { articles, total };
  }
);