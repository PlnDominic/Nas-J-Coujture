"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const listField = z
  .string()
  .optional()
  .transform((v) =>
    (v ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().optional(),
  priceCents: z.coerce.number().int().nonnegative("Price cannot be negative"),
  compareAtPriceCents: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : null)),
  stock: z.coerce.number().int().nonnegative("Stock cannot be negative"),
  categoryId: z
    .string()
    .optional()
    .transform((v) => v || null),
  sizes: listField,
  colors: listField,
  isPublished: z.coerce.boolean(),
  imageUrls: listField,
});

function parseProductForm(formData: FormData) {
  return productSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    priceCents: formData.get("priceCents"),
    compareAtPriceCents: formData.get("compareAtPriceCents"),
    stock: formData.get("stock"),
    categoryId: formData.get("categoryId"),
    sizes: formData.get("sizes"),
    colors: formData.get("colors"),
    isPublished: formData.get("isPublished") === "on",
    imageUrls: formData.get("imageUrls"),
  });
}

export async function createProduct(
  _prevState: string | null,
  formData: FormData,
): Promise<string | null> {
  await requireAdmin();
  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Invalid product";
  }
  const data = parsed.data;

  const supabase = await createClient();
  const { data: product, error } = await supabase
    .from("products")
    .insert({
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      price_cents: data.priceCents,
      compare_at_price_cents: data.compareAtPriceCents,
      stock: data.stock,
      category_id: data.categoryId,
      sizes: data.sizes,
      colors: data.colors,
      is_published: data.isPublished,
      currency: "GHS",
    })
    .select("id")
    .single();

  if (error || !product) {
    return error?.message.includes("duplicate")
      ? "A product with this slug already exists."
      : "Could not create product.";
  }

  if (data.imageUrls.length > 0) {
    await supabase.from("product_images").insert(
      data.imageUrls.map((url, position) => ({
        product_id: product.id,
        url,
        position,
      })),
    );
  }

  revalidatePath("/admin");
  revalidatePath("/products");
  redirect("/admin");
}

export async function updateProduct(
  productId: string,
  _prevState: string | null,
  formData: FormData,
): Promise<string | null> {
  await requireAdmin();
  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Invalid product";
  }
  const data = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      price_cents: data.priceCents,
      compare_at_price_cents: data.compareAtPriceCents,
      stock: data.stock,
      category_id: data.categoryId,
      sizes: data.sizes,
      colors: data.colors,
      is_published: data.isPublished,
    })
    .eq("id", productId);

  if (error) {
    return error.message.includes("duplicate")
      ? "A product with this slug already exists."
      : "Could not update product.";
  }

  if (data.imageUrls.length > 0) {
    const { data: existing } = await supabase
      .from("product_images")
      .select("position")
      .eq("product_id", productId)
      .order("position", { ascending: false })
      .limit(1);
    const startPosition = (existing?.[0]?.position ?? -1) + 1;

    await supabase.from("product_images").insert(
      data.imageUrls.map((url, i) => ({
        product_id: productId,
        url,
        position: startPosition + i,
      })),
    );
  }

  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath(`/products/${data.slug}`);
  redirect("/admin");
}

export async function deleteProduct(productId: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("products").delete().eq("id", productId);
  revalidatePath("/admin");
  revalidatePath("/products");
}

export async function deleteProductImage(imageId: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("product_images").delete().eq("id", imageId);
  revalidatePath("/admin");
}
