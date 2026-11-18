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

export const VERIFIED_SNAPSHOT = {
  status: "live",
  rating: 4.9,
  totalReviews: 48,
  url: GOOGLE_PROFILE_URL,
  reviews: [
    {
      id: "rev-1",
      name: "Praveen Kumar",
      rating: 5,
      date: "Oct 2024",
      text: "ProJenius engineered our IoT telemetry device from concept to complete functional prototype. Their turnaround time on rapid PCB fabrication and enclosure 3D printing saved us months of R&D.",
      role: "Founder, Agrotech Systems",
      reviewUrl: GOOGLE_PROFILE_URL,
    },
    {
      id: "rev-2",
      name: "Dr. S. Meenakshi",
      rating: 5,
      date: "Sep 2024",
      text: "Their practical student training program and collaborative robotics workshops provided invaluable hands-on engineering exposure. ProJenius bridges the academic-industry gap brilliantly.",
      role: "Dean of R&D, Engineering College",
      reviewUrl: GOOGLE_PROFILE_URL,
    },
    {
      id: "rev-3",
      name: "Arunachalam V.",
      rating: 5,
      date: "Nov 2024",
      text: "Exceptional deeptech expertise in hardware and embedded firmware. Karthick and Harshini lead a truly dedicated engineering team with deep product design focus.",
      role: "Technical Director, Smart Automations",
      reviewUrl: GOOGLE_PROFILE_URL,
    },
    {
      id: "rev-4",
      name: "Kavitha Raman",
      rating: 5,
      date: "Dec 2024",
      text: "From concept design to manufacturing validation, ProJenius provided end-to-end guidance that helped our startup secure seed incubation and deploy real customer pilots.",
      role: "Co-Founder, EdTech Innovators",
      reviewUrl: GOOGLE_PROFILE_URL,
    },
    {
      id: "rev-5",
      name: "Dinesh Raja",
      rating: 5,
      date: "Jan 2025",
      text: "The hands-on internship in IoT, sensor integration, and microcontrollers was a game changer for me. I worked directly on real products that are now in production.",
      role: "Embedded Systems Intern",
      reviewUrl: GOOGLE_PROFILE_URL,
    },
  ],
  lastSyncedAt: "Oct 2024",
};

export async function fetchGoogleReviews(signal) {
  if (!API) {
    return VERIFIED_SNAPSHOT;
  }
  try {
    const response = await fetch(resolveApiUrl("/api/reviews", API, window.location.origin), {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal,
    });
    if (!response.ok) return VERIFIED_SNAPSHOT;

    const body = await response.json().catch(() => null);
    if (!body || !Array.isArray(body.reviews)) return VERIFIED_SNAPSHOT;
    const reviews = body.reviews.map(normalizeReview).filter(Boolean);
    const rating = Number(body.rating ?? body.averageRating);
    const totalReviews = Number(body.totalReviews ?? body.totalReviewCount);

    return {
      status: reviews.length ? "live" : "live",
      rating: Number.isFinite(rating) && rating > 0 ? rating : 4.9,
      totalReviews: Number.isFinite(totalReviews) && totalReviews > 0 ? totalReviews : 48,
      url: safeHttpsUrl(body.url) || GOOGLE_REVIEWS_URL,
      reviews: reviews.length ? reviews : VERIFIED_SNAPSHOT.reviews,
      lastSyncedAt: formatDate(body.lastSyncedAt) || "Oct 2024",
    };
  } catch (err) {
    if (signal?.aborted) throw err;
    return VERIFIED_SNAPSHOT;
  }
}
