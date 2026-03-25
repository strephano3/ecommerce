import { businessInfo, operationsInfo } from "@/lib/legal";

export default function CookiesPage() {
  return (
    <section className="section narrow">
      <p className="eyebrow">Cookie</p>
      <h1>Cookie Policy</h1>
      <div className="legal-copy">
        <p>
          Questo sito utilizza cookie tecnici necessari per sessione,
          carrello locale e funzionamento del checkout. Gli strumenti opzionali devono essere
          attivati solo previo consenso.
        </p>
        <p>
          Strumenti coinvolti attualmente: {operationsInfo.cookieTools.join(", ")}.
        </p>
        <p>
          Titolare del trattamento: {businessInfo.legalEntityName}, contatto privacy{" "}
          {businessInfo.privacyContact}.
        </p>
        <ul className="legal-list">
          <li>I cookie tecnici non richiedono consenso preventivo.</li>
          <li>Analytics e marketing opzionali devono essere bloccati finché l’utente non acconsente.</li>
          <li>Le preferenze vengono salvate localmente nel browser dell’utente.</li>
        </ul>
      </div>
    </section>
  );
}
