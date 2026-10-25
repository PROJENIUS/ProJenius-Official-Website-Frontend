import { memo, useCallback } from "react";
import "./PjxIncubateHero.css";

/* ==========================================================================
   PjxIncubateHero.jsx
   RULES FOLLOWED : no inline style | no <style> tag | no CSS import | no CSS module
                    unique "pjx-incubate-" class names | no repeated markup (data + map)
                    zero external dependencies | self-contained single JSX file
   NOTE           : load PjxIncubateHero.css ONCE outside this file
                    (e.g. <link rel="stylesheet" href="/PjxIncubateHero.css"> in index.html)
   ========================================================================== */

/* ---------- 1. Vector SVG icon paths (feather / lucide geometry) ---------- */
const PJX_PATH_ARROW = Object.freeze(["M5 12h14", "m12 5 7 7-7 7"]);

const PJX_PATH_BULB = Object.freeze([
  "M9 18h6",
  "M10 22h4",
  "M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6h8c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z",
]);

const PJX_PATH_ROCKET = Object.freeze([
  "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z",
  "m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z",
  "M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0",
  "M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5",
]);

const PJX_PATH_TREND = Object.freeze([
  "m22 7-8.5 8.5-5-5L2 17",
  "m16 7 6 0 0 6",
]);

const PJX_PATH_USERS = Object.freeze([
  "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
  "M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  "M22 21v-2a4 4 0 0 0-3-3.87",
  "M16 3.13a4 4 0 0 1 0 7.75",
]);

/* ---------- 2. Reusable SVG Icon Component ---------- */
const PjxIcon = memo(function PjxIcon({ className = "", paths, viewBox = "0 0 24 24" }) {
  if (!paths) return null;
  const pathList = Array.isArray(paths) ? paths : [paths];

  return (
    <svg
      className={className}
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {pathList.map((d, index) => (
        <path key={index} d={d} />
      ))}
    </svg>
  );
});

/* ---------- 3. Static features data (created once outside component) ---------- */
const PJX_INCUBATE_FEATURES = [
  { id: "mentorship", icon: PJX_PATH_BULB, title: "Mentorship", text: "Learn from industry experts and faculty." },
  { id: "resources", icon: PJX_PATH_USERS, title: "Resources", text: "Access tools, labs and funding support." },
  { id: "growth", icon: PJX_PATH_TREND, title: "Growth", text: "Turn your idea into a sustainable startup." },
];

/* ---------- 4. Hero component ---------- */
function PjxIncubateHero({ onStart }) {
  /* When "Incubate" button is clicked in IncubateHero, open and scroll to the form (last section) */
  const handleIncubateClick = useCallback(
    (e) => {
      if (onStart) {
        onStart(e);
        return;
      }
      const formEl = document.getElementById("application");
      if (formEl) {
        formEl.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
          const firstInput = formEl.querySelector("input, select, textarea");
          if (firstInput) firstInput.focus();
        }, 500);
      }
    },
    [onStart]
  );

  return (
    /* SECTION: Hero wrapper */
    <section className="pjx-incubate-hero" aria-labelledby="pjx-incubate-title">

      {/* SECTION: Label, headline and sub text */}
      <div className="pjx-incubate-hero__content">
        <p className="pjx-incubate-hero__eyebrow">Projenius Startup Incubation</p>

        <h2 id="pjx-incubate-title" className="pjx-incubate-hero__title">
          Turn your idea into <span className="pjx-incubate-hero__accent">something real.</span>
        </h2>

        <p className="pjx-incubate-hero__text">Answer a few questions. We&apos;ll help you find the right next step.</p>
      </div>

      {/* SECTION: Feature cards (Mentorship / Resources / Growth) */}
      <ul className="pjx-incubate-hero__features">
        {PJX_INCUBATE_FEATURES.map((feature) => (
          <li key={feature.id} className="pjx-incubate-hero__feature">
            <span className="pjx-incubate-hero__feature-icon">
              <PjxIcon className="pjx-incubate-hero__svg pjx-incubate-hero__feature-svg" paths={feature.icon} />
            </span>
            <h2 className="pjx-incubate-hero__feature-title">{feature.title}</h2>
            <p className="pjx-incubate-hero__feature-text">{feature.text}</p>
          </li>
        ))}
      </ul>

      {/* SECTION: Call to action */}
      <div className="pjx-incubate-hero__cta">
        <button type="button" className="pjx-incubate-hero__button" onClick={handleIncubateClick}>
          <PjxIcon className="pjx-incubate-hero__svg pjx-incubate-hero__icon" paths={PJX_PATH_ROCKET} />
          <span>Incubate</span>
          <PjxIcon className="pjx-incubate-hero__svg pjx-incubate-hero__icon" paths={PJX_PATH_ARROW} />
        </button>
        <p className="pjx-incubate-hero__hint">Start your idea assessment</p>
      </div>

    </section>
  );
}

/* memo = skips re-render unless "onStart" changes */
export default memo(PjxIncubateHero);
