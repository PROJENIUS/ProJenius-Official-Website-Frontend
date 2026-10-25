import React, { memo } from "react";
import "./StartupReadyJourney.css";

/* ==========================================================================
   StartupReadyJourney
   --------------------------------------------------------------------------
   - Styles live in StartupReadyJourney.css (load it once, globally).
   - Every class is prefixed with "pjsrj-" so it never clashes with other code.
   - No inline styles anywhere: every value comes from the CSS file.
   - The six stages are plain data below. Edit them here, nothing else changes.
   ========================================================================== */

/* ---------- Static data (created once, outside the component) ---------- */

/* Six route stages. "side" tells which side of the node the label sits on. */
const STAGES = [
  { id: "idea", title: "Idea", note: "Problem & concept", side: "left" },
  { id: "validate", title: "Validate", note: "Feasibility & fit", side: "right" },
  { id: "build", title: "Build", note: "Prototype & MVP", side: "left" },
  { id: "protect", title: "Protect", note: "IP & patents", side: "right" },
  { id: "establish", title: "Establish", note: "Registration", side: "left" },
  { id: "grow", title: "Grow", note: "Ongoing support", side: "right" },
];

/* Ruler ticks on the left of the route (every 5th tick is longer via CSS) */
const TICK_KEYS = Array.from({ length: 30 }, (_, index) => index + 1);

/* Route curve, drawn once in a 270 x 1000 box (the CSS scales the box).
   The six curve ends match the six stage positions set in the CSS. */
const ROUTE_PATH =
  "M0 30 C135 51 189 126 270 204 C135 225 81 300 0 378 " +
  "C135 399 189 474 270 552 C135 573 81 648 0 726 " +
  "C135 747 189 822 270 900";

function StartupReadyJourney() {
  return (
    <section className="pjsrj-journey" aria-labelledby="pjsrj-journey-title">
      {/* ---------- Background: faint grid + soft glow (decorative) ---------- */}
      <div className="pjsrj-journey__grid" aria-hidden="true" />
      <div className="pjsrj-journey__glow" aria-hidden="true" />

      <div className="pjsrj-journey__inner">
        {/* ---------- Left column: heading, text, buttons, hint ---------- */}
        <div className="pjsrj-journey__copy">
          <p className="pjsrj-journey__eyebrow">Startup Support</p>

          <h2 id="pjsrj-journey-title" className="pjsrj-journey__title">
            From Idea to
            <span className="pjsrj-journey__title-accent">Startup-Ready.</span>
          </h2>

          <p className="pjsrj-journey__text">
            Have an idea, problem, prototype or early-stage venture? ProJenius
            helps innovators understand the problem, validate the opportunity,
            build the right technology and take the next practical step.
          </p>

          <div className="pjsrj-journey__actions">
            <a className="pjsrj-journey__btn" href="#contact">
              Discuss Your Idea
              <span className="pjsrj-journey__btn-icon" aria-hidden="true">
                &rarr;
              </span>
            </a>
            <a
              className="pjsrj-journey__btn pjsrj-journey__btn--outline"
              href="#sp-journey"
            >
              Explore Our Approach
              <span className="pjsrj-journey__btn-icon" aria-hidden="true">
                &darr;
              </span>
            </a>
          </div>

          <p className="pjsrj-journey__hint">
            <span className="pjsrj-journey__hint-dot" aria-hidden="true" />
            Hover the route below. Every stage is something we can help with.
          </p>
        </div>

        {/* ---------- Right column: route with six stages ---------- */}
        <div className="pjsrj-journey__route" id="sp-journey">
          <div className="pjsrj-journey__ruler" aria-hidden="true">
            {TICK_KEYS.map((key) => (
              <span key={key} className="pjsrj-journey__tick" />
            ))}
          </div>

          <div className="pjsrj-journey__track">
            <div className="pjsrj-journey__halo" aria-hidden="true" />

            {/* The curve, its faint dotted twin and the travelling dot (decorative) */}
            <svg
              className="pjsrj-journey__curve"
              viewBox="0 0 270 1000"
              aria-hidden="true"
              focusable="false"
            >
              <defs>
                <linearGradient
                  id="pjsrj-curve-gradient"
                  gradientUnits="userSpaceOnUse"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1000"
                >
                  <stop offset="0%" className="pjsrj-journey__stop-start" />
                  <stop offset="55%" className="pjsrj-journey__stop-mid" />
                  <stop offset="100%" className="pjsrj-journey__stop-end" />
                </linearGradient>
              </defs>
              <path className="pjsrj-journey__curve-ghost" d={ROUTE_PATH} />
              <path
                className="pjsrj-journey__curve-line"
                d={ROUTE_PATH}
                stroke="url(#pjsrj-curve-gradient)"
              />
              <path
                className="pjsrj-journey__curve-dot"
                d={ROUTE_PATH}
                pathLength="100"
              />
            </svg>

            {/* Stage nodes + labels (real list, readable by screen readers) */}
            <ol className="pjsrj-journey__stages">
              {STAGES.map((stage) => (
                <li
                  key={stage.id}
                  className={`pjsrj-journey__stage pjsrj-journey__stage--${stage.side}`}
                >
                  <span className="pjsrj-journey__node" aria-hidden="true" />
                  <span className="pjsrj-journey__label">
                    <strong className="pjsrj-journey__label-title">
                      {stage.title}
                    </strong>
                    <span className="pjsrj-journey__label-note">{stage.note}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <p className="pjsrj-journey__side-text" aria-hidden="true">
            Idea &rarr; Startup-Ready
          </p>
        </div>
      </div>
    </section>
  );
}

export default memo(StartupReadyJourney);
