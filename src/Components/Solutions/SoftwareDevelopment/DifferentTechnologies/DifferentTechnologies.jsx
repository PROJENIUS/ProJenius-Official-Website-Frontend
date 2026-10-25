import { useEffect, useRef, useState } from "react";
import "./DifferentTechnologies.css";

/* =========================================================
   DIFFERENT TECHNOLOGIES — DATA
   (x / y are only used for the SVG lines; node positions live in the CSS)
========================================================= */
const NODES = [
  { label: "UI/UX", x: 50, y: 13, cap: "Experiences designed before they are built." },
  { label: "Automation", x: 74, y: 23.8, cap: "Connected, repeatable workflows." },
  { label: "SaaS", x: 84, y: 50, cap: "Multi-user platforms that scale with you." },
  { label: "Integrations", x: 74, y: 76.2, cap: "APIs and systems working together." },
  { label: "Data", x: 50, y: 87, cap: "Dashboards, reporting and insight." },
  { label: "Mobile", x: 26, y: 76.2, cap: "Applications for phones and tablets." },
  { label: "AI", x: 16, y: 50, cap: "Intelligent features where they add value." },
  { label: "Web", x: 26, y: 23.8, cap: "Websites, portals and web applications." },
];

const DEFAULT_CAPTION = "Hover or tap a node to see how it connects.";

/* =========================================================
   DIFFERENT TECHNOLOGIES — COMPONENT
========================================================= */
export default function DifferentTechnologies() {
  const [hot, setHot] = useState(null);
  const [inView, setInView] = useState(false);
  const stageRef = useRef(null);

  /* Draw the diagram once it is on screen */
  useEffect(() => {
    const el = stageRef.current;
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
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* Hover only for a real mouse, so taps on touch screens don't flicker */
  const handleEnter = (index, event) => {
    if (event.pointerType === "mouse") setHot(index);
  };
  const handleLeave = (event) => {
    if (event.pointerType === "mouse") setHot(null);
  };

  return (
    <section
      id="pj-development-technologies"
      className="pj-development-technologies"
      aria-labelledby="pj-development-technologies-title"
    >
      <div className="pj-development-technologies-wrap">
        {/* ---------- LEFT COPY ---------- */}
        <div className="pj-development-technologies-copy">
          <h2 id="pj-development-technologies-title" className="pj-development-technologies-title">
            Different Technologies.
            <br />
            <span className="pj-development-technologies-title-accent">One Requirement.</span>
          </h2>
          <p className="pj-development-technologies-statement">
            We don't force every project into the same technology or architecture. The solution is shaped around the requirement.
          </p>
        </div>

        {/* ---------- RIGHT DIAGRAM ---------- */}
        <div className="pj-development-technologies-diagram-wrap">
          <div ref={stageRef} className={`pj-development-technologies-stage${inView ? " pj-development-technologies-stage--in" : ""}`}>
            <div className="pj-development-technologies-ring pj-development-technologies-ring--outer" aria-hidden="true" />
            <div className="pj-development-technologies-ring pj-development-technologies-ring--inner" aria-hidden="true" />

            <svg className="pj-development-technologies-lines" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
              {NODES.map((node, index) => (
                <line
                  key={node.label}
                  className={`pj-development-technologies-line pj-development-technologies-line--${index + 1}${hot === index ? " pj-development-technologies-line--hot" : ""}`}
                  x1="50%"
                  y1="50%"
                  x2={`${node.x}%`}
                  y2={`${node.y}%`}
                  pathLength="1"
                />
              ))}
            </svg>

            <div className="pj-development-technologies-core">
              <span>Your business<br />requirement</span>
            </div>

            {NODES.map((node, index) => {
              const isHot = hot === index;
              return (
                <button
                  key={node.label}
                  type="button"
                  className={`pj-development-technologies-node pj-development-technologies-node--${index + 1}${isHot ? " pj-development-technologies-node--hot" : ""}`}
                  onPointerEnter={(event) => handleEnter(index, event)}
                  onPointerLeave={handleLeave}
                  onFocus={() => setHot(index)}
                  onBlur={() => setHot(null)}
                  onClick={() => setHot((current) => (current === index ? null : index))}
                  aria-pressed={isHot}
                >
                  {node.label}
                </button>
              );
            })}
          </div>

          <p className="pj-development-technologies-caption" aria-live="polite">
            {hot === null ? DEFAULT_CAPTION : `${NODES[hot].label}: ${NODES[hot].cap}`}
          </p>
        </div>
      </div>
    </section>
  );
}
