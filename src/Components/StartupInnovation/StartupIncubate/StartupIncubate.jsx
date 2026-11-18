import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";

import TypedPhrase from "../../Common/TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../../Common/SectionTitleLine/SectionTitleLine.jsx";
import { FACILITIES, PRICING } from "../../Incubate/incubateData.js";
import { whatsappHref } from "../../../utils/whatsapp.js";
import "./StartupIncubate.css";

/* =============================================================================
   INCUBATE AT PROJENIUS — incubation as part of the Startup page.
   Left: what it is and the two actions (apply / talk to the team on
   WhatsApp). There is no separate incubation page; /incubate redirects
   here.
   Right: the six facilities as photo tiles (photos from
   src/assets/Incubate/<id>/, shared with the Incubate page).
   ============================================================================= */

export default function StartupIncubate() {
  return (
    <section id="startup-incubate" className="pjsuI" aria-labelledby="startup-incubate-title">
      <div className="pjds-container pjsuI__layout">
        <div className="pjsuI__copy">
          <p className="pjds-eyebrow" data-reveal="up">Incubate at ProJenius</p>
          <h2 id="startup-incubate-title" className="pjds-title pjsuI__title" data-reveal="up" data-reveal-delay="1">
            A Place to Build <TypedPhrase phrases={["Every Day.", "With Our Team."]} />
          </h2>
          <SectionTitleLine />
          <p className="pjds-lead pjsuI__lead" data-reveal="up" data-reveal-delay="2">
            Take a seat in our workspace and build your product with the lab and the team around you: soldering
            stations, 3D printers, tools, network and mentoring.
          </p>
          <p className="pjsuI__note" data-reveal="up" data-reveal-delay="2">
            {PRICING.registration} one-time registration when you join. Seat and services are charged separately, based
            on what you need. 24/7 access is for incubated teams with a seat, as per the incubation rules.
          </p>
          <div className="pjsuI__actions" data-reveal="up" data-reveal-delay="3">
            <Link className="pjsuI__btn pjsuI__btn--primary" to="/incubate/apply">
              Apply for Incubation <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a
              className="pjsuI__btn pjsuI__btn--ghost"
              href={whatsappHref("Hi ProJenius, I would like to talk about incubating at ProJenius.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={18} aria-hidden="true" />
              Talk to Our Team
              <span className="pjds-sr-only"> on WhatsApp (opens in a new tab)</span>
            </a>
          </div>
        </div>

        <ul className="pjsuI__grid">
          {FACILITIES.map(({ id, Icon, title, image }, index) => (
            <li key={id} className="pjsuI__tile" data-reveal="up" data-reveal-delay={String((index % 3) + 1)}>
              {image && <img src={image} alt="" loading="lazy" decoding="async" />}
              <span className="pjsuI__tile-label">
                <span className="pjsuI__tile-icon" aria-hidden="true"><Icon size={16} strokeWidth={2.2} /></span>
                {title}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
