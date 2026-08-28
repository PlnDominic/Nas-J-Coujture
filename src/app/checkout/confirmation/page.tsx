import Link from "next/link";

export default async function OrderConfirmationPage({
  searchParams,
}: PageProps<"/checkout/confirmation">) {
  const { order } = await searchParams;
  const orderId = Array.isArray(order) ? order[0] : order;

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <h1 className="font-serif text-3xl font-semibold">Thank you!</h1>
      <p className="mt-3 text-muted-foreground">
        Your order has been placed. We&apos;ll reach out shortly to confirm delivery details.
      </p>
      {orderId && (
        <p className="mt-4 text-sm text-muted-foreground">
          Order reference: <span className="font-mono text-foreground">{orderId}</span>
        </p>
      )}
      <Link
        href="/products"
        className="mt-8 inline-flex items-center rounded-full bg-brand px-6 py-3 text-sm font-medium text-brand-foreground transition hover:opacity-90"
      >
        Continue shopping
      </Link>
    </div>
  );
}
