import { api, APIError } from "encore.dev/api";
import { blogDB } from "./db";
import type { Article, UpdateArticleRequest } from "./types";

interface UpdateArticleParams {
  id: number;
}

interface UpdateArticleBody extends UpdateArticleRequest {}

// Updates an existing article.
export const update = api<UpdateArticleParams & UpdateArticleBody, Article>(
  { expose: true, method: "PUT", path: "/articles/:id" },
  async (params) => {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (params.title !== undefined) {
      updates.push(`title = $${paramIndex}`);
      values.push(params.title);
      paramIndex++;
    }

    if (params.description !== undefined) {
      updates.push(`description = $${paramIndex}`);
      values.push(params.description);
      paramIndex++;
    }

    if (params.content !== undefined) {
      updates.push(`content = $${paramIndex}`);
      values.push(params.content);
      paramIndex++;
    }

    if (params.imageUrl !== undefined) {
      updates.push(`image_url = $${paramIndex}`);
      values.push(params.imageUrl || null);
      paramIndex++;
    }

    if (params.link !== undefined) {
      updates.push(`link = $${paramIndex}`);
      values.push(params.link || null);
      paramIndex++;
    }

    if (params.downloadLink !== undefined) {
      updates.push(`download_link = $${paramIndex}`);
      values.push(params.downloadLink || null);
      paramIndex++;
    }

    if (params.category !== undefined) {
      updates.push(`category = $${paramIndex}`);
      values.push(params.category);
      paramIndex++;
    }

    if (params.published !== undefined) {
      updates.push(`published = $${paramIndex}`);
      values.push(params.published);
      paramIndex++;
    }

    if (updates.length === 0) {
      throw APIError.invalidArgument("no fields to update");
    }

    updates.push(`updated_at = NOW()`);
    values.push(params.id);

    const query = `
      UPDATE articles 
      SET ${updates.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING 
        id, title, description, content, image_url as "imageUrl", 
        link, download_link as "downloadLink", category, published, 
        created_at as "createdAt", updated_at as "updatedAt"
    `;

    const article = await blogDB.rawQueryRow<Article>(query, ...values);

    if (!article) {
      throw APIError.notFound("article not found");
    }

    return article;
  }
);
