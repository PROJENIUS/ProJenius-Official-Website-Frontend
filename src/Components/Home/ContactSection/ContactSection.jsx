import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";

import "./ContactSection.css";
import fastDeliveryIcon from "../../../assets/Home/ContactSection/ContactSection_1.svg";
import reliableSolutionsIcon from "../../../assets/Home/ContactSection/ContactSection_2.svg";
import dedicatedSupportIcon from "../../../assets/Home/ContactSection/ContactSection_3.svg";

const CONTACT_FEATURES = [
  { title: "Fast Delivery", description: "Efficient development", icon: fastDeliveryIcon },
  { title: "Reliable Solutions", description: "Built for real impact", icon: reliableSolutionsIcon },
  { title: "Dedicated Support", description: "We’re here to help", icon: dedicatedSupportIcon },
];

const WHATSAPP_HREF =
  "https://wa.me/918925450473?text=Hi%2C%20I%20would%20like%20to%20discuss%20a%20project%20with%20ProJenius.";
const PHONE_HREF = "tel:+918925450473";

export default function ContactSection() {
  return (
    <section className="pjh-home-contact" aria-labelledby="pjh-home-contact-title">
      <div className="pjds-container">
        <div className="pjh-home-contact__card" data-reveal="up">
          <p className="pjds-eyebrow pjds-eyebrow--on-dark pjh-home-contact__eyebrow">
            Let’s work together
          </p>

          <h2 className="pjh-home-contact__title" id="pjh-home-contact-title">
            Let’s Build Something Great Together
          </h2>

          <span className="pjh-home-contact__accent" aria-hidden="true" />

          <p className="pjh-home-contact__description">
            Have an idea, project, or business challenge? Let’s shape it into a useful solution with
            the right technology and a team ready to help.
          </p>

          <ul className="pjh-home-contact__features" aria-label="How ProJenius works with you">
            {CONTACT_FEATURES.map(({ title, description, icon }, index) => (
              <li className="pjh-home-contact__feature" key={title}>
                <span className="pjh-home-contact__feature-icon" aria-hidden="true">
                  <img src={icon} alt="" />
                </span>
                <span className="pjh-home-contact__feature-copy">
                  <strong>{title}</strong>
                  <span>{description}</span>
                </span>
                {index < CONTACT_FEATURES.length - 1 && (
                  <span className="pjh-home-contact__divider" aria-hidden="true" />
                )}
              </li>
            ))}
          </ul>

          <div className="pjh-home-contact__actions">
            <a
              className="pjh-home-contact__button pjh-home-contact__button--primary"
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={18} aria-hidden="true" />
              Start Your Project
              <span className="pjds-sr-only"> (opens WhatsApp in a new tab)</span>
            </a>
            <a className="pjh-home-contact__button pjh-home-contact__button--secondary" href={PHONE_HREF}>
              <Phone size={17} aria-hidden="true" />
              Talk to Our Team
            </a>
          </div>

          <Link className="pjh-home-contact__contact-link" to="/contact">
            Prefer to send an enquiry? Contact us <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
