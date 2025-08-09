export type ArticleCategory = "Hardware" | "Software" | "Tips";

export interface Article {
  id: number;
  title: string;
  description: string;
  content: string;
  imageUrl?: string;
  link?: string;
  downloadLink?: string;
  category: ArticleCategory;
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
  category: ArticleCategory;
  published?: boolean;
}

export interface UpdateArticleRequest {
  title?: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  link?: string;
  downloadLink?: string;
  category?: ArticleCategory;
  published?: boolean;
}

export interface ListArticlesParams {
  category?: ArticleCategory;
  published?: boolean;
  limit?: number;
  offset?: number;
}

export interface ListArticlesResponse {
  articles: Article[];
  total: number;
}
