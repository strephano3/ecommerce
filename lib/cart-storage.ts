"use client";

import type { CartItem } from "@/lib/types";

export const CART_STORAGE_KEY = "touch-grass-cart";

export function readCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("cart-updated"));
}

export function addCartItem(item: CartItem) {
  const items = readCart();
  const existing = items.find(
    (entry) => entry.productId === item.productId && entry.size === item.size
  );

  if (existing) {
    existing.quantity += item.quantity;
  } else {
    items.push(item);
  }

  writeCart(items);
}
