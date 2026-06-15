-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_title TEXT,
  quote TEXT NOT NULL,
  background_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create instagram_posts table
CREATE TABLE IF NOT EXISTS instagram_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  caption TEXT,
  post_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert sample testimonials
INSERT INTO testimonials (client_name, client_title, quote, display_order) VALUES
  ('Nikita & Subohjeet', 'Wedding at Goa', 'I am still in shock at how beautiful our wedding looked. Walking into the venue for the first time felt like stepping into a literal fairytale. Casant Events took every disorganized idea I had and turned it into a breathtaking reality. From the stunning floral arrangements to the way the lighting changed the entire mood of the room, everything was perfection.', 1),
  ('Ahana & Himanshu', 'Wedding at Goa', 'Working with Casant Events was the best decision we made for our wedding. Their attention to detail and creative vision transformed our venue into something we could have never imagined. Every guest complimented the lighting and decor all night long.', 2),
  ('Apeksa & Salil', 'Wedding at Goa', 'The team at Casant Events is truly world-class. They managed every aspect of our event with such professionalism and grace. The production quality was outstanding and our guests are still talking about how magical the evening was.', 3)
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_posts ENABLE ROW LEVEL SECURITY;

-- Public read
DROP POLICY IF EXISTS "Public read testimonials" ON testimonials;
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public read instagram posts" ON instagram_posts;
CREATE POLICY "Public read instagram posts" ON instagram_posts FOR SELECT USING (is_active = true);

-- Authenticated full access
DROP POLICY IF EXISTS "Auth manage testimonials" ON testimonials;
CREATE POLICY "Auth manage testimonials" ON testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Auth manage instagram posts" ON instagram_posts;
CREATE POLICY "Auth manage instagram posts" ON instagram_posts FOR ALL TO authenticated USING (true) WITH CHECK (true);
