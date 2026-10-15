import { useEffect, useRef, useState } from "react";
import "./DevelopmentHero.css";

/* =========================================================
   DEVELOPMENT HERO — DATA
========================================================= */
const CONTACT_HREF = "/contact";
const PROCESS_HREF = "#pj-development-process";

const MAIN_PATH =
  "M270 60C270 105 250 105 250 150C250 195 290 195 290 240C290 285 250 285 250 330C250 375 290 375 290 420C290 465 250 465 250 510C250 555 280 555 280 600";
const LOOP_PATH =
  "M280 600C335 645 585 650 585 400C585 150 585 60 420 60L306 60";

const NODES = [
  { x: 270, y: 60, label: "Your requirement", first: true },
  { x: 250, y: 150, label: "Understand" },
  { x: 290, y: 240, label: "Design" },
  { x: 250, y: 330, label: "Build" },
  { x: 290, y: 420, label: "Integrate" },
  { x: 250, y: 510, label: "Launch" },
  { x: 280, y: 600, label: "Improve" },
];

const SATS = [
  { label: "Data", x: 400, y: 140, w: 58, to: [250, 150] },
  { label: "UI/UX", x: 445, y: 235, w: 68, to: [290, 240] },
  { label: "Web", x: 385, y: 300, w: 52, to: [250, 330] },
  { label: "Mobile", x: 490, y: 345, w: 72, to: [250, 330] },
  { label: "SaaS", x: 395, y: 385, w: 60, to: [250, 330] },
  { label: "AI", x: 415, y: 455, w: 46, to: [290, 420] },
  { label: "Automation", x: 505, y: 410, w: 104, to: [290, 420] },
];

/* =========================================================
   DEVELOPMENT HERO — COMPONENT
========================================================= */
export default function DevelopmentHero() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  /* Start animations once the hero is on screen */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="pj-development-overview"
      className={`pj-development-hero${isVisible ? " pj-development-hero--visible" : ""}`}
      ref={sectionRef}
      aria-labelledby="pj-development-hero-title"
    >
      <div className="pj-development-hero-background" aria-hidden="true" />

      <div className="pj-development-hero-inner">
        <div className="pj-development-hero-content">
          {/* ---------- LEFT COPY ---------- */}
          <div className="pj-development-hero-copy">
            <div className="pj-development-hero-eyebrow">
              <span className="pj-development-hero-eyebrow-dot" aria-hidden="true" />
              <span>DIGITAL DEVELOPMENT</span>
            </div>

            <h1 id="pj-development-hero-title" className="pj-development-hero-title">
              <span className="pj-development-hero-title-line">From Requirements</span>
              <span className="pj-development-hero-title-line">to Digital Products.</span>
              <span className="pj-development-hero-title-line pj-development-hero-title-line--cyan">
                Built Around Your
              </span>
              <span className="pj-development-hero-title-line pj-development-hero-title-line--cyan">
                Business.
              </span>
            </h1>

            <p className="pj-development-hero-description">
              We design and build websites, web apps, mobile apps, SaaS platforms,
              AI solutions, and automation tools based on your business needs.
            </p>

            <div className="pj-development-hero-actions">
              <a href={CONTACT_HREF} className="pj-development-hero-button">
                <span>Start a Project</span>
                <span aria-hidden="true">→</span>
              </a>
              <a
                href={PROCESS_HREF}
                className="pj-development-hero-button pj-development-hero-button--secondary"
              >
                <span>Explore How We Work</span>
                <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>

          {/* ---------- RIGHT JOURNEY (decorative) ---------- */}
          <div className="pj-development-hero-journey" aria-hidden="true">
            <svg className="pj-development-hero-svg" viewBox="0 0 620 680" focusable="false">
              <defs>
                <linearGradient id="pj-development-hero-gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#1769FF" />
                  <stop offset="50%" stopColor="#278DFF" />
                  <stop offset="100%" stopColor="#25D2E8" />
                </linearGradient>
              </defs>

              {SATS.map((item, index) => (
                <path
                  key={`tie-${item.label}`}
                  className={`pj-development-hero-tie pj-development-hero-i${index}`}
                  d={`M${item.x} ${item.y}L${item.to[0]} ${item.to[1]}`}
                />
              ))}

              <path
                className="pj-development-hero-loop"
                d={LOOP_PATH}
                pathLength="1"
                stroke="url(#pj-development-hero-gradient)"
              />
              <polygon className="pj-development-hero-loop-arrow" points="298,60 311,53 311,67" />
              <path
                id="pj-development-hero-main-path"
                className="pj-development-hero-path"
                d={MAIN_PATH}
                pathLength="1"
                stroke="url(#pj-development-hero-gradient)"
              />

              {NODES.map((node, index) => (
                <g key={node.label} className={`pj-development-hero-node pj-development-hero-i${index}`}>
                  {node.first && (
                    <>
                      <circle className="pj-development-hero-pulse" cx={node.x} cy={node.y} r="18" />
                      <circle
                        className="pj-development-hero-pulse pj-development-hero-pulse--second"
                        cx={node.x}
                        cy={node.y}
                        r="18"
                      />
                    </>
                  )}
                  <circle
                    className="pj-development-hero-ring"
                    cx={node.x}
                    cy={node.y}
                    r={node.first ? 18 : 13}
                    stroke="url(#pj-development-hero-gradient)"
                  />
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.first ? 8 : 5.5}
                    fill="url(#pj-development-hero-gradient)"
                  />
                  <text
                    className={`pj-development-hero-label${node.first ? " pj-development-hero-label--first" : ""}`}
                    x={node.x - (node.first ? 28 : 24)}
                    y={node.y}
                    textAnchor="end"
                    dominantBaseline="central"
                  >
                    {node.label}
                  </text>
                </g>
              ))}

              {isVisible && (
                <circle className="pj-development-hero-packet" r="5.5" opacity="0">
                  <set attributeName="opacity" to="1" begin="2.7s" />
                  <animateMotion dur="7s" begin="2.7s" repeatCount="indefinite">
                    <mpath href="#pj-development-hero-main-path" />
                  </animateMotion>
                </circle>
              )}

              {SATS.map((item, index) => (
                <g key={`sat-${item.label}`} className={`pj-development-hero-sat pj-development-hero-i${index}`}>
                  <g transform={`translate(${item.x} ${item.y})`}>
                    <g className="pj-development-hero-sat-float">
                      <rect
                        className="pj-development-hero-chip"
                        x={-(item.w + 10) / 2}
                        y="-16"
                        width={item.w + 10}
                        height="32"
                        rx="16"
                      />
                      <text
                        className="pj-development-hero-chip-text"
                        x="0"
                        y="0"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        {item.label}
                      </text>
                    </g>
                  </g>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>

      <div className="pj-development-hero-zigzag" aria-hidden="true">
        <div className="pj-development-hero-zigzag-cyan" />
        <div className="pj-development-hero-zigzag-white" />
      </div>
    </section>
  );
}
