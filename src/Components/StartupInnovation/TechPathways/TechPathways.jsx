import { Component, memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import "./TechPathways.css";

/* ==========================================================================
   TechPathways.jsx
   RULES FOLLOWED : no inline style | no <style> tag | no CSS import | no CSS module
                    unique "tpw-" class names | no repeated markup (data + map)
   NOTE           : load TechPathways.css ONCE outside this file
                    (e.g. <link rel="stylesheet" href="/TechPathways.css"> in index.html)
   ========================================================================== */

/* ==========================================================================
   SESSION 1 : STATIC DATA
   Frozen so nothing can change it at runtime. One array drives the rows,
   the curves and the journey, so there is no repeated markup.
   ========================================================================== */
const PATHWAYS = Object.freeze([
  { id: "saas", title: "SaaS / Software", blurb: "Platforms, apps and web products",
    note: "Software moves fast: validate the idea, ship a lean MVP, then iterate on real usage.",
    steps: ["Problem", "Research", "Design", "MVP", "Beta", "Launch", "Scale"] },
  { id: "ai", title: "AI / Data", blurb: "Models, data and intelligent features",
    note: "AI projects succeed or fail on data quality, so data comes before models.",
    steps: ["Problem", "Data", "Model", "Validate", "Deploy", "Monitor"] },
  { id: "iot", title: "IoT / Embedded", blurb: "Connected devices and firmware",
    note: "Connected products bring electronics, firmware and software together in one build.",
    steps: ["Problem", "Research", "Electronics", "PCB", "Firmware", "Prototype", "MVP"] },
  { id: "hw", title: "Hardware / Product", blurb: "Physical products and devices",
    note: "Physical products need feasibility and mechanical design early, because changes get costlier later.",
    steps: ["Problem", "Research", "CAD", "Prototype", "Testing", "Tooling", "Production"] },
  { id: "auto", title: "Automation", blurb: "Workflows, control and integration",
    note: "Automation starts with mapping how the work is done today, then designing what should change.",
    steps: ["Problem", "Process Study", "Workflow Design", "Integration", "Testing", "Deployment"] },
]);

const STEP_DELAY_MS = 380; // time between each journey step lighting up
const CURVE_BEND = 0.5;    // 0..1 : where the curve control points sit

/* ==========================================================================
   SESSION 2 : HELPERS (pure functions, no side effects)
   ========================================================================== */
const pad = (n) => String(n).padStart(2, "0"); // 1 -> "01"

// Honour the visitor's "reduce motion" setting (safe if window is missing)
const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// S-curve between two points -> SVG "d" attribute (not CSS)
const curvePath = (x1, y1, x2, y2) => {
  const mx = x1 + (x2 - x1) * CURVE_BEND;
  return `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`;
};

/* ==========================================================================
   SESSION 3 : ERROR BOUNDARY  (safety: one failing part cannot blank the page)
   Classes : tpw-fallback
   ========================================================================== */
class SafeBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed
      ? <p className="tpw-fallback" role="alert">This section could not be loaded.</p>
      : this.props.children;
  }
}

/* ==========================================================================
   SESSION 4 : PATH ROW  (one clickable direction in the list)
   Classes : tpw-row-item, tpw-row, tpw-row--active, tpw-row-num,
             tpw-row-text, tpw-row-title, tpw-row-blurb, tpw-row-arrow
   ========================================================================== */
const PathRow = memo(function PathRow({ index, item, isActive, isSelected, registerRow, onActivate, onSelect }) {
  return (
    <li className="tpw-row-item">
      <button
        ref={(el) => registerRow(index, el)}
        type="button"
        className={`tpw-row${isActive ? " tpw-row--active" : ""}`}
        aria-pressed={isSelected}
        aria-controls="tpw-journey-panel"
        onMouseEnter={() => onActivate(index)}
        onFocus={() => onActivate(index)}
        onClick={() => onSelect(index)}
      >
        <span className="tpw-row-num" aria-hidden="true">{pad(index + 1)}</span>
        <span className="tpw-row-text">
          <span className="tpw-row-title">{item.title}</span>
          <span className="tpw-row-blurb">{item.blurb}</span>
        </span>
        <span className="tpw-row-arrow" aria-hidden="true">→</span>
      </button>
    </li>
  );
});

/* ==========================================================================
   SESSION 5 : CONNECTOR CURVES  (SVG lines from the idea card to each row)
   Classes : tpw-curves, tpw-curve, tpw-curve--active
   ========================================================================== */
const PathCurves = memo(function PathCurves({ geom, activeIndex }) {
  if (!geom) return null;
  const { width, height, start, ends } = geom;
  return (
    <svg className="tpw-curves" viewBox={`0 0 ${width} ${height}`} aria-hidden="true" focusable="false">
      {ends.map((end, i) => (
        <path
          key={PATHWAYS[i].id}
          className={`tpw-curve${i === activeIndex ? " tpw-curve--active" : ""}`}
          d={curvePath(start.x, start.y, end.x, end.y)}
        />
      ))}
    </svg>
  );
});

/* ==========================================================================
   SESSION 6 : JOURNEY PANEL  (steps light up one after another)
   Classes : tpw-journey, tpw-journey-head, tpw-journey-eyebrow, tpw-journey-title,
             tpw-journey-note, tpw-steps, tpw-step, tpw-step--done, tpw-step--linked,
             tpw-step-dot, tpw-step-num, tpw-step-label
   ========================================================================== */
const Journey = memo(function Journey({ item }) {
  const total = item.steps.length;
  const [reached, setReached] = useState(1);

  useEffect(() => {
    if (prefersReducedMotion()) { setReached(total); return undefined; }
    let count = 1;
    setReached(1);
    const timer = setInterval(() => {
      count += 1;
      setReached(count);
      if (count >= total) clearInterval(timer);
    }, STEP_DELAY_MS);
    return () => clearInterval(timer); // cleanup: no leaks, no updates after unmount
  }, [total]);

  return (
    <section id="tpw-journey-panel" className="tpw-journey" aria-live="polite" aria-label={`${item.title} example journey`}>
      <div className="tpw-journey-head">
        <div>
          <p className="tpw-journey-eyebrow">Example Journey</p>
          <h3 className="tpw-journey-title">{item.title}</h3>
        </div>
        <p className="tpw-journey-note">{item.note}</p>
      </div>
      <ol className="tpw-steps">
        {item.steps.map((label, i) => (
          <li
            key={label}
            className={`tpw-step${i < reached ? " tpw-step--done" : ""}${i < reached - 1 ? " tpw-step--linked" : ""}`}
          >
            <span className="tpw-step-dot" aria-hidden="true" />
            <span className="tpw-step-num">{pad(i + 1)}</span>
            <span className="tpw-step-label">{label}</span>
          </li>
        ))}
      </ol>
    </section>
  );
});

/* ==========================================================================
   SESSION 7 : MAIN SECTION  (header + idea card + list + journey)
   Classes : tpw-section, tpw-header, tpw-eyebrow, tpw-heading, tpw-lead,
             tpw-stage, tpw-idea, tpw-idea-title, tpw-idea-text, tpw-idea-dot, tpw-list
   ========================================================================== */
export default function TechPathways() {
  const [activeIndex, setActiveIndex] = useState(0);     // highlighted by hover / focus
  const [selectedIndex, setSelectedIndex] = useState(0); // clicked -> journey shown
  const [geom, setGeom] = useState(null);                // measured curve coordinates

  const stageRef = useRef(null);
  const dotRef = useRef(null);
  const rowRefs = useRef([]);

  // Stable handlers so memoised children do not re-render needlessly
  const handleActivate = useCallback((i) => setActiveIndex(i), []);
  const handleSelect = useCallback((i) => { setActiveIndex(i); setSelectedIndex(i); }, []);
  const registerRow = useCallback((i, el) => { rowRefs.current[i] = el; }, []);

  // Measure real positions so curves stay correct on every screen size
  useLayoutEffect(() => {
    const stage = stageRef.current;
    const dot = dotRef.current;
    if (!stage || !dot) return undefined;

    const measure = () => {
      if (window.getComputedStyle(dot).display === "none") { setGeom(null); return; } // mobile: curves hidden
      const s = stage.getBoundingClientRect();
      const d = dot.getBoundingClientRect();
      const ends = rowRefs.current.filter(Boolean).map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left - s.left, y: r.top - s.top + r.height / 2 };
      });
      setGeom({ width: s.width, height: s.height, ends,
        start: { x: d.left - s.left + d.width / 2, y: d.top - s.top + d.height / 2 } });
    };

    measure();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  const selected = PATHWAYS[selectedIndex]; // always valid, guarded below anyway

  return (
    <section className="tpw-section" aria-labelledby="tpw-heading">
      <header className="tpw-header">
        <p className="tpw-eyebrow">Technology Pathways</p>
        <h2 id="tpw-heading" className="tpw-heading">Your Idea Determines the Path.</h2>
        <p className="tpw-lead">
          Different ideas require different combinations of technology, validation and support.
          Pick a direction to see an example route.
        </p>
      </header>

      <div ref={stageRef} className="tpw-stage">
        <PathCurves geom={geom} activeIndex={activeIndex} />
        <div className="tpw-idea">
          <h3 className="tpw-idea-title">Your Idea</h3>
          <p className="tpw-idea-text">Where every path begins</p>
          <span ref={dotRef} className="tpw-idea-dot" aria-hidden="true" />
        </div>
        <ul className="tpw-list">
          {PATHWAYS.map((item, i) => (
            <PathRow
              key={item.id}
              index={i}
              item={item}
              isActive={i === activeIndex}
              isSelected={i === selectedIndex}
              registerRow={registerRow}
              onActivate={handleActivate}
              onSelect={handleSelect}
            />
          ))}
        </ul>
      </div>

      {/* key = re-mount on change so the step animation restarts */}
      {selected && (
        <SafeBoundary key={selected.id}>
          <Journey item={selected} />
        </SafeBoundary>
      )}
    </section>
  );
}
