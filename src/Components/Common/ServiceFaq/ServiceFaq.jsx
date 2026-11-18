import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Minus, Plus } from "lucide-react";

import TypedPhrase from "../TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../SectionTitleLine/SectionTitleLine.jsx";
import "./ServiceFaq.css";

/* =============================================================================
   SERVICE FAQ — shared by the service pages (PCB, Rapid Prototyping, …).
   Left: heading, a short line and an "Ask a question" button; it stays
   fixed (sticky) while the questions on the right scroll past.
   Right: the accordion, circled + / –, one answer open at a time.
   Colours follow the section (navy or light).

   Props
     id          section id (heading id is `${id}-title`)
     items       [{ q, a }]   a may be text or JSX (links)
     askTo       where "Ask a question" goes
     lead        optional line under the heading
     secondary   optional { label, to } second button beside "Ask a question"
   ============================================================================= */

export default function ServiceFaq({
  id,
  items,
  askTo,
  secondary,
  lead = "Can't find what you're looking for? Ask us directly. A rough idea is enough to start.",
}) {
  const [openIndex, setOpenIndex] = useState(null);
  const titleId = `${id}-title`;

  return (
    <section id={id} className="pj-faq" aria-labelledby={titleId}>
      <div className="pjds-container pj-faq__layout">
        <div className="pj-faq__aside">
          <p className="pjds-eyebrow" data-reveal="up">Questions</p>
          <h2 id={titleId} className="pjds-title pj-faq__title" data-reveal="up" data-reveal-delay="1">
            Frequently Asked <TypedPhrase phrases={["Questions.", "Answers."]} />
          </h2>
          <SectionTitleLine />
          <p className="pjds-lead pj-faq__lead" data-reveal="up" data-reveal-delay="2">{lead}</p>
          <div className="pj-faq__actions" data-reveal="up" data-reveal-delay="3">
            <Link className="pj-faq__ask" to={askTo}>
              Ask a question <ArrowRight size={18} aria-hidden="true" />
            </Link>
            {secondary && (
              <Link className="pj-faq__ask pj-faq__ask--ghost" to={secondary.to}>
                {secondary.label}
              </Link>
            )}
          </div>
        </div>

        <div className="pj-faq__list">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            const panelId = `${id}-panel-${index}`;
            const buttonId = `${id}-button-${index}`;
            return (
              <div className={`pj-faq__item${isOpen ? " is-open" : ""}`} key={item.q} data-reveal="up" data-reveal-delay={String((index % 4) + 1)}>
                <h3 className="pj-faq__item-heading">
                  <button
                    id={buttonId}
                    type="button"
                    className="pj-faq__trigger"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    <span>{item.q}</span>
                    <span className="pj-faq__icon" aria-hidden="true">
                      {isOpen ? <Minus size={16} strokeWidth={2.4} /> : <Plus size={16} strokeWidth={2.4} />}
                    </span>
                  </button>
                </h3>
                <div id={panelId} role="region" aria-labelledby={buttonId} className="pj-faq__panel">
                  <div className="pj-faq__panel-inner">
                    <p className="pj-faq__text">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
