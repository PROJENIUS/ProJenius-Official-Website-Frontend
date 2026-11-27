import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight } from "lucide-react";

import TypedPhrase from "../TypedPhrase/TypedPhrase.jsx";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs.jsx";
import "./SplitHero.css";

/* =============================================================================
   SPLIT HERO — copy on the left, a photo card on the right, and a strip of
   numbered stages along the bottom. Navy, ProJenius cyan accents, the blue
   typing words in the title.

   Props
     id           id for the <h1>
     breadcrumbs  optional [{ label, to }] trail above the label
     kicker       small label above the title
     title        fixed words of the title
     typed        [phrases] typed in cyan on the second line
     description  short paragraph
     primary      { label, to }   cyan button (page link or "/contact…")
     secondary    { label, to }   outline button ("#section" scrolls)
     tags         ["PCB Design", …]  small labels under the buttons
     photo, photoAlt
     badge        { kicker, title }  floating card on the photo
     steps        [{ label, text }]  strip along the bottom; the boxes rise in
                  one by one each time the strip scrolls into view (up or
                  down), like the homepage reveal. The strip has its own
                  observer: it sits at the screen's bottom edge, where the
                  page reveal's 28px start offset would keep it hidden.
   ============================================================================= */

function HeroLink({ action, className, Icon }) {
  if (action.to.startsWith("#")) {
    const onClick = (event) => {
      const target = document.querySelector(action.to);
      if (!target) return;
      event.preventDefault();
      const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    };
    return (
      <a className={className} href={action.to} onClick={onClick}>
        {action.label}
        <Icon size={18} aria-hidden="true" />
      </a>
    );
  }
  return (
    <Link className={className} to={action.to}>
      {action.label}
      <Icon size={18} aria-hidden="true" />
    </Link>
  );
}

/* true while the element is on screen; false again when it leaves, so the
   animation replays from either scroll direction. */
function useInViewTwoWay(threshold = 0.4) {
  const ref = useRef(null);
  const [inView, setInView] = useState(typeof IntersectionObserver === "undefined");
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold });
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

export default function SplitHero({
  id,
  kicker,
  title,
  typed = [],
  description,
  primary,
  secondary,
  tags = [],
  photo,
  photoAlt = "",
  badge,
  steps = [],
  className = "",
  breadcrumbs,
}) {
  const [stripRef, stripIn] = useInViewTwoWay();
  return (
    <section className={`pj-split${className ? ` ${className}` : ""}`} aria-labelledby={id}>
      <div className="pjds-container pj-split__inner">
        <div className="pj-split__copy">
          {breadcrumbs && <Breadcrumbs className="pj-crumbs--hero" items={breadcrumbs} />}
          {kicker && <p className="pj-split__kicker">{kicker}</p>}
          <h1 id={id} className="pj-split__title">
            <span className="pj-split__title-fixed">{title}</span>
            {typed.length > 0 && (
              <span className="pj-split__title-typed">
                <TypedPhrase phrases={typed} tone="dark" />
              </span>
            )}
          </h1>
          {description && <p className="pj-split__desc">{description}</p>}

          {(primary || secondary) && (
            <div className="pj-split__actions">
              {primary && <HeroLink action={primary} className="pj-split__btn pj-split__btn--primary" Icon={ArrowUpRight} />}
              {secondary && <HeroLink action={secondary} className="pj-split__btn pj-split__btn--ghost" Icon={ArrowDown} />}
            </div>
          )}

          {tags.length > 0 && (
            <ul className="pj-split__tags" aria-label="Services">
              {tags.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
          )}
        </div>

        {photo && (
          <figure className="pj-split__media">
            <div className="pj-split__frame">
              <img src={photo} alt={photoAlt} fetchPriority="high" decoding="async" />
            </div>
            {badge && (
              <figcaption className="pj-split__badge">
                <span className="pj-split__badge-kicker">{badge.kicker}</span>
                <span className="pj-split__badge-title">{badge.title}</span>
              </figcaption>
            )}
          </figure>
        )}
      </div>

      {steps.length > 0 && (
        <div ref={stripRef} className={`pj-split__strip${stripIn ? " pj-split__strip--in" : ""}`}>
          <ol className="pjds-container pj-split__steps">
            {steps.map((step, index) => (
              <li key={step.label} className="pj-split__step" style={{ "--i": index }}>
                <span className="pj-split__step-label">
                  {String(index + 1).padStart(2, "0")} / {step.label}
                </span>
                <span className="pj-split__step-text">{step.text}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
