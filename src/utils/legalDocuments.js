import { normalizeApiBase } from "./apiUrl.js";

const configuredApiBase = import.meta.env.VITE_API_BASE_URL?.trim();
const API_BASE = normalizeApiBase(configuredApiBase, import.meta.env.DEV);

function normalizeCourseTerms(data) {
  const sourceSections = data.item.sections || [];
  const sections = sourceSections.map((section, order) => ({
    heading: section.heading || section.title || "Course terms",
    body: section.body || section.content || "",
    order: Number.isSafeInteger(section.order) ? section.order : order,
  }));

  sections.push(
    {
      heading: "Before you register",
      body: "Check the programme, delivery mode, schedule and fee before paying. A payment does not mean the registration is approved. ProJenius reviews paid registrations and sends approval or rejection by email.",
      order: sections.length,
    },
    {
      heading: "Refunds and changes",
      body: "Participant cancellations, non-attendance and personal-plan changes do not ordinarily qualify for a refund after payment. Batch changes depend on availability and written approval. Rejection does not automatically issue a refund. Verified duplicate charges, ProJenius cancellations, applicable law and payment-provider decisions are handled on their individual facts.",
      order: sections.length + 1,
    },
  );

  return {
    ...data.item,
    key: "course-terms",
    title: data.item.title || "Terms & Conditions and Refund Policy",
    introduction: data.item.introduction
      || "Review the programme details, delivery mode, schedule and fees carefully before registering.",
    sections,
    lastUpdated: data.item.lastUpdated || data.item.publishedAt || null,
  };
}

export async function fetchLegalDocument(key, signal) {
  const path = key === "course-terms"
    ? "/api/courses/terms"
    : `/api/legal/${encodeURIComponent(key)}`;
  const response = await fetch(`${API_BASE}${path}`, {
    cache: "no-store",
    signal,
    headers: { Accept: "application/json" },
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "This legal document could not be loaded.");
  }

  if (
    !data.item
    || (data.item.key && data.item.key !== key)
    || !Array.isArray(data.item.sections)
  ) {
    throw new Error("The legal document response was incomplete. Please retry.");
  }

  if (key !== "course-terms" || data.item.key === key) {
    return data.item;
  }

  return normalizeCourseTerms(data);
}

export function formatLegalDate(value) {
  if (!value) return "Update date not yet recorded";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date not available";

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}
