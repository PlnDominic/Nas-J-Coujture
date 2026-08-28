"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const cartItemSchema = z.object({
  productId: z.string().uuid(),
  name: z.string(),
  priceCents: z.number().int().nonnegative(),
  quantity: z.number().int().positive(),
  size: z.string().nullable(),
  color: z.string().nullable(),
});

const checkoutSchema = z.object({
  customerName: z.string().min(1, "Name is required"),
  customerEmail: z.string().email("Enter a valid email"),
  customerPhone: z.string().min(1, "Phone number is required"),
  shippingAddress: z.string().min(1, "Address is required"),
  shippingCity: z.string().min(1, "City is required"),
  shippingRegion: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(cartItemSchema).min(1, "Your bag is empty"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export type CheckoutResult =
  | { ok: true; orderId: string }
  | { ok: false; error: string };

export async function placeOrder(input: CheckoutInput): Promise<CheckoutResult> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid order" };
  }
  const data = parsed.data;

  const admin = createAdminClient();

  // Re-check current prices and stock server-side instead of trusting the client.
  const productIds = data.items.map((i) => i.productId);
  const { data: products, error: productsError } = await admin
    .from("products")
    .select("id, name, price_cents, currency, stock")
    .in("id", productIds);

  if (productsError) {
    return { ok: false, error: "Could not verify products. Please try again." };
  }

  const byId = new Map(products.map((p) => [p.id, p]));
  for (const item of data.items) {
    const product = byId.get(item.productId);
    if (!product) {
      return { ok: false, error: `${item.name} is no longer available.` };
    }
    if (product.stock < item.quantity) {
      return { ok: false, error: `Only ${product.stock} left of ${product.name}.` };
    }
  }

  const currency = products[0]?.currency ?? "GHS";
  const totalCents = data.items.reduce((sum, item) => {
    const product = byId.get(item.productId)!;
    return sum + product.price_cents * item.quantity;
  }, 0);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      customer_id: user?.id ?? null,
      customer_name: data.customerName,
      customer_email: data.customerEmail,
      customer_phone: data.customerPhone,
      shipping_address: data.shippingAddress,
      shipping_city: data.shippingCity,
      shipping_region: data.shippingRegion || null,
      notes: data.notes || null,
      status: "pending",
      total_cents: totalCents,
      currency,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return { ok: false, error: "Could not create your order. Please try again." };
  }

  const orderItems = data.items.map((item) => {
    const product = byId.get(item.productId)!;
    return {
      order_id: order.id,
      product_id: item.productId,
      product_name: product.name,
      unit_price_cents: product.price_cents,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    };
  });

  const { error: itemsError } = await admin.from("order_items").insert(orderItems);
  if (itemsError) {
    return { ok: false, error: "Could not save your order items. Please try again." };
  }

  await Promise.all(
    data.items.map((item) => {
      const product = byId.get(item.productId)!;
      return admin
        .from("products")
        .update({ stock: product.stock - item.quantity })
        .eq("id", item.productId);
    }),
  );

  return { ok: true, orderId: order.id };
}
