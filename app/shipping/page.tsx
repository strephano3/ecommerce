import { operationsInfo } from "@/lib/legal";

export default function ShippingPage() {
  return (
    <section className="section narrow">
      <p className="eyebrow">Spedizioni</p>
      <h1>Informazioni sulle spedizioni</h1>
      <div className="legal-copy">
        <p>Tempi di evasione previsti: {operationsInfo.fulfillmentTime}.</p>
        <p>Aree servite: {operationsInfo.shippingArea}.</p>
        <p>Corrieri previsti: {operationsInfo.couriers.join(", ")}.</p>
        <ul className="legal-list">
          <li>i tempi decorrono dalla conferma del pagamento</li>
          <li>la consegna standard sul territorio italiano viene normalmente affidata a corriere espresso</li>
          <li>le spedizioni verso località disagiate o isole possono richiedere tempi superiori</li>
          <li>eventuali costi di spedizione vengono mostrati al checkout prima della conferma finale</li>
          <li>eventuali ritardi del corriere non dipendono dal venditore</li>
        </ul>
      </div>
    </section>
  );
}
