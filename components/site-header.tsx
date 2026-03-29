"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { readCart } from "@/lib/cart-storage";

const navItems = [
  { href: "/shop", label: "Negozio" },
  { href: "/shop/posters", label: "Poster" },
  { href: "/shipping", label: "Spedizioni" },
  { href: "/returns", label: "Resi" },
  { href: "/support", label: "Supporto" },
  { href: "/cart", label: "Carrello" }
];

export function SiteHeader() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const syncCartCount = () => {
      const items = readCart();
      setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));
    };

    syncCartCount();
    window.addEventListener("cart-updated", syncCartCount);
    return () => window.removeEventListener("cart-updated", syncCartCount);
  }, []);

  return (
    <header className="site-header">
      <Link href="/" className="brand-mark">
        touch grass
      </Link>
      <nav className="top-nav" aria-label="Main navigation">
        {navItems.map((item) =>
          item.href === "/cart" ? (
            <Link key={item.href} href={item.href} className="cart-link">
              <span>{item.label}</span>
              {cartCount > 0 ? <span className="cart-badge">{cartCount}</span> : null}
            </Link>
          ) : (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          )
        )}
      </nav>
    </header>
  );
}
