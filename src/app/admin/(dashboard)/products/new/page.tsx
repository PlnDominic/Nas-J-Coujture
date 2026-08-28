import { createClient } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";
import { createProduct } from "@/app/admin/(dashboard)/products/actions";

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("*").order("name");

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold">Add product</h1>
      <div className="mt-8">
        <ProductForm categories={categories ?? []} action={createProduct} />
      </div>
    </div>
  );
}
