import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";
import { updateProduct } from "@/app/admin/(dashboard)/products/actions";
import type { ProductWithImages } from "@/types/database";

export default async function EditProductPage({
  params,
}: PageProps<"/admin/products/[id]/edit">) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*, product_images(*), categories(*)").eq("id", id).single(),
    supabase.from("categories").select("*").order("name"),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold">Edit product</h1>
      <div className="mt-8">
        <ProductForm
          categories={categories ?? []}
          product={product as unknown as ProductWithImages}
          action={updateProduct.bind(null, id)}
        />
      </div>
    </div>
  );
}
