import { useCallback, useEffect, useRef, useState } from "react";
import "./HowWeTurn.css";

/* =========================================================
   HOW WE TURN — DATA
========================================================= */
const STAGES = [
  { n: "01", title: "Discover", verb: "Understand", note: "before anything is built", chips: ["Business", "Users", "Goals", "Requirements", "Existing systems"] },
  { n: "02", title: "Plan", verb: "Define", note: "what gets built and why", chips: ["Scope", "Priorities", "Features", "User journeys", "Solution direction"] },
  { n: "03", title: "Design", verb: "Create", note: "the experience first", chips: ["User flows", "Wireframes", "UI", "Prototypes", "Experience structure"] },
  { n: "04", title: "Develop", verb: "Build", note: "the right solution", chips: ["Website", "Application", "SaaS", "AI solution", "Automation", "Digital platform"] },
  { n: "05", title: "Integrate", verb: "Connect", note: "everything it depends on", chips: ["APIs", "Data", "AI services", "External systems", "Required infrastructure"] },
  { n: "06", title: "Test", verb: "Validate", note: "it works for real people", chips: ["Functionality", "Responsiveness", "Usability", "Performance", "Security"] },
  { n: "07", title: "Deploy", verb: "Launch", note: "to real users", text: "Prepare the solution for real users and launch." },
  { n: "08", title: "Support", verb: "Improve", note: "and evolve", text: "Maintain, monitor, improve and evolve the solution." },
];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/* =========================================================
   HOW WE TURN — HELPERS
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

/* =========================================================
   HOW WE TURN — COMPONENT
========================================================= */
export default function HowWeTurn() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const railRef = useRef(null);
  const fillRef = useRef(null);
  const frameRef = useRef(null);
  const [headRef, headIn] = useInView(0.2);
  const [active, setActive] = useState(0);

  /* Scroll position -> rail fill + active stage */
  const updateFromScroll = useCallback(() => {
    frameRef.current = null;
    const rail = railRef.current;
    if (!rail) return;
    const rect = rail.getBoundingClientRect();
    const progress = clamp((window.innerHeight * 0.5 - rect.top) / rect.height, 0, 1);

    if (fillRef.current) fillRef.current.style.strokeDashoffset = String(1 - progress);

    const next = clamp(Math.floor(progress / (1 / STAGES.length)), 0, STAGES.length - 1);
    setActive((current) => (current === next ? current : next));
  }, []);

  const requestUpdate = useCallback(() => {
    if (frameRef.current !== null) return;
    frameRef.current = window.requestAnimationFrame(updateFromScroll);
  }, [updateFromScroll]);

  useEffect(() => {
    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [requestUpdate]);

  /* Heading height -> CSS variable (the left panel sticks below the heading) */
  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    if (!section || !header) return undefined;

    const update = () => {
      section.style.setProperty("--pj-process-header-height", `${header.offsetHeight}px`);
      requestUpdate();
    };
    update();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }
    const observer = new ResizeObserver(update);
    observer.observe(header);
    return () => observer.disconnect();
  }, [requestUpdate]);

  const currentStage = STAGES[active];

  return (
    <section
      id="pj-development-process"
      ref={sectionRef}
      className="pj-development-process"
      aria-labelledby="pj-development-process-title"
    >
      <div className="pj-development-process-wrap">
        {/* ---------- HEADING (sticky on desktop) ---------- */}
        <div ref={headerRef} className="pj-development-process-header-sticky">
          <div ref={headRef} className={`pj-development-process-head${headIn ? " pj-development-process-head--in" : ""}`}>
            <h2 id="pj-development-process-title" className="pj-development-process-head-title">
              How We Turn a Requirement Into Reality.
            </h2>
            <p className="pj-development-process-head-text">
              A structured journey from the first conversation to a working digital product.
            </p>
          </div>
        </div>

        <div className="pj-development-process-layout">
          {/* ---------- LEFT STICKY PANEL (visual duplicate of the list, hidden from screen readers) ---------- */}
          <aside className="pj-development-process-side" aria-hidden="true">
            <div className="pj-development-process-num" key={currentStage.n}>{currentStage.n}</div>
            <div className="pj-development-process-word">{currentStage.title}</div>
            <div className="pj-development-process-count">Stage {active + 1} of {STAGES.length}</div>
            <div className="pj-development-process-ticks">
              {STAGES.map((stage, index) => (
                <i
                  key={stage.n}
                  className={`pj-development-process-tick${index <= active ? " pj-development-process-tick--on" : ""}${index === active ? " pj-development-process-tick--cur" : ""}`}
                />
              ))}
            </div>
          </aside>

          {/* ---------- RIGHT PROCESS ---------- */}
          <div className="pj-development-process-content">
            <div ref={railRef} className="pj-development-process-rail">
              <svg className="pj-development-process-railsvg" width="4" aria-hidden="true" focusable="false">
                <line className="pj-development-process-railtrack" x1="2" y1="0" x2="2" y2="100%" />
                <line ref={fillRef} className="pj-development-process-railfill" x1="2" y1="0" x2="2" y2="100%" pathLength="1" />
              </svg>

              <ol className="pj-development-process-stages">
                {STAGES.map((stage, index) => {
                  let state = "";
                  if (index === active) state = " pj-development-process-stage--active";
                  else if (index < active) state = " pj-development-process-stage--done";
                  else if (index === active + 1) state = " pj-development-process-stage--next";

                  return (
                    <li key={stage.n} className={`pj-development-process-stage${state}`}>
                      <span className="pj-development-process-stage-n">{stage.n}</span>
                      <h3 className="pj-development-process-stage-title">{stage.title}</h3>
                      <span className="pj-development-process-stage-verb"><b>{stage.verb}</b> {stage.note}</span>
                      <div className="pj-development-process-stage-body">
                        {stage.chips ? (
                          <ul className="pj-development-process-chips">
                            {stage.chips.map((chip) => <li key={chip}>{chip}</li>)}
                          </ul>
                        ) : (
                          <p>{stage.text}</p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            <p className="pj-development-process-loop">
              <svg className="pj-development-process-loop-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M20 12a8 8 0 11-2.6-5.9" />
                <path d="M20 4v5h-5" />
              </svg>
              <span>And then the journey continues: new requirements, new opportunities, new growth.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
