"use client";

import { useState } from "react";

import { addCartItem } from "@/lib/cart-storage";
import type { Product } from "@/lib/types";

export function AddToCartButton({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState(product.variants[0]?.size ?? "");
  const [message, setMessage] = useState("");

  function handleAdd() {
    const selectedVariant = product.variants.find((variant) => variant.size === selectedSize);

    if (!selectedVariant) {
      setMessage("Aggiungi prima almeno una taglia al prodotto.");
      return;
    }

    addCartItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      imageUrl: product.images[0]?.url,
      size: selectedVariant.size,
      quantity: 1,
      price: product.price
    });
    setMessage("Prodotto aggiunto al carrello.");
  }

  return (
    <div className="purchase-box">
      <label>
        Taglia
        <select
          value={selectedSize}
          onChange={(event) => setSelectedSize(event.target.value)}
          disabled={product.variants.length === 0}
        >
          {product.variants.length === 0 ? (
            <option value="">Nessuna taglia disponibile</option>
          ) : (
            product.variants.map((variant) => (
              <option key={variant.id} value={variant.size}>
                {variant.size} ({variant.stock} disponibili)
              </option>
            ))
          )}
        </select>
      </label>
      <button type="button" className="button button-dark" onClick={handleAdd}>
        Aggiungi al carrello
      </button>
      {message ? <p className="helper-text">{message}</p> : null}
    </div>
  );
}
