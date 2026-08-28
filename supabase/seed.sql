-- Optional sample data for local development / demos.
-- Run after 0001_init.sql. Safe to re-run (uses fixed slugs with upsert).

insert into public.categories (name, slug) values
  ('Dresses', 'dresses'),
  ('Tops', 'tops'),
  ('Outerwear', 'outerwear'),
  ('Accessories', 'accessories')
on conflict (slug) do nothing;

insert into public.products
  (name, slug, description, price_cents, compare_at_price_cents, stock, category_id, sizes, colors, is_published)
select
  p.name, p.slug, p.description, p.price_cents, p.compare_at_price_cents, p.stock,
  c.id, p.sizes, p.colors, true
from (
  values
    ('Adire Wrap Dress', 'adire-wrap-dress',
      'Hand-dyed adire cotton wrap dress with an adjustable waist tie.',
      45000, 55000, 12, 'dresses', array['S','M','L','XL'], array['Indigo','Rust']),
    ('Kente Trim Blouse', 'kente-trim-blouse',
      'Relaxed-fit blouse finished with woven kente trim at the cuffs.',
      28000, null, 20, 'tops', array['S','M','L'], array['Cream']),
    ('Ankara Bomber Jacket', 'ankara-bomber-jacket',
      'Bold Ankara-print bomber jacket lined in soft cotton.',
      62000, 72000, 8, 'outerwear', array['M','L','XL'], array['Multicolor']),
    ('Beaded Waist Belt', 'beaded-waist-belt',
      'Handcrafted beaded waist belt, one size fits most.',
      15000, null, 30, 'accessories', array['One Size'], array['Gold','Black'])
) as p(name, slug, description, price_cents, compare_at_price_cents, stock, category_slug, sizes, colors)
join public.categories c on c.slug = p.category_slug
on conflict (slug) do nothing;
