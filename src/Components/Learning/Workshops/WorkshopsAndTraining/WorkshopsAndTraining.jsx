import { Link } from "react-router-dom";
import { ArrowRight, Hammer, MessageCircle, SlidersHorizontal, Users } from "lucide-react";

import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../../../Common/SectionTitleLine/SectionTitleLine.jsx";
import { whatsappHref } from "../../../../utils/whatsapp.js";
import usePageHero from "../../../../pageHeroes/usePageHero.js";
import { HERO_DEFAULTS } from "../../../../pageHeroes/heroDefaults.js";
import "./WorkshopsAndTraining.css";

/* =========================================================
   WORKSHOP HERO — navy, our hero pattern: pill, heading with
   cyan typing, blue line, cyan CTA. Right: real ProJenius
   workshop photos with three floating cards.
   Text, photos and floating cards: Admin → Page Heroes → Workshops
   (built-in: src/pageHeroes/heroDefaults.js).
========================================================= */

const WHATSAPP = whatsappHref("Hi ProJenius, I would like to know about hosting a workshop at our institution.");

const FLOAT_ICONS = [Hammer, SlidersHorizontal, Users];

export default function WorkshopHero() {
  const hero = usePageHero("workshops", HERO_DEFAULTS.workshops);
  const PHOTOS = [1, 2, 3].map((n) => ({ image: hero[`photo${n}`], alt: hero[`photo${n}Alt`] }));
  return (
    <section className="pjwh" aria-labelledby="wh-hero-title">
      <div className="pjds-container pjwh__grid">
        <div className="pjwh__copy">
          <p className="pjds-eyebrow pjds-eyebrow--on-dark" data-reveal="up">{hero.eyebrow}</p>
          <h1 id="wh-hero-title" className="pjwh__title" data-reveal="up" data-reveal-delay="1">
            {hero.title}{" "}
            <TypedPhrase tone="dark" phrases={hero.phrases} />
          </h1>
          <SectionTitleLine />
          <p className="pjwh__lead" data-reveal="up" data-reveal-delay="2">
            {hero.lead}
          </p>
          <div className="pjwh__actions" data-reveal="up" data-reveal-delay="3">
            <Link className="pjwh__btn pjwh__btn--primary" to={hero.primary.to}>
              {hero.primary.label} <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a className="pjwh__btn pjwh__btn--ghost" href={WHATSAPP} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={18} aria-hidden="true" /> Ask on WhatsApp
              <span className="pjds-sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>

        <div className="pjwh__photos" data-reveal="up" data-reveal-delay="2">
          {PHOTOS.map((photo, index) => (
            <figure key={index} className={`pjwh__photo pjwh__photo--${index + 1}`}>
              <img src={photo.image} alt={photo.alt} loading={index ? "lazy" : "eager"} />
            </figure>
          ))}
          {hero.floats.map((float, index) => {
            const Icon = FLOAT_ICONS[index] || Users;
            return (
              <p key={index} className={`pjwh__float pjwh__float--${"abc"[index]}`}>
                <span className="pjwh__float-icon" aria-hidden="true"><Icon size={17} /></span>
                <span><strong>{float.title}</strong><small>{float.text}</small></span>
              </p>
            );
          })}
        </div>
      </div>
    </section>
  );
}
