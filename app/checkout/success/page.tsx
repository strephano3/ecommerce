import { CheckoutSuccessClient } from "@/components/checkout-success-client";

export default async function CheckoutSuccessPage({
  searchParams
}: {
  searchParams: Promise<{ provider?: string; session_id?: string }>;
}) {
  const params = await searchParams;

  return (
    <section className="section narrow">
      <p className="eyebrow">Pagamento completato</p>
      <h1>Conferma pagamento</h1>
      <CheckoutSuccessClient provider={params.provider} sessionId={params.session_id} />
    </section>
  );
}
