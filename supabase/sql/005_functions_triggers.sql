-- Function to handle updated_at for products
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to apply promo code
CREATE OR REPLACE FUNCTION apply_promo_code(p_code text, p_produit_id uuid DEFAULT NULL)
RETURNS TABLE(
  reduction numeric,
  total_after numeric,
  promo_code_id uuid,
  message text
) AS $$
DECLARE
  v_promo promo_codes%ROWTYPE;
  v_reduction numeric := 0;
  v_total_after numeric := 0;
  v_prix_produit numeric;
BEGIN
  -- Find the promo code
  SELECT * INTO v_promo
  FROM promo_codes
  WHERE upper(code) = upper(p_code);
  
  -- Check if code exists
  IF NOT FOUND THEN
    RETURN QUERY SELECT 
      0::numeric, 
      0::numeric, 
      NULL::uuid, 
      'Code promo invalide'::text;
    RETURN;
  END IF;
  
  -- Check if code is active
  IF NOT v_promo.actif THEN
    RETURN QUERY SELECT 
      0::numeric, 
      0::numeric, 
      v_promo.id, 
      'Ce code promo n''est plus actif'::text;
    RETURN;
  END IF;
  
  -- Check date range
  IF now() < v_promo.date_debut OR now() > v_promo.date_fin THEN
    RETURN QUERY SELECT 
      0::numeric, 
      0::numeric, 
      v_promo.id, 
      'Ce code promo n''est pas valide pour cette periode'::text;
    RETURN;
  END IF;
  
  -- Check usage limit
  IF v_promo.usage_max IS NOT NULL AND v_promo.usage_count >= v_promo.usage_max THEN
    RETURN QUERY SELECT 
      0::numeric, 
      0::numeric, 
      v_promo.id, 
      'Ce code promo a atteint sa limite d''utilisation'::text;
    RETURN;
  END IF;
  
  -- Check product-specific code
  IF v_promo.produit_id IS NOT NULL AND p_produit_id IS NOT NULL THEN
    IF v_promo.produit_id != p_produit_id THEN
      RETURN QUERY SELECT 
        0::numeric, 
        0::numeric, 
        v_promo.id, 
        'Ce code promo n''est pas applicable a ce produit'::text;
      RETURN;
    END IF;
  END IF;
  
  -- Calculate reduction (for product-specific, we need the product price)
  IF v_promo.produit_id IS NOT NULL THEN
    SELECT prix INTO v_prix_produit
    FROM products
    WHERE id = v_promo.produit_id;
    
    IF v_promo.type_reduction = 'pourcentage' THEN
      v_reduction := v_prix_produit * (v_promo.valeur / 100);
    ELSE
      v_reduction := LEAST(v_promo.valeur, v_prix_produit);
    END IF;
    v_total_after := v_prix_produit - v_reduction;
  ELSE
    -- Global code - reduction will be calculated based on cart total
    IF v_promo.type_reduction = 'pourcentage' THEN
      v_reduction := v_promo.valeur;
    ELSE
      v_reduction := v_promo.valeur;
    END IF;
  END IF;
  
  RETURN QUERY SELECT 
    v_reduction, 
    v_total_after, 
    v_promo.id, 
    'Code promo applique avec succes'::text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment promo usage
CREATE OR REPLACE FUNCTION increment_promo_usage(p_code text)
RETURNS void AS $$
BEGIN
  UPDATE promo_codes
  SET usage_count = usage_count + 1
  WHERE upper(code) = upper(p_code);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate order total
CREATE OR REPLACE FUNCTION calculate_order_total(p_order_id uuid)
RETURNS numeric AS $$
DECLARE
  v_total numeric := 0;
  v_discount numeric := 0;
  v_promo promo_codes%ROWTYPE;
BEGIN
  -- Calculate sum of items
  SELECT COALESCE(SUM(quantite * prix_unitaire), 0)
  INTO v_total
  FROM order_items
  WHERE order_id = p_order_id;
  
  -- Check for promo code
  SELECT pc.* INTO v_promo
  FROM orders o
  JOIN promo_codes pc ON o.promo_code_id = pc.id
  WHERE o.id = p_order_id;
  
  IF FOUND THEN
    IF v_promo.type_reduction = 'pourcentage' THEN
      v_discount := v_total * (v_promo.valeur / 100);
    ELSE
      v_discount := LEAST(v_promo.valeur, v_total);
    END IF;
    v_total := v_total - v_discount;
  END IF;
  
  -- Update order total
  UPDATE orders
  SET total = v_total
  WHERE id = p_order_id;
  
  RETURN v_total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for updated_at on products
CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Trigger to increment promo usage after order insert
CREATE OR REPLACE FUNCTION trigger_increment_promo_usage()
RETURNS TRIGGER AS $$
DECLARE
  v_code text;
BEGIN
  IF NEW.promo_code_id IS NOT NULL THEN
    SELECT code INTO v_code
    FROM promo_codes
    WHERE id = NEW.promo_code_id;
    
    IF v_code IS NOT NULL THEN
      PERFORM increment_promo_usage(v_code);
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_promo_used
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION trigger_increment_promo_usage();
