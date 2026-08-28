import Link from "next/link";
import CartIndicator from "@/components/CartIndicator";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6">
        <Link href="/" className="font-serif text-xl font-semibold tracking-tight text-brand">
          Nasji Culture
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium sm:flex">
          <Link href="/products" className="transition hover:text-brand">
            Shop All
          </Link>
          <Link href="/products?category=dresses" className="transition hover:text-brand">
            Dresses
          </Link>
          <Link href="/products?category=outerwear" className="transition hover:text-brand">
            Outerwear
          </Link>
          <Link href="/products?category=accessories" className="transition hover:text-brand">
            Accessories
          </Link>
        </nav>

        <CartIndicator />
      </div>
    </header>
  );
}
