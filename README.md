# Nasji Culture

A storefront for Nasji Culture — a fashion brand selling small-batch, heritage-craft
clothing. Built with Next.js (App Router), TypeScript, Tailwind CSS, and Supabase.

## Features

- **Storefront**: home page, product listing with category filters, product detail
  pages with size/color selection, a persistent shopping cart, and checkout.
- **Checkout**: collects customer + shipping details and creates an order; server-side
  code re-validates prices and stock before saving, so nothing is trusted from the
  client.
- **Admin panel** (`/admin`): email/password sign-in gated to accounts with the
  `admin` role. Admins can create/edit/delete products (name, description, price,
  compare-at price, stock, category, sizes, colors, images) and update order status.
- **Supabase**: Postgres schema with row-level security so customers can only see
  published products and their own orders, while admins can manage everything.
  Product images are stored in a public Supabase Storage bucket.

## Getting started

1. **Create a Supabase project** at [supabase.com](https://supabase.com).
2. **Run the schema migration**: open the SQL editor in your Supabase project and run
   `supabase/migrations/0001_init.sql`. Optionally follow it with `supabase/seed.sql`
   for sample products.
3. **Copy environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   Fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and
   `SUPABASE_SERVICE_ROLE_KEY` from Project Settings → API.
4. **Install dependencies and run the dev server**:
   ```bash
   npm install
   npm run dev
   ```
5. **Create your first admin user**:
   - Sign up a user (e.g. via the Supabase dashboard's Authentication → Users →
     Add user, or by wiring up a sign-up form).
   - Promote them to admin in the SQL editor:
     ```sql
     update public.profiles set role = 'admin' where id = '<user-uuid>';
     ```
   - Sign in at `/admin/login`.

## Project structure

- `src/app` — routes (storefront pages, `/admin` dashboard, checkout).
- `src/components` — shared UI; `src/components/admin` — admin-only UI.
- `src/lib/supabase` — browser, server, and admin (service-role) Supabase clients.
- `src/store/cart.ts` — client-side cart state (Zustand, persisted to localStorage).
- `supabase/migrations` — SQL schema and RLS policies.

## Scripts

- `npm run dev` — start the dev server.
- `npm run build` — production build.
- `npm run lint` — lint the codebase.
