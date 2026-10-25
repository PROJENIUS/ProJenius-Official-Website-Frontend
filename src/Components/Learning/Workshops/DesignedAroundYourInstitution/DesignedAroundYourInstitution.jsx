import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import "./DesignedAroundYourInstitution.css";

/* Illustrations for each format (all drawn in SVG, no images needed) */
const visuals = {
  oneDay: (
    <svg viewBox="0 0 220 64" aria-hidden="true">
      <rect className="di-fill" x="8" y="6" width="212" height="52" rx="8" />
      <path d="M28 24h82M28 38h50" />
    </svg>
  ),
  bootcamp: (
    <svg viewBox="0 0 220 64" aria-hidden="true">
      <rect className="di-fill" x="8" y="40" width="44" height="20" rx="6" />
      <rect className="di-fill" x="64" y="30" width="44" height="30" rx="6" />
      <rect className="di-fill" x="118" y="20" width="44" height="40" rx="6" />
      <rect className="di-fill" x="172" y="6" width="44" height="54" rx="6" />
    </svg>
  ),
  department: (
    <svg viewBox="0 0 220 64" aria-hidden="true">
      <rect className="di-dash" x="6" y="4" width="96" height="66" rx="8" />
      <circle className="di-solid" cx="26" cy="22" r="9" />
      <circle className="di-solid" cx="76" cy="22" r="9" />
      <circle className="di-solid" cx="26" cy="52" r="9" />
      <circle className="di-solid" cx="76" cy="52" r="9" />
      <circle cx="126" cy="22" r="8.5" />
      <circle cx="176" cy="22" r="8.5" />
      <circle cx="126" cy="52" r="8.5" />
      <circle cx="176" cy="52" r="8.5" />
    </svg>
  ),
  network: (
    <svg viewBox="0 0 220 64" aria-hidden="true">
      <path d="M16 50 61 15 111 50 161 15 204 50 111 50ZM61 15H161M16 50 111 50" />
      {[[16, 50], [61, 15], [111, 50], [161, 15], [204, 50]].map(([x, y]) => (
        <circle key={x} className="di-solid" cx={x} cy={y} r="10" />
      ))}
    </svg>
  ),
};

const formats = [
  { visual: "oneDay", tone: "cyan", tag: "Single Day", title: "One-Day Workshop",
    text: "An intensive practical learning experience focused on a specific technology or topic." },
  { visual: "bootcamp", tone: "blue", tag: "Multi-Session", title: "Hands-On Bootcamp",
    text: "A multi-session experience combining learning, practical activities, and project building." },
  { visual: "department", tone: "indigo", tag: "Per Department", title: "Department Workshop",
    text: "A customized workshop aligned with a specific academic department or student group." },
  { visual: "network", tone: "teal", tag: "Institution-Wide", title: "Institution / Club Workshop",
    text: "Technology and innovation sessions designed for technical clubs, innovation clubs, student communities, or institution-wide programs." },
];

export default function DesignedAroundYourInstitution() {
  return (
    <section className="di-section">
      <div className="di-container">
        <header className="di-header">
          <p className="pjds-eyebrow" data-reveal="up">Workshop Formats</p>
          <h2 className="di-title" data-reveal="up" data-reveal-delay="1">
            <span className="di-title-static">Designed Around</span>
            <TypedPhrase phrases={["Your Institution", "Your Students", "Your Schedule"]} />
          </h2>
          <p className="di-desc" data-reveal="up" data-reveal-delay="2">
            Every institution has different objectives, student groups, schedules,
            and learning requirements. Workshops can be structured accordingly.
          </p>
        </header>

        <div className="di-grid" data-reveal="up" data-reveal-delay="3">
          {formats.map((f, index) => (
            <article key={f.title} className={`di-col di-col--${f.tone}`}>
              <div className="di-card-top">
                <span className="di-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <span className="di-tag">{f.tag}</span>
              </div>
              <div className="di-visual">{visuals[f.visual]}</div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
              <Link to="/contact?type=workshop" className="di-link">
                Ask about this format <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}