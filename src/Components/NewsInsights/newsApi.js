import { normalizeApiBase, resolveApiUrl } from "../../utils/apiUrl.js";

/* =============================================================================
   NEWS & INSIGHTS — API helpers and shared formatting
   Backend: GET /api/news (all), /api/news/:type (news | blog),
            /api/news/:type/:slug, /api/news/categories
   "blog" articles are shown to visitors as "Insights".
   ============================================================================= */

const API = normalizeApiBase(import.meta.env.VITE_API_BASE_URL?.trim(), import.meta.env.DEV);

export const apiUrl = (path) => resolveApiUrl(path, API, window.location.origin);

export const TYPE_LABEL = { news: "News", blog: "Insights" };

export const articleHref = (item) => `/news-insights/${item.contentType}/${encodeURIComponent(item.slug)}`;

export function assetUrl(reference) {
  const value = String(reference || "");
  if (!value) return "";
  const path = /^https?:\/\//i.test(value) || value.startsWith("/") ? value : `/api/news/assets/${encodeURIComponent(value)}`;
  return apiUrl(path);
}

export const coverOf = (item) => item?.thumbnailUrl || item?.thumbnailFilename || "";

export const coverAlt = (item) =>
  item?.images?.find((img) => img.filename === item.thumbnailFilename)?.alt || item?.title || "";

export function formatDate(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/* Minutes to read the body (200 words a minute); falls back to the summary. */
export function readMinutes(item) {
  const text = `${item?.body || item?.summary || ""}`;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export async function getJson(path) {
  if (!API) throw new Error("News service is not configured.");
  const response = await fetch(apiUrl(path));
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "Articles are unavailable.");
  return body;
}

/* -----------------------------------------------------------------------------
   PREVIEW ARTICLES — shown only while developing (npm run dev) when the
   backend is not running, so the layout can be checked. They are never shown
   on the live site: there, an empty or unavailable list shows a clear message.
   ----------------------------------------------------------------------------- */
const day = 86400000;
export const PREVIEW_ARTICLES = import.meta.env.DEV
  ? [
      {
        _id: "preview-1",
        contentType: "news",
        slug: "preview-sample-news-story",
        category: "Company News",
        title: "Sample news story: this is how a news article appears",
        summary: "Preview only. Publish a news article from the admin panel and it replaces this sample automatically.",
        body: "This is preview text used while developing the page.\n\n## A section heading\nParagraphs are separated by a blank line.\n\n- List items start with a dash\n- Another list item\n\n> A line starting with > becomes a quote.\n\nThe article ends here.",
        publishedAt: new Date(Date.now() - day).toISOString(),
        author: { name: "ProJenius Team", role: "Editorial" },
        tags: ["Preview", "Layout"],
      },
      {
        _id: "preview-2",
        contentType: "blog",
        slug: "preview-sample-insight",
        category: "Engineering",
        title: "Sample insight article: how an insight card looks",
        summary: "Preview only. Insights are the blog articles published from the admin panel.",
        body: "Preview text for an insight article.\n\n## Why it matters\nA short paragraph of sample text.",
        publishedAt: new Date(Date.now() - day * 4).toISOString(),
        author: { name: "ProJenius Team" },
      },
      {
        _id: "preview-3",
        contentType: "news",
        slug: "preview-sample-update",
        category: "Events",
        title: "Sample update: a third card to fill the grid",
        summary: "Preview only. This sample shows how dates, topics and the read link line up.",
        body: "Preview text.",
        publishedAt: new Date(Date.now() - day * 9).toISOString(),
        author: { name: "ProJenius Team" },
      },
      {
        _id: "preview-4",
        contentType: "blog",
        slug: "preview-sample-guide",
        category: "Engineering",
        title: "Sample guide: a longer title to check how two lines wrap on the card",
        summary: "Preview only. Long titles are trimmed to two lines and summaries to three.",
        body: "Preview text.",
        publishedAt: new Date(Date.now() - day * 15).toISOString(),
        author: { name: "ProJenius Team" },
      },
    ]
  : [];
