import { Link } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";

import "./ContactSection.css";
import fastDeliveryIcon from "../../../assets/Home/ContactSection/ContactSection_1.svg";
import reliableSolutionsIcon from "../../../assets/Home/ContactSection/ContactSection_2.svg";
import dedicatedSupportIcon from "../../../assets/Home/ContactSection/ContactSection_3.svg";

/* =============================================================================
   LET'S CONNECT — the blue closing card (Home, About, Startup …).
   Called with no props it shows the homepage version. Pages can pass their
   own text, features and actions:
     id, eyebrow, title, description
     features  [{ title, description, icon (image) | Icon (lucide) }]
     primary   { label, href | to, external? }   cyan button with →
     secondary { label, href | to }             outline button (phone icon
                                                when href starts with tel:)
   ============================================================================= */

const DEFAULT_FEATURES = [
  { title: "Fast Delivery", description: "Efficient development", icon: fastDeliveryIcon },
  { title: "Reliable Solutions", description: "Built for real impact", icon: reliableSolutionsIcon },
  { title: "Dedicated Support", description: "We’re here to help", icon: dedicatedSupportIcon },
];

const DEFAULT_PRIMARY = {
  label: "Start Your Project",
  href: "https://wa.me/918925450473?text=Hi%2C%20I%20would%20like%20to%20discuss%20a%20project%20with%20ProJenius.",
  external: true,
};
const DEFAULT_SECONDARY = { label: "Talk to Our Team", href: "tel:+918925450473" };

function Action({ action, className, children }) {
  if (action.to) {
    return <Link className={className} to={action.to}>{children}</Link>;
  }
  return (
    <a className={className} href={action.href} {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {children}
      {action.external && <span className="pjds-sr-only"> (opens in a new tab)</span>}
    </a>
  );
}

export default function ContactSection({
  id,
  eyebrow = "Let’s Connect",
  title = "Let’s Build Something Great Together",
  description = "Have an idea, project, or business challenge? Let’s turn your vision into a powerful digital experience with the right technology and strategy.",
  features = DEFAULT_FEATURES,
  primary = DEFAULT_PRIMARY,
  secondary = DEFAULT_SECONDARY,
}) {
  const titleId = id ? `${id}-title` : "pjh-home-contact-title";
  const secondaryIsPhone = secondary?.href?.startsWith("tel:");

  return (
    <section id={id} className="pjh-home-contact" aria-labelledby={titleId}>
      <div className="pjds-container">
        <div className="pjh-home-contact__eyebrow-wrap">
          <p className="pjds-eyebrow pjh-home-contact__eyebrow" data-reveal="up">{eyebrow}</p>
        </div>

        <div className="pjh-home-contact__card" data-reveal="up" data-reveal-delay="1">
          <h2 className="pjh-home-contact__title" id={titleId}>{title}</h2>

          <span className="pjh-home-contact__accent" aria-hidden="true" />

          <p className="pjh-home-contact__description">{description}</p>

          <ul className="pjh-home-contact__features" aria-label="How ProJenius works with you">
            {features.map(({ title: featureTitle, description: featureText, icon, Icon }, index) => (
              <li className="pjh-home-contact__feature" key={featureTitle}>
                <span className="pjh-home-contact__feature-icon" aria-hidden="true">
                  {Icon ? <Icon className="pjh-home-contact__feature-svg" strokeWidth={1.9} /> : <img src={icon} alt="" />}
                </span>
                <span className="pjh-home-contact__feature-copy">
                  <strong>{featureTitle}</strong>
                  <span>{featureText}</span>
                </span>
                {index < features.length - 1 && <span className="pjh-home-contact__divider" aria-hidden="true" />}
              </li>
            ))}
          </ul>

          <div className="pjh-home-contact__actions">
            <Action action={primary} className="pjh-home-contact__button pjh-home-contact__button--primary">
              {primary.label}
              <ArrowRight size={18} aria-hidden="true" />
            </Action>
            {secondary && (
              <Action action={secondary} className="pjh-home-contact__button pjh-home-contact__button--secondary">
                {secondaryIsPhone && <Phone size={17} aria-hidden="true" />}
                {secondary.label}
              </Action>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
