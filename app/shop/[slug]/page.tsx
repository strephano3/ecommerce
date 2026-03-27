import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AddToCartButton } from "@/components/add-to-cart-button";
import { getProductBySlug } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const image = product.images[0];

  return (
    <section className="section product-detail">
      <div className="product-detail-media">
        {image ? (
          <Image src={image.url} alt={image.alt || product.name} fill sizes="50vw" />
        ) : (
          <div className="product-card-placeholder">touch grass</div>
        )}
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
            <span className="trust-icon" aria-hidden="true">
              ✓
            </span>
            <span>Pagamenti sicuri</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon" aria-hidden="true">
              🇮🇹
            </span>
            <span>Spedizione in tutta Italia</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon" aria-hidden="true">
              🚚
            </span>
            <span>Resi semplici</span>
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
