import { Link } from "react-router-dom";
import { ArrowRight, Hammer, MessageCircle, SlidersHorizontal, Users } from "lucide-react";

import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../../../Common/SectionTitleLine/SectionTitleLine.jsx";
import { whatsappHref } from "../../../../utils/whatsapp.js";
import { heroPhotos } from "../../../Common/HeroPhotoStack/heroPhotos.js";
import handsOnPhoto from "../../../../assets/About/Achievements/Achievements_4.webp";
import classroomPhoto from "../../../../assets/About/Achievements/Achievements_6.webp";
import sessionPhoto from "../../../../assets/About/Achievements/Achievements_3.webp";
import "./WorkshopThatGoesBeyondTheClassroom.css";

/* =========================================================
   WORKSHOP HERO — navy, our hero pattern: pill, heading with
   cyan typing, blue line, cyan CTA. Right: real ProJenius
   workshop photos with three floating cards.
   Photos: drop 3+ into src/assets/Heroes/workshop/ to replace them.
========================================================= */

const DEFAULT_PHOTOS = [
  { image: handsOnPhoto, alt: "Students exploring a working prototype at a ProJenius workshop" },
  { image: classroomPhoto, alt: "Explaining concepts in the classroom" },
  { image: sessionPhoto, alt: "Students during a hands-on session" },
];
const UPLOADED = heroPhotos("workshop").cards || [];
const PHOTOS = UPLOADED.length >= 3
  ? UPLOADED.slice(0, 3).map((p) => ({ image: p.image, alt: p.title || "ProJenius workshop" }))
  : DEFAULT_PHOTOS;

const WHATSAPP = whatsappHref("Hi ProJenius, I would like to know about hosting a workshop at our institution.");

export default function WorkshopHero() {
  return (
    <section className="pjwh" aria-labelledby="wh-hero-title">
      <div className="pjds-container pjwh__grid">
        <div className="pjwh__copy">
          <p className="pjds-eyebrow pjds-eyebrow--on-dark" data-reveal="up">Workshops &amp; Training</p>
          <h1 id="wh-hero-title" className="pjwh__title" data-reveal="up" data-reveal-delay="1">
            Workshops That Go{" "}
            <TypedPhrase tone="dark" phrases={["Beyond the Classroom.", "Hands-On.", "Into Real Projects."]} />
          </h1>
          <SectionTitleLine />
          <p className="pjwh__lead" data-reveal="up" data-reveal-delay="2">
            Hands-on technology workshops designed to help students explore, experiment, build and experience
            emerging technologies through practical learning.
          </p>
          <div className="pjwh__actions" data-reveal="up" data-reveal-delay="3">
            <Link className="pjwh__btn pjwh__btn--primary" to="/contact?type=workshop">
              Plan a Workshop <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a className="pjwh__btn pjwh__btn--ghost" href={WHATSAPP} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={18} aria-hidden="true" /> Ask on WhatsApp
              <span className="pjds-sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>

        <div className="pjwh__photos" data-reveal="up" data-reveal-delay="2">
          {PHOTOS.map((photo, index) => (
            <figure key={index} className={`pjwh__photo pjwh__photo--${index + 1}`}>
              <img src={photo.image} alt={photo.alt} loading={index ? "lazy" : "eager"} />
            </figure>
          ))}
          <p className="pjwh__float pjwh__float--a">
            <span className="pjwh__float-icon" aria-hidden="true"><Hammer size={17} /></span>
            <span><strong>Hands-on sessions</strong><small>Students build, not just listen</small></span>
          </p>
          <p className="pjwh__float pjwh__float--b">
            <span className="pjwh__float-icon" aria-hidden="true"><SlidersHorizontal size={17} /></span>
            <span><strong>Customized topics</strong><small>Shaped around your students</small></span>
          </p>
          <p className="pjwh__float pjwh__float--c">
            <span className="pjwh__float-icon" aria-hidden="true"><Users size={17} /></span>
            <span><strong>For colleges &amp; clubs</strong><small>Departments, clubs, institutions</small></span>
          </p>
        </div>
      </div>
    </section>
  );
}
