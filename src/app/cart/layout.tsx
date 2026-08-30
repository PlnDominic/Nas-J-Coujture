import type { Metadata } from "next";

// The cart is a transactional, per-visitor page with nothing useful to
// index, so keep it out of search results.
export const metadata: Metadata = {
  title: "Your Bag",
  robots: { index: false, follow: true },
};

export default function CartLayout({ children }: LayoutProps<"/cart">) {
  return children;
}
