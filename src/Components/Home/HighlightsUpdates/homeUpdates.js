import { normalizeApiBase, resolveApiUrl } from "../../../utils/apiUrl.js";

/* =============================================================================
   HOME UPDATES DATA
   -----------------------------------------------------------------------------
   Reads the latest published items from the existing News & Insights API
   (GET /api/news), which the Admin Dashboard publishing workflow already
   feeds. API base and asset handling mirror NewsInsightsContent.jsx so both
   surfaces resolve URLs identically.
   ============================================================================= */

const API = normalizeApiBase(import.meta.env.VITE_API_BASE_URL?.trim(), import.meta.env.DEV);

export const HOME_UPDATES_LIMIT = 4;

const apiUrl = (path) => resolveApiUrl(path, API, window.location.origin);

function assetUrl(reference) {
  const value = String(reference || "");
  const path = /^https?:\/\//i.test(value) || value.startsWith("/")
    ? value
    : `/api/news/assets/${encodeURIComponent(value)}`;
  return apiUrl(path);
}

function normalizeItem(item) {
  const imageReference = item.thumbnailUrl || item.thumbnailFilename;
  const imageAlt = item.images?.find((image) => image.filename === item.thumbnailFilename)?.alt || "";

  return {
    id: `${item.contentType}-${item._id || item.slug}`,
    title: item.title,
    summary: item.summary || "",
    category: item.category || (item.contentType === "blog" ? "Insight" : "News"),
    publishedAt: item.publishedAt || null,
    href: `/news-insights/${item.contentType}/${encodeURIComponent(item.slug)}`,
    image: imageReference ? assetUrl(imageReference) : "",
    imageAlt,
  };
}

export async function fetchHomeUpdates(signal) {
  const query = new URLSearchParams({ page: "1", limit: String(HOME_UPDATES_LIMIT) });
  const response = await fetch(`${apiUrl("/api/news")}?${query}`, {
    signal,
    headers: { Accept: "application/json" },
  });
  const body = await response.json().catch(() => null);

  if (!response.ok || !body || !Array.isArray(body.items)) {
    throw new Error("Updates are unavailable.");
  }

  return body.items
    .filter((item) => item?.title && item?.slug && ["news", "blog"].includes(item.contentType))
    .slice(0, HOME_UPDATES_LIMIT)
    .map(normalizeItem);
}

export function formatUpdateDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

/* -----------------------------------------------------------------------------
   TEMPORARY FALLBACK — shown only when no published update can be loaded.
   These are links to existing pages, labelled "Explore"; they are not news,
   achievements or offers, and must never be presented as such. Remove once
   the publishing workflow is consistently populated.
   ----------------------------------------------------------------------------- */
export const EXPLORE_FALLBACK = [
  {
    id: "explore-news",
    title: "Company Milestones, Project Stories and Innovation Updates",
    summary:
      "Follow ProJenius news, technology perspectives and project stories as they are published.",
    href: "/news-insights",
    cta: "Visit News & Insights",
    icon: "news",
  },
  {
    id: "explore-courses",
    title: "Explore Current Courses",
    summary: "Browse the practical technology courses currently open for registration.",
    href: "/services/courses",
    cta: "View courses",
    icon: "courses",
  },
  {
    id: "explore-workshops",
    title: "Workshops for Institutions",
    summary: "Hands-on technology workshops designed around your campus and students.",
    href: "/workshop",
    cta: "View workshops",
    icon: "workshops",
  },
  {
    id: "explore-startup",
    title: "Startup & Innovation Support",
    summary: "Support for founders and student innovators taking an idea toward a working product.",
    href: "/startup",
    cta: "View startup support",
    icon: "startup",
  },
];
