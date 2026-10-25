import { RotateCcw } from "lucide-react";

import "./ServiceProcess.css";

/* =============================================================================
   SERVICE PROCESS — numbered stages for one page's way of working
   -----------------------------------------------------------------------------
   Horizontal timeline on wide screens, vertical on phones. Each page passes
   its own stages; nothing here is shared copy.

   Props
     id, eyebrow, title, intro   section heading
     steps     [{ title, text }]
     loop      optional label for a "repeat" arrow back to an earlier stage
     note      optional closing note under the steps
     tone      "light" (default) | "dark"
   ============================================================================= */

export default function ServiceProcess({ id, eyebrow, title, intro, steps, loop, note, tone = "light", className = "" }) {
  const dark = tone === "dark";
  return (
    <section
      id={id}
      className={`pjsv-process pjsv-process--${dark ? "dark" : "light"}${className ? ` ${className}` : ""}`}
      aria-labelledby={`${id}-title`}
    >
      <div className="pjds-container">
        <header className="pjsv-process__head">
          <p className={`pjds-eyebrow${dark ? " pjds-eyebrow--on-dark" : ""}`} data-reveal="up">{eyebrow}</p>
          <h2 id={`${id}-title`} className="pjsv-process__title" data-reveal="up" data-reveal-delay="1">{title}</h2>
          {intro && <p className="pjsv-process__intro" data-reveal="up" data-reveal-delay="2">{intro}</p>}
        </header>

        <ol className="pjsv-process__steps" data-count={steps.length} data-reveal="up" data-reveal-delay="2">
          {steps.map((step, index) => (
            <li key={step.title} className="pjsv-process__step">
              <span className="pjsv-process__num" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="pjsv-process__step-title">{step.title}</h3>
              <p className="pjsv-process__step-text">{step.text}</p>
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
