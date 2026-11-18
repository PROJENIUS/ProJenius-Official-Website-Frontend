import { normalizeApiBase, resolveApiUrl } from "../../../utils/apiUrl.js";

/* Course API helpers shared by the course list and the course detail page. */

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
export const API = normalizeApiBase(configuredApiBaseUrl, import.meta.env.DEV);

export const apiUrl = (path) => resolveApiUrl(path, API, window.location.origin);
export const mediaUrl = (url) => resolveApiUrl(url, API, window.location.origin);

export const inr = (minor = 0) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(minor / 100);

export const api = async (path, options) => {
  if (!API) throw new Error("Course services are not configured.");
  const response = await fetch(apiUrl(`/api/courses${path}`), options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Course information is unavailable.");
  return data;
};
