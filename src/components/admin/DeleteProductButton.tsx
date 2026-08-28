"use client";

import { useTransition } from "react";
import { deleteProduct } from "@/app/admin/(dashboard)/products/actions";

export default function DeleteProductButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm(`Delete "${productName}"? This cannot be undone.`)) {
          startTransition(() => deleteProduct(productId));
        }
      }}
      className="text-muted-foreground hover:text-brand disabled:opacity-50"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
