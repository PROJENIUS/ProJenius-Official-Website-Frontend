import { useEffect, useState } from "react";
import "./CourseTerms.css";

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const API = (configuredApiBaseUrl || (import.meta.env.DEV ? "http://localhost:5000" : "")).replace(/\/+$/, "");

export default function CourseTerms() {
  const [terms, setTerms] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    fetch(`${API}/api/courses/terms`, { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || "Terms are temporarily unavailable.");
        return data.item;
      })
      .then((item) => { if (active) setTerms(item); })
      .catch((requestError) => { if (active) setError(requestError.message); });
    return () => { active = false; };
  }, []);

  return <main className="course-terms-page">
    <article className="course-terms-page__content">
      <a href="/services/courses" className="course-terms-page__back">Back to live training</a>
      <p className="course-terms-page__eyebrow">PROJENIUS · LIVE TRAINING</p>
      <h1>Terms &amp; Conditions and Refund Policy</h1>
      {error && <p role="alert">{error}</p>}
      {!terms && !error && <p role="status">Loading current terms…</p>}
      {terms && <>
        <p className="course-terms-page__version">Version {terms.version}</p>
        <p>{terms.policy}</p>
        <h2>Before you register</h2>
        <p>Check the programme, delivery mode, schedule and fee before paying. A payment does not mean the registration is approved. ProJenius reviews paid registrations and sends approval or rejection by email.</p>
        <h2>Refunds and changes</h2>
        <p>Participant cancellations, non-attendance and personal-plan changes do not ordinarily qualify for a refund after payment. Batch changes depend on availability and written approval. Rejection does not automatically issue a refund. Verified duplicate charges, ProJenius cancellations, applicable law and payment-provider decisions are handled on their individual facts.</p>
        <p className="course-terms-page__legal">These terms are provided for customer information and have not been certified as legal advice. Applicable non-waivable consumer rights continue to apply.</p>
      </>}
    </article>
  </main>;
}
