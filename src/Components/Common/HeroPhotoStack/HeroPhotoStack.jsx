import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";

import useOnScreen from "../../../hooks/useOnScreen.js";
import "./HeroPhotoStack.css";

/* =============================================================================
   HERO PHOTO STACK — the rotating 3-card visual from the Products hero,
   shared by the other page heroes.
   -----------------------------------------------------------------------------
   Three photo cards (back, middle, front). Every 3 seconds the back card
   moves to the middle, the middle comes to the front and the front card
   leaves; the next photo enters at the back. Pauses on hover/focus, while
   off screen and with reduced motion.

   Props
     items  [{ image, title, category?, alt?, href? }]  (href optional:
            "/route", "#id" or "https://..." to make the card a link)
     badge  optional { title, text } shown at the bottom right
     label  accessible name for the whole visual
   ============================================================================= */

const INTERVAL_MS = 3000;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function roleOf(index, step, count) {
  const offset = (((index - step) % count) + count) % count;
  if (offset === 0) return "front";
  if (offset === 1) return "middle";
  if (offset === 2) return "back";
  if (offset === count - 1) return "gone";
  return "waiting";
}

function CardInner({ item }) {
  return (
    <>
      {item.image ? (
        <img src={item.image} alt={item.alt || item.title} decoding="async" />
      ) : (
        <span className="pj-hps__placeholder" aria-hidden="true">
          <ImageIcon size={36} strokeWidth={1.4} />
          <span>Photo coming soon</span>
        </span>
      )}
      <figcaption>
        {item.category && <span className="pj-hps__category">{item.category}</span>}
        <span className="pj-hps__title">{item.title}</span>
        {item.href && (
          <span className="pj-hps__go" aria-hidden="true"><ArrowUpRight size={16} strokeWidth={2.4} /></span>
        )}
      </figcaption>
    </>
  );
}

function CardLink({ item, shown, children }) {
  const common = {
    className: "pj-hps__link",
    tabIndex: shown ? undefined : -1,
    "aria-hidden": shown ? undefined : "true",
  };
  if (/^https?:/.test(item.href)) {
    return <a {...common} href={item.href} target="_blank" rel="noopener noreferrer">{children}</a>;
  }
  if (item.href.startsWith("#")) return <a {...common} href={item.href}>{children}</a>;
  return <Link {...common} to={item.href}>{children}</Link>;
}

export default function HeroPhotoStack({ items, badge, label = "Photos from ProJenius" }) {
  const ref = useRef(null);
  const isOnScreen = useOnScreen(ref);
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = items.length;

  useEffect(() => {
    if (!isOnScreen || paused || count < 3 || prefersReducedMotion()) return undefined;
    const timer = window.setInterval(() => setStep((current) => (current + 1) % count), INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [isOnScreen, paused, count]);

  if (!count) return null;

  return (
    <div
      ref={ref}
      className="pj-hps"
      role="group"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="pj-hps__stack">
        {items.map((item, index) => {
          const role = count < 3 ? ["front", "middle", "back"][index] : roleOf(index, step, count);
          const shown = role === "front" || role === "middle" || role === "back";
          return (
            <figure key={`${item.title}-${index}`} className={`pj-hps__card is-${role}`} aria-hidden={item.href || shown ? undefined : "true"}>
              {item.href ? (
                <CardLink item={item} shown={shown}><CardInner item={item} /></CardLink>
              ) : (
                <div className="pj-hps__link"><CardInner item={item} /></div>
              )}
            </figure>
          );
        })}
      </div>

      {badge && (
        <p className="pj-hps__badge">
          <strong>{badge.title}</strong>
          {badge.text}
        </p>
      )}
    </div>
  );
}
