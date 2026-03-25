import { ProductCard } from "@/components/product-card";
import { readProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const products = (await readProducts()).filter((product) => product.status === "active");

  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Catalogo</p>
          <h1>Tutti i prodotti</h1>
        </div>
        <p className="section-caption">{products.length} prodotti disponibili.</p>
      </div>
      {products.length > 0 ? (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>La collezione sara disponibile a breve</h3>
          <p>Stiamo preparando i prossimi articoli del catalogo.</p>
        </div>
      )}
    </section>
  );
}
