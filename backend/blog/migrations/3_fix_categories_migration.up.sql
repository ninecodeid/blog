-- First, check if the category column still exists and handle the migration properly
DO $$
BEGIN
    -- Check if category column exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'articles' AND column_name = 'category') THEN
        -- Update articles table to reference categories
        ALTER TABLE articles DROP CONSTRAINT IF EXISTS articles_category_check;
        
        -- Add category_id column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'articles' AND column_name = 'category_id') THEN
            ALTER TABLE articles ADD COLUMN category_id BIGINT REFERENCES categories(id);
        END IF;

        -- Migrate existing data
        UPDATE articles SET category_id = (
            SELECT id FROM categories WHERE name = articles.category
        ) WHERE category_id IS NULL;

        -- Make category_id required and drop old category column
        ALTER TABLE articles ALTER COLUMN category_id SET NOT NULL;
        ALTER TABLE articles DROP COLUMN category;
    END IF;
    
    -- Ensure index exists
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_articles_category_id') THEN
        CREATE INDEX idx_articles_category_id ON articles(category_id);
    END IF;
END $$;
