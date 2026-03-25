import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { readProducts } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusLabel: Record<string, string> = {
  draft: "Bozza",
  active: "Attivo",
  archived: "Archiviato",
  sold_out: "Esaurito"
};

async function deleteProductAction(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "");
  if (!id) {
    return;
  }

  const { deleteProduct } = await import("@/lib/products");
  const result = await deleteProduct(id);
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/products");

  if (result.outcome === "archived") {
    redirect("/admin/products?notice=archived");
  }

  redirect("/admin/products?notice=deleted");
}

export default async function AdminProductsPage({
  searchParams
}: {
  searchParams?: Promise<{ notice?: string }>;
}) {
  const products = await readProducts();
  const params = searchParams ? await searchParams : undefined;
  const notice = params?.notice;

  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Gestione catalogo</p>
          <h1>Prodotti</h1>
        </div>
        <Link href="/admin/products/new" className="button button-dark">
          Crea prodotto
        </Link>
      </div>

      {notice === "deleted" ? (
        <p className="form-success">Prodotto eliminato.</p>
      ) : null}

      {notice === "archived" ? (
        <p className="helper-text">
          Il prodotto non poteva essere eliminato perché presente nello storico ordini. È stato archiviato.
        </p>
      ) : null}

      {products.length > 0 ? (
        <div className="admin-table">
          <div className="admin-table-row admin-table-head">
            <span>Nome</span>
            <span>Stato</span>
            <span>Prezzo</span>
            <span>Taglie</span>
            <span>Azioni</span>
          </div>
          {products.map((product) => (
            <div key={product.id} className="admin-table-row">
              <span>{product.name}</span>
              <span>{statusLabel[product.status] ?? product.status}</span>
              <span>{formatPrice(product.price)}</span>
              <span>{product.variants.map((variant) => variant.size).join(", ")}</span>
              <span className="admin-table-actions">
                <Link href={`/shop/${product.slug}`}>Apri</Link>
                <Link href={`/admin/products/${product.id}/edit`}>Modifica</Link>
                <form action={deleteProductAction}>
                  <input type="hidden" name="id" value={product.id} />
                  <button type="submit">Elimina</button>
                </form>
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>Nessun prodotto presente</h3>
          <p>Inizia dalla creazione del primo articolo per popolare il catalogo.</p>
        </div>
      )}
    </section>
  );
}
