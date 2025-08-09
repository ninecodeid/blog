import { api } from "encore.dev/api";
import { blogDB } from "../db";
import type { Category, ListCategoriesResponse } from "../types";

// Retrieves all categories.
export const listCategories = api<void, ListCategoriesResponse>(
  { expose: true, method: "GET", path: "/categories" },
  async () => {
    const categories = await blogDB.rawQueryAll<Category>(
      `SELECT 
        id, name, description, color,
        created_at as "createdAt", updated_at as "updatedAt"
      FROM categories 
      ORDER BY name ASC`
    );

    return { categories, total: categories.length };
  }
);
