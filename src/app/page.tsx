import Link from "next/link";
import { getPublishedProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default async function HomePage() {
  const products = await getPublishedProducts();
  const featured = products.slice(0, 8);

  return (
    <div>
      <section className="border-b border-border bg-muted">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-20 sm:px-6">
          <p className="text-sm font-medium uppercase tracking-widest text-brand">
            New Arrivals
          </p>
          <h1 className="max-w-xl font-serif text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            Heritage craft, made for everyday wear.
          </h1>
          <p className="max-w-md text-muted-foreground">
            Small-batch fashion pieces designed and hand-finished with traditional textile
            techniques.
          </p>
          <Link
            href="/products"
            className="mt-4 inline-flex items-center rounded-full bg-brand px-6 py-3 text-sm font-medium text-brand-foreground transition hover:opacity-90"
          >
            Shop the collection
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-serif text-2xl font-semibold">Featured Pieces</h2>
          <Link href="/products" className="text-sm font-medium text-brand hover:underline">
            View all
          </Link>
        </div>

        {featured.length === 0 ? (
          <p className="text-muted-foreground">
            No products yet — check back soon, or sign in as an admin to add the first one.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
