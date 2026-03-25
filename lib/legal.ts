export const businessInfo = {
  brandName: "Touch Grass",
  website: "touchgrass.com",
  legalEntityName: "Stefano La Rosa",
  vatNumber: "LRSSFN05A09H501V",
  reaNumber: "[Da inserire quando disponibile]",
  registeredOffice: "[Da inserire quando disponibile]",
  supportEmail: "info@touchgrass.com",
  pecEmail: "[Da inserire quando disponibile]",
  replyEmail: "info@touchgrass.com",
  ownerName: "Stefano La Rosa",
  privacyContact: "privacy@touchgrass.com"
};

export function isConfiguredValue(value: string) {
  return value.length > 0 && !value.includes("[Da inserire");
}

export const operationsInfo = {
  fulfillmentTime: "1-3 giorni lavorativi dalla conferma del pagamento",
  shippingArea: "Italia",
  returnWindow: "14 giorni dal ricevimento",
  refundTiming: "entro 14 giorni dalla conferma del reso",
  paymentMethods: ["Stripe", "PayPal", "Apple Pay tramite Stripe", "Klarna tramite Stripe"],
  couriers: ["Corriere espresso selezionato in base alla destinazione e alla disponibilita del servizio"],
  analyticsTools: ["Stripe", "PayPal", "Resend"],
  cookieTools: [
    "cookie tecnici di sessione",
    "strumenti di pagamento",
    "cookie opzionali di analytics da attivare solo con consenso"
  ]
};
