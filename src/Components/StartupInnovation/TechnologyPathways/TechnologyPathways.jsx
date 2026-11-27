import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import TypedPhrase from "../../Common/TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../../Common/SectionTitleLine/SectionTitleLine.jsx";
import { SERVICE_ROUTES } from "../../Solutions/Shared/serviceLinks.js";
import "./TechnologyPathways.css";

/* =============================================================================
   TECHNOLOGY PATHWAYS — "Your Idea Determines the Path."
   Left: a "Your idea" card. Curved lines branch from it to five numbered
   rows. Each row goes straight to the ProJenius solution page that builds
   that kind of idea; hovering or focusing a row lights its curve in cyan.
   The curves are measured from the real row positions (ResizeObserver).
   On narrow screens the curves are hidden and the card sits above the rows.
   ============================================================================= */

/* One row per ProJenius solution (Solutions-menu order), then incubation.
   Each kind of idea goes straight to the team that builds it; no page is
   listed twice. */
const PATHS = [
  { key: "software", label: "SaaS, AI & Automation", sub: "Platforms, apps, AI features and automated workflows", page: "Software Development", to: SERVICE_ROUTES.software },
  { key: "pcb", label: "Custom Circuit Board", sub: "A board designed, made and tested for your product", page: "PCB Design & Fabrication", to: SERVICE_ROUTES.pcb },
  { key: "iot", label: "IoT & Embedded Device", sub: "Sensors, firmware and connected devices", page: "Hardware & Embedded Systems", to: SERVICE_ROUTES.hardware },
  { key: "product", label: "Complete Physical Product", sub: "Enclosure, electronics and app, built end to end", page: "Rapid Prototyping", to: SERVICE_ROUTES.prototyping },
  { key: "incubate", label: "Build It Yourself", sub: "A seat, our lab and a team to guide you", page: "Incubate at ProJenius", to: SERVICE_ROUTES.incubate },
];

export default function TechnologyPathways() {
  const [activeKey, setActiveKey] = useState(PATHS[0].key);
  const [curves, setCurves] = useState({ w: 0, h: 0, d: [] });
  const mapRef = useRef(null);
  const dotRef = useRef(null);
  const rowRefs = useRef([]);

  /* Curves from the card's dot to the left edge of each row's header */
  const measure = useCallback(() => {
    const map = mapRef.current;
    const dot = dotRef.current;
    if (!map || !dot) return;
    const box = map.getBoundingClientRect();
    const o = dot.getBoundingClientRect();
    const ox = o.left + o.width / 2 - box.left;
    const oy = o.top + o.height / 2 - box.top;
    const d = rowRefs.current.map((row) => {
      if (!row) return "";
      const head = row.firstElementChild.getBoundingClientRect();
      const tx = head.left - box.left;
      const ty = head.top + head.height / 2 - box.top;
      const dx = (tx - ox) * 0.55;
      return `M${ox} ${oy} C${ox + dx} ${oy}, ${tx - dx} ${ty}, ${tx} ${ty}`;
    });
    setCurves({ w: box.width, h: box.height, d });
  }, []);

  useLayoutEffect(() => {
    measure();
    if (typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(measure);
    if (mapRef.current) observer.observe(mapRef.current);
    rowRefs.current.forEach((row) => row && observer.observe(row));
    return () => observer.disconnect();
  }, [measure]);

  /* Auto-advance every 3 s while the map is on screen; pauses while the
     pointer or keyboard focus is on the rows. Off for reduced motion. */
  const [onScreen, setOnScreen] = useState(false);
  const [paused, setPaused] = useState(false);
  const reduceMotion =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const autoplay = onScreen && !paused && !reduceMotion;

  useEffect(() => {
    const el = mapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!autoplay) return undefined;
    const timer = window.setTimeout(() => {
      setActiveKey((key) => PATHS[(PATHS.findIndex((p) => p.key === key) + 1) % PATHS.length].key);
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [autoplay, activeKey]);

  return (
    <section id="startup-pathways" className="pjsuP" aria-labelledby="startup-pathways-title">
      <div className="pjds-container">
        <header className="pjsuP__head">
          <div>
            <p className="pjds-eyebrow" data-reveal="up">Technology Pathways</p>
            <h2 id="startup-pathways-title" className="pjds-title pjsuP__title" data-reveal="up" data-reveal-delay="1">
              Your Idea Determines <TypedPhrase phrases={["the Path.", "the Technology."]} />
            </h2>
            <SectionTitleLine />
          </div>
          <p className="pjds-lead pjsuP__lead" data-reveal="up" data-reveal-delay="2">
            Different ideas need different combinations of technology, validation and support. Pick your direction
            to go straight to the team that builds it.
          </p>
        </header>

        <div ref={mapRef} className="pjsuP__map" data-reveal="up" data-reveal-delay="2">
          {/* Branch curves (decorative) */}
          {curves.w > 0 && (
            <svg className="pjsuP__curves" width={curves.w} height={curves.h} viewBox={`0 0 ${curves.w} ${curves.h}`} aria-hidden="true">
              {curves.d.map((d, i) => (
                <path key={`base-${PATHS[i].key}`} className="pjsuP__curve" d={d} />
              ))}
              {curves.d.map((d, i) =>
                PATHS[i].key === activeKey ? (
                  <path key={`on-${PATHS[i].key}`} className="pjsuP__curve pjsuP__curve--on" d={d} pathLength="1" />
                ) : null,
              )}
            </svg>
          )}

          <div className="pjsuP__origin">
            <span className="pjsuP__origin-title">Your Idea</span>
            <span className="pjsuP__origin-sub">Where every path begins</span>
            <span ref={dotRef} className="pjsuP__origin-dot" aria-hidden="true" />
          </div>

          <ol
            className={`pjsuP__rows${autoplay ? " is-auto" : ""}`}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            {PATHS.map((path, index) => (
              <li
                key={path.key}
                ref={(el) => { rowRefs.current[index] = el; }}
                className={`pjsuP__row${path.key === activeKey ? " is-on" : ""}`}
              >
                <Link
                  className="pjsuP__row-head"
                  to={path.to}
                  onMouseEnter={() => setActiveKey(path.key)}
                  onFocus={() => setActiveKey(path.key)}
                >
                  <span className="pjsuP__num">{String(index + 1).padStart(2, "0")}</span>
                  <span className="pjsuP__row-text">
                    <span className="pjsuP__row-title">{path.label}</span>
                    <span className="pjsuP__row-sub">{path.sub}</span>
                  </span>
                  <span className="pjsuP__dest">
                    {path.page}
                    <ArrowRight className="pjsuP__arrow" size={18} aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
