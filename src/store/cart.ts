"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  priceCents: number;
  currency: string;
  imageUrl: string | null;
  size: string | null;
  color: string | null;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string, size: string | null, color: string | null) => void;
  updateQuantity: (
    productId: string,
    size: string | null,
    color: string | null,
    quantity: number,
  ) => void;
  clear: () => void;
}

function sameLine(a: CartItem, productId: string, size: string | null, color: string | null) {
  return a.productId === productId && a.size === size && a.color === color;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) =>
            sameLine(i, item.productId, item.size, item.color),
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                sameLine(i, item.productId, item.size, item.color)
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity }] };
        }),
      removeItem: (productId, size, color) =>
        set((state) => ({
          items: state.items.filter((i) => !sameLine(i, productId, size, color)),
        })),
      updateQuantity: (productId, size, color, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => !sameLine(i, productId, size, color))
              : state.items.map((i) =>
                  sameLine(i, productId, size, color) ? { ...i, quantity } : i,
                ),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "nasji-culture-cart" },
  ),
);

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

export function cartTotalCents(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0);
}
