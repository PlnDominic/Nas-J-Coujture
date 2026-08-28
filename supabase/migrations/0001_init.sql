-- Nasji Culture storefront schema
-- Run this in the Supabase SQL editor, or via `supabase db push`.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Profiles: one row per auth.users, carries the admin flag.
-- A new auth user gets a 'customer' profile automatically (see trigger below).
-- Promote someone to admin manually:
--   update public.profiles set role = 'admin' where id = '<user-uuid>';
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles are viewable by owner" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles are updatable by owner" on public.profiles
  for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Helper used by RLS policies below to check "is the current user an admin?"
create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- Categories
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "categories are viewable by everyone" on public.categories
  for select using (true);

create policy "categories are manageable by admins" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Products
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price_cents integer not null check (price_cents >= 0),
  compare_at_price_cents integer check (compare_at_price_cents >= 0),
  currency text not null default 'GHS',
  stock integer not null default 0 check (stock >= 0),
  category_id uuid references public.categories (id) on delete set null,
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_id_idx on public.products (category_id);
create index if not exists products_is_published_idx on public.products (is_published);

alter table public.products enable row level security;

create policy "published products are viewable by everyone" on public.products
  for select using (is_published or public.is_admin());

create policy "products are manageable by admins" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute procedure public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Product images (Supabase Storage bucket "product-images" holds the files)
-- ---------------------------------------------------------------------------
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  url text not null,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists product_images_product_id_idx on public.product_images (product_id);

alter table public.product_images enable row level security;

create policy "product images are viewable by everyone" on public.product_images
  for select using (true);

create policy "product images are manageable by admins" on public.product_images
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Orders + order items
-- ---------------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references auth.users (id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  shipping_address text not null,
  shipping_city text not null,
  shipping_region text,
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_cents integer not null check (total_cents >= 0),
  currency text not null default 'GHS',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "orders are viewable by owner or admin" on public.orders
  for select using (auth.uid() = customer_id or public.is_admin());

create policy "anyone can place an order" on public.orders
  for insert with check (true);

create policy "orders are updatable by admins" on public.orders
  for update using (public.is_admin()) with check (public.is_admin());

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute procedure public.set_updated_at();

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  product_name text not null,
  unit_price_cents integer not null check (unit_price_cents >= 0),
  quantity integer not null check (quantity > 0),
  size text,
  color text,
  created_at timestamptz not null default now()
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);

alter table public.order_items enable row level security;

create policy "order items are viewable by order owner or admin" on public.order_items
  for select using (
    public.is_admin()
    or exists (
      select 1 from public.orders
      where orders.id = order_items.order_id and orders.customer_id = auth.uid()
    )
  );

create policy "anyone can create order items with their order" on public.order_items
  for insert with check (true);

-- ---------------------------------------------------------------------------
-- Storage bucket for product images
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "product images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "admins can upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "admins can update product images"
  on storage.objects for update
  using (bucket_id = 'product-images' and public.is_admin());

create policy "admins can delete product images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and public.is_admin());
