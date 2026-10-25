import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, Star } from "lucide-react";

import useOnScreen from "../../../hooks/useOnScreen.js";
import "./B3Hero.css";

/* =============================================================================
   HOME V3 — HERO
   A night-time drawing board. The blueprint grid lights up around the mouse
   pointer and a technical drawing of a device sketches itself in on load.
   The slow drawing-ring rotation stops while the hero is off screen.
   ============================================================================= */

const GOOGLE_PROFILE_URL = "https://www.google.com/maps/place/data=!4m2!3m1!1s0x3b00cfb5c8f13bb3:0xc245f4db34baf398";

function onPointerMove(event) {
  if (event.pointerType !== "mouse") return;
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--gx", `${event.clientX - rect.left}px`);
  event.currentTarget.style.setProperty("--gy", `${event.clientY - rect.top}px`);
}

/* Construction drawing of the device that the Build section assembles. */
function HeroDrawing() {
  return (
    <svg className="b3h__drawing" viewBox="0 0 800 800" aria-hidden="true" focusable="false">
      <g className="b3h__ring">
        <circle cx="400" cy="400" r="330" pathLength="1" />
      </g>
      <g className="b3h__construct">
        <circle cx="400" cy="400" r="250" pathLength="1" />
        <line x1="40" y1="400" x2="760" y2="400" pathLength="1" />
        <line x1="400" y1="40" x2="400" y2="760" pathLength="1" />
        <line x1="150" y1="150" x2="650" y2="650" pathLength="1" />
      </g>
      <g className="b3h__part">
        <rect x="230" y="270" width="340" height="260" rx="34" pathLength="1" />
        <rect x="258" y="298" width="284" height="204" rx="14" pathLength="1" />
        <rect x="402" y="320" width="118" height="118" rx="6" pathLength="1" />
        <rect x="286" y="330" width="78" height="78" rx="4" pathLength="1" />
        <path d="M364 369 H402 M325 408 V460 H470 V438" pathLength="1" />
        <circle cx="290" cy="474" r="9" pathLength="1" />
        <circle cx="520" cy="474" r="9" pathLength="1" />
      </g>
      <g className="b3h__dims">
        <path d="M230 230 V250 M570 230 V250 M230 240 H570" pathLength="1" />
        <path d="M610 270 H630 M610 530 H630 M620 270 V530" pathLength="1" />
      </g>
      <g className="b3h__notes">
        <text x="400" y="222" textAnchor="middle">W</text>
        <text x="646" y="404">H</text>
        <text x="96" y="132">REV · A</text>
        <text x="604" y="690">IDEA → PRODUCT</text>
      </g>
    </svg>
  );
}

export default function B3Hero() {
  const ref = useRef(null);
  const isOnScreen = useOnScreen(ref);

  return (
    <section
      ref={ref}
      className="b3h"
      aria-labelledby="b3h-title"
      onPointerMove={onPointerMove}
      data-idle={isOnScreen ? undefined : "true"}
    >
      <div className="b3h__grid b3-grid" aria-hidden="true" />
      <div className="b3h__grid b3h__grid--lit b3-grid" aria-hidden="true" />
      <div className="b3h__glow" aria-hidden="true" />
      <HeroDrawing />

      <div className="b3-wrap b3h__inner">
        <p className="b3-label b3h__label"><b>ProJenius</b> / Engineering &amp; Innovation</p>
        <h1 id="b3h-title" className="b3h__title">
          <span className="b3h__line"><span>From a rough idea</span></span>
          <span className="b3h__line"><span>to a <span className="b3-lit">working product.</span></span></span>
        </h1>
        <p className="b3h__lead">
          Software, electronics, PCBs and prototypes, designed and built by one team.
          Scroll down and watch an idea become a product.
        </p>
        <div className="b3h__actions">
          <Link className="b3-btn b3-btn--light" to="/contact">
            Start your project <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
          </Link>
          <a className="b3-btn b3-btn--ghost" href="#b3-build">
            Watch it get built <ArrowDown size={18} strokeWidth={2.2} aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="b3-wrap b3h__foot">
        <a className="b3h__rating" href={GOOGLE_PROFILE_URL} target="_blank" rel="noopener noreferrer">
          <Star size={16} strokeWidth={0} fill="currentColor" aria-hidden="true" />
          <strong>4.8</strong> Google rating · 57 reviews
        </a>
        <p className="b3h__disciplines">Software · Electronics · PCB · Prototyping · Training</p>
        <span className="b3h__cue" aria-hidden="true">Scroll<span /></span>
      </div>
    </section>
  );
}
