/* Cookie consent: the visitor's choice, and Google Analytics loading only
   after "Accept analytics". Set VITE_GA_MEASUREMENT_ID (e.g. G-XXXXXXX) on
   Vercel to turn analytics on; without it no analytics code is ever loaded. */

const KEY = "pj-cookie-consent";
export const GA_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID || "").trim();
export const OPEN_EVENT = "pj:open-cookie-settings";

export function readConsent() {
  try { return localStorage.getItem(KEY); } catch { return null; }
}

export function saveConsent(value) {
  try { localStorage.setItem(KEY, value); } catch { /* private mode: ask again next visit */ }
  if (value === "analytics") loadAnalytics();
}

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

let loaded = false;
export function loadAnalytics() {
  if (loaded || !/^G-[A-Z0-9]{4,}$/.test(GA_ID) || typeof document === "undefined") return;
  loaded = true;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { anonymize_ip: true, send_page_view: false });
}

export function trackPageView(path) {
  if (loaded && typeof window.gtag === "function") window.gtag("event", "page_view", { page_path: path, page_location: window.location.href, page_title: document.title });
}
