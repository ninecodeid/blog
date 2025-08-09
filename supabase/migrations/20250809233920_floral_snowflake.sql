/*
  # Add Analytics Support

  1. New Tables
    - `article_views`
      - `article_id` (bigint, foreign key to articles)
      - `views` (bigint, view count)
      - `updated_at` (timestamp, last updated)

  2. Indexes
    - Index on article_id for fast lookups
    - Index on views for popular articles queries

  3. Constraints
    - Foreign key constraint to articles table
    - Unique constraint on article_id
*/

CREATE TABLE IF NOT EXISTS article_views (
  article_id BIGINT PRIMARY KEY REFERENCES articles(id) ON DELETE CASCADE,
  views BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_article_views_views ON article_views(views DESC);
CREATE INDEX IF NOT EXISTS idx_article_views_updated_at ON article_views(updated_at DESC);