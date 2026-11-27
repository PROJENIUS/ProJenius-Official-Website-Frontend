import { ArrowUpRight, Building2, Mail, MapPin, Navigation, Phone } from "lucide-react";

import TypedPhrase from "../../Common/TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../../Common/SectionTitleLine/SectionTitleLine.jsx";
import OfficeMapArt from "../../Common/OfficeMap/OfficeMapArt.jsx";
import { MAPS_DIRECTIONS_HREF, MAPS_VIEW_HREF, OFFICE_ADDRESS_LINES } from "../../Common/OfficeMap/officeLocation.js";
import "./OurOffice.css";

/* =============================================================================
   VISIT OUR OFFICE — last section of the Contact page (light).
   Left: the office details card (address, phone, email, directions).
   Right: the office map, the same drawing as the footer, linking to the
   ProJenius Google Business listing (no embedded third-party map, so it
   always appears instantly, never blank, and sets no cookies).
   ============================================================================= */

const COMPANY = "ProJenius Innovation Technology Private Limited";
const ADDRESS_LINES = OFFICE_ADDRESS_LINES;
const PHONE = "+91 89254 50473";
const EMAIL = "teamprojenius@gmail.com";

export default function OurOffice() {
  return (
    <section className="pj-contact-direct" id="pj-contact-direct" aria-labelledby="pj-contact-direct-title">
      <div className="pjds-container">
        <header className="pj-contact-direct__header">
          <p className="pjds-eyebrow" data-reveal="up">Our Office</p>
          <h2 className="pj-contact-direct__title" id="pj-contact-direct-title" data-reveal="up" data-reveal-delay="1">
            Visit Us <TypedPhrase phrases={["in Madurai.", "and Say Hello."]} />
          </h2>
          <SectionTitleLine />
        </header>

        <div className="pj-contact-direct__layout">
          <div className="pj-contact-direct__card" data-reveal="left">
            <div className="pj-contact-direct__block">
              <span className="pj-contact-direct__icon" aria-hidden="true"><Building2 size={20} /></span>
              <div>
                <p className="pj-contact-direct__label">Company</p>
                <p className="pj-contact-direct__value">{COMPANY}</p>
              </div>
            </div>
            <div className="pj-contact-direct__block">
              <span className="pj-contact-direct__icon" aria-hidden="true"><MapPin size={20} /></span>
              <div>
                <p className="pj-contact-direct__label">Address</p>
                <address className="pj-contact-direct__value">
                  {ADDRESS_LINES.map((line) => <span key={line}>{line}</span>)}
                </address>
              </div>
            </div>
            <div className="pj-contact-direct__block">
              <span className="pj-contact-direct__icon" aria-hidden="true"><Phone size={20} /></span>
              <div>
                <p className="pj-contact-direct__label">Phone</p>
                <a className="pj-contact-direct__value pj-contact-direct__link" href={`tel:${PHONE.replace(/\s/g, "")}`}>{PHONE}</a>
              </div>
            </div>
            <div className="pj-contact-direct__block">
              <span className="pj-contact-direct__icon" aria-hidden="true"><Mail size={20} /></span>
              <div>
                <p className="pj-contact-direct__label">Email</p>
                <a className="pj-contact-direct__value pj-contact-direct__link" href={`mailto:${EMAIL}`}>{EMAIL}</a>
              </div>
            </div>
            <a className="pj-contact-direct__directions" href={MAPS_DIRECTIONS_HREF} target="_blank" rel="noopener noreferrer">
              <Navigation size={18} aria-hidden="true" /> Get Directions
              <span className="pjds-sr-only"> (opens Google Maps in a new tab)</span>
            </a>
          </div>

          <div className="pj-contact-direct__map" data-reveal="right">
            <a className="pj-contact-direct__map-link" href={MAPS_VIEW_HREF} target="_blank" rel="noopener noreferrer" aria-label="Open the ProJenius office in Google Maps (opens in a new tab)">
              <OfficeMapArt />
            </a>
            <div className="pj-contact-direct__map-bar">
              <span><MapPin size={16} aria-hidden="true" /> ProJenius Innovation Technology, Madurai</span>
              <a href={MAPS_VIEW_HREF} target="_blank" rel="noopener noreferrer">View on Google Maps <ArrowUpRight size={15} aria-hidden="true" /><span className="pjds-sr-only"> (opens in a new tab)</span></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
