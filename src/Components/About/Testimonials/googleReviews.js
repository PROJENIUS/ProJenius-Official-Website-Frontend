import { normalizeApiBase, resolveApiUrl } from "../../../utils/apiUrl.js";

/* Google credentials stay on the backend. The public API returns a normalized,
 * paginated Google Business Profile review collection at GET /api/reviews. */
export const GOOGLE_REVIEWS_URL = "https://g.page/r/CZjzujTb9EXCEBM/review";
export const GOOGLE_PROFILE_URL = "https://www.google.com/maps/place/data=!4m2!3m1!1s0x3b00cfb5c8f13bb3:0xc245f4db34baf398";

const API = normalizeApiBase(import.meta.env.VITE_API_BASE_URL?.trim(), import.meta.env.DEV);
export const GOOGLE_REVIEWS_API_CONFIGURED = Boolean(API);
const dateFormatter = new Intl.DateTimeFormat("en-IN", { month: "short", year: "numeric" });
const STAR_RATINGS = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

function safeHttpsUrl(value) {
  if (typeof value !== "string") return "";
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : "";
  } catch {
    return "";
  }
}

function formatDate(value) {
  if (!value) return "";
  const numeric = Number(value);
  const date = typeof value === "number" || (Number.isFinite(numeric) && numeric > 0)
    ? new Date(numeric < 1e12 ? numeric * 1000 : numeric)
    : new Date(value);
  return Number.isNaN(date.getTime()) ? "" : dateFormatter.format(date);
}

function normalizeReview(item, index) {
  const rawText = item?.text ?? item?.review ?? item?.comment ?? "";
  const text = String(typeof rawText === "object" ? rawText?.text ?? "" : rawText).trim();
  const reviewer = item?.reviewer ?? item?.authorAttribution ?? item?.author_attribution ?? {};
  const name = String(
    item?.author_name ?? item?.name ?? reviewer.displayName ?? reviewer.display_name ?? "Google user"
  ).trim();
  const rating = Math.max(0, Math.min(5, Math.round(Number(item?.rating ?? STAR_RATINGS[item?.starRating]) || 0)));
  if (!rating) return null;

  const photo = item?.profile_photo_url ?? item?.profilePhotoUrl ?? reviewer.profilePhotoUrl ??
    reviewer.photoUri ?? reviewer.photo_uri ?? item?.author_photo_url ?? "";
  const date = formatDate(item?.date) || item?.relative_time_description || formatDate(item?.time ? Number(item.time) * 1000 : item?.publishTime ?? item?.createTime);
  const reviewUrl = safeHttpsUrl(item?.reviewUrl ?? item?.url ?? item?.review_url);

  return {
    id: String(item?.id ?? item?.reviewId ?? item?.name ?? `${name}-${index}`),
    name,
    rating,
    text,
    date,
    profilePhotoUrl: safeHttpsUrl(photo),
    reviewUrl,
  };
}

export async function fetchGoogleReviews(signal) {
  if (!API) throw new Error("Reviews API is not configured.");
  const response = await fetch(resolveApiUrl("/api/reviews", API, window.location.origin), {
    headers: { Accept: "application/json" },
    cache: "no-store",
    signal,
  });
  if (!response.ok) throw new Error(`Reviews request failed (${response.status}).`);

  const body = await response.json().catch(() => null);
  if (!body || !Array.isArray(body.reviews)) throw new Error("Unexpected reviews response.");
  const reviews = body.reviews.map(normalizeReview).filter(Boolean);
  const rating = Number(body.rating ?? body.averageRating);
  const totalReviews = Number(body.totalReviews ?? body.totalReviewCount);

  return {
    status: reviews.length ? "live" : "empty",
    rating: Number.isFinite(rating) && rating > 0 ? rating : null,
    totalReviews: Number.isFinite(totalReviews) && totalReviews > 0 ? totalReviews : reviews.length,
    url: safeHttpsUrl(body.url) || GOOGLE_REVIEWS_URL,
    reviews,
    lastSyncedAt: formatDate(body.lastSyncedAt),
  };
}
