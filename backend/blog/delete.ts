import { api, APIError } from "encore.dev/api";
import { blogDB } from "./db";

interface DeleteArticleParams {
  id: number;
}

// Deletes an article.
export const deleteArticle = api<DeleteArticleParams, void>(
  { expose: true, method: "DELETE", path: "/articles/:id" },
  async (params) => {
    const result = await blogDB.rawQueryRow<{ count: string }>(
      "DELETE FROM articles WHERE id = $1 RETURNING 1 as count",
      params.id
    );

    if (!result) {
      throw APIError.notFound("article not found");
    }
  }
);
