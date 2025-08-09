import { api, APIError } from "encore.dev/api";
import { blogDB } from "./db";
import type { Article } from "./types";

interface GetArticleParams {
  id: number;
}

// Retrieves a single article by ID.
export const get = api<GetArticleParams, Article>(
  { expose: true, method: "GET", path: "/articles/:id" },
  async (params) => {
    const article = await blogDB.rawQueryRow<Article>(
      `SELECT 
        a.id, a.title, a.description, a.content, a.image_url as "imageUrl", 
        a.link, a.download_link as "downloadLink", a.category_id as "categoryId", a.published, 
        a.created_at as "createdAt", a.updated_at as "updatedAt",
        c.id as "category.id", c.name as "category.name", c.description as "category.description", c.color as "category.color",
        c.created_at as "category.createdAt", c.updated_at as "category.updatedAt"
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.id = $1`,
      params.id
    );

    if (!article) {
      throw APIError.notFound("article not found");
    }

    // Transform flat result to nested structure
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
  }
);
