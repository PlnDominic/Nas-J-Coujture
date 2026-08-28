import Link from "next/link";
import { getCategories, getPublishedProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default async function ProductsPage({
  searchParams,
}: PageProps<"/products">) {
  const { category } = await searchParams;
  const categorySlug = Array.isArray(category) ? category[0] : category;

  const [products, categories] = await Promise.all([
    getPublishedProducts(categorySlug),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-3xl font-semibold">Shop All</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/products"
          className={`rounded-full border px-4 py-1.5 text-sm transition ${
            !categorySlug
              ? "border-brand bg-brand text-brand-foreground"
              : "border-border hover:border-brand hover:text-brand"
          }`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/products?category=${c.slug}`}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              categorySlug === c.slug
                ? "border-brand bg-brand text-brand-foreground"
                : "border-border hover:border-brand hover:text-brand"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="mt-16 text-muted-foreground">No products found in this category yet.</p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
