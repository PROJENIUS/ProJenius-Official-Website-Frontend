import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Boxes } from "lucide-react";

import useOnScreen from "../../../hooks/useOnScreen.js";
import { PRODUCTS } from "../productsData.js";
import "./ProductsHeroVisual.css";

/* =============================================================================
   PRODUCTS HERO VISUAL — three product cards (back, middle, front) that
   move on every 3 seconds: back goes to the middle, middle comes to the
   front, the front card leaves and the next product enters at the back,
   through every product in productsData.js. Pauses on hover/focus, while off screen and with reduced
   motion.

   Each card is a link: to the product's own website when it has one (opens
   in a new tab), otherwise to that product's section on this page.
   Products without a photo show a branded placeholder until a photo is
   added to src/assets/Products/ (see productsData.js).
   ============================================================================= */

const INTERVAL_MS = 3000;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Role of product i at step t: front = t, middle = t + 1, back = t + 2,
   the card that just left = t - 1, all others wait hidden behind the back. */
function roleOf(index, step, count) {
  const offset = (((index - step) % count) + count) % count;
  if (offset === 0) return "front";
  if (offset === 1) return "middle";
  if (offset === 2) return "back";
  if (offset === count - 1) return "gone";
  return "waiting";
}

function CardLink({ product, shown, children }) {
  const common = {
    className: "pjpr-hero-visual__link",
    tabIndex: shown ? undefined : -1,
    "aria-hidden": shown ? undefined : "true",
  };
  if (product.link?.external) {
    return (
      <a {...common} href={product.link.href} target="_blank" rel="noopener noreferrer">
        {children}
        <span className="pjds-sr-only">: visit the {product.title} website (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <a {...common} href={`#${product.id}`}>
      {children}
      <span className="pjds-sr-only">: see {product.title} on this page</span>
    </a>
  );
}

export default function ProductsHeroVisual() {
  const ref = useRef(null);
  const isOnScreen = useOnScreen(ref);
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = PRODUCTS.length;

  useEffect(() => {
    if (!isOnScreen || paused || count < 3 || prefersReducedMotion()) return undefined;
    const timer = window.setInterval(() => setStep((current) => (current + 1) % count), INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [isOnScreen, paused, count]);

  return (
    <div
      ref={ref}
      className="pjpr-hero-visual"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="pjpr-hero-visual__stack">
        {PRODUCTS.map((product, index) => {
          const role = roleOf(index, step, count);
          const shown = role === "front" || role === "middle" || role === "back";
          return (
            <figure key={product.id} className={`pjpr-hero-visual__card is-${role}`}>
              <CardLink product={product} shown={shown}>
                {product.image ? (
                  <img src={product.image} alt={product.alt} decoding="async" loading={index < 3 ? "eager" : "lazy"} />
                ) : (
                  <span className="pjpr-hero-visual__placeholder" aria-hidden="true">
                    <Boxes size={40} strokeWidth={1.4} />
                    <span>Photo coming soon</span>
                  </span>
                )}
                <figcaption>
                  <span className="pjpr-hero-visual__category">{product.category}</span>
                  <span className="pjpr-hero-visual__title">{product.title}</span>
                  <span className="pjpr-hero-visual__go" aria-hidden="true"><ArrowUpRight size={16} strokeWidth={2.4} /></span>
                </figcaption>
              </CardLink>
            </figure>
          );
        })}
      </div>

      <p className="pjpr-hero-visual__badge">
        <strong>From idea to product</strong>
        Developed by ProJenius
      </p>
    </div>
  );
}
