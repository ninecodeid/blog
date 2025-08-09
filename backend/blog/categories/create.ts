import { api } from "encore.dev/api";
import { blogDB } from "../db";
import type { Category, CreateCategoryRequest } from "../types";

// Creates a new category.
export const createCategory = api<CreateCategoryRequest, Category>(
  { expose: true, method: "POST", path: "/categories" },
  async (req) => {
    const category = await blogDB.rawQueryRow<Category>(
      `INSERT INTO categories 
        (name, description, color, updated_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING 
        id, name, description, color,
        created_at as "createdAt", updated_at as "updatedAt"`,
      req.name,
      req.description || null,
      req.color || '#3B82F6'
    );

    return category!;
  }
);
