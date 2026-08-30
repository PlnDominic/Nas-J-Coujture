"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NAV_LINKS } from "@/lib/nav-links";
import { MenuIcon, CloseIcon, SearchIcon, UserIcon, HeartIcon } from "@/components/icons";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  // Lock body scroll while the menu is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label="Open menu"
        className="flex items-center justify-self-start"
      >
        <MenuIcon className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
          <div className="flex items-center justify-between border-b border-border px-4 py-5">
            <Link
              href="/"
              className="text-2xl font-extrabold uppercase tracking-tight text-foreground"
              onClick={close}
            >
              Nasji Culture
            </Link>
            <button type="button" onClick={close} aria-label="Close menu" className="flex items-center">
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          <nav
            id="mobile-nav-panel"
            aria-label="Mobile"
            className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-6"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className="border-b border-border py-4 text-lg font-semibold uppercase tracking-wide transition hover:text-brand"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/products"
              onClick={close}
              className="mt-6 flex items-center gap-2 py-2 text-sm font-semibold uppercase tracking-wider"
            >
              <SearchIcon className="h-4 w-4" />
              Search
            </Link>
            <span
              className="flex cursor-default items-center gap-2 py-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground"
              title="Customer accounts are coming soon"
            >
              <UserIcon className="h-4 w-4" />
              Login
            </span>
            <span
              className="flex cursor-default items-center gap-2 py-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground"
              title="Wishlist is coming soon"
            >
              <HeartIcon className="h-4 w-4" />
              Wishlist
            </span>
          </nav>
        </div>
      )}
    </div>
  );
}
