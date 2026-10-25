import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import useOnScreen from "../../../../hooks/useOnScreen.js";
import "./CareerGuidanceHero.css";

import sessionPhoto from "../../../../assets/About/Achievements/Achievements_5.webp";
import workshopPhoto from "../../../../assets/About/Achievements/Achievements_3.webp";
import handsOnPhoto from "../../../../assets/About/Achievements/Achievements_4.webp";
import certificatePhoto from "../../../../assets/Home/Optimized/who-we-are-team-900.webp";
import classroomPhoto from "../../../../assets/About/Achievements/Achievements_2.webp";
import awardsPhoto from "../../../../assets/Home/Optimized/hero-recognition-960.webp";
import eventPhoto from "../../../../assets/Home/Optimized/hero-ai-event-960.webp";

/* =========================================================
   CAREER GUIDANCE HERO
   Left: heading with the typed line and the two actions.
   Right: three real ProJenius photos in a stack (back, front,
   down). Every 3 seconds the stack moves on: a new photo
   appears at the back, the back photo comes to the front, the
   front photo moves down and the lowest one leaves. Pauses on
   hover, while off screen and with reduced motion.
   To add a photo, import it and add { src, alt, label }.
========================================================= */

const HERO_PHRASES = ["With a Clear Roadmap", "With Practical Preparation", "With the Right Direction"];

const PHOTOS = [
  { src: sessionPhoto, label: "Campus Session", alt: "ProJenius session with students at SRM Institute of Science and Technology" },
  { src: workshopPhoto, label: "Workshops", alt: "Students taking part in a ProJenius workshop" },
  { src: certificatePhoto, label: "Certification", alt: "Students and mentors with a certificate of recognition" },
  { src: handsOnPhoto, label: "Hands-On Learning", alt: "Students working together during a hands-on session" },
  { src: classroomPhoto, label: "Recognition", alt: "Students receiving recognition in a classroom" },
  { src: awardsPhoto, label: "Awards", alt: "Students and mentors on stage at a science and innovation recognition event" },
  { src: eventPhoto, label: "Industry Events", alt: "Speakers on stage at the CII Connect Madurai AI event" },
];

const INTERVAL_MS = 3000;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Role of photo i at step t: down = t, front = t + 1, back = t + 2, the one
   that just left = t - 1, every other photo waits hidden behind the back. */
function roleOf(index, step) {
  const offset = (((index - step) % PHOTOS.length) + PHOTOS.length) % PHOTOS.length;
  if (offset === 0) return "down";
  if (offset === 1) return "front";
  if (offset === 2) return "back";
  if (offset === PHOTOS.length - 1) return "gone";
  return "waiting";
}

export default function CareerGuidanceHero() {
  const visualRef = useRef(null);
  const isOnScreen = useOnScreen(visualRef);
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!isOnScreen || paused || prefersReducedMotion()) return undefined;
    const timer = window.setInterval(() => setStep((current) => (current + 1) % PHOTOS.length), INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [isOnScreen, paused]);

  return (
    <section className="cghero-section" aria-labelledby="cghero-title">
      <div className="pjds-container cghero-container">
        <div className="cghero-content">
          <p className="pjds-eyebrow pjds-eyebrow--on-dark" data-reveal="up">Career Guidance</p>
          <h1 className="cghero-title" id="cghero-title" data-reveal="up" data-reveal-delay="1">
            <span className="cghero-title-static">Build your technology career</span>
            <TypedPhrase tone="dark" phrases={HERO_PHRASES} />
          </h1>
          <p className="cghero-description" data-reveal="up" data-reveal-delay="2">
            Get practical guidance, skill recommendations and career preparation to move confidently toward your technology career.
          </p>
          <div className="cghero-actions" data-reveal="up" data-reveal-delay="3">
            <a href="#book-call" className="pjds-btn pjds-btn--primary">Book a mentoring call <ArrowRight size={18} aria-hidden="true" /></a>
            <a href="#guidance-process" className="pjds-btn pjds-btn--ghost">See how it works <ArrowRight size={18} aria-hidden="true" /></a>
          </div>
        </div>

        <div
          ref={visualRef}
          className="cghero-visual"
          data-reveal="right"
          data-reveal-delay="2"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {PHOTOS.map((photo, index) => {
            const role = roleOf(index, step);
            const shown = role === "back" || role === "front" || role === "down";
            return (
              <figure key={photo.label} className={`cghero-photo is-${role}`} aria-hidden={shown ? undefined : "true"}>
                <img src={photo.src} alt={shown ? photo.alt : ""} decoding="async" loading={index < 3 ? "eager" : "lazy"} />
                <figcaption className="cghero-photo__label">{photo.label}</figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
