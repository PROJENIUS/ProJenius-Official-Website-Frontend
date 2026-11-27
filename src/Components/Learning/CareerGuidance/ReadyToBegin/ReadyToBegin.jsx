import { ArrowRight, MessageCircle } from "lucide-react";

import { whatsappHref } from "../../../../utils/whatsapp.js";
import "./ReadyToBegin.css";

/* =========================================================
   CAREER GUIDANCE CLOSING — a short one-row navy card (like
   the course page's "Ready to begin?"): text left, price and
   two buttons right. Light section, last before the footer.
   The ₹99 call details match the booking section and FAQ.
========================================================= */

const BOOK = whatsappHref("Hi ProJenius, I would like to book a 1:1 career guidance call.");
const ASK = whatsappHref("Hi ProJenius, I have a question about career guidance.");

export default function ReadyToBegin() {
  return (
    <section className="pjcgc" aria-labelledby="cg-closing-title">
      <div className="pjds-container">
        <div className="pjcgc__card" data-reveal="up">
          <div className="pjcgc__copy">
            <p className="pjcgc__eyebrow">Ready to begin?</p>
            <h2 id="cg-closing-title" className="pjcgc__title">Plan Your Tech Career With a Mentor</h2>
            <p className="pjcgc__meta">1:1 call · 30 minutes · Fully refundable</p>
          </div>
          <div className="pjcgc__actions">
            <p className="pjcgc__price"><strong>₹99</strong><span>per call</span></p>
            <a className="pjcgc__btn pjcgc__btn--primary" href={BOOK} target="_blank" rel="noopener noreferrer">
              Book a Call <ArrowRight size={18} aria-hidden="true" />
              <span className="pjds-sr-only"> (opens WhatsApp in a new tab)</span>
            </a>
            <a className="pjcgc__btn pjcgc__btn--ghost" href={ASK} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={17} aria-hidden="true" /> Ask a question
              <span className="pjds-sr-only"> (opens WhatsApp in a new tab)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
