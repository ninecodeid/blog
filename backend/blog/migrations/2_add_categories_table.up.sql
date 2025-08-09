CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, description, color) VALUES 
  ('Hardware', 'Artikel tentang perangkat keras komputer', '#3B82F6'),
  ('Software', 'Artikel tentang perangkat lunak dan aplikasi', '#8B5CF6'),
  ('Tips', 'Tips dan trik seputar teknologi komputer', '#10B981');

-- Update articles table to reference categories
ALTER TABLE articles DROP CONSTRAINT articles_category_check;
ALTER TABLE articles ADD COLUMN category_id BIGINT REFERENCES categories(id);

-- Migrate existing data
UPDATE articles SET category_id = (
  SELECT id FROM categories WHERE name = articles.category
);

-- Make category_id required and drop old category column
ALTER TABLE articles ALTER COLUMN category_id SET NOT NULL;
ALTER TABLE articles DROP COLUMN category;

CREATE INDEX idx_articles_category_id ON articles(category_id);
