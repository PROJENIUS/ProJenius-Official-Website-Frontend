/* ==========================================================================
   WhyProJenius.jsx
   Section : "Why Work With ProJenius?" (heading on the left, 4 reasons on the right)
   Styles  : why-projenius.css -> link it globally (index.html / global
             stylesheet). It is NOT imported here, and there is no inline
             style and no CSS module.
   Classes : every class starts with the unique prefix "pjwhy-"
   ========================================================================== */
import { memo, useId } from "react";
import "./WhyProjenius.css";

/* ---------- SECTION 1 : STATIC CONTENT (frozen, created only once) ---------- */
const PJWHY_ITEMS = Object.freeze([
  {
    no: "01",
    title: "Practical Execution",
    text: "We focus on building and validating real solutions.",
  },
  {
    no: "02",
    title: "Cross-Technology Capability",
    text: "Software, AI, IoT, electronics, embedded systems and product development can come together when required.",
  },
  {
    no: "03",
    title: "End-to-End Support",
    text: "From early research and validation to prototype, MVP and startup readiness.",
  },
  {
    no: "04",
    title: "Founder-Friendly Approach",
    text: "Start with the problem. We help define the next practical step.",
  },
]);

/* ---------- SECTION 2 : ONE REASON ROW (memoized, never re-renders) ---------- */
const PjwhyItem = memo(function PjwhyItem({ item }) {
  return (
    <li className="pjwhy-item">
      <div className="pjwhy-item-inner">
        <span className="pjwhy-item-no" aria-hidden="true">
          {item.no}
        </span>
        <div className="pjwhy-item-body">
          <h3 className="pjwhy-item-title">{item.title}</h3>
          <p className="pjwhy-item-text">{item.text}</p>
        </div>
      </div>
    </li>
  );
});

/* ---------- SECTION 3 : MAIN SECTION ---------- */
function WhyProJenius() {
  const uid = useId(); /* unique id, safe even if the section is used twice */

  return (
    <section className="pjwhy-section" aria-labelledby={`${uid}-heading`}>
      <div className="pjwhy-container">
        {/* ----- Left side : eyebrow + heading ----- */}
        <div className="pjwhy-intro">
          <p className="pjwhy-eyebrow">Why ProJenius</p>
          <h2 className="pjwhy-heading" id={`${uid}-heading`}>
            Why Work With ProJenius?
          </h2>
        </div>

        {/* ----- Right side : reasons list ----- */}
        <ol className="pjwhy-list" role="list">
          {PJWHY_ITEMS.map((item) => (
            <PjwhyItem key={item.no} item={item} />
          ))}
        </ol>
      </div>
    </section>
  );
}

export default memo(WhyProJenius);
