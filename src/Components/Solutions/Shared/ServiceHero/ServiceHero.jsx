import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight } from "lucide-react";

import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import Breadcrumbs from "../../../Common/Breadcrumbs/Breadcrumbs.jsx";
import "./ServiceHero.css";

/* =============================================================================
   SERVICE HERO — shared by the engineering & innovation pages
   -----------------------------------------------------------------------------
   Built on the homepage hero system: navy base, an optional real photo under
   a navy gradient (the "transparent" look), a thin cyan line on the bottom
   edge, the pill label, a white heading with a cyan second line and the
   shared buttons. Each page supplies its own copy and its own visual.

   Props
     id           heading id (aria-labelledby)
     eyebrow      pill label text
     title        first heading line (white)
     highlight    second heading line (cyan)
     phrases      optional; typed second line instead of highlight
     description  short supporting paragraph
     primary      { label, to }   main action (route)
     secondary    { label, to }   optional; "#id" scrolls within the page
     backdrop     optional image (decorative, sits under the navy layer)
     visual       the page's own visual, shown beside the copy
     breadcrumbs  optional [{ label, to }] trail shown above the label
     className    page modifier class
   ============================================================================= */

function HeroAction({ action, variant }) {
  const className = `pjds-btn pjds-btn--${variant} pjsv-hero__btn`;
  const Icon = action.to.startsWith("#") ? ArrowDown : ArrowRight;
  const content = (
    <>
      {action.label}
      <Icon size={18} strokeWidth={2.2} aria-hidden="true" />
    </>
  );
  return action.to.startsWith("#")
    ? <a className={className} href={action.to}>{content}</a>
    : <Link className={className} to={action.to}>{content}</Link>;
}

export default function ServiceHero({
  id,
  eyebrow,
  title,
  highlight,
  phrases,
  description,
  primary,
  secondary,
  backdrop,
  visual,
  className = "",
  breadcrumbs,
}) {
  return (
    <section className={`pjsv-hero${backdrop ? " pjsv-hero--photo" : ""}${className ? ` ${className}` : ""}`} aria-labelledby={id}>
      <div className="pjsv-hero__backdrop" aria-hidden="true">
        {backdrop && <img src={backdrop} alt="" decoding="async" fetchPriority="high" />}
      </div>

      <div className="pjds-container pjsv-hero__layout">
        <div className="pjsv-hero__copy">
          {breadcrumbs && <Breadcrumbs className="pj-crumbs--hero" items={breadcrumbs} />}
          <p className="pjds-eyebrow pjds-eyebrow--on-dark pjsv-hero__eyebrow" data-reveal="up">{eyebrow}</p>
          <h1 id={id} className="pjsv-hero__title" data-reveal="up" data-reveal-delay="1">
            <span className="pjsv-hero__title-line">{title}</span>
            {phrases ? (
              <span className="pjsv-hero__title-line pjsv-hero__title-line--accent">
                <TypedPhrase tone="dark" phrases={phrases} />
              </span>
            ) : (
              <span className="pjsv-hero__title-line pjsv-hero__title-line--accent">{highlight}</span>
            )}
          </h1>
          <p className="pjsv-hero__description" data-reveal="up" data-reveal-delay="2">{description}</p>
          <div className="pjsv-hero__actions" data-reveal="up" data-reveal-delay="3">
            <HeroAction action={primary} variant="primary" />
            {secondary && <HeroAction action={secondary} variant="ghost" />}
          </div>
        </div>

        {visual && (
          <div className="pjsv-hero__visual" data-reveal="right" data-reveal-delay="2">
            {visual}
          </div>
        )}
      </div>
    </section>
  );
}
