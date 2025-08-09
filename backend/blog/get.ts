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
        id, title, description, content, image_url as "imageUrl", 
        link, download_link as "downloadLink", category, published, 
        created_at as "createdAt", updated_at as "updatedAt"
      FROM articles WHERE id = $1`,
      params.id
    );

    if (!article) {
      throw APIError.notFound("article not found");
    }

    return article;
  }
);
