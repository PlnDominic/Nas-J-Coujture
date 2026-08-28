"use client";

import Link from "next/link";
import { useCartStore, cartCount } from "@/store/cart";
import { useHasMounted } from "@/lib/useHasMounted";

export default function CartIndicator() {
  const items = useCartStore((s) => s.items);
  // Avoid SSR/client hydration mismatch: the persisted cart only exists
  // in the browser, so render the "0" state until mounted.
  const mounted = useHasMounted();
  const count = mounted ? cartCount(items) : 0;

  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:border-brand hover:text-brand"
    >
      Cart
      {count > 0 && (
        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-xs font-semibold text-brand-foreground">
          {count}
        </span>
      )}
    </Link>
  );
}
