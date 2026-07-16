-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE pack_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Categories policies
CREATE POLICY "Public can read categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert categories" ON categories
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update categories" ON categories
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete categories" ON categories
  FOR DELETE USING (is_admin());

-- Products policies
CREATE POLICY "Public can read products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert products" ON products
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update products" ON products
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete products" ON products
  FOR DELETE USING (is_admin());

-- Pack items policies
CREATE POLICY "Public can read pack_items" ON pack_items
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert pack_items" ON pack_items
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update pack_items" ON pack_items
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete pack_items" ON pack_items
  FOR DELETE USING (is_admin());

-- Promo codes policies
CREATE POLICY "Public can read active promo codes" ON promo_codes
  FOR SELECT USING (
    actif = true 
    AND date_debut <= now() 
    AND date_fin >= now()
  );

CREATE POLICY "Admins can insert promo_codes" ON promo_codes
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update promo_codes" ON promo_codes
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete promo_codes" ON promo_codes
  FOR DELETE USING (is_admin());

-- Orders policies
CREATE POLICY "Anyone can create orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can read all orders" ON orders
  FOR SELECT USING (is_admin());

CREATE POLICY "Users can read own orders" ON orders
  FOR SELECT USING (
    auth.role() = 'authenticated' 
    AND client_email = auth.email()
  );

CREATE POLICY "Admins can update orders" ON orders
  FOR UPDATE USING (is_admin());

-- Order items policies
CREATE POLICY "Anyone can insert order_items" ON order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can read all order_items" ON order_items
  FOR SELECT USING (is_admin());

CREATE POLICY "Users can read own order_items" ON order_items
  FOR SELECT USING (
    auth.role() = 'authenticated' 
    AND EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.client_email = auth.email()
    )
  );

-- Testimonials policies
CREATE POLICY "Public can read approved testimonials" ON testimonials
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Anyone can insert testimonials" ON testimonials
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update testimonials" ON testimonials
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete testimonials" ON testimonials
  FOR DELETE USING (is_admin());

-- Contact messages policies
CREATE POLICY "Anyone can insert contact_messages" ON contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can read contact_messages" ON contact_messages
  FOR SELECT USING (is_admin());

CREATE POLICY "Admins can update contact_messages" ON contact_messages
  FOR UPDATE USING (is_admin());

-- Admin users policies
CREATE POLICY "Admins can read admin_users" ON admin_users
  FOR SELECT USING (is_admin());

-- Storage policies for product-images bucket
CREATE POLICY "Public can view product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images' AND is_admin());

CREATE POLICY "Admins can update product images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'product-images' AND is_admin());

CREATE POLICY "Admins can delete product images" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images' AND is_admin());

-- Storage policies for testimonials-images bucket
CREATE POLICY "Public can view testimonial images" ON storage.objects
  FOR SELECT USING (bucket_id = 'testimonials-images');

CREATE POLICY "Admins can upload testimonial images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'testimonials-images' AND is_admin());

CREATE POLICY "Admins can update testimonial images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'testimonials-images' AND is_admin());

CREATE POLICY "Admins can delete testimonial images" ON storage.objects
  FOR DELETE USING (bucket_id = 'testimonials-images' AND is_admin());

-- Storage policies for site-assets bucket
CREATE POLICY "Public can view site assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'site-assets');

CREATE POLICY "Admins can upload site assets" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'site-assets' AND is_admin());

CREATE POLICY "Admins can update site assets" ON storage.objects
  FOR UPDATE USING (bucket_id = 'site-assets' AND is_admin());

CREATE POLICY "Admins can delete site assets" ON storage.objects
  FOR DELETE USING (bucket_id = 'site-assets' AND is_admin());
