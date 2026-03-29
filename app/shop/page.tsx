import { ProductCard } from "@/components/product-card";
import { inferProductKind } from "@/lib/product-kind";
import { readProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const products = (await readProducts()).filter((product) => product.status === "active");
  const apparelProducts = products.filter((product) => inferProductKind(product) === "apparel");
  const posterProducts = products.filter((product) => inferProductKind(product) === "poster");

  return (
    <>
      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Catalogo</p>
            <h1>Tutti i prodotti</h1>
          </div>
          <p className="section-caption">{products.length} prodotti disponibili.</p>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Sezione</p>
            <h2>Abbigliamento</h2>
          </div>
          <p className="section-caption">{apparelProducts.length} articoli.</p>
        </div>
        {apparelProducts.length > 0 ? (
          <div className="product-grid">
            {apparelProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>Nessun capo disponibile</h3>
            <p>La selezione abbigliamento arrivera a breve.</p>
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Sezione</p>
            <h2>Poster</h2>
          </div>
          <p className="section-caption">{posterProducts.length} poster disponibili.</p>
        </div>
        {posterProducts.length > 0 ? (
          <div className="product-grid">
            {posterProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>Nessun poster disponibile</h3>
            <p>La selezione poster verra pubblicata qui.</p>
          </div>
        )}
      </section>
    </>
  );
}
