-- 023_checkout_orders_cleanup.sql
-- Date: 2026-07-25
-- Simplify checkout data requirements while keeping legacy admin-compatible columns.

-- The checkout form now collects one full address field instead of a separate city.
-- Keep client_ville for existing admin screens and historical rows, but allow new
-- anonymous checkout orders to omit it.
ALTER TABLE orders
  ALTER COLUMN client_ville DROP NOT NULL;

