"use client";

import Link from "next/link";
import { useCartStore, cartCount } from "@/store/cart";
import { useHasMounted } from "@/lib/useHasMounted";
import { BagIcon } from "@/components/icons";

export default function CartIndicator() {
  const items = useCartStore((s) => s.items);
  // Avoid SSR/client hydration mismatch: the persisted cart only exists
  // in the browser, so render the "0" state until mounted.
  const mounted = useHasMounted();
  const count = mounted ? cartCount(items) : 0;

  return (
    <Link href="/cart" className="flex items-center gap-1.5 transition hover:text-brand">
      <BagIcon className="h-4 w-4" />
      Cart ({count})
    </Link>
  );
}
