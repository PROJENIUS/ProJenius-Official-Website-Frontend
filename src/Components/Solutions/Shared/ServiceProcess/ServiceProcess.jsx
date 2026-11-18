import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, RotateCcw } from "lucide-react";

import "./ServiceProcess.css";
import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../../../Common/SectionTitleLine/SectionTitleLine.jsx";

/* =============================================================================
   SERVICE PROCESS — numbered stages for one page's way of working
   -----------------------------------------------------------------------------
   Horizontal timeline on wide screens, vertical on phones. Each page passes
   its own stages; nothing here is shared copy.

   Props
     id, eyebrow, title, intro   section heading
     steps     [{ title, text, to?, linkLabel? }]  (to → a link to the page for that step)
     loop      optional label for a "repeat" arrow back to an earlier stage
     note      optional closing note under the steps
     tone      "light" (default) | "dark"

   Scroll animation (down and up): the line fills across the steps with the
   scroll, and each step lights up when the line reaches it (number fills
   cyan, text rises in). Progress is written to --pjsv-p and data-on
   directly, so scrolling never re-renders React. Reduced motion: all on.
   ============================================================================= */

/* 0 when the steps' top reaches 85% of the screen, 1 when it reaches 40% */
function useStepProgress(count) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const items = Array.from(el.children);
    const apply = (p) => {
      el.style.setProperty("--pjsv-p", p.toFixed(3));
      items.forEach((item, i) => {
        const at = count > 1 ? i / (count - 1) : 0;
        if (p >= at - 0.02) item.dataset.on = "true";
        else delete item.dataset.on;
      });
    };
    if (typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply(1);
      return undefined;
    }
    el.dataset.animated = "true";
    let frame = 0;
    const update = () => {
      frame = 0;
      const top = el.getBoundingClientRect().top;
      const vh = window.innerHeight || 1;
      apply(Math.min(1, Math.max(0, (vh * 0.85 - top) / (vh * 0.45))));
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [count]);
  return ref;
}

export default function ServiceProcess({ id, eyebrow, title, typed, intro, steps, loop, note, tone = "light", className = "" }) {
  const dark = tone === "dark";
  const stepsRef = useStepProgress(steps.length);
  return (
    <section
      id={id}
      className={`pjsv-process pjsv-process--${dark ? "dark" : "light"}${className ? ` ${className}` : ""}`}
      aria-labelledby={`${id}-title`}
    >
      <div className="pjds-container">
        <header className="pjsv-process__head">
          <p className={`pjds-eyebrow${dark ? " pjds-eyebrow--on-dark" : ""}`} data-reveal="up">{eyebrow}</p>
          <h2 id={`${id}-title`} className="pjsv-process__title" data-reveal="up" data-reveal-delay="1">
            {title}
            {typed && <> <TypedPhrase phrases={typed} /></>}
          </h2>
          <SectionTitleLine />
          {intro && <p className="pjsv-process__intro" data-reveal="up" data-reveal-delay="2">{intro}</p>}
        </header>

        <ol ref={stepsRef} className="pjsv-process__steps" data-count={steps.length}>
          {steps.map((step, index) => (
            <li key={step.title} className="pjsv-process__step">
              <span className="pjsv-process__num" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="pjsv-process__step-title">{step.title}</h3>
              <p className="pjsv-process__step-text">{step.text}</p>
              {step.to && (
                <Link className="pjsv-process__step-link" to={step.to}>
                  {step.linkLabel || "Learn more"}
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              )}
            </li>
          ))}
        </ol>

        {loop && (
          <p className="pjsv-process__loop" data-reveal="up" data-reveal-delay="3">
            <RotateCcw size={16} strokeWidth={2.2} aria-hidden="true" />
            {loop}
          </p>
        )}

        {note && <p className="pjsv-process__note" data-reveal="up" data-reveal-delay="3">{note}</p>}
      </div>
    </section>
  );
}
