"use client";

export type CookieConsent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

export const COOKIE_CONSENT_KEY = "touch-grass-cookie-consent";

export const defaultConsent: CookieConsent = {
  necessary: true,
  analytics: false,
  marketing: false,
  updatedAt: ""
};

export function readCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(COOKIE_CONSENT_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as CookieConsent;
  } catch {
    return null;
  }
}

export function writeCookieConsent(consent: Omit<CookieConsent, "updatedAt">) {
  if (typeof window === "undefined") {
    return;
  }

  const value: CookieConsent = {
    ...consent,
    updatedAt: new Date().toISOString()
  };

  window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("cookie-consent-updated", { detail: value }));
}
