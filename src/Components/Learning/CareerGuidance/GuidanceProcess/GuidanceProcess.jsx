import { useEffect, useRef, useState } from "react";
import { Briefcase, Compass, FileText, ListChecks, Search, Target } from "lucide-react";

import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import useOnScreen from "../../../../hooks/useOnScreen.js";
import "./GuidanceProcess.css";

/* =========================================================
   GUIDANCE PROCESS — six steps on a circle.
   The active step glows, a coloured arc runs from step 1 to
   it, and the centre shows its details. The active step moves
   on every 3 seconds while the section is on screen; pointing
   at or focusing a step selects it and pauses the cycle.
   Phones get the same steps as a vertical list.
========================================================= */

const STEPS = [
  { title: "Profile Review", text: "We evaluate your current background and skills.", color: "blue", Icon: Search },
  { title: "Goal Discussion", text: "We align your interests with real industry roles.", color: "orange", Icon: Target },
  { title: "Skill Gap Analysis", text: "We flag exactly what's missing for your target job.", color: "teal", Icon: ListChecks },
  { title: "Roadmap Creation", text: "You receive a clear, actionable learning timeline.", color: "blue", Icon: Compass },
  { title: "Resume & Prep", text: "We refine your materials and practice interviews.", color: "orange", Icon: FileText },
  { title: "Placement Support", text: "We guide you through applications and hiring.", color: "teal", Icon: Briefcase },
];

const INTERVAL_MS = 3000;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function GuidanceProcess() {
  const sectionRef = useRef(null);
  const isOnScreen = useOnScreen(sectionRef);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!isOnScreen || paused || prefersReducedMotion()) return undefined;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % STEPS.length), INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [isOnScreen, paused]);

  const step = STEPS[active];
  const pause = () => setPaused(true);
  const resume = () => setPaused(false);

  return (
    <section id="guidance-process" ref={sectionRef} className="gp-section" aria-labelledby="gp-title">
      <div className="gp-container">
        <header className="gp-header">
          <p className="pjds-eyebrow" data-reveal="up">Guidance Process</p>
          <h2 id="gp-title" className="gp-title" data-reveal="up" data-reveal-delay="1">
            <span className="gp-title-static">A Practical Path for</span>
            <TypedPhrase phrases={["Students and Freshers", "Your First Tech Role", "Your Next Career Move"]} />
          </h2>
        </header>

        {/* Full list for screen readers (the circle is a visual summary). */}
        <ol className="pjds-sr-only">
          {STEPS.map((item) => <li key={item.title}>{item.title}: {item.text}</li>)}
        </ol>

        {/* ---------- Circle (tablet and desktop) ---------- */}
        <div
          className="gp-orbit"
          data-reveal="up"
          data-reveal-delay="2"
          aria-hidden="true"
          onMouseLeave={resume}
        >
          <svg className="gp-ring" viewBox="0 0 600 600" focusable="false">
            <defs>
              <linearGradient id="gp-ring-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#0b82c8" />
                <stop offset="0.5" stopColor="#e07b0b" />
                <stop offset="1" stopColor="#127a6a" />
              </linearGradient>
            </defs>
            <circle className="gp-ring__base" cx="300" cy="300" r="230" />
            <circle className={`gp-ring__arc gp-ring__arc--${active} gp-ring__arc--${step.color}`} cx="300" cy="300" r="230" pathLength="1" />
          </svg>

          <div key={active} className={`gp-hub gp-hub--${step.color}`}>
            <span className="gp-hub__bar" />
            <span className="gp-hub__tag">Step {active + 1}</span>
            <h3 className="gp-hub__title">{step.title}</h3>
            <p className="gp-hub__text">{step.text}</p>
          </div>

          {STEPS.map(({ title, color, Icon }, index) => (
            <button
              key={title}
              type="button"
              tabIndex={-1}
              className={`gp-node gp-node--${index} gp-node--${color}${index === active ? " is-active" : ""}`}
              onMouseEnter={() => { setActive(index); pause(); }}
              onClick={() => { setActive(index); pause(); }}
            >
              <span className="gp-node__badge">
                <Icon size={16} strokeWidth={2.2} />
                <b>{index + 1}</b>
              </span>
              <span className="gp-node__label">{title}</span>
            </button>
          ))}
        </div>

        {/* ---------- Vertical list (phones) ---------- */}
        <ol className="gp-list" data-reveal="up" data-reveal-delay="2" aria-hidden="true">
          {STEPS.map(({ title, text, color, Icon }, index) => (
            <li key={title} className={`gp-list__item gp-node--${color}${index === active ? " is-active" : ""}`}>
              <span className="gp-node__badge">
                <Icon size={16} strokeWidth={2.2} />
                <b>{index + 1}</b>
              </span>
              <span className="gp-list__copy">
                <strong>{title}</strong>
                <span>{text}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
