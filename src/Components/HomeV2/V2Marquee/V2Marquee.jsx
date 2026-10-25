import { useRef } from "react";

import useOnScreen from "../../../hooks/useOnScreen.js";
import "./V2Marquee.css";

/* =============================================================================
   HOME V2 — MARQUEE: what goes in, what comes out. Moves only while visible;
   still under prefers-reduced-motion. The second copy is for the seamless
   loop and is hidden from assistive technology.
   ============================================================================= */

const ITEMS = [
  "Requirement → Software",
  "Schematic → Board",
  "CAD → Prototype",
  "Sensor → Dashboard",
  "Idea → Startup",
  "Student → Engineer",
];

export default function V2Marquee() {
  const ref = useRef(null);
  const isOnScreen = useOnScreen(ref);

  return (
    <div ref={ref} className={`v2m${isOnScreen ? "" : " is-paused"}`}>
      <div className="v2m__track">
        {[0, 1].map((copy) => (
          <ul key={copy} className="v2m__list" aria-hidden={copy === 1 || undefined}>
            {ITEMS.map((item) => <li key={item}>{item}</li>)}
          </ul>
        ))}
      </div>
    </div>
  );
}
