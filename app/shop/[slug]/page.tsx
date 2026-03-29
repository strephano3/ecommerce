import Link from "next/link";
import { notFound } from "next/navigation";

import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductImageGallery } from "@/components/product-image-gallery";
import { inferProductKind } from "@/lib/product-kind";
import { getProductBySlug } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const isPoster = inferProductKind(product) === "poster";

  return (
    <section className="section product-detail">
      <div className="product-detail-media">
        <ProductImageGallery images={product.images} productName={product.name} isPoster={isPoster} />
      </div>

      <div className="product-detail-copy">
        <p className="eyebrow">
          {product.collection} / {product.category}
        </p>
        <h1>{product.name}</h1>
        <div className="price-line">
          <strong>{formatPrice(product.price)}</strong>
          {product.compareAtPrice ? <span>{formatPrice(product.compareAtPrice)}</span> : null}
        </div>
        <p>{product.description}</p>

        <div className="size-grid">
          {product.variants.map((variant) => (
            <div key={variant.id} className="size-pill">
              <span>{variant.size}</span>
              <small>{variant.stock} disponibili</small>
            </div>
          ))}
        </div>

        <div className="hero-actions product-actions">
          <AddToCartButton product={product} />
          <Link href="/checkout" className="button button-light">
            Vai al pagamento
          </Link>
        </div>

        <div className="trust-list">
          <div className="trust-item">
            <span className="trust-icon trust-icon-safe" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 3.5 18.5 6v5.7c0 4.1-2.6 7.8-6.5 9.3-3.9-1.5-6.5-5.2-6.5-9.3V6L12 3.5Z" />
                <path d="m8.8 12.2 2.1 2.1 4.4-4.7" />
              </svg>
            </span>
            <span className="trust-copy">
              <strong>Pagamenti sicuri</strong>
              <small>Checkout protetto e transazioni verificate.</small>
            </span>
          </div>
          <div className="trust-item">
            <span className="trust-icon trust-icon-italy" aria-hidden="true">
              <span className="flag-it">
                <span />
                <span />
                <span />
              </span>
            </span>
            <span className="trust-copy">
              <strong>Spedizione in tutta Italia</strong>
              <small>Consegna nazionale con tracciamento ordine.</small>
            </span>
          </div>
          <div className="trust-item">
            <span className="trust-icon trust-icon-returns" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3.5 7.5h10v8h-10z" />
                <path d="M13.5 10.5h3.6l2.4 2.5v2.5h-6" />
                <circle cx="8" cy="17.5" r="1.7" />
                <circle cx="17" cy="17.5" r="1.7" />
              </svg>
            </span>
            <span className="trust-copy">
              <strong>Resi semplici</strong>
              <small>Procedura chiara e assistenza rapida post acquisto.</small>
            </span>
          </div>
        </div>

        <div className="detail-meta">
          <p>Tag: {product.tags.join(", ") || "nessuno"}</p>
          <p>Pagamenti disponibili al checkout: Stripe, Apple Pay, Klarna e PayPal.</p>
        </div>
      </div>
    </section>
  );
}
