import { useEffect, useRef, useState } from "react";
import { Building2, Mail, MapPin, Navigation, Phone } from "lucide-react";

import TypedPhrase from "../../Common/TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../../Common/SectionTitleLine/SectionTitleLine.jsx";
import "./PreferToReachUsDirectly.css";

/* =============================================================================
   VISIT OUR OFFICE — last section of the Contact page (light).
   Left: the office details card (address, phone, email, directions).
   Right: a Google map of the office. The map is loaded only when the
   section is close to the screen, so the page stays fast.
   ============================================================================= */

const COMPANY = "ProJenius Innovation Technology Private Limited";
const ADDRESS_LINES = ["Plot No 3, Erikarai Street,", "Velmurugan Nagar, Namachivaya Nagar,", "Madurai, Tamil Nadu 625003"];
const PHONE = "+91 89254 50473";
const EMAIL = "teamprojenius@gmail.com";
const DIRECTIONS =
  "https://www.google.com/maps/dir//ProJenius+Innovation+Technology+Private+Limited,+PLOT+NO+3,+Erikarai+St,+Velmurugan+Nagar,+Namachivaya+Nagar,+Madurai,+Tamil+Nadu+625003/@9.9136785,78.0901833,17z";
const MAP_EMBED = "https://www.google.com/maps?q=9.9136785,78.0901833&z=16&output=embed";

export default function PreferToReachUsDirectly() {
  const mapRef = useRef(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const el = mapRef.current;
    if (!el || !("IntersectionObserver" in window)) {
      setShowMap(true);
      return undefined;
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShowMap(true);
        io.disconnect();
      }
    }, { rootMargin: "300px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
            <a className="pj-contact-direct__directions" href={DIRECTIONS} target="_blank" rel="noopener noreferrer">
              <Navigation size={18} aria-hidden="true" /> Get Directions
              <span className="pjds-sr-only"> (opens Google Maps in a new tab)</span>
            </a>
          </div>

          <div ref={mapRef} className="pj-contact-direct__map" data-reveal="right">
            {showMap ? (
              <iframe
                title="Map showing the ProJenius office in Madurai"
                src={MAP_EMBED}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              <div className="pj-contact-direct__map-wait" aria-hidden="true"><MapPin size={28} /></div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
