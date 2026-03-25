"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { readCart, writeCart } from "@/lib/cart-storage";
import type { CartItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

function totalAmount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function CartView() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const load = () => setItems(readCart());
    load();
    window.addEventListener("cart-updated", load);
    return () => window.removeEventListener("cart-updated", load);
  }, []);

  function updateQuantity(index: number, nextQuantity: number) {
    const nextItems = [...items];
    if (nextQuantity <= 0) {
      nextItems.splice(index, 1);
    } else {
      nextItems[index] = { ...nextItems[index], quantity: nextQuantity };
    }
    setItems(nextItems);
    writeCart(nextItems);
  }

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <h3>Il carrello e vuoto</h3>
        <p>Aggiungi i primi prodotti dal negozio per vedere qui il riepilogo.</p>
      </div>
    );
  }

  return (
    <div className="cart-layout">
      <div className="cart-list">
        {items.map((item, index) => (
          <article key={`${item.productId}-${item.size}`} className="cart-item">
            <div className="cart-item-media">
              {item.imageUrl ? (
                <Image src={item.imageUrl} alt={item.name} fill sizes="120px" />
              ) : (
                <div className="product-card-placeholder">touch grass</div>
              )}
            </div>
            <div className="cart-item-copy">
              <Link href={`/shop/${item.slug}`}>{item.name}</Link>
              <p>Taglia: {item.size}</p>
              <p>{formatPrice(item.price)}</p>
              <div className="cart-qty">
                <button type="button" onClick={() => updateQuantity(index, item.quantity - 1)}>
                  -
                </button>
                <span>{item.quantity}</span>
                <button type="button" onClick={() => updateQuantity(index, item.quantity + 1)}>
                  +
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      <aside className="info-card">
        <h3>Riepilogo</h3>
        <p>Subtotale: {formatPrice(totalAmount(items))}</p>
        <p>Spedizione e IVA verranno calcolate al checkout reale.</p>
        <Link href="/checkout" className="button button-dark">
          Continua al pagamento
        </Link>
      </aside>
    </div>
  );
}
