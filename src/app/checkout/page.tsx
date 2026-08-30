"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore, cartTotalCents } from "@/store/cart";
import { formatMoney } from "@/lib/money";
import { useHasMounted } from "@/lib/useHasMounted";
import { placeOrder } from "./actions";

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const router = useRouter();

  const mounted = useHasMounted();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    setError(null);

    const result = await placeOrder({
      customerName: String(formData.get("customerName") || ""),
      customerEmail: String(formData.get("customerEmail") || ""),
      customerPhone: String(formData.get("customerPhone") || ""),
      shippingAddress: String(formData.get("shippingAddress") || ""),
      shippingCity: String(formData.get("shippingCity") || ""),
      shippingRegion: String(formData.get("shippingRegion") || ""),
      notes: String(formData.get("notes") || ""),
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        priceCents: i.priceCents,
        quantity: i.quantity,
        size: i.size,
        color: i.color,
      })),
    });

    setSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    clear();
    router.push(`/checkout/confirmation?order=${result.orderId}`);
  }

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-serif text-2xl font-semibold">Your bag is empty</h1>
        <p className="mt-2 text-muted-foreground">Add items to your bag before checking out.</p>
      </div>
    );
  }

  const total = cartTotalCents(items);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-3xl font-semibold">Checkout</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <form action={handleSubmit} className="space-y-6">
          <fieldset className="space-y-4">
            <legend className="mb-1 font-medium">Contact</legend>
            <input
              name="customerName"
              required
              placeholder="Full name"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                name="customerEmail"
                type="email"
                required
                placeholder="Email"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand"
              />
              <input
                name="customerPhone"
                required
                placeholder="Phone number"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand"
              />
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="mb-1 font-medium">Shipping address</legend>
            <input
              name="shippingAddress"
              required
              placeholder="Street address"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                name="shippingCity"
                required
                placeholder="City"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand"
              />
              <input
                name="shippingRegion"
                placeholder="Region (optional)"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand"
              />
            </div>
            <textarea
              name="notes"
              placeholder="Delivery notes (optional)"
              rows={3}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand"
            />
          </fieldset>

          {error && (
            <p className="rounded-lg border border-brand/30 bg-brand/5 px-4 py-3 text-sm text-brand">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-none bg-foreground px-6 py-3 text-xs font-semibold uppercase tracking-wider text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Placing order…" : `Place order: ${formatMoney(total)}`}
          </button>
          <p className="text-xs text-muted-foreground">
            Payment is collected on delivery / by invoice; our team will reach out to confirm
            your order.
          </p>
        </form>

        <div className="h-fit rounded-lg border border-border bg-muted p-6">
          <h2 className="font-medium">Order summary</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {items.map((item) => (
              <li
                key={`${item.productId}-${item.size}-${item.color}`}
                className="flex justify-between gap-4"
              >
                <span className="text-muted-foreground">
                  {item.name} × {item.quantity}
                  {item.size ? ` (${item.size})` : ""}
                </span>
                <span>{formatMoney(item.priceCents * item.quantity, item.currency)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-border pt-4 font-medium">
            <span>Total</span>
            <span>{formatMoney(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
