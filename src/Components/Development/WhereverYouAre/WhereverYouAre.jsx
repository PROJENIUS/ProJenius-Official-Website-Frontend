import { useCallback, useEffect, useRef, useState } from "react";
import "./WhereverYouAre.css";

/* =========================================================
   WHEREVER YOU ARE — DATA
========================================================= */
const CONTACT_HREF = "/contact";

const NEW_TAGS = [
  "New digital products", "New websites", "New applications", "SaaS ideas",
  "Business platforms", "AI-powered products", "Automation systems",
];
const IMPROVE_TAGS = [
  "Existing websites", "Existing applications", "UI/UX problems", "Performance issues",
  "Feature improvements", "Digital transformation", "Product modernization",
];
const STEPS = ["Existing interface", "Audit", "Improvement", "Optimized interface"];

/* =========================================================
   WHEREVER YOU ARE — HELPERS
========================================================= */
function useInView(threshold = 0.15) {
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

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return undefined;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return reduced;
}

/* Replays an animation on first view and on mouse hover (max once per 4.5s) */
function useReplay(inView) {
  const [run, setRun] = useState(0);
  const last = useRef(0);
  const play = useCallback(() => {
    last.current = Date.now();
    setRun((value) => value + 1);
  }, []);
  useEffect(() => {
    if (inView) play();
  }, [inView, play]);
  const onHover = useCallback(
    (event) => {
      if (event.pointerType === "mouse" && Date.now() - last.current > 4500) play();
    },
    [play]
  );
  return [run, onHover];
}

/* =========================================================
   WHEREVER YOU ARE — MOCK SCREEN PIECES
========================================================= */
function MockBefore() {
  return (
    <div className="pj-development-wherever-mock-layer pj-development-wherever-mock-before">
      <div className="pj-development-wherever-mock-nav">
        <span className="pj-development-wherever-mock-logo" />
        <div className="pj-development-wherever-mock-links"><i /><i /><i /><i /><i /><i /><i /></div>
      </div>
      <div className="pj-development-wherever-mock-bhero">
        <div className="pj-development-wherever-mock-bcopy">
          <div className="pj-development-wherever-mock-h" />
          <div className="pj-development-wherever-mock-p" /><div className="pj-development-wherever-mock-p" />
          <div className="pj-development-wherever-mock-p" /><div className="pj-development-wherever-mock-p" />
          <div className="pj-development-wherever-mock-bbtns"><i /><i /><i /></div>
        </div>
        <div className="pj-development-wherever-mock-bimg" />
      </div>
      <div className="pj-development-wherever-mock-btiles"><i /><i /><i /><i /></div>
      <span className="pj-development-wherever-mock-badge">!</span>
      <span className="pj-development-wherever-mock-badge pj-development-wherever-mock-badge--b">?</span>
    </div>
  );
}

function MockAfter() {
  return (
    <div className="pj-development-wherever-mock-layer pj-development-wherever-mock-after">
      <div className="pj-development-wherever-mock-nav">
        <span className="pj-development-wherever-mock-logo" />
        <div className="pj-development-wherever-mock-links"><i /><i /><i /><b /></div>
      </div>
      <div className="pj-development-wherever-mock-hero">
        <div>
          <div className="pj-development-wherever-mock-h" />
          <div className="pj-development-wherever-mock-h pj-development-wherever-mock-h--s" />
          <div className="pj-development-wherever-mock-p" />
          <div className="pj-development-wherever-mock-p pj-development-wherever-mock-p--s" />
          <div className="pj-development-wherever-mock-cta" />
        </div>
        <div className="pj-development-wherever-mock-card" />
      </div>
      <div className="pj-development-wherever-mock-tiles">
        <div className="pj-development-wherever-mock-tile" />
        <div className="pj-development-wherever-mock-tile" />
        <div className="pj-development-wherever-mock-tile" />
      </div>
    </div>
  );
}

function MockScreen({ className, children }) {
  return (
    <div className={`pj-development-wherever-mock ${className}`}>
      <div className="pj-development-wherever-mock-screen">{children}</div>
    </div>
  );
}

/* Small arrow used inside buttons */
function Arrow() {
  return (
    <svg className="pj-development-wherever-btn-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/* =========================================================
   WHEREVER YOU ARE — COMPONENT
========================================================= */
export default function WhereverYouAre() {
  const reduced = useReducedMotion();
  const [headRef, headIn] = useInView(0.2);
  const [newRef, newInView] = useInView(0.25);
  const [improveRef, improveInView] = useInView(0.25);
  const [mergeRef, mergeInView] = useInView(0.2);

  const [newRun, onNewHover] = useReplay(newInView);
  const [improveRun, onImproveHover] = useReplay(improveInView);
  const [litSteps, setLitSteps] = useState(0);

  /* Improvement chips light up one by one */
  useEffect(() => {
    if (!improveRun) return undefined;
    if (reduced) {
      setLitSteps(STEPS.length);
      return undefined;
    }
    setLitSteps(0);
    const timers = STEPS.map((_, index) =>
      window.setTimeout(() => setLitSteps(index + 1), 350 + index * 700)
    );
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [improveRun, reduced]);

  return (
    <section
      id="pj-development-wherever"
      className="pj-development-wherever"
      aria-labelledby="pj-development-wherever-title"
    >
      <div className="pj-development-wherever-wrap">
        {/* ---------- SECTION HEADING ---------- */}
        <div ref={headRef} className={`pj-development-wherever-head${headIn ? " pj-development-wherever-head--in" : ""}`}>
          <h2 id="pj-development-wherever-title" className="pj-development-wherever-head-title">
            Wherever You Are, We Can Start.
          </h2>
          <p className="pj-development-wherever-head-text">
            A blank page or a product that's already live: either way, the journey begins with your requirement.
          </p>
        </div>

        <div className="pj-development-wherever-grid">
          {/* ---------- CARD: BUILD SOMETHING NEW ---------- */}
          <article
            ref={newRef}
            className={`pj-development-wherever-card pj-development-wherever-card--new${newInView ? " pj-development-wherever-card--in" : ""}`}
            onPointerEnter={onNewHover}
          >
            <div className="pj-development-wherever-visual" aria-hidden="true">
              <MockScreen
                key={`new-${newRun}`}
                className={`pj-development-wherever-build${newRun || reduced ? " pj-development-wherever-build--play" : ""}`}
              >
                <div className="pj-development-wherever-blank">
                  <span><i>+</i>Blank canvas</span>
                </div>
                <MockAfter />
              </MockScreen>
            </div>
            <div>
              <p className="pj-development-wherever-kicker">Starting from scratch</p>
              <h3 className="pj-development-wherever-card-title">Build Something New</h3>
            </div>
            <ul className="pj-development-wherever-tags" aria-label="Best for">
              {NEW_TAGS.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
            <div className="pj-development-wherever-cta-wrap">
              <a className="pj-development-wherever-btn pj-development-wherever-btn--primary" href={CONTACT_HREF}>
                Build Something New<Arrow />
              </a>
            </div>
          </article>

          {/* ---------- CARD: IMPROVE SOMETHING EXISTING ---------- */}
          <article
            ref={improveRef}
            className={`pj-development-wherever-card pj-development-wherever-card--improve${improveInView ? " pj-development-wherever-card--in" : ""}`}
            onPointerEnter={onImproveHover}
          >
            <div>
              <div className="pj-development-wherever-visual" aria-hidden="true">
                <MockScreen
                  key={`improve-${improveRun}`}
                  className={`pj-development-wherever-scan${improveRun || reduced ? " pj-development-wherever-scan--play" : ""}`}
                >
                  <MockBefore />
                  <MockAfter />
                  <div className="pj-development-wherever-scanline" />
                </MockScreen>
              </div>
              <ol className="pj-development-wherever-steps" aria-label="How an improvement works">
                {STEPS.map((step, index) => {
                  const isLit = index < litSteps;
                  const isLast = index === STEPS.length - 1;
                  return (
                    <li
                      key={step}
                      className={`pj-development-wherever-step${isLit ? " pj-development-wherever-step--lit" : ""}${isLit && isLast ? " pj-development-wherever-step--complete" : ""}`}
                    >
                      {step}
                    </li>
                  );
                })}
              </ol>
            </div>
            <div>
              <p className="pj-development-wherever-kicker">Already live</p>
              <h3 className="pj-development-wherever-card-title">Improve Something Existing</h3>
            </div>
            <ul className="pj-development-wherever-tags" aria-label="Best for">
              {IMPROVE_TAGS.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
            <div className="pj-development-wherever-cta-wrap">
              <a className="pj-development-wherever-btn pj-development-wherever-btn--dark" href={CONTACT_HREF}>
                Improve My Product<Arrow />
              </a>
            </div>
          </article>
        </div>

        {/* ---------- MERGE ---------- */}
        <div
          ref={mergeRef}
          className={`pj-development-wherever-merge${mergeInView ? " pj-development-wherever-merge--in" : ""}`}
        >
          <div className="pj-development-wherever-merge-labels">
            <span className="pj-development-wherever-merge-left">New build</span>
            <span className="pj-development-wherever-merge-or">or</span>
            <span className="pj-development-wherever-merge-right">Existing product</span>
          </div>
          <svg className="pj-development-wherever-merge-svg" viewBox="0 0 100 42" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="pj-development-wherever-gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#1D5CFF" />
                <stop offset="100%" stopColor="#12C9E0" />
              </linearGradient>
            </defs>
            <path d="M28 0 C28 22 45 19 53 42" vectorEffect="non-scaling-stroke" />
            <path d="M78 0 C78 22 61 19 53 42" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="pj-development-wherever-merge-pill">
            <span aria-hidden="true" />
            <span>ProJenius Development Journey</span>
          </div>
        </div>
      </div>
    </section>
  );
}
