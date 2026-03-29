import { ProductCard } from "@/components/product-card";
import { inferProductKind } from "@/lib/product-kind";
import { readProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function PostersPage() {
  const posters = (await readProducts()).filter(
    (product) => product.status === "active" && inferProductKind(product) === "poster"
  );

  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Catalogo</p>
          <h1>Poster</h1>
        </div>
        <p className="section-caption">{posters.length} poster disponibili.</p>
      </div>
      {posters.length > 0 ? (
        <div className="product-grid">
          {posters.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>Nessun poster disponibile</h3>
          <p>La selezione dedicata ai poster verra pubblicata qui.</p>
        </div>
      )}
    </section>
  );
}
