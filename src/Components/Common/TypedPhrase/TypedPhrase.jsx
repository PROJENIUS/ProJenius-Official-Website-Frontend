import { useEffect, useRef, useState } from "react";

import useOnScreen from "../../../hooks/useOnScreen.js";
import "./TypedPhrase.css";

/* =============================================================================
   TYPED PHRASE — the homepage "Who We Are" typed heading line, shared.
   -----------------------------------------------------------------------------
   Same timing as the homepage: types a phrase, holds, deletes, moves to the
   next phrase, repeats.

   - An invisible copy of the longest phrase sits in the same grid cell, so the
     line keeps one width and height whatever is typed (no layout jump, also
     when the longest phrase wraps on phones).
   - Timers run only while the line is on screen.
   - prefers-reduced-motion: the first phrase is shown, nothing animates.
   - Screen readers get the full list once; the typing itself is aria-hidden.

   tone="dark" uses the cyan for dark (navy) backgrounds.
   ============================================================================= */

const TYPE_SPEED = 120;
const DELETE_SPEED = 70;
const HOLD_AFTER_TYPING = 1800;
const PAUSE_AFTER_DELETING = 450;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function TypedPhrase({ phrases, tone = "light", className = "" }) {
  const ref = useRef(null);
  const isOnScreen = useOnScreen(ref);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const reduce = prefersReducedMotion();
  const current = phrases[phraseIndex];
  const longest = phrases.reduce((a, b) => (b.length > a.length ? b : a), "");

  useEffect(() => {
    if (!isOnScreen || reduce) return undefined;

    let delay;
    let next;
    if (!isDeleting && length < current.length) {
      delay = TYPE_SPEED;
      next = () => setLength((value) => value + 1);
    } else if (!isDeleting) {
      delay = HOLD_AFTER_TYPING;
      next = () => setIsDeleting(true);
    } else if (length > 0) {
      delay = DELETE_SPEED;
      next = () => setLength((value) => value - 1);
    } else {
      delay = PAUSE_AFTER_DELETING;
      next = () => {
        setIsDeleting(false);
        setPhraseIndex((value) => (value + 1) % phrases.length);
      };
    }

    const timer = window.setTimeout(next, delay);
    return () => window.clearTimeout(timer);
  }, [isOnScreen, reduce, isDeleting, length, current, phrases.length]);

  const shown = reduce ? phrases[0] : current.slice(0, length);

  return (
    <span ref={ref} className={`pjtp${tone === "dark" ? " pjtp--dark" : ""}${className ? ` ${className}` : ""}`}>
      <span className="pjds-sr-only">{phrases.join(", ")}</span>
      <span className="pjtp__sizer" aria-hidden="true">{longest}|</span>
      <span className="pjtp__live" aria-hidden="true">
        {shown}
        {!reduce && <span className="pjtp__cursor">|</span>}
      </span>
    </span>
  );
}
