import { useEffect, useRef, useState } from "react";
import "./LaunchingIsNotTheEnd.css";

const P = "pj-development-launching";

/* =========================================================
   LAUNCHING IS NOT THE END — DATA
========================================================= */
const TRACK = ["Build", "Launch", "Monitor", "Maintain", "Improve", "Grow"];

const ICONS = {
  content: (<><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></>),
  bug: (<><rect x="8" y="8" width="8" height="11" rx="4" /><path d="M9 8a3 3 0 016 0M4 12h4M16 12h4M5 6l3 3M19 6l-3 3M5 19l3-3M19 19l-3-3M12 11v8" /></>),
  perf: (<><path d="M4 17a8 8 0 1116 0" /><path d="M12 17l4-5M4 21h16" /></>),
  feature: (<><rect x="3.5" y="3.5" width="17" height="17" rx="4" /><path d="M12 8v8M8 12h8" /></>),
  uiux: (<><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M10 4v16M3 10h7" /></>),
  support: (<><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3.5" /><path d="M5.6 5.6l3.9 3.9M14.5 14.5l3.9 3.9M18.4 5.6l-3.9 3.9M9.5 14.5l-3.9 3.9" /></>),
  shield: (<><path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6l8-3z" /><path d="M8.5 12l2.5 2.5 4.5-5" /></>),
  review: (<><rect x="3.5" y="5" width="17" height="15.5" rx="3" /><path d="M8 3v4M16 3v4M3.5 10h17M9 15l2 2 4-4" /></>),
};

const ITEMS = [
  { icon: "content", title: "Content updates", text: "Keep pages, copy and media current." },
  { icon: "bug", title: "Bug fixes", text: "Resolve issues quickly and safely." },
  { icon: "perf", title: "Performance improvements", text: "Stay fast as usage grows." },
  { icon: "feature", title: "Feature enhancements", text: "Add what your users need next." },
  { icon: "uiux", title: "UI / UX improvements", text: "Refine flows based on real use." },
  { icon: "support", title: "Technical support", text: "Help when you need it." },
  { icon: "shield", title: "Security / component updates", text: "Keep protections and components current." },
  { icon: "review", title: "Periodic digital reviews", text: "Regular check-ins on how the product is doing." },
];

/* =========================================================
   LAUNCHING IS NOT THE END — HELPERS
========================================================= */
function useInView(threshold = 0.12, rootMargin = "0px 0px -4% 0px") {
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
      { threshold, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);
  return [ref, inView];
}

/* =========================================================
   LAUNCHING IS NOT THE END — COMPONENT
========================================================= */
export default function LaunchingIsNotTheEnd() {
  const [sectionRef, inView] = useInView(0.12, "0px 0px -5% 0px");
  const [headRef, headIn] = useInView(0.2);
  const [activeTrack, setActiveTrack] = useState(TRACK.length - 1);
  const pausedRef = useRef(false);

  /* Auto-advance the journey (skipped for reduced motion, paused while the user interacts) */
  useEffect(() => {
    if (!inView) return undefined;
    const reduced = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return undefined;
    const timer = window.setInterval(() => {
      if (!pausedRef.current) setActiveTrack((current) => (current + 1) % TRACK.length);
    }, 1400);
    return () => window.clearInterval(timer);
  }, [inView]);

  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
  };

  return (
    <section
      ref={sectionRef}
      id="pj-development-launching"
      className={`${P}${inView ? ` ${P}--in` : ""}`}
      aria-labelledby="pj-development-launching-title"
    >
      <div className={`${P}-wrap`}>
        {/* ---------- HEADING ---------- */}
        <div ref={headRef} className={`${P}-head${headIn ? ` ${P}-head--in` : ""}`}>
          <h2 id="pj-development-launching-title" className={`${P}-head-title`}>Launching Is Not the End.</h2>
          <p className={`${P}-head-text`}>
            We can continue supporting your digital product beyond the initial launch, helping you maintain, improve and adapt it as your needs change.
          </p>
        </div>

        {/* ---------- JOURNEY ---------- */}
        <div className={`${P}-journey`} role="group" aria-label="Post-launch journey">
          <div className={`${P}-track`} onPointerEnter={pause} onPointerLeave={resume} onFocus={pause} onBlur={resume}>
            <div className={`${P}-journey-line`} aria-hidden="true">
              <span className={`${P}-journey-progress ${P}-journey-progress--step-${activeTrack}`} />
            </div>

            {TRACK.map((title, index) => (
              <button
                key={title}
                type="button"
                className={`${P}-track-item${index === activeTrack ? ` ${P}-track-item--active` : ""}${index < activeTrack ? ` ${P}-track-item--done` : ""}`}
                aria-current={index === activeTrack ? "step" : undefined}
                onClick={() => setActiveTrack(index)}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") setActiveTrack(index);
                }}
              >
                <span className={`${P}-track-dot`} aria-hidden="true" />
                <span className={`${P}-track-title`}>{title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ---------- SUPPORT GRID ---------- */}
        <div className={`${P}-grid`}>
          {ITEMS.map((item, index) => (
            <article key={item.title} className={`${P}-item ${P}-item--${index + 1}`}>
              <svg className={`${P}-icon`} viewBox="0 0 24 24" aria-hidden="true" focusable="false">{ICONS[item.icon]}</svg>
              <h3 className={`${P}-item-title`}>{item.title}</h3>
              <p className={`${P}-item-text`}>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
