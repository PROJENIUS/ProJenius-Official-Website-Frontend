/* =============================================================================
   CAREERS — OPEN ROLES FROM THE BACKEND
   Roles are created in Admin → Job Openings. GET /api/careers/openings lists
   the open ones; GET /api/careers/openings/:slug gives one role.
   ============================================================================= */

import { useEffect, useState } from "react";
import { normalizeApiBase, resolveApiUrl } from "../../utils/apiUrl.js";

const API = normalizeApiBase(import.meta.env.VITE_API_BASE_URL?.trim(), import.meta.env.DEV);
const url = (path) => resolveApiUrl(path, API, window.location.origin);

/** { status: "loading" | "ready" | "error", items } */
export function useOpenings() {
  const [state, setState] = useState({ status: "loading", items: [] });
  useEffect(() => {
    const controller = new AbortController();
    fetch(url("/api/careers/openings"), { signal: controller.signal, headers: { Accept: "application/json" } })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("unavailable"))))
      .then((body) => setState({ status: "ready", items: Array.isArray(body.items) ? body.items : [] }))
      .catch((error) => { if (error.name !== "AbortError") setState({ status: "error", items: [] }); });
    return () => controller.abort();
  }, []);
  return state;
}

/** { status: "loading" | "ready" | "missing" | "error", item } */
export function useOpening(slug) {
  const [state, setState] = useState({ status: "loading", item: null, slug });
  useEffect(() => {
    if (!slug) return undefined;
    const controller = new AbortController();
    fetch(url(`/api/careers/openings/${encodeURIComponent(slug)}`), { signal: controller.signal, headers: { Accept: "application/json" } })
      .then(async (response) => {
        if (response.status === 404) return setState({ status: "missing", item: null, slug });
        if (!response.ok) throw new Error("unavailable");
        const body = await response.json();
        return setState({ status: "ready", item: body.item, slug });
      })
      .catch((error) => { if (error.name !== "AbortError") setState({ status: "error", item: null, slug }); });
    return () => controller.abort();
  }, [slug]);
  return state.slug === slug ? state : { status: "loading", item: null, slug };
}

export const roleHref = (slug) => `/join-our-team/${encodeURIComponent(slug)}`;
export const applyHref = (slug) => (slug ? `/join-our-team/apply?role=${encodeURIComponent(slug)}` : "/join-our-team/apply");

export function postedLabel(date) {
  if (!date) return "";
  const days = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 86400000));
  if (days === 0) return "Posted today";
  if (days === 1) return "Posted yesterday";
  if (days < 30) return `Posted ${days} days ago`;
  return `Posted ${new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`;
}
