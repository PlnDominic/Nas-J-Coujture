import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { signOut } from "@/app/admin/login/actions";

// The admin dashboard is a private, authenticated area with nothing for
// search engines to index.
export const metadata: Metadata = {
  title: { template: "%s | Admin", default: "Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireAdmin();

  return (
    <div className="mx-auto flex max-w-6xl gap-8 px-4 py-10 sm:px-6">
      <aside className="w-48 shrink-0">
        <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Admin
        </p>
        <p className="mb-6 text-sm font-medium">{profile.full_name ?? "Signed in"}</p>
        <nav className="space-y-1 text-sm">
          <Link href="/admin" className="block rounded-lg px-3 py-2 transition hover:bg-muted">
            Products
          </Link>
          <Link
            href="/admin/orders"
            className="block rounded-lg px-3 py-2 transition hover:bg-muted"
          >
            Orders
          </Link>
          <Link
            href="/admin/products/new"
            className="block rounded-lg px-3 py-2 transition hover:bg-muted"
          >
            Add product
          </Link>
        </nav>
        <form action={signOut} className="mt-8">
          <button type="submit" className="text-sm text-muted-foreground hover:text-brand">
            Sign out
          </button>
        </form>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
