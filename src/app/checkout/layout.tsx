import type { Metadata } from "next";

// Checkout and its confirmation page are transactional, per-visitor pages
// with nothing useful to index, so keep them out of search results.
export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: true },
};

export default function CheckoutLayout({ children }: LayoutProps<"/checkout">) {
  return children;
}
