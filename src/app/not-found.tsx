import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="font-serif text-6xl font-semibold text-brand">404</p>
      <h1 className="mt-4 font-serif text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist, or may have moved.
      </p>
      <div className="mt-8 flex items-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center rounded-none bg-foreground px-7 py-3 text-xs font-semibold uppercase tracking-wider text-background transition hover:opacity-90"
        >
          Back to home
        </Link>
        <Link
          href="/products"
          className="inline-flex items-center rounded-none border border-foreground px-7 py-3 text-xs font-semibold uppercase tracking-wider transition hover:bg-foreground hover:text-background"
        >
          Shop all
        </Link>
      </div>
    </div>
  );
}
