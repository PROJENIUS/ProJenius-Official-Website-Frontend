import { useCallback, useEffect, useRef, useState } from "react";
import "./OurApproach.css";

/* =========================================================
   OUR APPROACH — DATA
========================================================= */
const AUTO_HOVER_DELAY = 5000;

const BLOCKS = [
  {
    num: "01",
    title: "Business goal",
    question: "What are you trying to achieve?",
    points: ["The outcome that defines success", "The priorities that matter most", "How the solution supports the business"],
  },
  {
    num: "02",
    title: "User need",
    question: "Who will use the solution and what should their experience be?",
    points: ["Who the users really are", "What they need to get done", "Where the experience should feel effortless"],
  },
  {
    num: "03",
    title: "Business constraints",
    question: "Budget, timeline, resources and existing systems.",
    points: ["Budget and delivery timeline", "Team and resources available", "Systems you already rely on"],
  },
  {
    num: "04",
    title: "Future growth",
    question: "How should the solution evolve as the business grows?",
    points: ["New features and more users over time", "Integrations you may need later", "A foundation that can scale"],
  },
];

const FLOW = [
  { title: "Requirement", sub: "What you bring us" },
  { title: "Understanding", sub: "Goals, users, constraints" },
  { title: "Strategy", sub: "The approach that fits" },
  { title: "Right solution", sub: "Shaped around your need" },
];

/* =========================================================
   OUR APPROACH — HELPERS
========================================================= */
function useInView(threshold = 0.1) {
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
        if (!entry.isIntersecting) return;
        setInView(true);
        observer.disconnect();
      },
      { threshold, rootMargin: "0px 0px -4% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

const isDesktop = () =>
  typeof window !== "undefined" && window.matchMedia("(min-width: 901px)").matches;

/* =========================================================
   OUR APPROACH — COMPONENT
========================================================= */
export default function OurApproach() {
  const [active, setActive] = useState(0);
  const [ref, inView] = useInView();
  const pausedRef = useRef(false);

  const activateNext = useCallback(() => {
    setActive((current) => (current + 1) % BLOCKS.length);
  }, []);

  /* Auto-rotate cards (skipped for reduced motion, paused on hover / focus) */
  useEffect(() => {
    if (!inView) return undefined;
    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return undefined;
    const timer = window.setInterval(() => {
      if (!pausedRef.current) activateNext();
    }, AUTO_HOVER_DELAY);
    return () => window.clearInterval(timer);
  }, [inView, activateNext]);

  const handleCardEnter = (index, event) => {
    if (!isDesktop() || event.pointerType !== "mouse") return;
    pausedRef.current = true;
    setActive(index);
  };
  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
  };
  const handleFlowHover = (index, event) => {
    if (isDesktop() && event.pointerType === "mouse") setActive(index);
  };

  return (
    <section
      id="pj-development-approach"
      ref={ref}
      className={`pj-development-approach${inView ? " pj-development-approach--in" : ""}`}
      aria-labelledby="pj-development-approach-title"
    >
      <div className="pj-development-approach-wrap">
        {/* ---------- EYEBROW ---------- */}
        <div className="pj-development-approach-rv">
          <span className="pj-development-approach-eyebrow">Our approach</span>
        </div>

        {/* ---------- HEADING ---------- */}
        <h2
          id="pj-development-approach-title"
          className="pj-development-approach-title pj-development-approach-rv pj-development-approach-rv--d1"
        >
          We Don't Start With Technology.
        </h2>
        <p className="pj-development-approach-claim pj-development-approach-rv pj-development-approach-rv--d2">
          We Start With the Problem.
        </p>
        <p className="pj-development-approach-lead pj-development-approach-rv pj-development-approach-rv--d3">
          Before choosing a platform, architecture or development approach, we understand what you are
          trying to achieve, who you are building for and what constraints matter.
        </p>

        {/* ---------- CARDS ---------- */}
        <div
          className="pj-development-approach-blocks pj-development-approach-rv pj-development-approach-rv--d3"
          onPointerLeave={resume}
          onFocus={pause}
          onBlur={resume}
        >
          {BLOCKS.map((block, index) => {
            const isActive = active === index;
            return (
              <article
                key={block.num}
                className={`pj-development-approach-block${isActive ? " pj-development-approach-block--active" : ""}`}
                onPointerEnter={(event) => handleCardEnter(index, event)}
              >
                <button
                  type="button"
                  className="pj-development-approach-block-head"
                  aria-expanded={isActive}
                  aria-controls={`pj-development-approach-panel-${index}`}
                  onClick={() => setActive(index)}
                >
                  <span className="pj-development-approach-block-num">{block.num}</span>
                  <span className="pj-development-approach-block-title">{block.title}</span>
                  <span className="pj-development-approach-block-q">{block.question}</span>
                </button>
                <div id={`pj-development-approach-panel-${index}`} className="pj-development-approach-panel">
                  <ul className="pj-development-approach-points">
                    {block.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>

        {/* ---------- JOURNEY BAND ---------- */}
        <div className="pj-development-approach-band">
          <p className="pj-development-approach-band-caption">
            Every project moves along the same path, from what you asked for to what you actually need.
          </p>
          <div className="pj-development-approach-flow" role="group" aria-label="From requirement to the right solution">
            <div className="pj-development-approach-flow-line" aria-hidden="true">
              <span className={`pj-development-approach-flow-progress pj-development-approach-flow-progress--step-${active}`} />
            </div>
            {FLOW.map((item, index) => {
              const isActive = active === index;
              return (
                <button
                  key={item.title}
                  type="button"
                  className={`pj-development-approach-flow-step${isActive ? " pj-development-approach-flow-step--active" : ""}`}
                  aria-current={isActive ? "step" : undefined}
                  onClick={() => setActive(index)}
                  onPointerEnter={(event) => handleFlowHover(index, event)}
                >
                  <span className="pj-development-approach-flow-node" aria-hidden="true">
                    <span />
                  </span>
                  <span className="pj-development-approach-flow-title">{item.title}</span>
                  <span className="pj-development-approach-flow-sub">{item.sub}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
