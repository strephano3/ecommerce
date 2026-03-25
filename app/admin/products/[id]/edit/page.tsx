import { notFound } from "next/navigation";

import { AdminProductForm } from "@/components/admin-product-form";
import { getProductById } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <section className="section narrow">
      <p className="eyebrow">Console / Modifica prodotto</p>
      <h1>Modifica prodotto</h1>
      <AdminProductForm mode="edit" initialProduct={product} />
    </section>
  );
}
