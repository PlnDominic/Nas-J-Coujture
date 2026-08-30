import type { Metadata } from "next";
import Link from "next/link";
import { getCategories, getPublishedProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import Breadcrumbs from "@/components/Breadcrumbs";

export async function generateMetadata({
  searchParams,
}: PageProps<"/products">): Promise<Metadata> {
  const { category } = await searchParams;
  const categorySlug = Array.isArray(category) ? category[0] : category;

  if (!categorySlug) {
    return {
      title: "Shop All",
      description: "Browse the full Nasji Culture collection of handcrafted kaftans and agbada.",
      alternates: { canonical: "/products" },
    };
  }

  const categories = await getCategories();
  const matched = categories.find((c) => c.slug === categorySlug);
  const name = matched?.name ?? categorySlug;

  return {
    title: name,
    description: `Shop the ${name} collection from Nasji Culture: handcrafted, small-batch pieces.`,
    alternates: { canonical: `/products?category=${categorySlug}` },
  };
}

export default async function ProductsPage({
  searchParams,
}: PageProps<"/products">) {
  const { category } = await searchParams;
  const categorySlug = Array.isArray(category) ? category[0] : category;

  const [products, categories] = await Promise.all([
    getPublishedProducts(categorySlug),
    getCategories(),
  ]);

  const activeCategory = categories.find((c) => c.slug === categorySlug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop All", href: activeCategory ? "/products" : undefined },
          ...(activeCategory ? [{ label: activeCategory.name }] : []),
        ]}
      />
      <h1 className="mt-4 font-serif text-3xl font-semibold">
        {activeCategory ? activeCategory.name : "Shop All"}
      </h1>

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
