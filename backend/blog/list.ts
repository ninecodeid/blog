import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { blogDB } from "./db";
import type { Article, ListArticlesResponse } from "./types";

interface ListArticlesParams {
  categoryId?: Query<number>;
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
      ORDER BY a.created_at DESC 
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
