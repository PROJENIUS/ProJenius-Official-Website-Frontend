import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

import "./OurProjects.css";
import { PROJECTS } from "./projectsData.js";

/* =============================================================================
   OUR PROJECTS — the previous homepage layout, restored:
     centred header (pill tag, title with typed line, underline, description)
     card slider: active card centred, previous/next cards beside it,
     arrow buttons and dot navigation
   Updated to the design system (Manrope/Inter, tokens) with responsive sizing.
   Entrance motion uses the shared homepage [data-reveal] system; the section's
   own observer only drives typing and autoplay.
   Autoplay advances every three seconds while visible, continues during mouse
   hover, pauses for keyboard interaction and reduced motion, and restarts its
   interval after every manual navigation.
   ============================================================================= */

// Each phrase names the kind of work shown by the project cards below.
const TYPING_TEXTS = [
  "Smart IoT Systems",
  "AI-Powered Solutions",
  "Embedded Hardware",
  "Autonomous Robotics",
  "Road Safety Technology",
];
const LONGEST_TYPING_TEXT = TYPING_TEXTS.reduce((a, b) => (b.length > a.length ? b : a));
const TYPE_SPEED = 120;
const DELETE_SPEED = 70;
const HOLD_AFTER_TYPING = 1800;
const PAUSE_AFTER_DELETING = 450;
const ROTATION_INTERVAL = 3000;
const TOTAL = PROJECTS.length;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Typed second title line. An invisible copy of the longest phrase reserves
   the space, so typing never moves the content below it at any width. */
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
    <span className="pjh-projects__typed">
      <span className="pjds-sr-only">{TYPING_TEXTS.join(", ")}</span>
      <span className="pjh-projects__typed-ghost" aria-hidden="true">
        {LONGEST_TYPING_TEXT}
      </span>
      <span className="pjh-projects__typed-text" aria-hidden="true">
        {shown}
        {!reduce && <span className="pjh-projects__cursor">|</span>}
      </span>
    </span>
  );
}

function ProjectVisual({ project }) {
  const { Icon } = project;
  if (project.image) {
    return <img src={project.image} alt={project.alt} loading="lazy" decoding="async" draggable="false" />;
  }
  return (
    <span className="pjh-projects__placeholder" aria-hidden="true">
      <Icon size={72} strokeWidth={1.3} />
    </span>
  );
}

/* Five stars, the first `rating` of them filled (rating is out of 5). */
function ProjectRating({ rating }) {
  const filled = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div className="pjh-projects__rating" role="img" aria-label={`Rated ${filled} out of 5`}>
      <span className="pjh-projects__stars" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            size={17}
            strokeWidth={1.6}
            className={`pjh-projects__star${index < filled ? " is-filled" : ""}`}
          />
        ))}
      </span>
      <span className="pjh-projects__rating-value" aria-hidden="true">{filled.toFixed(1)}</span>
    </div>
  );
}

function cardPosition(index, activeIndex) {
  if (index === activeIndex) return "active";
  if (index === (activeIndex - 1 + TOTAL) % TOTAL) return "prev";
  if (index === (activeIndex + 1) % TOTAL) return "next";
  return "hidden";
}

export default function OurProjects() {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(() => typeof IntersectionObserver === "undefined");
  const [hasKeyboardFocus, setHasKeyboardFocus] = useState(false);

  const isRunning = isVisible && !hasKeyboardFocus && !prefersReducedMotion();

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

  // Keyed on activeIndex, so every change (auto or manual) restarts the wait.
  useEffect(() => {
    if (!isRunning) return undefined;
    const timer = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % TOTAL);
    }, ROTATION_INTERVAL);
    return () => window.clearTimeout(timer);
  }, [isRunning, activeIndex]);

  const goTo = (index) => setActiveIndex((index + TOTAL) % TOTAL);

  const handleFocus = (event) => {
    if (event.target.matches?.(":focus-visible")) setHasKeyboardFocus(true);
  };

  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setHasKeyboardFocus(false);
  };

  return (
    <section
      ref={sectionRef}
      id="home-projects"
      className="pjh-projects"
      aria-labelledby="pjh-projects-title"
    >
      <div className="pjds-container">
        {/* Header ---------------------------------------------------------- */}
        <header className="pjh-projects__header">
          <p className="pjds-eyebrow pjh-projects__tag" data-reveal="up">Our Projects</p>
          <h2 id="pjh-projects-title" className="pjh-projects__title" data-reveal="up" data-reveal-delay="1">
            <span className="pjh-projects__title-static">Turning Real-World Problems Into</span>
            <TypingLine active={isVisible} />
          </h2>
          <span className="pjh-projects__title-line" aria-hidden="true" data-reveal="line" data-reveal-delay="2" />
          <p className="pjh-projects__description" data-reveal="up" data-reveal-delay="2">
            Explore our technology projects across software, IoT, AI, hardware, and embedded
            systems, developed to address real-world business and industry needs.
          </p>
        </header>

        {/* Slider ---------------------------------------------------------- */}
        <div
          className="pjh-projects__slider"
          data-reveal="up"
          data-reveal-delay="3"
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          <button
            type="button"
            className="pjh-projects__arrow pjh-projects__arrow--prev"
            onClick={() => goTo(activeIndex - 1)}
            aria-label="Previous project"
          >
            <ChevronLeft size={22} aria-hidden="true" />
          </button>

          <div className="pjh-projects__stage">
            {PROJECTS.map((project, index) => {
              const position = cardPosition(index, activeIndex);
              return (
                <article
                  key={project.id}
                  className={`pjh-projects__card pjh-projects__card--${position}`}
                  aria-hidden={position !== "active"}
                >
                  <div className="pjh-projects__card-media">
                    <ProjectVisual project={project} />
                    <span className="pjh-projects__card-shade" aria-hidden="true" />
                    <span className="pjh-projects__category">{project.category}</span>
                  </div>
                  <div className="pjh-projects__card-body">
                    <h3 className="pjh-projects__card-title">{project.title}</h3>
                    <p className="pjh-projects__card-text">{project.description}</p>
                    {typeof project.rating === "number" && <ProjectRating rating={project.rating} />}
                  </div>
                </article>
              );
            })}
          </div>

          <button
            type="button"
            className="pjh-projects__arrow pjh-projects__arrow--next"
            onClick={() => goTo(activeIndex + 1)}
            aria-label="Next project"
          >
            <ChevronRight size={22} aria-hidden="true" />
          </button>
        </div>

        {/* Dots ------------------------------------------------------------ */}
        <div className="pjh-projects__dots" role="group" aria-label="Choose a project" data-reveal="up" data-reveal-delay="4">
          {PROJECTS.map((project, index) => (
            <button
              key={project.id}
              type="button"
              className={`pjh-projects__dot${index === activeIndex ? " is-active" : ""}`}
              aria-label={`Show ${project.title}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => goTo(index)}
            />
          ))}
        </div>

        <p className="pjds-sr-only" aria-live={isRunning ? "off" : "polite"} aria-atomic="true">
          {`Project ${activeIndex + 1} of ${TOTAL}: ${PROJECTS[activeIndex].title}`}
        </p>
      </div>
    </section>
  );
}
