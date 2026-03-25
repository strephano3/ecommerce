import { operationsInfo } from "@/lib/legal";

export default function ReturnsPage() {
  return (
    <section className="section narrow">
      <p className="eyebrow">Resi</p>
      <h1>Politica di reso e rimborso</h1>
      <div className="legal-copy">
        <p>Finestra di recesso prevista: {operationsInfo.returnWindow}.</p>
        <p>Rimborso previsto: {operationsInfo.refundTiming}.</p>
        <ul className="legal-list">
          <li>il prodotto deve essere restituito integro e nelle condizioni previste dalla policy</li>
          <li>il capo non deve presentare segni di utilizzo, lavaggio o danneggiamento non imputabile al trasporto</li>
          <li>i costi di spedizione del reso, salvo diverso obbligo di legge o difetto del prodotto, restano a carico del cliente</li>
          <li>i rimborsi vengono emessi secondo il metodo di pagamento originario, salvo diversa indicazione lecita</li>
          <li>in caso di prodotto difettoso o errato il cliente deve contattare l’assistenza prima della restituzione</li>
        </ul>
      </div>
    </section>
  );
}
