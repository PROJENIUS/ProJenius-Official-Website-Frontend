import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./WhereverYouAre.css";
import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../../../Common/SectionTitleLine/SectionTitleLine.jsx";

/* =========================================================
   WHEREVER YOU ARE — DATA
========================================================= */
const contactHref = (from) => `/contact?type=development&from=${from}`;

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
        <div className="pj-development-wherever-mock-blinks">
          <span>HOME</span><span>ABOUT US</span><span>SERVICES</span><span>GALLERY</span><span>NEWS</span><span>CONTACT</span>
        </div>
      </div>
      <div className="pj-development-wherever-mock-bhero">
        <div className="pj-development-wherever-mock-bcopy">
          <p className="pj-development-wherever-mock-btitle">Welcome to Our Website!!</p>
          <div className="pj-development-wherever-mock-p" /><div className="pj-development-wherever-mock-p" />
          <div className="pj-development-wherever-mock-p" /><div className="pj-development-wherever-mock-p" />
          <div className="pj-development-wherever-mock-bbtns"><i>Click here</i><i>More info</i><i>Login</i></div>
        </div>
        <div className="pj-development-wherever-mock-bimg" />
      </div>
      <div className="pj-development-wherever-mock-btiles"><i /><i /><i /><i /></div>
      <span className="pj-development-wherever-mock-issue">Slow to load</span>
      <span className="pj-development-wherever-mock-issue pj-development-wherever-mock-issue--b">Hard to use on mobile</span>
    </div>
  );
}

/* Improve card — the SAME site as MockBefore, redesigned, with its two issues fixed */
function MockImproved() {
  return (
    <div className="pj-development-wherever-mock-layer pj-development-wherever-mock-after">
      <div className="pj-development-wherever-mock-nav">
        <span className="pj-development-wherever-mock-brand"><span className="pj-development-wherever-mock-logo" />YourBrand</span>
        <div className="pj-development-wherever-mock-links">
          <span>About</span><span>Services</span><span>Gallery</span><b>Contact us</b>
        </div>
      </div>
      <div className="pj-development-wherever-mock-hero">
        <div>
          <p className="pj-development-wherever-mock-title">Welcome to<br /><em>YourBrand.</em></p>
          <div className="pj-development-wherever-mock-p" />
          <div className="pj-development-wherever-mock-p pj-development-wherever-mock-p--s" />
          <span className="pj-development-wherever-mock-cta">Get started</span>
        </div>
        <div className="pj-development-wherever-mock-photo"><span /></div>
      </div>
      <div className="pj-development-wherever-mock-tiles pj-development-wherever-mock-tiles--4">
        <div className="pj-development-wherever-mock-tile"><span className="pj-development-wherever-mock-ico" />Services</div>
        <div className="pj-development-wherever-mock-tile"><span className="pj-development-wherever-mock-ico" />Gallery</div>
        <div className="pj-development-wherever-mock-tile"><span className="pj-development-wherever-mock-ico" />News</div>
        <div className="pj-development-wherever-mock-tile"><span className="pj-development-wherever-mock-ico" />Contact</div>
      </div>
      <span className="pj-development-wherever-mock-fixed">Faster loading</span>
      <span className="pj-development-wherever-mock-fixed pj-development-wherever-mock-fixed--b">Mobile-friendly</span>
    </div>
  );
}

/* New card — a brand-new product (an app dashboard) built from a blank canvas */
function MockNewProduct() {
  return (
    <div className="pj-development-wherever-mock-layer pj-development-wherever-mock-app">
      <aside className="pj-development-wherever-app-side">
        <span className="pj-development-wherever-mock-logo" />
        <i className="is-on" /><i /><i /><i />
      </aside>
      <div className="pj-development-wherever-app-main">
        <div className="pj-development-wherever-app-top">
          <p className="pj-development-wherever-app-title">Dashboard</p>
          <span className="pj-development-wherever-mock-live"><i />Live</span>
          <span className="pj-development-wherever-app-avatar" />
        </div>
        <div className="pj-development-wherever-app-kpis">
          <div className="pj-development-wherever-app-kpi"><span>Users</span><b /><em style={{ width: "62%" }} /></div>
          <div className="pj-development-wherever-app-kpi"><span>Orders</span><b /><em style={{ width: "48%" }} /></div>
          <div className="pj-development-wherever-app-kpi"><span>Revenue</span><b /><em style={{ width: "74%" }} /></div>
        </div>
        <div className="pj-development-wherever-app-chart">
          <span className="pj-development-wherever-app-chart-label">This week</span>
          <svg viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <path className="pj-development-wherever-app-area" d="M0 52 L28 44 L56 47 L84 32 L112 36 L140 20 L168 24 L200 8 V60 H0Z" />
            <path className="pj-development-wherever-app-line" d="M0 52 L28 44 L56 47 L84 32 L112 36 L140 20 L168 24 L200 8" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function MockScreen({ className, children, outside = null }) {
  return (
    <div className={`pj-development-wherever-mock ${className}`}>
      <div className="pj-development-wherever-mock-screen">{children}</div>
      {outside}
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

/* Scroll-linked drawing for the joining lines: --pj-merge goes 0 → 1 as the
   diagram moves up the screen (lines draw from both sides to the centre),
   and back to 0 when scrolling up (lines pull back). Written straight to the
   element's style, so scrolling never re-renders React. When fully drawn
   the element gets --joined (pill lights up, pulses flow). */
function useScrollDraw() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const reduced =
      typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.style.setProperty("--pj-merge", "1");
      el.classList.add("pj-development-wherever-merge--joined");
      return undefined;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      /* Starts when the diagram's top reaches 92% of the screen height,
         fully joined when it reaches 50%. */
      const startY = vh * 0.92;
      const endY = vh * 0.5;
      const progress = Math.min(1, Math.max(0, (startY - rect.top) / (startY - endY)));
      el.style.setProperty("--pj-merge", progress.toFixed(3));
      el.classList.toggle("pj-development-wherever-merge--joined", progress >= 0.99);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);
  return ref;
}

/* =========================================================
   WHEREVER YOU ARE — COMPONENT
========================================================= */
export default function WhereverYouAre() {
  const reduced = useReducedMotion();
  const [headRef, headIn] = useInView(0.2);
  const [newRef, newInView] = useInView(0.25);
  const [improveRef, improveInView] = useInView(0.25);
  const mergeRef = useScrollDraw();

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
          <p className="pjds-eyebrow pjds-eyebrow--on-dark">Where You Start</p>
          <h2 id="pj-development-wherever-title" className="pj-development-wherever-head-title">
            Wherever You Are, <TypedPhrase phrases={["We Can Start.", "We Can Help."]} />
          </h2>
          <SectionTitleLine />
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
                <MockNewProduct />
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
              <Link className="pj-development-wherever-btn pj-development-wherever-btn--primary" to={contactHref("start-new")}>
                Build Something New<Arrow />
              </Link>
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
                  outside={(
                    <>
                      <span className="pj-development-wherever-mock-tag pj-development-wherever-mock-tag--before">Before</span>
                      <span className="pj-development-wherever-mock-tag pj-development-wherever-mock-tag--after">After</span>
                    </>
                  )}
                >
                  <MockBefore />
                  <MockImproved />
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
              <Link className="pj-development-wherever-btn pj-development-wherever-btn--dark" to={contactHref("start-existing")}>
                Improve My Product<Arrow />
              </Link>
            </div>
          </article>
        </div>

        {/* ---------- MERGE ---------- */}
        <div
          ref={mergeRef}
          className="pj-development-wherever-merge"
        >
          <div className="pj-development-wherever-merge-labels">
            <span className="pj-development-wherever-merge-left">New build</span>
            <span className="pj-development-wherever-merge-or">or</span>
            <span className="pj-development-wherever-merge-right">Existing product</span>
          </div>
          <svg className="pj-development-wherever-merge-svg" viewBox="0 0 100 42" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="pj-development-wherever-gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0478a8" />
                <stop offset="100%" stopColor="#20c8f5" />
              </linearGradient>
            </defs>
            {/* Faint track, the drawing line, then the flowing pulse, for each side */}
            <path className="pj-development-wherever-merge-track" d="M28 0 C28 22 45 19 53 42" vectorEffect="non-scaling-stroke" />
            <path className="pj-development-wherever-merge-track" d="M78 0 C78 22 61 19 53 42" vectorEffect="non-scaling-stroke" />
            <path className="pj-development-wherever-merge-draw" d="M28 0 C28 22 45 19 53 42" pathLength="1" vectorEffect="non-scaling-stroke" />
            <path className="pj-development-wherever-merge-draw" d="M78 0 C78 22 61 19 53 42" pathLength="1" vectorEffect="non-scaling-stroke" />
            <path className="pj-development-wherever-merge-pulse" d="M28 0 C28 22 45 19 53 42" pathLength="1" vectorEffect="non-scaling-stroke" />
            <path className="pj-development-wherever-merge-pulse pj-development-wherever-merge-pulse--b" d="M78 0 C78 22 61 19 53 42" pathLength="1" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="pj-development-wherever-merge-pill">
            <span aria-hidden="true" />
            <span>Either Way, It Starts With a Conversation</span>
          </div>
        </div>
      </div>
    </section>
  );
}
