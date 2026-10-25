import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { BrainCircuit, Boxes, GraduationCap, RadioTower } from "lucide-react";

import "./WhoWeAre.css";
import { WHO_WE_ARE_STATS, WHO_WE_ARE_VIDEO_TITLE, WHO_WE_ARE_VIDEO_URL } from "./whoWeAreConfig.js";

import mainImage from "../../../assets/Home/Optimized/who-we-are-main-452.webp";
import secondImage from "../../../assets/Home/Optimized/who-we-are-lab-800.webp";

/* =============================================================================
   WHO WE ARE — the previous homepage layout, restored:
     centred header (pill tag, title with typed line, underline, description)
     left:  main image + overlapping second image + stats panel
     right: introduction video + four feature cards
   Updated to the design system (Manrope/Inter, tokens) with responsive sizing.
   Entrance motion uses the shared homepage [data-reveal] system (both scroll
   directions); the section's own observer only drives typing and count-up.
   ============================================================================= */

const TYPING_TEXTS = ["IoT & Embedded Systems", "Product Development", "Software & AI Solutions"];
const TYPE_SPEED = 120;
const DELETE_SPEED = 70;
const HOLD_AFTER_TYPING = 1800;
const PAUSE_AFTER_DELETING = 450;
const COUNT_DURATION = 1400;

const FEATURES = [
  { title: "Software Development", text: "Web, apps & software", to: "/services/development", Icon: BrainCircuit },
  { title: "Smart IoT Solutions", text: "IoT & embedded systems", to: "/services/hardware-embedded-systems", Icon: RadioTower },
  { title: "Product Development", text: "Prototypes & 3D design", to: "/services/rapid-prototyping", Icon: Boxes },
  { title: "Training & Mentorship", text: "Courses, internships & workshops", to: "/services/courses", Icon: GraduationCap },
];

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Accepts watch?v=, youtu.be/, /embed/, /shorts/ and /live/ links. */
function getYouTubeId(url) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    let id = "";
    if (host === "youtu.be") id = parsed.pathname.slice(1).split("/")[0];
    else if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      id = parsed.searchParams.get("v") || parsed.pathname.match(/\/(?:embed|shorts|live)\/([\w-]+)/)?.[1] || "";
    }
    return /^[\w-]{11}$/.test(id) ? id : "";
  } catch {
    return "";
  }
}

/* Typed second title line. Runs only while the section is visible. */
function TypingLine({ active }) {
  const [textIndex, setTextIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const reduce = prefersReducedMotion();
  const current = TYPING_TEXTS[textIndex];

  useEffect(() => {
    if (!active || reduce) return undefined;

    let delay;
    let next;
    if (!isDeleting && length < current.length) {
      delay = TYPE_SPEED;
      next = () => setLength((value) => value + 1);
    } else if (!isDeleting) {
      delay = HOLD_AFTER_TYPING;
      next = () => setIsDeleting(true);
    } else if (length > 0) {
      delay = DELETE_SPEED;
      next = () => setLength((value) => value - 1);
    } else {
      delay = PAUSE_AFTER_DELETING;
      next = () => {
        setIsDeleting(false);
        setTextIndex((value) => (value + 1) % TYPING_TEXTS.length);
      };
    }

    const timer = window.setTimeout(next, delay);
    return () => window.clearTimeout(timer);
  }, [active, reduce, isDeleting, length, current]);

  const shown = reduce ? TYPING_TEXTS[0] : current.slice(0, length);

  return (
    <span className="pjh-about__typed">
      <span className="pjds-sr-only">{TYPING_TEXTS.join(", ")}</span>
      <span className="pjh-about__typed-text" aria-hidden="true">
        {shown}
        {!reduce && <span className="pjh-about__cursor">|</span>}
      </span>
    </span>
  );
}

/* Count-up number; restarts each time the section scrolls into view. */
function AnimatedNumber({ end, suffix, active }) {
  const [value, setValue] = useState(() => (prefersReducedMotion() ? end : 0));

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    let frame = 0;
    if (active) {
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / COUNT_DURATION);
        setValue(Math.round(end * (1 - Math.pow(1 - t, 3))));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    } else {
      frame = requestAnimationFrame(() => setValue(0));
    }
    return () => cancelAnimationFrame(frame);
  }, [active, end]);

  return (
    <>
      <span aria-hidden="true">{value}{suffix}</span>
      <span className="pjds-sr-only">{end}{suffix}</span>
    </>
  );
}

/* Keep the native YouTube player visible so its thumbnail, channel details,
   title, and playback controls remain YouTube's own. */
function IntroVideo() {
  const videoId = getYouTubeId(WHO_WE_ARE_VIDEO_URL);

  if (!videoId) return null;

  return (
    <div className="pjh-about__video">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&playsinline=1`}
        title={WHO_WE_ARE_VIDEO_TITLE}
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}

export default function WhoWeAre() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(() => typeof IntersectionObserver === "undefined");

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`pjh-about${isVisible ? " is-visible" : ""}`}
      aria-labelledby="pjh-about-title"
    >
      <div className="pjds-container">
        {/* Header ---------------------------------------------------------- */}
        <header className="pjh-about__header">
          <p className="pjds-eyebrow pjh-about__tag" data-reveal="up">Who We Are</p>
          <h2 id="pjh-about-title" className="pjh-about__title" data-reveal="up" data-reveal-delay="1">
            <span className="pjh-about__title-static">Building Technology Solutions</span>
            <TypingLine active={isVisible} />
          </h2>
          <span className="pjh-about__title-line" aria-hidden="true" data-reveal="line" data-reveal-delay="2" />
          <p className="pjh-about__description" data-reveal="up" data-reveal-delay="2">
            We build practical technology solutions across software, hardware, IoT, and product
            development for businesses, institutions, startups, and organizations.
          </p>
        </header>

        {/* Content --------------------------------------------------------- */}
        <div className="pjh-about__content">
          <div className="pjh-about__left" data-reveal="left" data-reveal-delay="3">
            <div className="pjh-about__images">
              <div className="pjh-about__main-image">
                <img
                  src={mainImage}
                  width="452"
                  height="639"
                  alt="Team members collaborating over a tablet"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="pjh-about__small-image">
                <img
                  src={secondImage}
                  width="800"
                  height="360"
                  alt="Students working together on a hardware prototype in a lab"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <dl className="pjh-about__stats" data-reveal="up" data-reveal-delay="6">
                {WHO_WE_ARE_STATS.map((stat) => (
                  <div key={stat.label} className="pjh-about__stat">
                    <dt className="pjh-about__stat-label">{stat.label}</dt>
                    <dd className="pjh-about__stat-number">
                      <AnimatedNumber end={stat.value} suffix={stat.suffix} active={isVisible} />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="pjh-about__right" data-reveal="right" data-reveal-delay="3">
            <IntroVideo />
            <ul className="pjh-about__features">
              {FEATURES.map(({ title, text, to, Icon }, index) => (
                <li
                  key={title}
                  className="pjh-about__feature-item"
                  data-reveal="up"
                  data-reveal-delay={String(index + 3)}
                >
                  <Link to={to} className="pjh-about__feature">
                    <span className="pjh-about__feature-icon" aria-hidden="true">
                      <Icon size={22} strokeWidth={2} />
                    </span>
                    <span className="pjh-about__feature-content">
                      <span className="pjh-about__feature-title">{title}</span>
                      <span className="pjh-about__feature-text">{text}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
