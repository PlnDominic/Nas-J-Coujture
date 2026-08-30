import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import { primaryImage } from "@/lib/product-image";
import { formatMoney } from "@/lib/money";
import { siteUrl } from "@/lib/site";
import AddToCartForm from "@/components/AddToCartForm";
import Breadcrumbs from "@/components/Breadcrumbs";

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };

  const description =
    product.description?.slice(0, 160) ??
    `${product.name}, handcrafted by Nasji Culture.`;
  const image = primaryImage(product);

  return {
    title: product.name,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.name,
      description,
      url: `${siteUrl}/products/${product.slug}`,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const images = [...product.product_images].sort((a, b) => a.position - b.position);
  const onSale =
    product.compare_at_price_cents != null &&
    product.compare_at_price_cents > product.price_cents;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? undefined,
    image: images.map((img) => img.url),
    category: product.categories?.name,
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/products/${product.slug}`,
      priceCurrency: product.currency,
      price: (product.price_cents / 100).toFixed(2),
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop All", href: "/products" },
          ...(product.categories
            ? [
                {
                  label: product.categories.name,
                  href: `/products?category=${product.categories.slug}`,
                },
              ]
            : []),
          { label: product.name },
        ]}
      />
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
            {images[0] ? (
              <Image
                src={images[0].url}
                alt={product.name}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No image yet
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {images.slice(1).map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-square overflow-hidden rounded-lg bg-muted"
                >
                  <Image src={img.url} alt={product.name} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.categories && (
            <p className="text-sm font-medium uppercase tracking-widest text-brand">
              {product.categories.name}
            </p>
          )}
          <h1 className="mt-2 font-serif text-3xl font-semibold">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3 text-lg">
            <span className={onSale ? "text-brand" : ""}>
              {formatMoney(product.price_cents, product.currency)}
            </span>
            {onSale && (
              <span className="text-muted-foreground line-through">
                {formatMoney(product.compare_at_price_cents!, product.currency)}
              </span>
            )}
          </div>

          {product.description && (
            <p className="mt-6 leading-relaxed text-muted-foreground">{product.description}</p>
          )}

          <div className="mt-8">
            <AddToCartForm product={product} />
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            {product.stock > 0 ? `${product.stock} in stock` : "Currently unavailable"}
          </p>
        </div>
      </div>
    </div>
  );
}
