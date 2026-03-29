import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import { inferProductKind } from "@/lib/product-kind";
import { readProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await readProducts();
  const featured = products
    .filter((product) => product.status === "active" && product.featured)
    .slice(0, 8);
  const featuredApparel = featured.filter((product) => inferProductKind(product) === "apparel").slice(0, 4);
  const featuredPosters = featured.filter((product) => inferProductKind(product) === "poster").slice(0, 4);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Touch Grass</p>
          <h1>Abbigliamento pensato per uscire di casa.</h1>
          <div className="hero-actions">
            <Link href="/shop" className="button button-dark">
              Scopri il negozio
            </Link>
            <Link href="/shipping" className="button button-light">
              Spedizioni e resi
            </Link>
          </div>
        </div>
        <div className="hero-note">
          <p className="eyebrow">Touch Grass</p>
          <p>Spedizione in tutta italia.</p>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Catalogo</p>
            <h2>Abbigliamento</h2>
          </div>
          <Link href="/shop" className="text-link">Vedi tutto</Link>
        </div>
        {featuredApparel.length > 0 ? (
          <div className="product-grid">
            {featuredApparel.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>La selezione arrivera presto</h3>
            <p>Torna a trovarci per scoprire i prossimi capi in uscita.</p>
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Catalogo</p>
            <h2>Poster</h2>
          </div>
          <Link href="/shop/posters" className="text-link">Vedi tutti</Link>
        </div>
        {featuredPosters.length > 0 ? (
          <div className="product-grid">
            {featuredPosters.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>I poster arriveranno presto</h3>
            <p>Qui troverai la selezione dedicata ai poster Touch Grass.</p>
          </div>
        )}
      </section>
    </>
  );
}
