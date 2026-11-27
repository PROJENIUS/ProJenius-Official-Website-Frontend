import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import TypedPhrase from "../../Common/TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../../Common/SectionTitleLine/SectionTitleLine.jsx";
import { scrollToHash } from "../../Common/CinematicHero/heroUtils.js";
import { whatsappHref } from "../../../utils/whatsapp.js";
import "./ContactHero.css";

/* =============================================================================
   CONTACT HERO — navy. A breadcrumb line, a centred heading (pill, cyan
   typing, blue line, lead), then the four ways to reach ProJenius as one row
   of simple cards: icon, title, short line, link.
   ============================================================================= */

const PHONE = "+91 89254 50473";
const EMAIL = "teamprojenius@gmail.com";

const CHANNELS = [
  {
    Icon: MessageCircle,
    title: "Chat on WhatsApp",
    text: "Quickest way to reach our team.",
    link: "Start a chat",
    href: whatsappHref("Hello ProJenius, I would like to know more."),
    external: true,
  },
  {
    Icon: Mail,
    title: "Email us",
    text: "For detailed requirements and documents.",
    link: EMAIL,
    href: `mailto:${EMAIL}`,
  },
  {
    Icon: Phone,
    title: "Call us",
    text: "Talk to the ProJenius team directly.",
    link: PHONE,
    href: `tel:${PHONE.replace(/\s/g, "")}`,
  },
  {
    Icon: MapPin,
    title: "Visit us",
    text: "Our office in Madurai, Tamil Nadu.",
    link: "See office & map",
    hash: "#pj-contact-direct",
  },
];

export default function ContactHero() {
  return (
    <section className="pj-contact-hero" aria-labelledby="pj-contact-hero-title">
      <div className="pjds-container">
        <div className="pj-contact-hero__crumbs" data-reveal="up">
          <nav aria-label="Breadcrumb">
            <Link to="/">ProJenius</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Contact</span>
          </nav>
          <span className="pj-contact-hero__crumbs-note">Phone · WhatsApp · Email</span>
        </div>

        <header className="pj-contact-hero__head">
          <p className="pjds-eyebrow pjds-eyebrow--on-dark" data-reveal="up">Get in Touch</p>
          <h1 id="pj-contact-hero-title" className="pj-contact-hero__title" data-reveal="up" data-reveal-delay="1">
            Let&rsquo;s Build <TypedPhrase tone="dark" phrases={["Something Great.", "Your Idea.", "It Together."]} />
          </h1>
          <SectionTitleLine />
          <p className="pj-contact-hero__lead" data-reveal="up" data-reveal-delay="2">
            Tell us about your project, idea or question. Choose how you want to reach us, or send an
            enquiry and our team will get back to you.
          </p>
          <a
            className="pj-contact-hero__cta"
            href="#pj-contact-help"
            onClick={(event) => scrollToHash(event, "#pj-contact-help")}
            data-reveal="up"
            data-reveal-delay="3"
          >
            Send an Enquiry <ArrowDown size={18} aria-hidden="true" />
          </a>
        </header>

        <ul className="pj-contact-hero__channels">
          {CHANNELS.map(({ Icon, title, text, link, href, hash, external }, index) => (
            <li key={title} className="pj-contact-hero__channel" data-reveal="up" data-reveal-delay={String(index + 1)}>
              <span className="pj-contact-hero__channel-icon" aria-hidden="true"><Icon size={20} /></span>
              <h2 className="pj-contact-hero__channel-title">{title}</h2>
              <p className="pj-contact-hero__channel-text">{text}</p>
              <a
                className="pj-contact-hero__channel-link"
                href={hash || href}
                onClick={hash ? (event) => scrollToHash(event, hash) : undefined}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <span>{link}</span>
                <ArrowRight size={16} aria-hidden="true" />
                {external && <span className="pjds-sr-only"> (opens in a new tab)</span>}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
