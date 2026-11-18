import { useEffect, useRef, useState } from "react";

import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../../../Common/SectionTitleLine/SectionTitleLine.jsx";
import "./HowWeTurnARequirement.css";

/* =============================================================================
   HOW WE TURN A REQUIREMENT
   -----------------------------------------------------------------------------
   "How We Turn a Requirement Into a Workshop" — the institution + ProJenius
   workflow as a vertical timeline. Each step lights up as the visitor
   scrolls to it (down and back up); tags show who is involved. Light section
   (fourth on the page). The scroll logic is skipped for reduced motion.
   ============================================================================= */

/* ===========================================================================
   CONTENT
   =========================================================================== */
const REQUIREMENT_STEPS = [
  {
    title: "Understand",
    text: "Understand the institution’s objective, audience, department, and expected outcome.",
    roles: ["Institution", "ProJenius"],
  },
  {
    title: "Customize",
    text: "Select the appropriate technology, difficulty level, activities, and duration.",
    roles: ["ProJenius"],
  },
  {
    title: "Learn",
    text: "Introduce the concepts through an engaging combination of explanation and demonstration.",
    roles: ["ProJenius", "Students"],
  },
  {
    title: "Build",
    text: "Students participate in hands-on activities, experiments, or project work.",
    roles: ["Students"],
  },
  {
    title: "Showcase",
    text: "Students demonstrate, test, or present what they have created.",
    roles: ["Students"],
  },
  {
    title: "Continue",
    text: "Where relevant, students can continue into deeper learning, projects, internships, or other ProJenius opportunities.",
    roles: ["Students", "ProJenius"],
  },
];

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function HowWeTurnARequirement() {
  const listRef = useRef(null);
  const [litSteps, setLitSteps] = useState(() => REQUIREMENT_STEPS.map(() => prefersReducedMotion()));

  /* Marks every step whose node has scrolled above the 65% line of the
     viewport. One passive scroll listener, throttled with requestAnimationFrame
     and removed on unmount. */
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    let frame = 0;
    const update = () => {
      frame = 0;
      const list = listRef.current;
      if (!list) return;
      const triggerY = window.innerHeight * 0.65;
      const next = Array.from(list.querySelectorAll(".pj-workshop-requirement__node")).map(
        (node) => node.getBoundingClientRect().top < triggerY
      );
      setLitSteps((prev) =>
        prev.length === next.length && prev.every((value, i) => value === next[i]) ? prev : next
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <section
      className="pj-workshop-requirement"
      id="pj-workshop-requirement"
      aria-labelledby="pj-workshop-requirement-title"
    >
      <div className="pj-workshop-requirement__wrap pj-workshop-requirement__grid">
        {/* =====================================================================
            REQUIREMENT — INTRO
            ===================================================================== */}
        <div className="pj-workshop-requirement__intro">
          <p className="pjds-eyebrow" data-reveal="up">Our Process</p>
          <h2 className="pj-workshop-requirement__title" id="pj-workshop-requirement-title" data-reveal="up" data-reveal-delay="1">
            How We Turn a Requirement <TypedPhrase phrases={["Into a Workshop.", "Into Real Learning."]} />
          </h2>
          <SectionTitleLine />
          <p className="pj-workshop-requirement__lead" data-reveal="up" data-reveal-delay="2">
            From your first conversation to what students build and take forward, this is how a
            ProJenius workshop takes shape.
          </p>
          <p className="pj-workshop-requirement__legend" data-reveal="up" data-reveal-delay="3">
            The tags on each step show who is involved: the institution, ProJenius, or the students.
          </p>
        </div>

        {/* =====================================================================
            REQUIREMENT — SIX-STEP TIMELINE
            ===================================================================== */}
        <ol className="pj-workshop-requirement__list" ref={listRef} aria-label="Six steps from requirement to workshop">
          {REQUIREMENT_STEPS.map((step, i) => (
            <li
              key={step.title}
              className={`pj-workshop-requirement__step${
                litSteps[i] ? " pj-workshop-requirement__step--on" : ""
              }${litSteps[i + 1] ? " pj-workshop-requirement__step--linked" : ""}`}
            >
              <div className="pj-workshop-requirement__node">{String(i + 1).padStart(2, "0")}</div>
              {i < REQUIREMENT_STEPS.length - 1 && (
                <span className="pj-workshop-requirement__seg" aria-hidden="true" />
              )}
              <div className="pj-workshop-requirement__body">
                <h3 className="pj-workshop-requirement__step-title">{step.title}</h3>
                <p className="pj-workshop-requirement__text">{step.text}</p>
                <div className="pj-workshop-requirement__roles">
                  {step.roles.map((role) => (
                    <span key={role} className="pj-workshop-requirement__role">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
