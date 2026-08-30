import Image from "next/image";
import Link from "next/link";
import { categoryTileImages } from "@/lib/placeholder-images";

const TILES = [
  {
    slug: "dresses",
    name: "Dresses",
    blurb: "Effortless silhouettes for every occasion.",
    image: categoryTileImages.dresses,
  },
  {
    slug: "outerwear",
    name: "Outerwear",
    blurb: "Layers built to move with you.",
    image: categoryTileImages.outerwear,
  },
  {
    slug: "accessories",
    name: "Accessories",
    blurb: "The finishing details, hand-selected.",
    image: categoryTileImages.accessories,
  },
];

export default function CategoryStrip() {
  return (
    <section className="bg-[#111] text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-14 sm:grid-cols-3 sm:px-6">
        {TILES.map((tile) => (
          <div key={tile.slug} className="flex items-center gap-4">
            <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-sm">
              <Image
                src={tile.image}
                alt={tile.name}
                fill
                sizes="80px"
                className="object-cover grayscale"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold uppercase tracking-wide">{tile.name}</h3>
              <p className="mt-1 text-sm text-white/60">{tile.blurb}</p>
              <Link
                href={`/products?category=${tile.slug}`}
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-white transition hover:text-brand"
              >
                Shop {tile.name} →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
