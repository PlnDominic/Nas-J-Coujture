import Image from "next/image";
import Link from "next/link";
import { getPublishedProducts } from "@/lib/products";
import { heroImage, newSeasonImage } from "@/lib/placeholder-images";
import ProductCard from "@/components/ProductCard";
import CategoryStrip from "@/components/CategoryStrip";
import TrustBadges from "@/components/TrustBadges";

export default async function HomePage() {
  const products = await getPublishedProducts();
  const featured = products.slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#e7e3db]">
        <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-6">
          <p className="text-xs font-semibold uppercase leading-relaxed tracking-widest text-foreground">
            Handcrafted style,
            <br />
            worn every day.
          </p>
        </div>

        <div className="relative mx-auto flex max-w-6xl justify-center px-4 sm:px-6">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap text-center font-sans text-[34vw] font-extrabold uppercase leading-none tracking-tight text-foreground/90 sm:text-[24vw]"
          >
            Nasji
          </span>

          <div className="relative z-10 aspect-[3/4] w-[62%] max-w-md overflow-hidden sm:w-[38%]">
            <Image
              src={heroImage}
              alt="Nasji Culture new collection"
              fill
              priority
              sizes="(min-width: 640px) 500px, 62vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="relative z-10 mx-auto flex max-w-6xl items-end justify-between px-4 pb-12 pt-8 sm:px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/products"
              className="rounded-none bg-foreground px-7 py-3 text-xs font-semibold uppercase tracking-wider text-background transition hover:opacity-90"
            >
              Shop now
            </Link>
            <Link
              href="/products"
              className="text-xs font-semibold uppercase tracking-wider underline decoration-1 underline-offset-4 transition hover:text-brand"
            >
              Explore new in
            </Link>
          </div>
          <p className="hidden text-right text-xs font-semibold uppercase tracking-widest text-muted-foreground sm:block">
            New
            <br />
            Collection
            <br />
            2026
          </p>
        </div>
      </section>

      {/* Category strip */}
      <CategoryStrip />

      {/* New season banner */}
      <section className="grid grid-cols-1 sm:grid-cols-2">
        <div className="flex flex-col justify-center gap-4 bg-muted px-6 py-16 sm:px-12 lg:px-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand">New season</p>
          <h2 className="font-sans text-4xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-5xl">
            New
            <br />
            Arrivals
          </h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Discover the newest small-batch pieces, hand-finished this season with traditional
            textile techniques.
          </p>
          <Link
            href="/products"
            className="mt-2 inline-flex w-fit items-center rounded-none bg-foreground px-7 py-3 text-xs font-semibold uppercase tracking-wider text-background transition hover:opacity-90"
          >
            Explore collection
          </Link>
        </div>
        <div className="relative aspect-[4/3] sm:aspect-auto">
          <Image
            src={newSeasonImage}
            alt="New season lookbook"
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover"
            style={{ objectPosition: "center 20%" }}
          />
        </div>
      </section>

      <TrustBadges />

      {/* Best sellers */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-lg font-extrabold uppercase tracking-wide">Best of Nasji</h2>
          <Link
            href="/products"
            className="text-xs font-semibold uppercase tracking-wider underline decoration-1 underline-offset-4 hover:text-brand"
          >
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
