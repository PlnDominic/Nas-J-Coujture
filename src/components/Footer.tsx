import Link from "next/link";
import { NAV_LINKS } from "@/lib/nav-links";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-muted">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-muted-foreground sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div>
            <p className="font-serif text-base font-semibold text-foreground">Nasji Culture</p>
            <p className="mt-4 max-w-sm">
              Contemporary fashion rooted in heritage craft. Every piece is made in small
              batches. When it&apos;s gone, it&apos;s gone.
            </p>
          </div>
          <nav aria-label="Shop" className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground">
              Shop
            </p>
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-brand">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-8 border-t border-border pt-6">
          &copy; {new Date().getFullYear()} Nasji Culture. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
