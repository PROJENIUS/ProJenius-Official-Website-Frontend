import { Fragment } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";

import "./CinematicHero.css";

/* =============================================================================
   CINEMATIC HERO — the shared hero for every page except Home
   -----------------------------------------------------------------------------
   Full-width real photo under a navy fade (it zooms in slowly once), a pill
   badge, a short headline whose words rise one by one with ONE accent word
   in cyan italic, a lead line, the homepage button pair (cyan main + white
   outline), two glass fact cards with real facts from the page, and the
   scrolling service band (white words alternating with cyan outlines).

   Props
     id           heading id (aria-labelledby)
     eyebrow      pill badge text
     title        headline text before the accent word(s)
     accent       the accent word(s), shown in cyan italic
     after        optional headline text after the accent
     description  lead paragraph
     primary      { label, to }  main action ("/route", "#id", "https://…", "tel:")
     secondary    { label, to }  optional second action
     photo        background photo (a real ProJenius photo)
     facts        up to two cards: [{ label, title, text?, chips?, to?, icon? }]
                  (icon: a small image shown on a white tile, e.g. the logo)
     band         words for the scrolling service band
     className    page modifier class
   ============================================================================= */

const isExternal = (to) => /^(https?:|tel:|mailto:)/.test(to);

function SmartLink({ to, className, children, ariaLabel }) {
  if (isExternal(to)) {
    const newTab = to.startsWith("http");
    return (
      <a className={className} href={to} aria-label={ariaLabel} {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
        {newTab && <span className="pjds-sr-only"> (opens in a new tab)</span>}
      </a>
    );
  }
  if (to.startsWith("#")) return <a className={className} href={to} aria-label={ariaLabel}>{children}</a>;
  return <Link className={className} to={to} aria-label={ariaLabel}>{children}</Link>;
}

function Action({ action, variant }) {
  const Icon = action.to.startsWith("#") ? ArrowDown : isExternal(action.to) ? ArrowUpRight : ArrowRight;
  const className = `pjds-btn pjds-btn--${variant}${variant === "primary" ? " pjds-btn--on-dark" : ""} pj-cine__btn`;
  return (
    <SmartLink to={action.to} className={className}>
      {action.label}
      <Icon size={18} strokeWidth={2.2} aria-hidden="true" />
    </SmartLink>
  );
}

function FactCard({ fact }) {
  const body = (
    <>
      {fact.icon && <span className="pj-cine__fact-icon" aria-hidden="true">{fact.icon}</span>}
      <span className="pj-cine__fact-label">{fact.label}</span>
      <span className="pj-cine__fact-title">{fact.title}</span>
      {fact.text && <span className="pj-cine__fact-text">{fact.text}</span>}
      {fact.chips && (
        <span className="pj-cine__chips">
          {fact.chips.map((chip) => <span key={chip}>{chip}</span>)}
        </span>
      )}
    </>
  );
  return fact.to
    ? <SmartLink to={fact.to} className="pj-cine__fact pj-cine__fact--link">{body}</SmartLink>
    : <div className="pj-cine__fact">{body}</div>;
}

export default function CinematicHero({
  id,
  eyebrow,
  title,
  accent,
  after,
  description,
  primary,
  secondary,
  photo,
  facts = [],
  band = [],
  className = "",
}) {
  const words = [
    ...title.split(" ").map((text) => ({ text })),
    { text: accent, accent: true },
    ...(after ? after.split(" ").map((text) => ({ text })) : []),
  ];

  return (
    <section className={`pj-cine${className ? ` ${className}` : ""}`} aria-labelledby={id}>
      <div className="pj-cine__media" aria-hidden="true">
        {photo && <img src={photo} alt="" decoding="async" fetchPriority="high" />}
      </div>
      <span className="pj-cine__shade" aria-hidden="true" />

      <div className="pjds-container pj-cine__layout">
        <div className="pj-cine__copy">
          <p className="pj-cine__badge"><span aria-hidden="true" />{eyebrow}</p>
          <h1 id={id} className="pj-cine__title">
            {words.map((word, i) => (
              <Fragment key={i}>
                {i > 0 && " "}
                <span className={`pj-cine__word pj-cine__word--${Math.min(i + 1, 8)}`}>
                  {word.accent ? <em>{word.text}</em> : word.text}
                </span>
              </Fragment>
            ))}
          </h1>
          <p className="pj-cine__lead">{description}</p>
          <div className="pj-cine__actions">
            <Action action={primary} variant="primary" />
            {secondary && <Action action={secondary} variant="ghost" />}
          </div>
        </div>

        {facts.length > 0 && (
          <div className="pj-cine__facts">
            {facts.slice(0, 2).map((fact) => <FactCard key={fact.title} fact={fact} />)}
          </div>
        )}
      </div>

      {band.length > 0 && (
        <div className="pj-cine__band" aria-hidden="true">
          <div className="pj-cine__track">
            {/* Two identical copies loop seamlessly; every second word is outlined. */}
            {[...band, ...band].map((item, i) => (
              <span key={`${item}-${i}`} className={(i % band.length) % 2 ? "is-outline" : undefined}>{item}</span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
