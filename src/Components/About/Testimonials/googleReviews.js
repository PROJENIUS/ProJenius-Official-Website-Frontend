import { normalizeApiBase, resolveApiUrl } from "../../../utils/apiUrl.js";
import { GOOGLE_RATING, GOOGLE_REVIEW_COUNT } from "../../../utils/googleRating.js";

/* Live Google reviews. The backend (projenius-backend src/modules/googleReviews)
 * reads every review from the Google Business Profile API and refreshes every
 * 5 minutes, so a new review appears on its own; Google credentials stay on
 * the backend. GET /api/reviews returns { rating, totalReviews, url, reviews }. */
export const GOOGLE_REVIEWS_URL = "https://g.page/r/CZjzujTb9EXCEBM/review";
export const GOOGLE_PROFILE_URL = "https://www.google.com/maps/place/data=!4m2!3m1!1s0x3b00cfb5c8f13bb3:0xc245f4db34baf398";

const API = normalizeApiBase(import.meta.env.VITE_API_BASE_URL?.trim(), import.meta.env.DEV);
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

/* An ISO date, or a timestamp in seconds or milliseconds → Date, or null. */
function toDate(value) {
  if (!value) return null;
  const numeric = Number(value);
  const date = Number.isFinite(numeric) && numeric > 0
    ? new Date(numeric < 1e12 ? numeric * 1000 : numeric)
    : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
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
  const when = toDate(item?.date ?? item?.publishTime ?? item?.createTime ?? item?.time);
  const date = when ? dateFormatter.format(when) : item?.relative_time_description || "";
  const time = when ? when.getTime() : 0;
  const reviewUrl = safeHttpsUrl(item?.reviewUrl ?? item?.url ?? item?.review_url);

  return {
    id: String(item?.id ?? item?.reviewId ?? item?.name ?? `${name}-${index}`),
    name,
    rating,
    text,
    date,
    time,
    profilePhotoUrl: safeHttpsUrl(photo),
    reviewUrl,
  };
}

/* Shown until Google answers, and whenever it cannot: the rating from
   utils/googleRating.js and no review cards. Reviews are never made up. */
export const REVIEWS_FALLBACK = {
  status: "unavailable",
  rating: Number(GOOGLE_RATING),
  totalReviews: Number(GOOGLE_REVIEW_COUNT),
  url: GOOGLE_REVIEWS_URL,
  reviews: [],
};

/* The last reviews Google returned, kept in this browser so a returning
   visitor sees them at once (the free backend can take a minute to wake). */
const CACHE_KEY = "pj-google-reviews-v1";

export function readCachedReviews() {
  try {
    const cached = JSON.parse(window.localStorage.getItem(CACHE_KEY) || "null");
    return cached && Array.isArray(cached.reviews) ? cached : REVIEWS_FALLBACK;
  } catch {
    return REVIEWS_FALLBACK;
  }
}

function writeCachedReviews(value) {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(value));
  } catch {
    // Storage full or blocked: the reviews still show.
  }
}

/* All reviews with written text, newest first. Star-only reviews still count
   in the rating and total. */
export async function fetchGoogleReviews(signal) {
  if (!API) return readCachedReviews();
  try {
    const response = await fetch(resolveApiUrl("/api/reviews", API, window.location.origin), {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal,
    });
    if (!response.ok) return readCachedReviews();

    const body = await response.json().catch(() => null);
    if (!body || !Array.isArray(body.reviews)) return readCachedReviews();
    const reviews = body.reviews
      .map(normalizeReview)
      .filter((review) => review && review.text)
      .sort((a, b) => (b.time || 0) - (a.time || 0));
    const rating = Number(body.rating ?? body.averageRating);
    const totalReviews = Number(body.totalReviews ?? body.totalReviewCount);

    const result = {
      status: "live",
      rating: Number.isFinite(rating) && rating > 0 ? rating : REVIEWS_FALLBACK.rating,
      totalReviews: Number.isFinite(totalReviews) && totalReviews > 0 ? totalReviews : REVIEWS_FALLBACK.totalReviews,
      url: safeHttpsUrl(body.url) || GOOGLE_REVIEWS_URL,
      reviews,
    };
    writeCachedReviews(result);
    return result;
  } catch (err) {
    if (signal?.aborted) throw err;
    return readCachedReviews();
  }
}
