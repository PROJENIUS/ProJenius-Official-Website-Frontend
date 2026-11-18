const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);
export const DEFAULT_API_BASE_URL = "https://projenius-official-website-backend.onrender.com";

export function normalizeApiBase(configuredBase, development = false) {
  const configured = String(configuredBase || "").trim();
  const candidate = configured || (development ? "http://localhost:5000" : DEFAULT_API_BASE_URL);
  if (!candidate) return "";

  try {
    const url = new URL(candidate);
    if (!["http:", "https:"].includes(url.protocol)) return "";
    if (!development && LOCAL_HOSTS.has(url.hostname.toLowerCase())) return "";
    url.pathname = url.pathname.replace(/\/+$/, "").replace(/\/api$/i, "");
    url.search = "";
    url.hash = "";
    return url.origin + (url.pathname === "/" ? "" : url.pathname);
  } catch {
    return "";
  }
}

export function resolveApiUrl(reference, apiBase = "", currentOrigin = "") {
  const value = String(reference || "").trim();
  if (!value) return "";

  try {
    const absolute = new URL(value);
    if (!["http:", "https:"].includes(absolute.protocol) || absolute.username || absolute.password) return "";
    if (!LOCAL_HOSTS.has(absolute.hostname.toLowerCase())) return absolute.href;
    const fallback = apiBase || currentOrigin;
    if (!fallback) return `${absolute.pathname}${absolute.search}${absolute.hash}`;
    return new URL(`${absolute.pathname}${absolute.search}${absolute.hash}`, `${fallback.replace(/\/+$/, "")}/`).href;
  } catch {
    // Relative references are expected for stored article/course asset paths.
  }

  const path = value.startsWith("/") ? value : `/${value}`;
  const base = apiBase || currentOrigin;
  if (!base) return path;
  try {
    return new URL(path, `${base.replace(/\/+$/, "")}/`).href;
  } catch {
    return path;
  }
}
