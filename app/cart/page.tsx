import { CartView } from "@/components/cart-view";

export default function CartPage() {
  return (
    <section className="section narrow">
      <p className="eyebrow">Carrello</p>
      <h1>Carrello</h1>
      <p className="section-copy">
        Il carrello viene salvato nel browser e resta disponibile finche non svuoti i dati locali.
      </p>
      <CartView />
    </section>
  );
}
