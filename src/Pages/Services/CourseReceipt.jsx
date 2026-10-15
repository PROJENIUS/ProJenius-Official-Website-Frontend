import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./CourseReceipt.css";

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const API = (configuredApiBaseUrl || (import.meta.env.DEV ? "http://localhost:5000" : "")).replace(/\/+$/, "");

export default function CourseReceipt() {
  const { token } = useParams();
  const [state, setState] = useState({ status: "loading", error: "", url: "" });

  useEffect(() => {
    let active = true;
    let objectUrl = "";
    const load = async () => {
      try {
        if (!API) throw new Error("Receipt downloads are not configured.");
        const response = await fetch(`${API}/api/courses/receipt/${encodeURIComponent(token)}`, { cache: "no-store", referrerPolicy: "no-referrer" });
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error || "This receipt link is invalid or has expired.");
        }
        const blob = await response.blob();
        if (blob.type !== "application/pdf") throw new Error("A valid PDF receipt was not returned.");
        objectUrl = URL.createObjectURL(blob);
        if (active) setState({ status: "ready", error: "", url: objectUrl });
      } catch (error) {
        if (active) setState({ status: "error", error: error.message, url: "" });
      }
    };
    void load();
    return () => { active = false; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [token]);

  return <main className="course-receipt-page">
    <section className="course-receipt-card" aria-live="polite">
      <p className="course-receipt-eyebrow">PROJENIUS LIVE TRAINING</p>
      <h1>Your payment receipt</h1>
      {state.status === "loading" && <p role="status">Validating your secure receipt link…</p>}
      {state.status === "error" && <><p role="alert">{state.error}</p><p>Request a fresh link from the course confirmation page using your registration reference and registered email.</p></>}
      {state.status === "ready" && <><p>Your verified payment receipt is ready to download.</p><a className="course-receipt-download" href={state.url} download="ProJenius-course-receipt.pdf">Download receipt PDF</a></>}
      <Link to="/services/courses">Return to courses</Link>
    </section>
  </main>;
}
