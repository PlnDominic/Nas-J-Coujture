import Image from "next/image";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import { primaryImage } from "@/lib/product-image";
import type { ProductWithImages } from "@/types/database";

export default function ProductCard({ product }: { product: ProductWithImages }) {
  const image = primaryImage(product);
  const onSale =
    product.compare_at_price_cents != null &&
    product.compare_at_price_cents > product.price_cents;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No image yet
          </div>
        )}
        {product.stock === 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-foreground px-2 py-1 text-xs font-medium text-background">
            Sold out
          </span>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="text-sm font-medium text-foreground">{product.name}</h3>
        <div className="flex items-center gap-2 text-sm">
          <span className={onSale ? "text-brand" : "text-muted-foreground"}>
            {formatMoney(product.price_cents, product.currency)}
          </span>
          {onSale && (
            <span className="text-muted-foreground line-through">
              {formatMoney(product.compare_at_price_cents!, product.currency)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
