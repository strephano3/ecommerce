import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];

  return (
    <article className="product-card">
      <Link href={`/shop/${product.slug}`} className="product-card-link">
        <div className="product-card-media">
          {image ? (
            <Image
              src={image.url}
              alt={image.alt || product.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="product-card-placeholder">touch grass</div>
          )}
        </div>
        <div className="product-card-copy">
          <div className="product-card-row">
            <h3>{product.name}</h3>
            <p>{formatPrice(product.price)}</p>
          </div>
          <p>{product.shortDescription}</p>
          <div className="product-meta">
            <span>{product.collection}</span>
            <span>{product.category}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
