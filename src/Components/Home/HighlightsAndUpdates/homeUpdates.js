import { normalizeApiBase, resolveApiUrl } from "../../../utils/apiUrl.js";
import newsImg from "../../../assets/Home/Optimized/hero-ai-event-960.webp";
import coursesImg from "../../../assets/Home/Optimized/training-courses-737.webp";
import workshopsImg from "../../../assets/Home/Optimized/training-workshops-800.webp";
import startupImg from "../../../assets/Home/Optimized/hero-recognition-960.webp";

/* =============================================================================
   HOME UPDATES DATA
   ============================================================================= */

const API = normalizeApiBase(import.meta.env.VITE_API_BASE_URL?.trim(), import.meta.env.DEV);

export const HOME_UPDATES_LIMIT = 10;

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
    ctaLabel: typeof item.ctaLabel === "string" ? item.ctaLabel.trim().slice(0, 22) : "",
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
   EXPLORE ITEMS — Shown with rich photography in the expanding cards UI
   ----------------------------------------------------------------------------- */
export const EXPLORE_FALLBACK = [
  {
    id: "explore-news",
    title: "Company Milestones & Innovation Updates",
    summary:
      "Follow ProJenius news, technology perspectives, and ecosystem keynote stories as they happen.",
    href: "/news-insights",
    cta: "Visit News & Insights",
    icon: "milestones",
    category: "Milestones",
    headline: "at ProJenius",
    image: newsImg,
    imageAlt: "ProJenius leadership at technology summit",
  },
  {
    id: "explore-courses",
    title: "Industry Technology Courses",
    summary: "Hands-on engineering curriculum in AI, Full-Stack, IoT, and embedded firmware.",
    href: "/services/courses",
    cta: "Explore Courses",
    icon: "courses",
    category: "Learning",
    headline: "in Our Courses",
    image: coursesImg,
    imageAlt: "Students learning engineering in classroom",
  },
  {
    id: "explore-workshops",
    title: "Institutional Workshops",
    summary: "Hands-on technology immersion workshops designed for universities and engineering campuses.",
    href: "/workshop",
    cta: "Explore Workshops",
    icon: "workshops",
    category: "Workshops",
    headline: "in Our Workshops",
    image: workshopsImg,
    imageAlt: "Students working together in technical workshop",
  },
  {
    id: "explore-startup",
    title: "Startup & Venture Support",
    summary: "From 0 to 1 MVP execution, rapid prototyping, and investment readiness for visionary founders.",
    href: "/startup",
    cta: "Explore Venture Hub",
    icon: "startup",
    category: "Innovation",
    headline: "in Startup Support",
    image: startupImg,
    imageAlt: "Team receiving technology recognition on stage",
  },
];
