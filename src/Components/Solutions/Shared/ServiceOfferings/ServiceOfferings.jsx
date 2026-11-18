import { MessageCircle } from "lucide-react";

import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../../../Common/SectionTitleLine/SectionTitleLine.jsx";
import { whatsappHref } from "../../../../utils/whatsapp.js";
import "./ServiceOfferings.css";

/* =============================================================================
   SERVICE OFFERINGS — "what we build" cards, shared by service pages.
   Each card: icon, title, short bullet points and the same action at the
   bottom: "Discuss on WhatsApp", with a message naming that card (and the
   page's `topic`). Links to other pages live in the closing card's
   related links, so every card here stays alike.
   Cards are white with dark text in both the navy and the light sections.

   Props
     id, eyebrow, title, typed, lead   section heading (site heading pattern)
     topic  page name used in the WhatsApp message, e.g. "Rapid Prototyping"
     items  [{ id, Icon, title, points: [] }]
   ============================================================================= */

export default function ServiceOfferings({ id, eyebrow, title, typed, lead, topic = "", items }) {
  const titleId = `${id}-title`;
  return (
    <section id={id} className="pjsv-offer" aria-labelledby={titleId}>
      <div className="pjds-container">
        <header className="pjsv-offer__head">
          <p className="pjds-eyebrow" data-reveal="up">{eyebrow}</p>
          <h2 id={titleId} className="pjds-title pjsv-offer__title" data-reveal="up" data-reveal-delay="1">
            {title}
            {typed && <> <TypedPhrase phrases={typed} /></>}
          </h2>
          <SectionTitleLine />
          {lead && <p className="pjds-lead pjsv-offer__lead" data-reveal="up" data-reveal-delay="2">{lead}</p>}
        </header>

        <ul className="pjsv-offer__grid" data-count={items.length}>
          {items.map(({ id: itemId, Icon, title: itemTitle, points }, index) => (
            <li key={itemId} className="pjsv-offer__card" data-reveal="up" data-reveal-delay={String((index % 4) + 1)}>
              <span className="pjsv-offer__icon" aria-hidden="true"><Icon size={22} strokeWidth={2} /></span>
              <h3 className="pjsv-offer__name">{itemTitle}</h3>
              <ul className="pjsv-offer__points">
                {points.map((point) => <li key={point}>{point}</li>)}
              </ul>
              <a
                className="pjsv-offer__wa"
                href={whatsappHref(`Hi ProJenius, I would like to discuss ${itemTitle}${topic ? ` (${topic})` : ""}.`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={16} aria-hidden="true" />
                Discuss on WhatsApp
                <span className="pjds-sr-only"> about {itemTitle} (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
