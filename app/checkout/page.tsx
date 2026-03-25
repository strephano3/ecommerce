import { CheckoutForm } from "@/components/checkout-form";

export default function CheckoutPage() {
  return (
    <section className="section narrow">
      <p className="eyebrow">Pagamento</p>
      <h1>Area pagamento</h1>
      <p className="section-copy">Completa i dati di spedizione e procedi al pagamento del tuo ordine.</p>
      <CheckoutForm />
    </section>
  );
}
