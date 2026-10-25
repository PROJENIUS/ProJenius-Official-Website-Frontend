import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import useOnScreen from "../../../../hooks/useOnScreen.js";
import "./WorkshopThatGoesBeyondTheClassroom.css";

/* Circuit-board diagram data (coordinates match the SVG viewBox below) */
const CX = 1285;
const CY = 451;

const nodes = [
  { label: ["Software"], x: 1285, y: 202, labelY: 174, d: "M1285 210 V386" },
  { label: ["AI / ML"], x: 1053, y: 252, labelY: 224, d: "M1053 260 V317 L1148 412 H1218" },
  { label: ["Innovation"], x: 1518, y: 252, labelY: 224, d: "M1518 260 V317 L1423 412 H1352" },
  { label: ["Embedded", "Systems"], x: 997, y: 451, labelY: 483, d: "M1005 451 H1218" },
  { label: ["IoT"], x: 1573, y: 451, labelY: 483, d: "M1352 451 H1565" },
  { label: ["PCB"], x: 1053, y: 650, labelY: 683, d: "M1053 642 V584 L1148 490 H1218" },
  { label: ["Robotics"], x: 1518, y: 650, labelY: 683, d: "M1518 642 V584 L1423 490 H1352" },
  { label: ["3D Printing"], x: 1285, y: 700, labelY: 733, d: "M1285 692 V516" },
];

const pinsTopBottom = [-44, -22, 22, 44];
const pinsSides = [-54, -20, 20, 54];

const HERO_PHRASES = ["Beyond the Classroom", "Into Real Projects", "Into Hands-On Labs"];

const steps = ["Learn", "Explore", "Build", "Test", "Experience"];
const stepX = [1002, 1144, 1286, 1428, 1570];

export default function WorkshopHero() {
  const heroRef = useRef(null);
  const isOnScreen = useOnScreen(heroRef);
  const [active, setActive] = useState(1);

  // Step through Learn → Experience only while the hero is visible and motion is allowed.
  useEffect(() => {
    if (!isOnScreen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const id = setInterval(() => setActive((a) => (a + 1) % steps.length), 2200);
    return () => clearInterval(id);
  }, [isOnScreen]);

  return (
    <section ref={heroRef} className={`wh-hero${isOnScreen ? "" : " is-paused"}`}>
      <div className="wh-container">
        {/* LEFT */}
        <div className="wh-left">
          <p className="pjds-eyebrow pjds-eyebrow--on-dark" data-reveal="up">Workshops &amp; Training</p>
          <h1 className="wh-title" data-reveal="up" data-reveal-delay="1">
            <span className="wh-title-static">Workshops That Go</span>
            <TypedPhrase tone="dark" phrases={HERO_PHRASES} />
          </h1>
          <p className="wh-desc" data-reveal="up" data-reveal-delay="2">
            Hands-on technology workshops designed to help students explore,
            experiment, build, and experience emerging technologies through
            practical learning.
          </p>

          {/* Both buttons used to be <button>s with no action. */}
          <div className="wh-actions" data-reveal="up" data-reveal-delay="3">
            <a href="#workshop-areas" className="wh-btn wh-btn-primary">
              Explore Workshops
            </a>
            <Link to="/contact?type=workshop" className="wh-btn wh-btn-outline">
              Host a Workshop
            </Link>
          </div>

          <div className="wh-audience" data-reveal="up" data-reveal-delay="4">
            <div>
              <p className="wh-audience-title">For students</p>
              <p>Learn a technology, then build something with it.</p>
            </div>
            <div>
              <p className="wh-audience-title">For institutions</p>
              <p>A practical technology session designed around your students.</p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="wh-right">
          <svg
            className="wh-diagram"
            viewBox="940 140 700 720"
            role="img"
            aria-label="Workshop topics connected to a central chip: Software, AI/ML, Innovation, Embedded Systems, IoT, PCB, Robotics and 3D Printing"
          >
            {/* chip pins */}
            {pinsTopBottom.map((o) => (
              <g key={`tb${o}`} className="wh-pin">
                <rect x={CX + o - 3} y={375} width="6" height="10" />
                <rect x={CX + o - 3} y={518} width="6" height="10" />
              </g>
            ))}
            {pinsSides.map((o) => (
              <g key={`s${o}`} className="wh-pin">
                <rect x={1209} y={CY + o - 3} width="10" height="6" />
                <rect x={1352} y={CY + o - 3} width="10" height="6" />
              </g>
            ))}

            {/* traces + moving pulses */}
            {nodes.map((n, i) => (
              <g key={n.label[0]}>
                <path className="wh-trace" d={n.d} />
                <path
                  className="wh-pulse"
                  d={n.d}
                  pathLength="1000"
                  style={{ animationDelay: `${i * 0.45}s` }}
                />
              </g>
            ))}

            {/* chip */}
            <rect className="wh-chip" x="1230" y="396" width="110" height="110" rx="10" />
            <text className="wh-chip-title" x={CX} y="454" textAnchor="middle">Workshop</text>
            <text className="wh-chip-sub" x={CX} y="477" textAnchor="middle">ProJenius</text>

            {/* nodes + labels */}
            {nodes.map((n) => (
              <g key={`n-${n.label[0]}`}>
                <circle className="wh-node" cx={n.x} cy={n.y} r="8" />
                <text className="wh-label" textAnchor="middle">
                  {n.label.map((line, i) => (
                    <tspan key={line} x={n.x} y={n.labelY + i * 18}>{line}</tspan>
                  ))}
                </text>
              </g>
            ))}

            {/* progress timeline */}
            <line className="wh-trace" x1="1002" y1="786" x2="1570" y2="786" />
            {steps.map((s, i) => (
              <g key={s}>
                <circle
                  className={`wh-step ${i === active ? "is-active" : ""}`}
                  cx={stepX[i]}
                  cy="786"
                  r={i === active ? 12 : 10}
                />
                <text
                  className={`wh-step-label ${i === active ? "is-active" : ""}`}
                  x={stepX[i]}
                  y="825"
                  textAnchor="middle"
                >
                  {s}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}