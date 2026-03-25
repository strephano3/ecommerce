import { businessInfo, isConfiguredValue, operationsInfo } from "@/lib/legal";

export default function TermsPage() {
  return (
    <section className="section narrow">
      <p className="eyebrow">Termini</p>
      <h1>Termini e condizioni di vendita</h1>
      <div className="legal-copy">
        <p>
          Il presente sito è gestito da {businessInfo.legalEntityName}
          {isConfiguredValue(businessInfo.registeredOffice) ? `, con sede in ${businessInfo.registeredOffice}` : ""}.
        </p>
        <h3>Oggetto</h3>
        <p>
          Le presenti condizioni disciplinano la vendita online dei prodotti a marchio{" "}
          {businessInfo.brandName}.
        </p>
        <h3>Prezzi e disponibilità</h3>
        <ul className="legal-list">
          <li>i prezzi sono indicati in euro</li>
          <li>la disponibilità può variare fino alla conferma dell’ordine</li>
          <li>gli errori manifesti di prezzo o descrizione restano correggibili</li>
        </ul>
        <h3>Pagamenti</h3>
        <p>Metodi previsti: {operationsInfo.paymentMethods.join(", ")}.</p>
        <h3>Spedizioni e consegna</h3>
        <p>
          Le spedizioni sono attualmente previste in {operationsInfo.shippingArea}. I tempi di
          evasione ordinari sono {operationsInfo.fulfillmentTime}.
        </p>
        <h3>Conclusione del contratto</h3>
        <p>
          Il contratto si considera concluso al ricevimento della conferma ordine e, quando
          applicabile, della conferma di pagamento.
        </p>
        <h3>Diritto di recesso</h3>
        <p>
          Il cliente consumatore, ove applicabile, può esercitare il diritto di recesso entro{" "}
          {operationsInfo.returnWindow}, secondo le condizioni indicate nella pagina Resi.
        </p>
        <h3>Limitazioni di responsabilità</h3>
        <p>
          Restano salve le garanzie legali applicabili al consumatore; il venditore non risponde per
          disservizi non imputabili direttamente alla propria organizzazione.
        </p>
        <h3>Contatti</h3>
        <p>
          Assistenza clienti: {businessInfo.supportEmail}
          {isConfiguredValue(businessInfo.pecEmail) ? `. PEC: ${businessInfo.pecEmail}.` : "."}
        </p>
      </div>
    </section>
  );
}
