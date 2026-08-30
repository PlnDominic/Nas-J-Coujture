import Link from "next/link";
import TopBar from "@/components/TopBar";
import CartIndicator from "@/components/CartIndicator";
import { SearchIcon, UserIcon, HeartIcon } from "@/components/icons";

const NAV_LINKS = [
  { label: "Shop All", href: "/products" },
  { label: "Dresses", href: "/products?category=dresses" },
  { label: "Outerwear", href: "/products?category=outerwear" },
  { label: "Accessories", href: "/products?category=accessories" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-background">
      <TopBar />
      <div className="border-b border-border">
        <div className="mx-auto grid max-w-6xl grid-cols-2 items-center gap-4 px-4 py-5 sm:grid-cols-3 sm:px-6">
          <nav className="hidden items-center gap-7 text-[11px] font-semibold uppercase tracking-wider sm:flex">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-brand">
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/"
            className="justify-self-start text-2xl font-extrabold uppercase tracking-tight text-foreground sm:justify-self-center"
          >
            Nasji Culture
          </Link>

          <div className="flex items-center justify-end gap-5 text-[11px] font-semibold uppercase tracking-wider">
            <Link href="/products" className="hidden items-center gap-1.5 sm:flex">
              <SearchIcon className="h-4 w-4" />
              Search
            </Link>
            <span
              className="hidden cursor-default items-center gap-1.5 text-muted-foreground sm:flex"
              title="Customer accounts are coming soon"
            >
              <UserIcon className="h-4 w-4" />
              Login
            </span>
            <span
              className="hidden cursor-default items-center gap-1.5 text-muted-foreground md:flex"
              title="Wishlist is coming soon"
            >
              <HeartIcon className="h-4 w-4" />
              Wishlist
            </span>
            <CartIndicator />
          </div>
        </div>
      </div>
    </header>
  );
}
