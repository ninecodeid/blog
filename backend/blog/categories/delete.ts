import { api, APIError } from "encore.dev/api";
import { blogDB } from "../db";

interface DeleteCategoryParams {
  id: number;
}

// Deletes a category.
export const deleteCategory = api<DeleteCategoryParams, void>(
  { expose: true, method: "DELETE", path: "/categories/:id" },
  async (params) => {
    // Check if category has articles
    const articleCount = await blogDB.rawQueryRow<{ count: string }>(
      "SELECT COUNT(*) as count FROM articles WHERE category_id = $1",
      params.id
    );

    if (articleCount && parseInt(articleCount.count) > 0) {
      throw APIError.failedPrecondition("cannot delete category with existing articles");
    }

    const result = await blogDB.rawQueryRow<{ count: string }>(
      "DELETE FROM categories WHERE id = $1 RETURNING 1 as count",
      params.id
    );

    if (!result) {
      throw APIError.notFound("category not found");
    }
  }
);
