import { api, APIError } from "encore.dev/api";
import { blogDB } from "../db";
import type { Category, UpdateCategoryRequest } from "../types";

interface UpdateCategoryParams {
  id: number;
}

interface UpdateCategoryBody extends UpdateCategoryRequest {}

// Updates an existing category.
export const updateCategory = api<UpdateCategoryParams & UpdateCategoryBody, Category>(
  { expose: true, method: "PUT", path: "/categories/:id" },
  async (params) => {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (params.name !== undefined) {
      updates.push(`name = $${paramIndex}`);
      values.push(params.name);
      paramIndex++;
    }

    if (params.description !== undefined) {
      updates.push(`description = $${paramIndex}`);
      values.push(params.description || null);
      paramIndex++;
    }

    if (params.color !== undefined) {
      updates.push(`color = $${paramIndex}`);
      values.push(params.color);
      paramIndex++;
    }

    if (updates.length === 0) {
      throw APIError.invalidArgument("no fields to update");
    }

    updates.push(`updated_at = NOW()`);
    values.push(params.id);

    const query = `
      UPDATE categories 
      SET ${updates.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING 
        id, name, description, color,
        created_at as "createdAt", updated_at as "updatedAt"
    `;

    const category = await blogDB.rawQueryRow<Category>(query, ...values);

    if (!category) {
      throw APIError.notFound("category not found");
    }

    return category;
  }
);
