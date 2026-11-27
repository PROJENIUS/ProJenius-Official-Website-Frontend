/* =============================================================================
   HERO PREVIEW — /hero-preview/:key
   -----------------------------------------------------------------------------
   Shown only inside the admin panel (Admin → Page Heroes). It renders the real
   page and replaces its hero content with the admin's unsaved draft, sent by
   window.postMessage. Messages are accepted only from the admin site's origin;
   on Vercel the page may be framed only by that origin (vercel.json) and it is
   kept out of search results.

   Messages from the admin (parent window):
     { type: "pj-hero-draft", key, values, images: { [mediaId]: Blob } }
   Messages to the admin:
     { type: "pj-hero-preview-ready", key, defaults }  built-in content, with
       each image as its full URL, so the admin form can start from it
   ============================================================================= */

import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { isImageField, PageHeroPreviewContext } from "./usePageHero.js";
import { HERO_DEFAULTS } from "./heroDefaults.js";

const PAGES = {
  about: lazy(() => import("../Pages/About/AboutPage.jsx")),
  "software-development": lazy(() => import("../Pages/Solutions/SoftwareDevelopment/SoftwareDevelopmentPage.jsx")),
  "pcb-design-fabrication": lazy(() => import("../Pages/Solutions/PCBDesignFabrication/PCBDesignFabricationPage.jsx")),
  courses: lazy(() => import("../Pages/Learning/Courses/CoursesPage.jsx")),
  "career-guidance": lazy(() => import("../Pages/Learning/CareerGuidance/CareerGuidancePage.jsx")),
  workshops: lazy(() => import("../Pages/Learning/Workshops/WorkshopsPage.jsx")),
  products: lazy(() => import("../Pages/Products/ProductsPage.jsx")),
  "news-insights": lazy(() => import("../Pages/NewsInsights/NewsInsightsPage.jsx")),
  "join-our-team": lazy(() => import("../Pages/JoinOurTeam/JoinOurTeamPage.jsx")),
};

const DEFAULT_ADMIN_ORIGIN = "https://pro-jenius-admin-website-frontend.vercel.app";
const ADMIN_ORIGINS = new Set([
  (import.meta.env.VITE_ADMIN_ORIGIN || DEFAULT_ADMIN_ORIGIN).replace(/\/+$/, ""),
  ...(import.meta.env.DEV ? ["http://localhost:5174", "http://localhost:5175"] : []),
]);

/* Replace each uploaded draft image with a local object URL for its Blob. */
function withPreviewImages(value, urls) {
  if (Array.isArray(value)) return value.map((item) => withPreviewImages(item, urls));
  if (!value || typeof value !== "object") return value;
  if (value.source === "upload" && urls[value.mediaId]) return { previewUrl: urls[value.mediaId] };
  return Object.fromEntries(Object.entries(value).map(([name, item]) => [name, withPreviewImages(item, urls)]));
}

/* Built-in content in plain JSON, image paths made absolute for the admin. */
function serializeDefaults(value, name = "") {
  if (Array.isArray(value)) return value.map((item) => serializeDefaults(item));
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([field, item]) => [field, serializeDefaults(item, field)]));
  if (isImageField(name, value)) return new URL(value, window.location.href).href;
  return value;
}

export default function HeroPreviewPage() {
  const { key } = useParams();
  const Page = PAGES[key];
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    // The cookie notice would cover the hero in the admin preview; this page
    // is never shown to visitors, so it is hidden here only.
    const style = document.createElement("style");
    style.textContent = '[class*="pj-cookie"]{display:none!important}';
    document.head.appendChild(style);
    return () => { meta.remove(); style.remove(); };
  }, []);

  useEffect(() => {
    if (!Page || window.parent === window) return undefined;
    let urls = {};
    const onMessage = (event) => {
      if (!ADMIN_ORIGINS.has(event.origin) || event.source !== window.parent) return;
      const data = event.data;
      if (!data || data.type !== "pj-hero-draft" || data.key !== key || typeof data.values !== "object") return;
      const next = {};
      for (const [mediaId, blob] of Object.entries(data.images || {})) {
        if (/^[a-f\d]{24}$/i.test(mediaId) && blob instanceof Blob && blob.type === "image/webp") next[mediaId] = urls[mediaId] || URL.createObjectURL(blob);
      }
      for (const [mediaId, url] of Object.entries(urls)) if (!next[mediaId]) URL.revokeObjectURL(url);
      urls = next;
      setDraft({ key, values: withPreviewImages(data.values, urls) });
    };
    window.addEventListener("message", onMessage);
    const defaults = serializeDefaults(HERO_DEFAULTS[key]);
    for (const origin of ADMIN_ORIGINS) window.parent.postMessage({ type: "pj-hero-preview-ready", key, defaults }, origin);
    return () => {
      window.removeEventListener("message", onMessage);
      for (const url of Object.values(urls)) URL.revokeObjectURL(url);
    };
  }, [Page, key]);

  const value = useMemo(() => draft || { key, values: null }, [draft, key]);
  if (!Page) return <p style={{ padding: 40 }}>This page has no editable hero.</p>;
  return (
    <PageHeroPreviewContext.Provider value={value}>
      <Suspense fallback={null}>
        <Page />
      </Suspense>
    </PageHeroPreviewContext.Provider>
  );
}
