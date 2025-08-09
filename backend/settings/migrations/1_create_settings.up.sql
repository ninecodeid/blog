CREATE TABLE settings (
  id BIGSERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (key, value, description, type) VALUES 
  ('site_title', 'EndieTech', 'Website title', 'text'),
  ('site_description', 'Technology Solutions for Modern World', 'Website description', 'text'),
  ('contact_email', 'admin@endietech.com', 'Contact email address', 'email'),
  ('posts_per_page', '12', 'Number of posts per page', 'number'),
  ('enable_comments', 'true', 'Enable comments on articles', 'boolean'),
  ('maintenance_mode', 'false', 'Enable maintenance mode', 'boolean'),
  ('analytics_code', '', 'Google Analytics tracking code', 'textarea'),
  ('social_facebook', '', 'Facebook page URL', 'url'),
  ('social_twitter', '', 'Twitter profile URL', 'url'),
  ('social_instagram', '', 'Instagram profile URL', 'url'),
  ('theme_primary_color', '#2563eb', 'Primary theme color', 'color'),
  ('theme_secondary_color', '#64748b', 'Secondary theme color', 'color');
