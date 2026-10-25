import { useEffect, useRef, useState } from "react";

import useOnScreen from "../../../hooks/useOnScreen.js";
import { WHO_WE_ARE_STATS } from "../../Home/WhoWeAre/whoWeAreConfig.js";
import "./V2Proof.css";

/* =============================================================================
   HOME V2 — NUMBERS. The figures already published on the homepage (one
   source: whoWeAreConfig.js) plus the Google rating shown in the footer.
   Counts up once when first seen; shows final values with reduced motion.
   ============================================================================= */

const ITEMS = [
  ...WHO_WE_ARE_STATS.map((stat) => ({ value: stat.value, suffix: stat.suffix, decimals: 0, label: stat.label })),
  { value: 4.8, suffix: "", decimals: 1, label: "Google rating · 57 reviews" },
];

function CountUp({ value, decimals, suffix, run }) {
  const [shown, setShown] = useState(() =>
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? value : 0
  );

  useEffect(() => {
    if (!run || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return undefined;
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 1400);
      setShown(value * (1 - Math.pow(1 - t, 3)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [run, value]); // run flips to true once, when the band is first seen

  return (
    <>
      <span aria-hidden="true">{shown.toFixed(decimals)}{suffix}</span>
      <span className="pjds-sr-only">{value.toFixed(decimals)}{suffix}</span>
    </>
  );
}

export default function V2Proof() {
  const ref = useRef(null);
  const isOnScreen = useOnScreen(ref, "0px 0px -15% 0px");
  const [seen, setSeen] = useState(false);
  if (isOnScreen && !seen) setSeen(true);

  return (
    <section className="v2-section v2p" aria-labelledby="v2p-title">
      <div className="v2-wrap">
        <p className="v2-label" data-reveal="up"><b>02</b> / In numbers</p>
        <h2 id="v2p-title" className="v2-h2" data-reveal="up" data-reveal-delay="1">
          Real work, <span className="v2-mark">real people.</span> <span className="v2-soft">Measured, not promised.</span>
        </h2>

        <dl ref={ref} className="v2p__band" data-reveal="up" data-reveal-delay="2">
          {ITEMS.map((item) => (
            <div key={item.label} className="v2p__item">
              <dt className="v2p__label">{item.label}</dt>
              <dd className="v2p__value"><CountUp {...item} run={seen} /></dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
