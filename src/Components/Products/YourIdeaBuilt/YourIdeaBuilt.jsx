import { ArrowRight, Phone } from "lucide-react";

import { whatsappHref } from "../../../utils/whatsapp.js";
import "./YourIdeaBuilt.css";

/* =============================================================================
   PRODUCTS CLOSING — short one-row navy card (like the course and career
   pages): text left, two actions right. Light section, last before footer.
   ============================================================================= */

export default function YourIdeaBuilt() {
  return (
    <section className="pjpc" aria-labelledby="pjpc-title">
      <div className="pjds-container">
        <div className="pjpc__card" data-reveal="up">
          <div>
            <p className="pjpc__eyebrow">Your idea, built</p>
            <h2 id="pjpc-title" className="pjpc__title">Have a Product Idea of Your Own?</h2>
            <p className="pjpc__meta">Plan · Prototype · Build into a product people use</p>
          </div>
          <div className="pjpc__actions">
            <a
              className="pjpc__btn pjpc__btn--primary"
              href={whatsappHref("Hi ProJenius, I have a product idea and would like to discuss building it with your team.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              Discuss Your Product <ArrowRight size={18} aria-hidden="true" />
              <span className="pjds-sr-only"> (opens WhatsApp in a new tab)</span>
            </a>
            <a className="pjpc__btn pjpc__btn--ghost" href="tel:+918925450473">
              <Phone size={17} aria-hidden="true" /> Talk to Our Team
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
