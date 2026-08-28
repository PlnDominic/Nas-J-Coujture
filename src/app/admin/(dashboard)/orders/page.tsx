import { createClient } from "@/lib/supabase/server";
import { formatMoney } from "@/lib/money";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import type { OrderWithItems } from "@/types/database";

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  const orders = (data ?? []) as unknown as OrderWithItems[];

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold">Orders</h1>

      {orders.length === 0 ? (
        <p className="mt-10 text-muted-foreground">No orders yet.</p>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <details key={order.id} className="rounded-lg border border-border p-4">
              <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{order.customer_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.customer_email} · {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">
                    {formatMoney(order.total_cents, order.currency)}
                  </span>
                  <OrderStatusSelect orderId={order.id} status={order.status} />
                </div>
              </summary>

              <div className="mt-4 border-t border-border pt-4 text-sm">
                <p className="text-muted-foreground">
                  {order.shipping_address}, {order.shipping_city}
                  {order.shipping_region ? `, ${order.shipping_region}` : ""}
                </p>
                {order.customer_phone && (
                  <p className="text-muted-foreground">{order.customer_phone}</p>
                )}
                {order.notes && <p className="mt-2 italic text-muted-foreground">{order.notes}</p>}

                <ul className="mt-4 space-y-2">
                  {order.order_items.map((item) => (
                    <li key={item.id} className="flex justify-between">
                      <span>
                        {item.product_name} × {item.quantity}
                        {item.size ? ` (${item.size})` : ""}
                        {item.color ? ` / ${item.color}` : ""}
                      </span>
                      <span>{formatMoney(item.unit_price_cents * item.quantity, order.currency)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
