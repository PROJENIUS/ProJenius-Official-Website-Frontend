import React, { memo } from "react";
import "./StartupSupporterHero.css";

/* ==========================================================================
   StartupSupporterHero
   --------------------------------------------------------------------------
   - Styles live in StartupSupporterHero.css (load it once, globally).
   - Every class is prefixed with "pjssh-" so it never clashes with other code.
   - No inline styles anywhere: all values come from the CSS file.
   ========================================================================== */

/* ---------- Static data (kept outside the component: created only once) ---------- */
const DOT_KEYS = [1, 2, 3, 4, 5];
const ORB_KEYS = [1, 2, 3];

function StartupSupporterHero() {
  return (
    <section className="pjssh-hero" aria-labelledby="pjssh-hero-title">
      {/* ---------- Background: soft glow + floating dots (decorative) ---------- */}
      <div className="pjssh-hero__glow" aria-hidden="true" />

      <div className="pjssh-hero__dots" aria-hidden="true">
        {DOT_KEYS.map((key) => (
          <span key={key} className="pjssh-hero__dot" />
        ))}
      </div>

      {/* ---------- Text content (left column) ---------- */}
      <div className="pjssh-hero__content">
        <p className="pjssh-hero__eyebrow">Startup Support</p>

        <h1 id="pjssh-hero-title" className="pjssh-hero__title">
          Turning <span className="pjssh-hero__accent">Ideas</span>
          <br />
          Into Real-World Solutions
        </h1>

        <p className="pjssh-hero__text">
          We support startups from idea to execution by combining technology,
          product engineering and practical business guidance to build solutions
          that are ready to grow.
        </p>
      </div>

      {/* ---------- Side circles (right column, decorative) ---------- */}
      <div className="pjssh-hero__orbs" aria-hidden="true">
        {ORB_KEYS.map((key) => (
          <div key={key} className="pjssh-hero__orb">
            <span>Projenius</span>
            <span>technology</span>
          </div>
        ))}
      </div>

      {/* ---------- Bottom wave (decorative) ---------- */}
      <svg
        className="pjssh-hero__wave"
        viewBox="0 0 1900 130"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <polygon
          className="pjssh-hero__wave-edge"
          points="0,15 150,70 320,0 1900,90 1900,130 0,130"
        />
        <polygon
          className="pjssh-hero__wave-base"
          points="0,30 150,80 322,22 1900,106 1900,130 0,130"
        />
      </svg>
    </section>
  );
}

export default memo(StartupSupporterHero);
