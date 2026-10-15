import { useEffect, useRef, useState } from "react";
import "./AlreadyHaveADigitalProduct.css";

const CONTACT_HREF = "/contact";

/* =========================================================
   ALREADY HAVE A DIGITAL PRODUCT — DATA
========================================================= */
const CATEGORIES = [
  "UI / UX", "Performance", "Mobile experience", "SEO health",
  "Functionality", "Security review", "Content structure", "Technical health",
];

/* =========================================================
   RADAR GEOMETRY (calculated once, outside the component)
========================================================= */
const CX = 200;
const CY = 200;
const R = 150;
const COUNT = CATEGORIES.length;
const LEVELS = [0.25, 0.5, 0.75, 1];

const polar = (angleDeg, factor = 1) => {
  const angle = (angleDeg * Math.PI) / 180;
  return [CX + Math.cos(angle) * R * factor, CY + Math.sin(angle) * R * factor];
};
const fmt = (value) => value.toFixed(1);

const VERTICES = CATEGORIES.map((_, index) => polar(-90 + index * 45));
const GRID_POINTS = LEVELS.map((factor) => ({
  factor,
  points: CATEGORIES.map((_, index) => polar(-90 + index * 45, factor).map(fmt).join(",")).join(" "),
}));
const [WEDGE_X, WEDGE_Y] = polar(-140);
const WEDGE_PATH = `M${CX} ${CY} L${fmt(WEDGE_X)} ${fmt(WEDGE_Y)} A${R} ${R} 0 0 1 ${CX} ${CY - R} Z`;

/* =========================================================
   ALREADY HAVE A DIGITAL PRODUCT — COMPONENT
========================================================= */
export default function AlreadyHaveADigitalProduct() {
  const [revealed, setRevealed] = useState(false);
  const [run, setRun] = useState(false);
  const [scanned, setScanned] = useState(0);
  const [hot, setHot] = useState(null);

  const sectionRef = useRef(null);
  const radarRef = useRef(null);

  /* Section reveal */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      setRevealed(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -4% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* Radar scan: ticks the checklist one by one */
  useEffect(() => {
    const el = radarRef.current;
    if (!el) return undefined;

    const reduced = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") {
      setScanned(COUNT);
      return undefined;
    }

    const timers = [];
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setRun(true);
        for (let index = 0; index < COUNT; index += 1) {
          timers.push(window.setTimeout(() => setScanned(index + 1), 250 + index * 380));
        }
      },
      { threshold: 0.45 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  const arrow = (
    <svg className="pj-development-digital-product-btn-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );

  return (
    <section
      id="pj-development-digital-product"
      ref={sectionRef}
      className={`pj-development-digital-product${revealed ? " pj-development-digital-product--in" : ""}`}
      aria-labelledby="pj-development-digital-product-title"
    >
      <div className="pj-development-digital-product-wrap">
        {/* ---------- LEFT CONTENT ---------- */}
        <div className="pj-development-digital-product-content">
          <div className="pj-development-digital-product-rv">
            <span className="pj-development-digital-product-eyebrow">Already have a digital product?</span>
          </div>

          <h2 id="pj-development-digital-product-title" className="pj-development-digital-product-title pj-development-digital-product-rv pj-development-digital-product-rv--d1">
            Let's See What<br />Can Be Improved.
          </h2>

          <p className="pj-development-digital-product-lead pj-development-digital-product-rv pj-development-digital-product-rv--d2">
            Your website or application may already be live. We can help identify opportunities across experience, performance, functionality and digital visibility.
          </p>

          {/* ---------- AUDIT LIST (highlights the radar axis) ---------- */}
          <ul className="pj-development-digital-product-list pj-development-digital-product-rv pj-development-digital-product-rv--d3">
            {CATEGORIES.map((name, index) => (
              <li
                key={name}
                tabIndex={0}
                className={`pj-development-digital-product-item${index < scanned ? " pj-development-digital-product-item--on" : ""}${hot === index ? " pj-development-digital-product-item--hot" : ""}`}
                onMouseEnter={() => setHot(index)}
                onMouseLeave={() => setHot(null)}
                onFocus={() => setHot(index)}
                onBlur={() => setHot(null)}
              >
                <span className="pj-development-digital-product-status" aria-hidden="true">
                  <svg viewBox="0 0 12 12" focusable="false"><path d="M2 6.5l2.5 2.5L10 3.5" /></svg>
                </span>
                <span>{name}</span>
              </li>
            ))}
          </ul>

          {/* ---------- BUTTONS ---------- */}
          <div className="pj-development-digital-product-actions pj-development-digital-product-rv pj-development-digital-product-rv--d3">
            <a className="pj-development-digital-product-btn pj-development-digital-product-btn--primary" href={CONTACT_HREF}>
              Request a Digital Audit{arrow}
            </a>
            <a className="pj-development-digital-product-btn pj-development-digital-product-btn--ghost" href={CONTACT_HREF}>
              Improve My Existing Product{arrow}
            </a>
          </div>
        </div>

        {/* ---------- RIGHT RADAR CARD ---------- */}
        <div className="pj-development-digital-product-card pj-development-digital-product-rv pj-development-digital-product-rv--d2">
          <div className="pj-development-digital-product-card-head">
            <b>Digital product health check</b>
            <span>Illustrative view, not a real score</span>
          </div>

          <svg
            ref={radarRef}
            className="pj-development-digital-product-radar"
            viewBox="0 0 400 400"
            role="img"
            aria-label="Illustrative radar showing eight areas reviewed in a digital audit"
          >
            <defs>
              <linearGradient id="pj-development-digital-product-wedge" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#35D9EE" stopOpacity="0" />
                <stop offset="100%" stopColor="#35D9EE" stopOpacity="0.42" />
              </linearGradient>
            </defs>

            {GRID_POINTS.map((level) => (
              <polygon key={level.factor} className="pj-development-digital-product-grid" points={level.points} />
            ))}

            {VERTICES.map(([x, y], index) => (
              <line
                key={`axis-${CATEGORIES[index]}`}
                className={`pj-development-digital-product-axis${hot === index ? " pj-development-digital-product-axis--hot" : ""}`}
                x1={CX}
                y1={CY}
                x2={fmt(x)}
                y2={fmt(y)}
              />
            ))}

            <g className={`pj-development-digital-product-sweep${run ? " pj-development-digital-product-sweep--run" : ""}`}>
              <path d={WEDGE_PATH} fill="url(#pj-development-digital-product-wedge)" />
              <path d={`M${CX} ${CY} L${CX} ${CY - R}`} stroke="#35D9EE" strokeWidth="2" />
            </g>

            {VERTICES.map(([x, y], index) => (
              <circle
                key={`vertex-${CATEGORIES[index]}`}
                className={`pj-development-digital-product-vertex${index < scanned ? " pj-development-digital-product-vertex--on" : ""}${hot === index ? " pj-development-digital-product-vertex--hot" : ""}`}
                cx={fmt(x)}
                cy={fmt(y)}
                r="6"
              />
            ))}

            <circle className="pj-development-digital-product-centre-ring" cx={CX} cy={CY} r="8" />
            <circle className="pj-development-digital-product-centre" cx={CX} cy={CY} r="4" />
          </svg>
        </div>
      </div>
    </section>
  );
}
