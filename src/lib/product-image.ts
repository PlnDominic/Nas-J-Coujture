import type { ProductWithImages } from "@/types/database";

export function primaryImage(product: ProductWithImages): string | null {
  const sorted = [...(product.product_images ?? [])].sort((a, b) => a.position - b.position);
  return sorted[0]?.url ?? null;
}
