export interface Category {
  id: number;
  name: string;
  description?: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  color?: string;
}

export interface Article {
  id: number;
  title: string;
  description: string;
  content: string;
  imageUrl?: string;
  link?: string;
  downloadLink?: string;
  categoryId: number;
  category?: Category;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateArticleRequest {
  title: string;
  description: string;
  content: string;
  imageUrl?: string;
  link?: string;
  downloadLink?: string;
  categoryId: number;
  published?: boolean;
}

export interface UpdateArticleRequest {
  title?: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  link?: string;
  downloadLink?: string;
  categoryId?: number;
  published?: boolean;
}

export interface ListArticlesParams {
  categoryId?: number;
  published?: boolean;
  limit?: number;
  offset?: number;
}

export interface ListArticlesResponse {
  articles: Article[];
  total: number;
}

export interface ListCategoriesResponse {
  categories: Category[];
  total: number;
}
