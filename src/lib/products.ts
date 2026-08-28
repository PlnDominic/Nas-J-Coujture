import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { ProductWithImages } from "@/types/database";
export { primaryImage } from "@/lib/product-image";

const PRODUCT_SELECT = "*, product_images(*), categories(*)";

export async function getPublishedProducts(categorySlug?: string) {
  // Deployment isn't wired up to Supabase yet — show an empty catalog
  // instead of crashing the storefront.
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (categorySlug) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();
    if (category) {
      query = query.eq("category_id", category.id);
    } else {
      return [];
    }
  }

  const { data, error } = await query;
  if (error) {
    console.error("getPublishedProducts failed:", error.message);
    return [];
  }
  return (data ?? []) as unknown as ProductWithImages[];
}

export async function getProductBySlug(slug: string) {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) return null;
  return data as unknown as ProductWithImages;
}

export async function getCategories() {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").select("*").order("name");
  if (error) {
    console.error("getCategories failed:", error.message);
    return [];
  }
  return data;
}
