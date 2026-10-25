/**
 * StartupJourney.jsx
 * CSS lives in StartupJourney.css (class prefix "pjs-path"), linked globally.
 * No inline styles, no CSS modules, no CSS imports in this file.
 */
import { memo, useCallback, useId, useState } from "react";
import "./Everyideadiff.css";

/* ============ 1. STATIC DATA (outside component = created once) ============ */
const STAGES = Object.freeze([
  { id: "discover", name: "Discover", sub: "Research & Problem Understanding",
    items: ["Problem identification", "User/problem research", "Technology research", "Requirements understanding", "Research & Development"] },
  { id: "validate", name: "Validate", sub: "Idea & Technical Validation",
    items: ["Idea evaluation", "Feasibility assessment", "Solution definition", "Technical validation", "MVP planning"] },
  { id: "build", name: "Build", sub: "Prototype & MVP Development",
    items: ["Software", "SaaS", "AI/ML", "IoT", "Embedded systems", "PCB", "3D design & printing", "Hardware integration", "MVP development"] },
  { id: "protect", name: "Protect", sub: "IP & Patent Support",
    items: ["Patent support", "IP documentation", "Technical documentation", "Prior-art research support", "Filing coordination/support"] },
  { id: "establish", name: "Establish", sub: "Startup & Registration Support",
    items: ["Company registration guidance", "Startup registration guidance", "Documentation support", "Relevant government/startup scheme guidance"] },
  { id: "prepare", name: "Prepare", sub: "Startup Readiness",
    items: ["Business model support", "Product positioning", "Pitch deck support", "Product roadmap", "Demo preparation", "Startup documentation"] },
  { id: "grow", name: "Grow", sub: "Continued Innovation Support",
    items: ["Product roadmap", "Technical mentoring", "Innovation support", "Startup mentoring", "Growth planning"] },
]);

/* ============ 2. MAP GEOMETRY (computed once, zig-zag: odd = left, even = right) ============ */
const MAP = { left: 110, right: 270, top: 30, step: 85 };
const NODES = STAGES.map((stage, i) => ({
  id: stage.id,
  name: stage.name,
  no: String(i + 1).padStart(2, "0"),
  x: i % 2 === 0 ? MAP.left : MAP.right,
  y: MAP.top + i * MAP.step,
  isLeft: i % 2 === 0,
}));
const MAP_HEIGHT = MAP.top * 2 + (STAGES.length - 1) * MAP.step;
// Smooth S-curve between each pair of neighbouring nodes.
// "rest" = a point just ahead of the start node (static tracer dot for reduced-motion users).
const bezier = (p0, p1, p2, p3, t) => {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
};
const SEGMENTS = NODES.slice(0, -1).map((a, i) => {
  const b = NODES[i + 1];
  const dy = b.y - a.y;
  const c1 = { x: a.x, y: a.y + dy * 0.5 }; // vertical tangents = smooth sine-wave route
  const c2 = { x: b.x, y: b.y - dy * 0.5 };
  return {
    d: `M${a.x} ${a.y} C${c1.x} ${c1.y} ${c2.x} ${c2.y} ${b.x} ${b.y}`,
    rest: { x: bezier(a.x, c1.x, c2.x, b.x, 0.12), y: bezier(a.y, c1.y, c2.y, b.y, 0.12) },
  };
});

// Respect "reduce motion": no looping tracer, just a still dot
const REDUCE_MOTION =
  typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const pad = (n) => String(n + 1).padStart(2, "0");

/* ============ 3. MAP NODE (memo: only re-renders when its state flips) ============ */
const MapNode = memo(function MapNode({ node, index, activeIndex, onSelect }) {
  const state = index === activeIndex ? " pjs-path__node--on" : index < activeIndex ? " pjs-path__node--done" : "";
  const labelX = node.isLeft ? node.x - 32 : node.x + 32;
  const handleKey = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(index);
    }
  };
  return (
    <g
      className={`pjs-path__node${state}`}
      role="button"
      tabIndex={0}
      aria-label={`Stage ${node.no}: ${node.name}`}
      aria-current={index === activeIndex ? "step" : undefined}
      onClick={() => onSelect(index)}
      onKeyDown={handleKey}
    >
      <circle className="pjs-path__node-ring" cx={node.x} cy={node.y} r="20" />
      <text className="pjs-path__node-no" x={node.x} y={node.y}>{node.no}</text>
      <text className={node.isLeft ? "pjs-path__label pjs-path__label--end" : "pjs-path__label"} x={labelX} y={node.y}>
        {node.name}
      </text>
    </g>
  );
});

/* ============ 4. TRACER (white dot + bright trail looping toward the next stage) ============ */
const Tracer = memo(function Tracer({ activeIndex, trailId }) {
  const isLast = activeIndex === STAGES.length - 1;
  if (isLast) {
    return <circle className="pjs-path__dot" cx={NODES[activeIndex].x} cy={NODES[activeIndex].y} r="4" />;
  }
  if (REDUCE_MOTION) {
    const { x, y } = SEGMENTS[activeIndex].rest;
    return <circle className="pjs-path__dot" cx={x} cy={y} r="4" />;
  }
  return (
    <g>
      <path id={trailId} className="pjs-path__trail" d={SEGMENTS[activeIndex].d} pathLength="1">
        <animate attributeName="stroke-dasharray" values="0 1;0.85 1" keyTimes="0;1" calcMode="spline" keySplines="0.4 0 0.2 1" dur="2.8s" repeatCount="indefinite" />
      </path>
      <circle className="pjs-path__dot" r="4">
        <animateMotion keyPoints="0;0.85" keyTimes="0;1" calcMode="spline" keySplines="0.4 0 0.2 1" dur="2.8s" repeatCount="indefinite">
          <mpath href={`#${trailId}`} />
        </animateMotion>
      </circle>
    </g>
  );
});

/* ============ 4b. JOURNEY MAP (nodes first, route + tracer drawn on top) ============ */
const JourneyMap = memo(function JourneyMap({ activeIndex, onSelect }) {
  const trailId = `${useId().replace(/:/g, "")}-trail`;
  return (
    <svg className="pjs-path__map" viewBox={`0 0 380 ${MAP_HEIGHT}`} role="group" aria-label="Startup journey map">
      {NODES.map((node, i) => (
        <MapNode key={node.id} node={node} index={i} activeIndex={activeIndex} onSelect={onSelect} />
      ))}
      {SEGMENTS.map((seg, i) => (
        <path key={STAGES[i].id} className={i < activeIndex ? "pjs-path__seg pjs-path__seg--done" : "pjs-path__seg"} d={seg.d} />
      ))}
      <Tracer key={activeIndex} activeIndex={activeIndex} trailId={trailId} />
    </svg>
  );
});

/* ============ 5. STAGE DETAIL (remounts per stage to replay the fade) ============ */
const StageDetail = memo(function StageDetail({ stage, activeIndex, onPrev, onNext }) {
  const isFirst = activeIndex === 0;
  const isLast = activeIndex === STAGES.length - 1;
  return (
    <div className="pjs-path__detail" aria-live="polite">
      <div className="pjs-path__detail-body" key={stage.id}>
        <p className="pjs-path__count">STAGE {pad(activeIndex)} / {pad(STAGES.length - 1)}</p>
        <h3 className="pjs-path__head">
          <span className="pjs-path__no" aria-hidden="true">{pad(activeIndex)}</span>
          <span className="pjs-path__name">{stage.name}</span>
        </h3>
        <p className="pjs-path__sub">{stage.sub}</p>
        <ul className="pjs-path__items">
          {stage.items.map((item) => (
            <li key={item} className="pjs-path__item">{item}</li>
          ))}
        </ul>
      </div>
      <div className="pjs-path__nav">
        <button type="button" className="pjs-path__btn" onClick={onPrev} disabled={isFirst} aria-label="Previous stage">‹</button>
        <button type="button" className="pjs-path__btn" onClick={onNext} disabled={isLast} aria-label="Next stage">›</button>
      </div>
    </div>
  );
});

/* ============ 6. MAIN SECTION ============ */
function StartupJourney() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSelect = useCallback((index) => setActiveIndex(index), []);
  const handlePrev = useCallback(() => setActiveIndex((i) => Math.max(0, i - 1)), []);
  const handleNext = useCallback(() => setActiveIndex((i) => Math.min(STAGES.length - 1, i + 1)), []);

  return (
    <section className="pjs-path" aria-label="The startup journey">
      <p className="pjs-path__eyebrow">The startup journey</p>
      <h2 className="pjs-path__title">Every Idea Has a Different Path.</h2>
      <p className="pjs-path__lead">
        There is no single formula for building a startup. The right path depends on the problem, technology, stage and goals.
      </p>

      <div className="pjs-path__layout">
        <StageDetail stage={STAGES[activeIndex]} activeIndex={activeIndex} onPrev={handlePrev} onNext={handleNext} />
        <JourneyMap activeIndex={activeIndex} onSelect={handleSelect} />
      </div>
    </section>
  );
}

export default memo(StartupJourney);
