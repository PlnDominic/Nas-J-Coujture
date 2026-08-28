"use client";

import { useTransition } from "react";
import { updateOrderStatus } from "@/app/admin/(dashboard)/orders/actions";
import type { OrderStatus } from "@/types/database";

const STATUSES: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={pending}
      onChange={(e) => startTransition(() => updateOrderStatus(orderId, e.target.value))}
      className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-brand disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s[0].toUpperCase() + s.slice(1)}
        </option>
      ))}
    </select>
  );
}
