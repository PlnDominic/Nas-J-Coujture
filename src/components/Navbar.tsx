import Link from "next/link";
import TopBar from "@/components/TopBar";
import CartIndicator from "@/components/CartIndicator";
import MobileNav from "@/components/MobileNav";
import { SearchIcon, UserIcon, HeartIcon } from "@/components/icons";
import { NAV_LINKS } from "@/lib/nav-links";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-background">
      <TopBar />
      <div className="border-b border-border">
        <div className="mx-auto grid max-w-6xl grid-cols-3 items-center gap-4 px-4 py-5 sm:px-6">
          <div className="flex items-center gap-7 text-[11px] font-semibold uppercase tracking-wider">
            <MobileNav />
            <nav className="hidden items-center gap-7 sm:flex">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="transition hover:text-brand">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <Link
            href="/"
            className="justify-self-center text-lg font-extrabold uppercase tracking-tight whitespace-nowrap text-foreground sm:text-2xl"
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
