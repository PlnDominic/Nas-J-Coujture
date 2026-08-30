"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore, cartTotalCents } from "@/store/cart";
import { formatMoney } from "@/lib/money";
import { useHasMounted } from "@/lib/useHasMounted";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const mounted = useHasMounted();

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-serif text-2xl font-semibold">Your bag is empty</h1>
        <p className="mt-2 text-muted-foreground">
          Browse the collection and add something you love.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center rounded-none bg-foreground px-7 py-3 text-xs font-semibold uppercase tracking-wider text-background transition hover:opacity-90"
        >
          Shop All
        </Link>
      </div>
    );
  }

  const total = cartTotalCents(items);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-3xl font-semibold">Your Bag</h1>

      <ul className="mt-8 divide-y divide-border">
        {items.map((item) => (
          <li
            key={`${item.productId}-${item.size}-${item.color}`}
            className="flex gap-4 py-6"
          >
            <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
              {item.imageUrl && (
                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
              )}
            </div>

            <div className="flex flex-1 flex-col justify-between">
              <div className="flex justify-between gap-4">
                <div>
                  <Link href={`/products/${item.slug}`} className="font-medium hover:text-brand">
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {[item.size, item.color].filter(Boolean).join(" / ")}
                  </p>
                </div>
                <p className="text-sm font-medium">
                  {formatMoney(item.priceCents * item.quantity, item.currency)}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    updateQuantity(item.productId, item.size, item.color, item.quantity - 1)
                  }
                  className="h-8 w-8 rounded-full border border-border transition hover:border-brand"
                >
                  −
                </button>
                <span className="w-6 text-center text-sm">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() =>
                    updateQuantity(item.productId, item.size, item.color, item.quantity + 1)
                  }
                  className="h-8 w-8 rounded-full border border-border transition hover:border-brand"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId, item.size, item.color)}
                  className="ml-4 text-sm text-muted-foreground underline-offset-2 hover:text-brand hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
        <span className="text-lg font-medium">Subtotal</span>
        <span className="text-lg font-medium">{formatMoney(total, items[0].currency)}</span>
      </div>

      <Link
        href="/checkout"
        className="mt-6 flex w-full items-center justify-center rounded-none bg-foreground px-7 py-3 text-xs font-semibold uppercase tracking-wider text-background transition hover:opacity-90"
      >
        Checkout
      </Link>
    </div>
  );
}
