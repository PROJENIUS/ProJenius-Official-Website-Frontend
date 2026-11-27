/* =============================================================================
   HOME HERO — CONTENT FROM THE ADMIN PANEL
   -----------------------------------------------------------------------------
   Slides are edited in Admin → Home Hero and served by GET /api/home/hero.
   The built-in slides (heroSlides.js) show instantly and stay whenever the
   API is slow, down or has nothing saved. The last slides received are kept
   in this browser so a returning visitor sees them straight away.
   ============================================================================= */

import { normalizeApiBase, resolveApiUrl } from "../../../utils/apiUrl.js";
import { BUILTIN_HERO_IMAGES } from "./heroSlides.js";

const API = normalizeApiBase(import.meta.env.VITE_API_BASE_URL?.trim(), import.meta.env.DEV);
const CACHE_KEY = "pj-home-hero-v1";
const MIN_SLIDES = 3;
/* Same rule as the backend: a path on this site or an in-page #anchor. */
const INTERNAL_LINK = /^(\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?\/?(?:\?[a-z0-9=&_-]*)?(?:#[a-z0-9-]+)?|#[a-z0-9-]+)$/i;

const text = (value, max) => (typeof value === "string" ? value.trim().slice(0, max) : "");

function cta(value) {
  const label = text(value?.label, 40);
  const to = typeof value?.to === "string" ? value.to.trim() : "";
  return label && INTERNAL_LINK.test(to) ? { label, to } : null;
}

function imageFor(image) {
  if (image?.builtinKey) return BUILTIN_HERO_IMAGES[image.builtinKey] || "";
  if (typeof image?.url === "string" && /^\/api\/media\/[a-f\d]{24}$/i.test(image.url)) {
    return resolveApiUrl(image.url, API, window.location.origin);
  }
  return "";
}

/* API slide → the shape HomeHero renders. Anything incomplete is dropped. */
function toSlide(raw) {
  const slide = {
    id: text(raw?.key, 40),
    caption: text(raw?.caption, 60),
    eyebrow: text(raw?.eyebrow, 80),
    title: text(raw?.title, 80),
    highlight: text(raw?.highlight, 80),
    description: text(raw?.description, 300),
    alt: text(raw?.alt, 200),
    image: imageFor(raw?.image),
    primary: cta(raw?.primary),
    secondary: cta(raw?.secondary),
  };
  return slide.id && slide.title && slide.highlight && slide.image && slide.primary && slide.secondary ? slide : null;
}

function toSlides(item) {
  const slides = Array.isArray(item?.slides) ? item.slides.map(toSlide).filter(Boolean) : [];
  return slides.length >= MIN_SLIDES ? slides : null;
}

/** Slides saved from an earlier visit, or null. */
export function cachedHeroSlides() {
  try {
    const cached = JSON.parse(window.localStorage.getItem(CACHE_KEY) || "null");
    const slides = toSlides(cached);
    return slides ? { revision: cached.revision, slides } : null;
  } catch {
    return null;
  }
}

/** The live slides, or null to keep the built-in ones. */
export async function fetchHeroSlides(signal) {
  if (!API && !import.meta.env.DEV) return null;
  const response = await fetch(resolveApiUrl("/api/home/hero", API, window.location.origin), { signal, headers: { Accept: "application/json" } });
  if (!response.ok) return null;
  const body = await response.json().catch(() => null);
  const slides = toSlides(body?.item);
  try {
    if (slides) window.localStorage.setItem(CACHE_KEY, JSON.stringify(body.item));
    else window.localStorage.removeItem(CACHE_KEY);
  } catch {
    // Storage can be full or blocked; the slides still show.
  }
  return slides ? { revision: body.item.revision, slides } : null;
}
