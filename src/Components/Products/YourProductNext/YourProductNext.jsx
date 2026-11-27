import { Link } from "react-router-dom";
import { ArrowRight, Building2, GraduationCap, MessageCircle, Rocket } from "lucide-react";

import TypedPhrase from "../../Common/TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../../Common/SectionTitleLine/SectionTitleLine.jsx";
import { SERVICE_ROUTES } from "../../Solutions/Shared/serviceLinks.js";
import { whatsappHref } from "../../../utils/whatsapp.js";
import "./YourProductNext.css";

/* =============================================================================
   GOT A PRODUCT IDEA? — encourages visitors to build their own product and
   sends each kind of visitor to the page that fits them.
   ============================================================================= */

const PATHS = [
  {
    Icon: GraduationCap,
    who: "Student or maker",
    title: "Build it yourself, with our lab",
    text: "Use our space, tools and team while you build your own product.",
    to: SERVICE_ROUTES.incubate,
    label: "Incubate at ProJenius",
  },
  {
    Icon: Rocket,
    who: "Startup founder",
    title: "Turn your idea into a product",
    text: "From a rough idea to one complete, working product.",
    to: SERVICE_ROUTES.startup,
    label: "Startup & Innovation",
  },
  {
    Icon: Building2,
    who: "Business or team",
    title: "Get a working prototype",
    text: "Enclosure, electronics and software, built and tested together.",
    to: SERVICE_ROUTES.prototyping,
    label: "Rapid Prototyping",
  },
];

export default function YourProductNext() {
  return (
    <section id="product-idea" className="pjpi" aria-labelledby="pjpi-title">
      <div className="pjds-container">
        <header className="pjpi__head">
          <p className="pjds-eyebrow pjds-eyebrow--on-dark" data-reveal="up">Your Product Next</p>
          <h2 id="pjpi-title" className="pjpi__title" data-reveal="up" data-reveal-delay="1">
            Got a Product Idea? <TypedPhrase tone="dark" phrases={["Let's Build It.", "Start Here."]} />
          </h2>
          <SectionTitleLine />
          <p className="pjpi__lead" data-reveal="up" data-reveal-delay="2">
            Every product on this page started as an idea. A rough one is enough to start; pick the path that fits you.
          </p>
        </header>

        <ul className="pjpi__paths">
          {PATHS.map(({ Icon, who, title, text, to, label }, index) => (
            <li key={label} className="pjpi__path" data-reveal="up" data-reveal-delay={String(index + 1)}>
              <span className="pjpi__icon" aria-hidden="true"><Icon size={24} /></span>
              <p className="pjpi__who">{who}</p>
              <h3>{title}</h3>
              <p className="pjpi__text">{text}</p>
              <Link className="pjpi__link" to={to}>
                {label} <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>

        <p className="pjpi__or" data-reveal="up" data-reveal-delay="3">
          Not sure which path?{" "}
          <a
            href={whatsappHref("Hi ProJenius, I have a product idea and would like to discuss building it with your team.")}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={16} aria-hidden="true" /> Tell us your idea on WhatsApp
            <span className="pjds-sr-only"> (opens in a new tab)</span>
          </a>
        </p>
      </div>
    </section>
  );
}
