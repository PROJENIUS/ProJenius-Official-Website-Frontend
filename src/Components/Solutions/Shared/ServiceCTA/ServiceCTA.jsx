import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, Check } from "lucide-react";

import "./ServiceCTA.css";
import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../../../Common/SectionTitleLine/SectionTitleLine.jsx";

/* =============================================================================
   SERVICE CTA — closing call to action + contextual related services
   -----------------------------------------------------------------------------
   Props
     id, eyebrow, title, text   heading copy (each page writes its own)
     primary        { label, to }   main action ("#id" scrolls within the page)
     checklistTitle / checklist     what helps the team start (or what an
                                    estimate depends on)
     related        [{ question, to, label }]  only the services that relate
                                    to this page, phrased as the visitor's need
   ============================================================================= */

export default function ServiceCTA({ id, eyebrow, title, typed, text, primary, checklistTitle, checklist = [], related = [] }) {
  return (
    <section id={id} className="pjsv-cta" aria-labelledby={`${id}-title`}>
      <div className="pjds-container">
        <div className={`pjsv-cta__card${checklist.length ? "" : " pjsv-cta__card--solo"}`} data-reveal="up">
          <div className="pjsv-cta__copy">
            <p className="pjds-eyebrow pjds-eyebrow--on-dark">{eyebrow}</p>
            <h2 id={`${id}-title`} className="pjsv-cta__title">
              {title}
              {typed && <> <TypedPhrase phrases={typed} tone="dark" /></>}
            </h2>
            <SectionTitleLine />
            <p className="pjsv-cta__text">{text}</p>
            {primary.to.startsWith("#") ? (
              <a className="pjds-btn pjds-btn--primary pjsv-cta__btn" href={primary.to}>
                {primary.label}
                <ArrowDown size={18} strokeWidth={2.2} aria-hidden="true" />
              </a>
            ) : (
              <Link className="pjds-btn pjds-btn--primary pjsv-cta__btn" to={primary.to}>
                {primary.label}
                <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
              </Link>
            )}
          </div>

          {checklist.length > 0 && (
            <div className="pjsv-cta__checklist">
              <p className="pjsv-cta__checklist-title">{checklistTitle}</p>
              <ul>
                {checklist.map((item) => (
                  <li key={item}>
                    <Check size={16} strokeWidth={2.6} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {related.length > 0 && (
          <nav className="pjsv-cta__related" aria-label="Related ProJenius services" data-reveal="up" data-reveal-delay="1">
            {related.map((item) => (
              <Link key={item.to} className="pjsv-cta__related-link" to={item.to}>
                <span className="pjsv-cta__related-question">{item.question}</span>
                <span className="pjsv-cta__related-label">
                  {item.label}
                  <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </nav>
        )}
      </div>
    </section>
  );
}
