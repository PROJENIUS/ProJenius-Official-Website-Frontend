/* =============================================================================
   PAGE HEROES — content from Admin → Page Heroes
   -----------------------------------------------------------------------------
   usePageHero(key, defaults) returns the hero content to render: the built-in
   `defaults` (kept in each hero component) with any saved admin values on top.
   Field names match projenius-backend src/modules/pageheroes/pageHero.schemas.js.

   • Saved content: GET /api/page-heroes/:key, remembered in this browser so a
     returning visitor sees it at once. Nothing saved / API down → defaults.
   • Admin preview (/hero-preview/:key): the admin panel sends its unsaved
     draft, which is shown instead (see HeroPreviewPage.jsx).
   Images: { source: "default" } keeps the built-in photo; an upload arrives
   as { url }. Anything unexpected falls back to the default, so a bad value
   can never break the page.
   ============================================================================= */

import { createContext, useContext, useEffect, useState } from "react";
import { normalizeApiBase, resolveApiUrl } from "../utils/apiUrl.js";

const API = normalizeApiBase(import.meta.env.VITE_API_BASE_URL?.trim(), import.meta.env.DEV);
const INTERNAL_LINK = /^(\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?\/?(?:\?[a-z0-9=&_-]*)?(?:#[a-z0-9-]+)?|#[a-z0-9-]+)$/i;
const MEDIA_URL = /^\/api\/media\/[a-f\d]{24}$/i;
const cacheKey = (key) => `pj-page-hero-v1:${key}`;

/** Set by the preview page: { key, values } of the admin's draft. */
export const PageHeroPreviewContext = createContext(null);

function imageFrom(value, fallback) {
  if (typeof value?.previewUrl === "string" && /^blob:/.test(value.previewUrl)) return value.previewUrl;
  if (typeof value?.url === "string") {
    if (MEDIA_URL.test(value.url)) return resolveApiUrl(value.url, API, window.location.origin);
    if (/^blob:/.test(value.url)) return value.url;
  }
  return fallback;
}

/* Saved value on top of the default, matching the default's shape. */
function mergeValue(fallback, value, isImage) {
  if (isImage) return imageFrom(value, fallback);
  if (typeof fallback === "string") return typeof value === "string" ? value : fallback;
  if (Array.isArray(fallback)) {
    if (!Array.isArray(value)) return fallback;
    if (fallback.length && typeof fallback[0] === "object") {
      return value.length === fallback.length ? value.map((item, index) => mergeObject(fallback[index], item)) : fallback;
    }
    return value.every((item) => typeof item === "string") && value.length ? value : fallback;
  }
  if (fallback && typeof fallback === "object" && "label" in fallback && "to" in fallback) {
    return typeof value?.label === "string" && INTERNAL_LINK.test(String(value?.to || "")) ? { label: value.label, to: value.to } : fallback;
  }
  return fallback;
}

/* An image field is any default whose name is "image", "photo…", "backdrop" or
   "screen…" and holds a URL string. */
export const isImageField = (name, fallback) => typeof fallback === "string" && /^(image|photo\d?|backdrop|screen\d)$/.test(name);

export function mergeObject(defaults, values) {
  if (!values || typeof values !== "object") return defaults;
  const out = {};
  for (const [name, fallback] of Object.entries(defaults)) out[name] = mergeValue(fallback, values[name], isImageField(name, fallback));
  return out;
}

function readCache(key) {
  try { return JSON.parse(window.localStorage.getItem(cacheKey(key)) || "null"); } catch { return null; }
}

function writeCache(key, item) {
  try {
    if (item) window.localStorage.setItem(cacheKey(key), JSON.stringify(item));
    else window.localStorage.removeItem(cacheKey(key));
  } catch {
    // Storage full or blocked: the content still shows.
  }
}

export default function usePageHero(key, defaults) {
  const preview = useContext(PageHeroPreviewContext);
  const [saved, setSaved] = useState(() => (preview ? null : readCache(key)));

  useEffect(() => {
    if (preview) return undefined;
    const controller = new AbortController();
    fetch(resolveApiUrl(`/api/page-heroes/${encodeURIComponent(key)}`, API, window.location.origin), { signal: controller.signal, headers: { Accept: "application/json" } })
      .then((response) => (response.ok ? response.json() : null))
      .then((body) => {
        if (!body) return;
        const item = body.item && typeof body.item.values === "object" ? body.item : null;
        writeCache(key, item);
        setSaved((current) => (current?.revision === item?.revision ? current : item));
      })
      .catch(() => {});
    return () => controller.abort();
  }, [key, preview]);

  if (preview?.key === key) return mergeObject(defaults, preview.values);
  return mergeObject(defaults, saved?.values);
}
