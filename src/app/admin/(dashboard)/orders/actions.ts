"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { OrderStatus } from "@/types/database";

const STATUSES: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];

export async function updateOrderStatus(orderId: string, status: string) {
  await requireAdmin();
  if (!STATUSES.includes(status as OrderStatus)) return;
  const validStatus = status as OrderStatus;

  const supabase = await createClient();
  await supabase.from("orders").update({ status: validStatus }).eq("id", orderId);
  revalidatePath("/admin/orders");
}
