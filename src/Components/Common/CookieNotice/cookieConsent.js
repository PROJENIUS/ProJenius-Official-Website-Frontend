/* Cookie consent: the visitor's choice, and Google Analytics loading only
   after "Accept". GA4 property "ProJenius Website" (account ProJenius
   Innovation Technology Private Limited). VITE_GA_MEASUREMENT_ID on Vercel
   overrides the ID. Only the built (live) site reports: local development and
   the admin's hero preview pages never send visits. */

const KEY = "pj-cookie-consent";
const DEFAULT_GA_ID = "G-JWVBED9Q01";
export const GA_ID = import.meta.env.PROD
  ? (import.meta.env.VITE_GA_MEASUREMENT_ID || DEFAULT_GA_ID).trim()
  : "";
export const OPEN_EVENT = "pj:open-cookie-settings";

const untracked = (path) => path.startsWith("/hero-preview/");

export function readConsent() {
  try { return localStorage.getItem(KEY); } catch { return null; }
}

export function saveConsent(value) {
  try { localStorage.setItem(KEY, value); } catch { /* private mode: ask again next visit */ }
  if (value === "analytics") {
    setDisabled(false);
    loadAnalytics();
  } else {
    setDisabled(true);
  }
}

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

/* Google's switch for stopping a loaded tag when consent is withdrawn. */
function setDisabled(disabled) {
  if (GA_ID && typeof window !== "undefined") window[`ga-disable-${GA_ID}`] = disabled;
}

/* Page views: when the tag starts, Google counts the page it starts on (also
   on the page where the visitor clicks Accept). After that the website is a
   single-page app, so each later page change is sent here — and the GA
   stream's "page changes based on browser history events" is switched off,
   so nothing is counted twice. */
let loaded = false;
let lastPath = "";
export function loadAnalytics() {
  if (loaded || !/^G-[A-Z0-9]{4,}$/.test(GA_ID) || typeof document === "undefined") return;
  if (untracked(window.location.pathname)) return;
  loaded = true;
  lastPath = window.location.pathname;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { anonymize_ip: true });
}

export function trackPageView(path) {
  if (!loaded || typeof window.gtag !== "function" || untracked(path) || path === lastPath) return;
  lastPath = path;
  window.gtag("event", "page_view", { page_location: window.location.href, page_title: document.title });
}
