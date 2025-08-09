import { api } from "encore.dev/api";
import { blogDB } from "./db";
import type { Article, CreateArticleRequest } from "./types";

// Creates a new article.
export const create = api<CreateArticleRequest, Article>(
  { expose: true, method: "POST", path: "/articles" },
  async (req) => {
    const article = await blogDB.rawQueryRow<Article>(
      `INSERT INTO articles 
        (title, description, content, image_url, link, download_link, category_id, published, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      RETURNING 
        id, title, description, content, image_url as "imageUrl", 
        link, download_link as "downloadLink", category_id as "categoryId", published, 
        created_at as "createdAt", updated_at as "updatedAt"`,
      req.title,
      req.description,
      req.content,
      req.imageUrl || null,
      req.link || null,
      req.downloadLink || null,
      req.categoryId,
      req.published || false
    );

    return article!;
  }
);
