// Hand-written types mirroring supabase/migrations/0001_init.sql.
// If the schema changes, regenerate with:
//   supabase gen types typescript --project-id <id> > src/types/database.ts

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type ProfileRole = "customer" | "admin";

export type Category = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_cents: number;
  compare_at_price_cents: number | null;
  currency: string;
  stock: number;
  category_id: string | null;
  sizes: string[];
  colors: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  position: number;
  created_at: string;
};

export type ProductWithImages = Product & {
  product_images: ProductImage[];
  categories: Category | null;
};

export type Order = {
  id: string;
  customer_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_address: string;
  shipping_city: string;
  shipping_region: string | null;
  status: OrderStatus;
  total_cents: number;
  currency: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  unit_price_cents: number;
  quantity: number;
  size: string | null;
  color: string | null;
  created_at: string;
};

export type OrderWithItems = Order & { order_items: OrderItem[] };

export type Profile = {
  id: string;
  full_name: string | null;
  role: ProfileRole;
  created_at: string;
};

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "12";
  };
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile>;
        Update: Partial<Profile>;
        Relationships: [];
      };
      categories: {
        Row: Category;
        Insert: Omit<Category, "id" | "created_at"> & { id?: string };
        Update: Partial<Category>;
        Relationships: [];
      };
      products: {
        Row: Product;
        Insert: Omit<Product, "id" | "created_at" | "updated_at"> & {
          id?: string;
        };
        Update: Partial<Product>;
        Relationships: [];
      };
      product_images: {
        Row: ProductImage;
        Insert: Omit<ProductImage, "id" | "created_at"> & { id?: string };
        Update: Partial<ProductImage>;
        Relationships: [];
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, "id" | "created_at" | "updated_at"> & {
          id?: string;
        };
        Update: Partial<Order>;
        Relationships: [];
      };
      order_items: {
        Row: OrderItem;
        Insert: Omit<OrderItem, "id" | "created_at"> & { id?: string };
        Update: Partial<OrderItem>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
