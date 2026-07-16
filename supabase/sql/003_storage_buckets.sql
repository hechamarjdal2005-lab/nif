-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('product-images', 'product-images', true),
  ('testimonials-images', 'testimonials-images', true),
  ('site-assets', 'site-assets', true);
