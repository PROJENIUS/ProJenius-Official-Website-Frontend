import { useCallback, useEffect, useRef, useState } from "react";
import "./AlreadyBuiltDoesntMeanDone.css";

/* =========================================================
   ALREADY BUILT DOESN'T MEAN DONE — DATA
========================================================= */
const STEPS = [
  { title: "Audit", text: "Review the current experience, structure and performance." },
  { title: "Insights", text: "Find what is holding users and the business back." },
  { title: "Improvement", text: "Redesign and rebuild what matters most." },
  { title: "Optimization", text: "Tune, measure and keep refining." },
];

const AREAS = ["UI/UX", "Performance", "Features", "Workflow", "Automation", "Mobile experience", "Content", "Digital visibility"];

const START_POSITION = 97;
const END_POSITION = 50;

/* =========================================================
   ALREADY BUILT DOESN'T MEAN DONE — HELPERS
========================================================= */
function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -4% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* Mock screens (wide variant) */
function MockBefore() {
  return (
    <div className="pj-development-already-built-mock-layer pj-development-already-built-mock-before">
      <div className="pj-development-already-built-mock-nav">
        <span className="pj-development-already-built-mock-logo" />
        <div className="pj-development-already-built-mock-links"><i /><i /><i /><i /><i /><i /><i /></div>
      </div>
      <div className="pj-development-already-built-mock-bhero">
        <div className="pj-development-already-built-mock-bcopy">
          <div className="pj-development-already-built-mock-h" />
          <div className="pj-development-already-built-mock-p" /><div className="pj-development-already-built-mock-p" />
          <div className="pj-development-already-built-mock-p" /><div className="pj-development-already-built-mock-p" />
          <div className="pj-development-already-built-mock-bbtns"><i /><i /><i /></div>
        </div>
        <div className="pj-development-already-built-mock-bimg" />
      </div>
      <div className="pj-development-already-built-mock-btiles"><i /><i /><i /><i /></div>
      <span className="pj-development-already-built-mock-badge">!</span>
      <span className="pj-development-already-built-mock-badge pj-development-already-built-mock-badge--b">?</span>
    </div>
  );
}

function MockAfter() {
  return (
    <div className="pj-development-already-built-mock-layer pj-development-already-built-mock-after">
      <div className="pj-development-already-built-mock-nav">
        <span className="pj-development-already-built-mock-logo" />
        <div className="pj-development-already-built-mock-links"><i /><i /><i /><b /></div>
      </div>
      <div className="pj-development-already-built-mock-hero">
        <div>
          <div className="pj-development-already-built-mock-h" />
          <div className="pj-development-already-built-mock-h pj-development-already-built-mock-h--s" />
          <div className="pj-development-already-built-mock-p" />
          <div className="pj-development-already-built-mock-p pj-development-already-built-mock-p--s" />
          <div className="pj-development-already-built-mock-cta" />
        </div>
        <div className="pj-development-already-built-mock-card" />
      </div>
      <div className="pj-development-already-built-mock-tiles">
        <div className="pj-development-already-built-mock-tile" />
        <div className="pj-development-already-built-mock-tile" />
        <div className="pj-development-already-built-mock-tile" />
      </div>
    </div>
  );
}

function MockScreen({ children }) {
  return (
    <div className="pj-development-already-built-mock">
      <div className="pj-development-already-built-mock-screen">{children}</div>
    </div>
  );
}

/* =========================================================
   ALREADY BUILT DOESN'T MEAN DONE — COMPONENT
========================================================= */
export default function AlreadyBuiltDoesntMeanDone() {
  const [headRef, headIn] = useInView(0.2);
  const [stepIndex, setStepIndex] = useState(0);

  const compareRef = useRef(null);
  const rangeRef = useRef(null);
  const touchedRef = useRef(false);

  /* Move the divider: writes straight to the DOM so dragging / the intro never re-render React */
  const applyPosition = useCallback((value) => {
    const compare = compareRef.current;
    if (compare) compare.style.setProperty("--pj-already-built-position", `${value}%`);
    if (rangeRef.current) rangeRef.current.value = String(value);

    const revealed = 100 - value;
    const next = revealed < 25 ? 0 : revealed < 50 ? 1 : revealed < 75 ? 2 : 3;
    setStepIndex((current) => (current === next ? current : next));
  }, []);

  /* Intro swipe when the card scrolls into view */
  useEffect(() => {
    const el = compareRef.current;
    if (!el) return undefined;

    const reduced = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") {
      applyPosition(END_POSITION);
      return undefined;
    }

    let frame = 0;
    let timer = null;
    let startTime = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        timer = window.setTimeout(() => {
          const animate = (time) => {
            if (touchedRef.current) return;
            if (startTime === null) startTime = time;
            const progress = Math.min(1, (time - startTime) / 1800);
            const eased = 1 - Math.pow(1 - progress, 3);
            applyPosition(START_POSITION + (END_POSITION - START_POSITION) * eased);
            if (progress < 1) frame = window.requestAnimationFrame(animate);
          };
          frame = window.requestAnimationFrame(animate);
        }, 300);
      },
      { threshold: 0.35 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      if (timer) window.clearTimeout(timer);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [applyPosition]);

  const handleChange = (event) => {
    touchedRef.current = true;
    applyPosition(Number(event.target.value));
  };

  return (
    <section
      id="pj-development-already-built"
      className="pj-development-already-built"
      aria-labelledby="pj-development-already-built-title"
    >
      <div className="pj-development-already-built-wrap">
        {/* ---------- HEADING ---------- */}
        <div ref={headRef} className={`pj-development-already-built-head${headIn ? " pj-development-already-built-head--in" : ""}`}>
          <h2 id="pj-development-already-built-title" className="pj-development-already-built-head-title">
            Already Built Doesn't Mean Finished.
          </h2>
          <p className="pj-development-already-built-head-text">
            Digital products evolve. New users, new requirements and new business goals create new opportunities to improve.
          </p>
        </div>

        <div className="pj-development-already-built-block">
          {/* ---------- BEFORE / AFTER COMPARISON ---------- */}
          <div ref={compareRef} className="pj-development-already-built-compare">
            <div className="pj-development-already-built-layer pj-development-already-built-layer--before" aria-hidden="true">
              <MockScreen><MockBefore /></MockScreen>
            </div>
            <div className="pj-development-already-built-layer pj-development-already-built-layer--after" aria-hidden="true">
              <MockScreen><MockAfter /></MockScreen>
            </div>

            <span className="pj-development-already-built-tag pj-development-already-built-tag--left">Existing experience</span>
            <span className="pj-development-already-built-tag pj-development-already-built-tag--right">Improved experience</span>

            {/* Invisible range input covers the card, so the whole card is draggable */}
            <input
              ref={rangeRef}
              className="pj-development-already-built-range"
              type="range"
              min="0"
              max="100"
              step="1"
              defaultValue={START_POSITION}
              aria-label="Drag to compare the existing and improved experience"
              onChange={handleChange}
              onPointerDown={() => {
                touchedRef.current = true;
              }}
            />

            <div className="pj-development-already-built-handle" aria-hidden="true">
              <span className="pj-development-already-built-handle-line" />
              <span className="pj-development-already-built-handle-knob">
                <svg viewBox="0 0 24 24" focusable="false"><path d="M9 7L4 12L9 17" /><path d="M15 7L20 12L15 17" /></svg>
              </span>
            </div>
          </div>

          {/* ---------- STEPS ---------- */}
          <ol className="pj-development-already-built-steps">
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className={`pj-development-already-built-step${index === stepIndex ? " pj-development-already-built-step--on" : ""}${index < stepIndex ? " pj-development-already-built-step--past" : ""}`}
              >
                <b>{step.title}</b>
                <span>{step.text}</span>
              </li>
            ))}
          </ol>

          {/* ---------- AREAS ---------- */}
          <p className="pj-development-already-built-areas-title">Where improvements usually happen</p>
          <ul className="pj-development-already-built-areas">
            {AREAS.map((area) => <li key={area}>{area}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
