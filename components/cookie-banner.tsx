"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { defaultConsent, readCookieConsent, writeCookieConsent } from "@/lib/cookie-consent";

export function CookieBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const existing = readCookieConsent();
    if (!existing) {
      setIsOpen(true);
      return;
    }

    setAnalytics(existing.analytics);
    setMarketing(existing.marketing);
  }, []);

  function acceptAll() {
    writeCookieConsent({
      necessary: true,
      analytics: true,
      marketing: true
    });
    setAnalytics(true);
    setMarketing(true);
    setIsOpen(false);
  }

  function rejectOptional() {
    writeCookieConsent({
      necessary: true,
      analytics: false,
      marketing: false
    });
    setAnalytics(false);
    setMarketing(false);
    setIsOpen(false);
  }

  function savePreferences() {
    writeCookieConsent({
      necessary: true,
      analytics,
      marketing
    });
    setIsOpen(false);
    setShowPreferences(false);
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="cookie-banner">
      <div className="cookie-panel">
        <p className="eyebrow">Cookie</p>
        <h3>Gestione consenso cookie</h3>
        <p>
          Utilizziamo cookie tecnici necessari al funzionamento del sito. Gli strumenti opzionali
          di analytics e marketing vengono attivati solo con il tuo consenso.
        </p>
        <p className="helper-text">
          Leggi <Link href="/privacy">Privacy</Link> e <Link href="/cookies">Cookie Policy</Link>.
        </p>

        {showPreferences ? (
          <div className="cookie-preferences">
            <label className="checkbox-field">
              <input type="checkbox" checked disabled />
              Cookie tecnici necessari
            </label>
            <label className="checkbox-field">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(event) => setAnalytics(event.target.checked)}
              />
              Analytics opzionali
            </label>
            <label className="checkbox-field">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(event) => setMarketing(event.target.checked)}
              />
              Marketing opzionale
            </label>
          </div>
        ) : null}

        <div className="cookie-actions">
          <button type="button" className="button button-light" onClick={rejectOptional}>
            Rifiuta opzionali
          </button>
          <button
            type="button"
            className="button button-light"
            onClick={() => setShowPreferences((value) => !value)}
          >
            {showPreferences ? "Chiudi preferenze" : "Personalizza"}
          </button>
          {showPreferences ? (
            <button type="button" className="button button-dark" onClick={savePreferences}>
              Salva preferenze
            </button>
          ) : (
            <button type="button" className="button button-dark" onClick={acceptAll}>
              Accetta tutto
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
