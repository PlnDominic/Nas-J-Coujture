import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { formatMoney } from "@/lib/money";
import { primaryImage } from "@/lib/products";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import type { ProductWithImages } from "@/types/database";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, product_images(*), categories(*)")
    .order("created_at", { ascending: false });

  const products = (data ?? []) as unknown as ProductWithImages[];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-brand-foreground transition hover:opacity-90"
        >
          Add product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="mt-10 text-muted-foreground">No products yet. Add your first one.</p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="py-2 pr-4 font-medium">Product</th>
                <th className="py-2 pr-4 font-medium">Price</th>
                <th className="py-2 pr-4 font-medium">Stock</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 pr-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const image = primaryImage(product);
                return (
                  <tr key={product.id} className="border-b border-border">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded bg-muted">
                          {image && <Image src={image} alt="" fill className="object-cover" />}
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {product.categories?.name ?? "Uncategorized"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4">{formatMoney(product.price_cents, product.currency)}</td>
                    <td className="py-3 pr-4">{product.stock}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs ${
                          product.is_published
                            ? "bg-muted text-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {product.is_published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="text-brand hover:underline"
                        >
                          Edit
                        </Link>
                        <DeleteProductButton productId={product.id} productName={product.name} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
