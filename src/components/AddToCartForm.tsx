"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import type { ProductWithImages } from "@/types/database";
import { primaryImage } from "@/lib/product-image";

export default function AddToCartForm({ product }: { product: ProductWithImages }) {
  const [size, setSize] = useState(product.sizes[0] ?? null);
  const [color, setColor] = useState(product.colors[0] ?? null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();

  const soldOut = product.stock <= 0;

  function handleAdd() {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        priceCents: product.price_cents,
        currency: product.currency,
        imageUrl: primaryImage(product),
        size,
        color,
      },
      quantity,
    );
    setAdded(true);
  }

  return (
    <div className="space-y-5">
      {product.sizes.length > 0 && (
        <div>
          <label className="mb-2 block text-sm font-medium">Size</label>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={`rounded-full border px-4 py-1.5 text-sm transition ${
                  size === s
                    ? "border-brand bg-brand text-brand-foreground"
                    : "border-border hover:border-brand"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.colors.length > 0 && (
        <div>
          <label className="mb-2 block text-sm font-medium">Color</label>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`rounded-full border px-4 py-1.5 text-sm transition ${
                  color === c
                    ? "border-brand bg-brand text-brand-foreground"
                    : "border-border hover:border-brand"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-medium">Quantity</label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="h-9 w-9 rounded-full border border-border transition hover:border-brand"
          >
            −
          </button>
          <span className="w-6 text-center">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            className="h-9 w-9 rounded-full border border-border transition hover:border-brand"
          >
            +
          </button>
        </div>
      </div>

      <button
        type="button"
        disabled={soldOut}
        onClick={handleAdd}
        className="w-full rounded-none bg-foreground px-6 py-3 text-xs font-semibold uppercase tracking-wider text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {soldOut ? "Sold out" : "Add to bag"}
      </button>

      {added && (
        <div className="flex items-center justify-between rounded-lg border border-border bg-muted px-4 py-3 text-sm">
          <span>Added to bag.</span>
          <button
            type="button"
            onClick={() => router.push("/cart")}
            className="font-medium text-brand hover:underline"
          >
            View bag →
          </button>
        </div>
      )}
    </div>
  );
}
