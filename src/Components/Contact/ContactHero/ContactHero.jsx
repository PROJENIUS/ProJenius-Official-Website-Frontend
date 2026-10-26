import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  Code2,
  Compass,
  Lightbulb,
  Mail,
  MapPin,
  MessageCircle,
  MessagesSquare,
  Phone,
  Presentation,
} from "lucide-react";

import TypedPhrase from "../../Common/TypedPhrase/TypedPhrase.jsx";
import { whatsappHref } from "../../../utils/whatsapp.js";
import HeroBackdrop from "../../Common/HeroPhotoStack/HeroBackdrop.jsx";
import { heroPhotos } from "../../Common/HeroPhotoStack/heroPhotos.js";
import teamPhoto from "../../../assets/Home/Optimized/who-we-are-team-900.webp";
import "./ContactHero.css";

/* Background photo: src/assets/Heroes/contact/backdrop.* (see its README). */
const HERO = heroPhotos("contact", { backdrop: teamPhoto });

/* =============================================================================
   CONTACT HERO
   -----------------------------------------------------------------------------
   Navy hero like the other pages: pill, static line + typed line, one lead
   line, two actions and the direct contact details. On the right a "What
   would you like to talk about?" panel: each tile jumps to the enquiry form
   and selects that enquiry type there.

   Tiles are plain "#pj-contact-help" links (they scroll even before React
   loads) and also announce the chosen type with ENQUIRY_REQUEST_EVENT, which
   WhatCanWeHelpYouWith listens for. The keys match its ENQUIRY_TYPES.
   ============================================================================= */

const ENQUIRY_REQUEST_EVENT = "pj-contact-enquiry-request";

const TOPICS = [
  { key: "startup", title: "Startup & Innovation", Icon: Lightbulb },
  { key: "development", title: "Development", Icon: Code2 },
  { key: "workshop", title: "Workshop", Icon: Presentation },
  { key: "course", title: "Courses & Learning", Icon: BookOpen },
  { key: "internship", title: "Internship", Icon: BriefcaseBusiness },
  { key: "career", title: "Join Our Team", Icon: Compass },
];

const PHONE_DISPLAY = "+91 89254 50473";
const PHONE_HREF = "tel:+918925450473";
const EMAIL = "teamprojenius@gmail.com";

const requestEnquiry = (key) =>
  window.dispatchEvent(new CustomEvent(ENQUIRY_REQUEST_EVENT, { detail: { type: key } }));

export default function ContactHero() {
  return (
    <section className="pj-contact-hero" aria-labelledby="pj-contact-hero-title">
      <HeroBackdrop image={HERO.backdrop} />
      <div className="pjds-container pj-contact-hero__layout">
        <div className="pj-contact-hero__copy">
          <p className="pjds-eyebrow pjds-eyebrow--on-dark" data-reveal="up">Contact ProJenius</p>
          <h1 id="pj-contact-hero-title" className="pj-contact-hero__title" data-reveal="up" data-reveal-delay="1">
            <span className="pj-contact-hero__title-static">Let&rsquo;s Start</span>
            <TypedPhrase tone="dark" phrases={["a Conversation", "Your Next Project", "Something Great"]} />
          </h1>
          <p className="pj-contact-hero__lead" data-reveal="up" data-reveal-delay="2">
            An idea to build, a workshop to run, a technology to learn or a project to discuss: tell us
            what you need and we&rsquo;ll connect you with the right ProJenius team.
          </p>

          <div className="pj-contact-hero__actions" data-reveal="up" data-reveal-delay="3">
            <a className="pjds-btn pjds-btn--primary pjds-btn--on-dark" href="#pj-contact-help">
              Start an Enquiry <ArrowDown size={18} aria-hidden="true" />
            </a>
            <a
              className="pjds-btn pjds-btn--ghost"
              href={whatsappHref("Hi ProJenius, I would like to discuss an enquiry with your team.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={18} aria-hidden="true" /> Chat on WhatsApp
              <span className="pjds-sr-only">(opens in a new tab)</span>
            </a>
          </div>

          <ul className="pj-contact-hero__quick" data-reveal="up" data-reveal-delay="4">
            <li>
              <a href={PHONE_HREF}><Phone size={16} aria-hidden="true" />{PHONE_DISPLAY}</a>
            </li>
            <li>
              <a href={`mailto:${EMAIL}`}><Mail size={16} aria-hidden="true" />{EMAIL}</a>
            </li>
            <li>
              <span><MapPin size={16} aria-hidden="true" />Madurai, Tamil Nadu</span>
            </li>
          </ul>
        </div>

        <nav className="pj-contact-hero__panel" aria-labelledby="pj-contact-hero-panel-title" data-reveal="right" data-reveal-delay="2">
          <h2 id="pj-contact-hero-panel-title" className="pj-contact-hero__panel-title">
            What would you like to talk about?
          </h2>
          <ul className="pj-contact-hero__topics">
            {TOPICS.map(({ key, title, Icon }) => (
              <li key={key}>
                <a
                  className={`pj-contact-hero__topic pj-contact-hero__topic--${key}`}
                  href="#pj-contact-help"
                  onClick={() => requestEnquiry(key)}
                >
                  <span className="pj-contact-hero__topic-icon" aria-hidden="true">
                    <Icon size={22} strokeWidth={1.9} />
                  </span>
                  <span className="pj-contact-hero__topic-title">{title}</span>
                  <ArrowUpRight className="pj-contact-hero__topic-go" size={16} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
          <a className="pj-contact-hero__general" href="#pj-contact-help" onClick={() => requestEnquiry("general")}>
            <MessagesSquare size={18} aria-hidden="true" />
            <span>Something else? <strong>Send a general enquiry</strong></span>
          </a>
        </nav>
      </div>
    </section>
  );
}
