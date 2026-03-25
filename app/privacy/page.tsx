import { businessInfo, isConfiguredValue, operationsInfo } from "@/lib/legal";

export default function PrivacyPage() {
  return (
    <section className="section narrow">
      <p className="eyebrow">Privacy</p>
      <h1>Informativa privacy</h1>
      <div className="legal-copy">
        <p>
          La presente informativa descrive il trattamento dei dati personali effettuato tramite il
          sito {businessInfo.brandName}, accessibile all’indirizzo {businessInfo.website}.
        </p>
        <p>
          Titolare del trattamento: {businessInfo.legalEntityName}
          {isConfiguredValue(businessInfo.registeredOffice) ? `, sede ${businessInfo.registeredOffice}` : ""}, contatto privacy {businessInfo.privacyContact}.
        </p>
        <h3>Dati trattati</h3>
        <ul className="legal-list">
          <li>dati identificativi e di contatto inseriti durante il checkout</li>
          <li>dati di spedizione e storico ordini</li>
          <li>dati tecnici necessari al funzionamento del sito e delle aree riservate</li>
          <li>dati connessi ai pagamenti gestiti da provider terzi</li>
        </ul>
        <h3>Finalità e basi giuridiche</h3>
        <ul className="legal-list">
          <li>esecuzione dell’ordine e adempimenti contrattuali</li>
          <li>obblighi fiscali, contabili e amministrativi</li>
          <li>gestione pagamenti, prevenzione frodi e assistenza clienti</li>
          <li>eventuali analytics o marketing solo previo consenso, se attivati</li>
        </ul>
        <h3>Fornitori e responsabili</h3>
        <p>
          Il sito utilizza servizi terzi tra cui {operationsInfo.analyticsTools.join(", ")}. I dati
          trattati dai provider di pagamento seguono anche le rispettive privacy policy.
        </p>
        <h3>Conservazione</h3>
        <p>
          I dati ordine e fatturazione devono essere conservati per i termini richiesti dalla legge;
          i dati non necessari vanno minimizzati e cancellati secondo policy interne da definire.
        </p>
        <h3>Diritti interessato</h3>
        <p>
          L’interessato può chiedere accesso, rettifica, cancellazione, limitazione, opposizione e
          portabilità, scrivendo a {businessInfo.privacyContact}.
        </p>
      </div>
    </section>
  );
}
