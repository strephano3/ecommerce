import { AdminProductForm } from "@/components/admin-product-form";

export default function NewProductPage() {
  return (
    <section className="section narrow">
      <p className="eyebrow">Console / Nuovo prodotto</p>
      <h1>Crea un nuovo prodotto</h1>
      <AdminProductForm mode="create" />
    </section>
  );
}
