import { useEffect, useRef, useState } from "react";
import "./NotJustAWorkshopAHandsOnExperience.css";

/* Simple stroke icons (24x24 grid) */
const icons = {
  bulb: (
    <>
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </>
  ),
  wrench: (
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  ),
  flask: (
    <>
      <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
      <path d="M8.5 2h7" />
      <path d="M7 16h10" />
    </>
  ),
  chart: (
    <>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="m7 12 3-3 2 2 4-4" />
    </>
  ),
};

const steps = [
  { no: "01", title: "Understand", icon: "bulb",
    text: "Learn the core concept and understand why it matters." },
  { no: "02", title: "Explore", icon: "compass",
    text: "Interact with tools, technologies, components, and real examples." },
  { no: "03", title: "Build", icon: "wrench",
    text: "Apply the concept through a practical activity or mini-project." },
  { no: "04", title: "Test", icon: "flask",
    text: "Experiment, troubleshoot, and improve the solution." },
  { no: "05", title: "Experience", icon: "chart",
    text: "Present, demonstrate, and understand how the technology applies in the real world." },
];

const RADIUS = 220; // px: how close the pointer must be before a card starts to pop
const LEVELS = 6;   // must match the .near-1 ... .near-6 classes in the CSS

export default function NotJustAWorkshopAHandsOnExperience() {
  const sectionRef = useRef(null);
  const stepRefs = useRef([]);
  const [armed, setArmed] = useState(false);
  const [inView, setInView] = useState(false);

  /* cards appear one by one when the section reaches the middle of the screen
     (scrolling down or up) and reset once it is fully out of view */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !("IntersectionObserver" in window)) return; // fallback: cards stay visible
    setArmed(true);

    const start = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setInView(true); }),
      { rootMargin: "-35% 0px -35% 0px" }
    );
    const reset = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (!e.isIntersecting) setInView(false); }),
      { threshold: 0 }
    );
    start.observe(el);
    reset.observe(el);
    return () => { start.disconnect(); reset.disconnect(); };
  }, []);

  /* pop effect when the mouse / finger moves or drags near a card (classes only) */
  useEffect(() => {
    const cards = () => stepRefs.current.filter(Boolean);

    const clear = (card) => {
      for (let k = 1; k <= LEVELS; k++) card.classList.remove(`near-${k}`);
      card.classList.remove("is-top");
    };

    const update = (x, y) => {
      let best = null, bestN = 0;
      cards().forEach((card) => {
        const r = card.getBoundingClientRect();
        const dx = Math.max(r.left - x, 0, x - r.right);
        const dy = Math.max(r.top - y, 0, y - r.bottom);
        const n = Math.max(0, 1 - Math.hypot(dx, dy) / RADIUS);
        const eased = n * n; // soft falloff
        const level = Math.round(eased * LEVELS);

        clear(card);
        if (level > 0) card.classList.add(`near-${level}`);
        if (eased > bestN) { bestN = eased; best = card; }
      });
      if (best) best.classList.add("is-top"); // closest card sits on top
    };

    const reset = () => cards().forEach(clear);
    const onMove = (e) => update(e.clientX, e.clientY);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    document.addEventListener("pointerleave", reset);
    window.addEventListener("blur", reset);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      document.removeEventListener("pointerleave", reset);
      window.removeEventListener("blur", reset);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={"nj-section" + (armed ? " armed" : "") + (inView ? " in" : "")}
    >
      <div className="nj-container">
        <h2 className="nj-title">Not Just a Workshop. A Hands-On Experience.</h2>
        <p className="nj-desc">
          At ProJenius, workshops are designed to move students beyond passive
          learning into practical exploration, experimentation, and building.
        </p>

        <ol className="nj-steps">
          {steps.map((s, i) => (
            <li
              key={s.no}
              className="nj-step"
              ref={(el) => (stepRefs.current[i] = el)}
            >
              <div className="nj-icon-row">
                <span className="nj-icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">{icons[s.icon]}</svg>
                </span>
                <span className="nj-line" aria-hidden="true" />
              </div>
              <span className="nj-no">{s.no}</span>
              <h3 className="nj-step-title">{s.title}</h3>
              <p className="nj-step-text">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}