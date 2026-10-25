import { normalizeApiBase, resolveApiUrl } from "./apiUrl.js";

/* =============================================================================
   Public enquiry submission — POST /api/contact/enquiries
   -----------------------------------------------------------------------------
   The backend expects multipart form data with one field, "payload", holding
   the JSON enquiry (see projenius-backend enquiry.validation.js). Errors come
   back as { error: "..." }; success as { success, message, data }.
   ============================================================================= */

const API_BASE = normalizeApiBase(import.meta.env.VITE_API_BASE_URL?.trim(), import.meta.env.DEV);

export const ENQUIRY_UNAVAILABLE_MESSAGE =
  "Online submission is temporarily unavailable. Please contact us by phone or WhatsApp instead.";

/* Same phone rule the API applies: Indian mobile or +international. */
export function isValidPhone(value) {
  const cleaned = String(value || "").replace(/[\s().-]/g, "");
  return /^(?:\+91|91|0)?[6-9]\d{9}$/.test(cleaned) || /^\+\d{7,15}$/.test(cleaned);
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value || "").trim());
}

export function countWords(value) {
  return String(value || "").trim().split(/\s+/).filter(Boolean).length;
}

function findReferenceId(body) {
  const candidates = [body?.data?.referenceId, body?.data?.reference, body?.data?.id, body?.data?._id, body?.referenceId, body?.id];
  const found = candidates.find((value) => typeof value === "string" && value.trim());
  return found ? found.trim() : "";
}

/* Resolves to { referenceId } on success; throws an Error whose message is
   safe to show to the visitor otherwise. */
export async function submitEnquiry(payload) {
  if (!API_BASE) throw new Error(ENQUIRY_UNAVAILABLE_MESSAGE);

  const body = new FormData();
  body.append("payload", JSON.stringify({ ...payload, timestamp: new Date().toISOString() }));

  let response;
  try {
    response = await fetch(resolveApiUrl("/api/contact/enquiries", API_BASE, window.location.origin), { method: "POST", body });
  } catch {
    throw new Error("We could not connect right now. Please try again in a moment.");
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      typeof data?.error === "string" && data.error.trim()
        ? data.error
        : "We could not send your submission. Please check your details and try again."
    );
  }
  return { referenceId: findReferenceId(data) };
}
