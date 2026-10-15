/* =============================================================================
   CONTACT HERO
   -----------------------------------------------------------------------------
   The opening section of the Contact page. Introduces the page, gives the
   visitor two entry points ("Start an Enquiry" / "Reach Us Directly"), and
   shows a decorative visual of the ProJenius ecosystem.

   Both call-to-action buttons are plain in-page anchor links (href="#...")
   pointing at the section ids rendered by WhatCanWeHelpYouWith and
   PreferToReachUsDirectly. This keeps the component free of event
   listeners, state and effects — navigation works even before React
   finishes hydrating, and each section stays fully independent.
   ============================================================================= */

const ContactHero = () => {
  return (
    <section className="pj-contact-hero" aria-labelledby="pj-contact-hero-title">
      <div className="pj-contact-hero__content">
        {/* ===================================================================
            HERO — COPY (heading, supporting text, call-to-action buttons)
            =================================================================== */}
        <div className="pj-contact-hero__copy">
          <h1 className="pj-contact-hero__title" id="pj-contact-hero-title">
            Let&rsquo;s Start a Conversation.
          </h1>

          <p className="pj-contact-hero__lead">
            Tell us what you&rsquo;re looking for. We&rsquo;ll help you find the right ProJenius pathway.
          </p>

          <p className="pj-contact-hero__description">
            Whether you have an idea to develop, a workshop to conduct, a technology to learn, an
            internship to explore, or a project to discuss &mdash; tell us what you&rsquo;re looking for.
          </p>

          <div className="pj-contact-hero__actions">
            <a className="pj-contact-hero__button pj-contact-hero__button--primary" href="#pj-contact-help">
              Start an Enquiry
            </a>
            <a className="pj-contact-hero__button pj-contact-hero__button--secondary" href="#pj-contact-direct">
              Reach Us Directly
            </a>
          </div>
        </div>

        {/* ===================================================================
            HERO — VISUAL (decorative ecosystem graphic, hidden from screen
            readers since it repeats information already in the page text)
            =================================================================== */}
        <figure className="pj-contact-hero__visual">
          <svg
            className="pj-contact-hero__graphic"
            viewBox="0 0 440 440"
            aria-hidden="true"
            focusable="false"
          >
            <circle className="pj-contact-hero__ring" cx="220" cy="220" r="150" />

            <g className="pj-contact-hero__links">
              <line x1="220" y1="220" x2="220" y2="70" />
              <line x1="220" y1="220" x2="350" y2="145" />
              <line x1="220" y1="220" x2="350" y2="295" />
              <line x1="220" y1="220" x2="220" y2="370" />
              <line x1="220" y1="220" x2="90" y2="295" />
              <line x1="220" y1="220" x2="90" y2="145" />
            </g>

            <g className="pj-contact-hero__core">
              <circle cx="220" cy="220" r="54" />
              <text x="220" y="225" textAnchor="middle">
                PROJENIUS
              </text>
            </g>

            <g className="pj-contact-hero__nodes">
              <g transform="translate(220 70)">
                <rect x="-70" y="-21" width="140" height="42" rx="21" />
                <text x="8" y="5" textAnchor="middle">STARTUP</text>
              </g>
              <g transform="translate(350 145)">
                <rect x="-75" y="-21" width="150" height="42" rx="21" />
                <text x="8" y="5" textAnchor="middle">DEVELOPMENT</text>
              </g>
              <g transform="translate(350 295)">
                <rect x="-70" y="-21" width="140" height="42" rx="21" />
                <text x="8" y="5" textAnchor="middle">WORKSHOP</text>
              </g>
              <g transform="translate(220 370)">
                <rect x="-70" y="-21" width="140" height="42" rx="21" />
                <text x="8" y="5" textAnchor="middle">LEARNING</text>
              </g>
              <g transform="translate(90 295)">
                <rect x="-72" y="-21" width="144" height="42" rx="21" />
                <text x="8" y="5" textAnchor="middle">INTERNSHIP</text>
              </g>
              <g transform="translate(90 145)">
                <rect x="-65" y="-21" width="130" height="42" rx="21" />
                <text x="8" y="5" textAnchor="middle">CAREER</text>
              </g>
            </g>
          </svg>
          <figcaption className="pj-contact-hero__caption">
            One ecosystem. Multiple ways to connect.
          </figcaption>
        </figure>
      </div>
    </section>
  );
};

export default ContactHero;
