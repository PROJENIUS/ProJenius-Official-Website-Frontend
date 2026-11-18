import { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Star, ExternalLink } from "lucide-react";
import "./OurProjects.css";
import { PROJECTS } from "./projectsData.js";

const TOTAL = PROJECTS.length;

/* The carousel moves to the next project after this long. */
const SLIDE_INTERVAL = 3000;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* The blue heading words type in, hold, delete and move to the next phrase,
   like the other homepage section headings. The phrases come from the
   section's own description. */
const TITLE_PHRASES = ["Smart Hardware & AI", "AI Vision & Robotics", "IoT & Embedded Systems"];
const LONGEST_PHRASE = TITLE_PHRASES.reduce((a, b) => (b.length > a.length ? b : a));

function ProjectsTypingLine({ active }) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const reduceMotion = prefersReducedMotion();
  const phrase = TITLE_PHRASES[phraseIndex];

  useEffect(() => {
    if (!active || reduceMotion) return undefined;
    let delay;
    let next;
    if (!isDeleting && length < phrase.length) {
      delay = 90;
      next = () => setLength((value) => value + 1);
    } else if (!isDeleting) {
      delay = 1500;
      next = () => setIsDeleting(true);
    } else if (length > 0) {
      delay = 55;
      next = () => setLength((value) => value - 1);
    } else {
      delay = 350;
      next = () => {
        setIsDeleting(false);
        setPhraseIndex((value) => (value + 1) % TITLE_PHRASES.length);
      };
    }
    const timer = window.setTimeout(next, delay);
    return () => window.clearTimeout(timer);
  }, [active, reduceMotion, isDeleting, length, phrase]);

  const shown = reduceMotion ? TITLE_PHRASES[0] : phrase.slice(0, length);
  return (
    <span className="pjh-proj3d__title-cyan">
      <span className="pjds-sr-only">{TITLE_PHRASES.join(", ")}</span>
      <span className="pjh-proj3d__title-ghost" aria-hidden="true">{LONGEST_PHRASE}</span>
      <span className="pjh-proj3d__title-typed" aria-hidden="true">
        {shown}
        {!reduceMotion && <span className="pjh-proj3d__cursor">|</span>}
      </span>
    </span>
  );
}

function ProjectRating({ rating }) {
  const filled = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div className="pjh-proj3d__rating" role="img" aria-label={`Rated ${filled} out of 5`}>
      <span className="pjh-proj3d__stars" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            size={14}
            className={`pjh-proj3d__star${index < filled ? " is-filled" : ""}`}
          />
        ))}
      </span>
      <span className="pjh-proj3d__rating-num">{filled.toFixed(1)}</span>
    </div>
  );
}

export default function OurProjects() {
  const [activeIndex, setActiveIndex] = useState(2); // Center card active initially
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const sectionRef = useRef(null);
  const [isOnScreen, setIsOnScreen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  /* Only run while the section is on screen. */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") {
      setIsOnScreen(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => setIsOnScreen(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  /* Autoplay: next project every 3 seconds, looping. The timer restarts
     whenever the project changes (arrows, dots, swipe or click too), and
     waits while the mouse is on the carousel or it has keyboard focus. */
  useEffect(() => {
    if (!isOnScreen || isPaused || TOTAL < 2 || prefersReducedMotion()) return undefined;
    const timer = window.setTimeout(() => setActiveIndex((prev) => (prev + 1) % TOTAL), SLIDE_INTERVAL);
    return () => window.clearTimeout(timer);
  }, [activeIndex, isOnScreen, isPaused]);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % TOTAL);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + TOTAL) % TOTAL);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") prevSlide();
    else if (e.key === "ArrowRight") nextSlide();
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
  };

  // Helper to calculate circular slot offset (-2, -1, 0, 1, 2)
  const getSlot = (index) => {
    let diff = index - activeIndex;
    if (diff > TOTAL / 2) diff -= TOTAL;
    if (diff < -TOTAL / 2) diff += TOTAL;

    if (diff === 0) return 0;
    if (diff === -1) return -1;
    if (diff === 1) return 1;
    if (diff <= -2) return -2;
    return 2;
  };

  return (
    <section
      ref={sectionRef}
      id="home-projects"
      className="pjh-proj3d"
      aria-labelledby="pjh-projects-title"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="ProJenius Innovation Projects"
    >
      <div className="pjds-container">
        {/* Header */}
        <header className="pjh-proj3d__header">
          <div className="pjh-proj3d__eyebrow-wrap">
            <span className="pjds-eyebrow pjds-eyebrow--on-dark pjh-proj3d__eyebrow">
              Our Projects
            </span>
          </div>

          <h2 id="pjh-projects-title" className="pjh-proj3d__title">
            <span className="pjh-proj3d__title-static">Turning Real-World Challenges into</span>
            <ProjectsTypingLine active={isOnScreen} />
          </h2>
          <span className="pjh-title-line" aria-hidden="true" data-reveal="line" data-reveal-delay="2" />

          <p className="pjh-proj3d__lead">
            Explore our multidisciplinary technology projects across AI vision, robotics, IoT telemetry, and embedded hardware, engineered for industrial scalability.
          </p>
        </header>

        {/* Wide 3D Panoramic Curved Carousel Stage (Image 3 Reference) */}
        <div
          className="pjh-proj3d__carousel-wrap"
          onPointerEnter={(event) => { if (event.pointerType === "mouse") setIsPaused(true); }}
          onPointerLeave={() => setIsPaused(false)}
          onFocus={(event) => { if (event.target.matches?.(":focus-visible")) setIsPaused(true); }}
          onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false); }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Circular Navigation Arrows */}
          <button
            type="button"
            className="pjh-proj3d__arrow pjh-proj3d__arrow--prev"
            onClick={prevSlide}
            aria-label="Previous project"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            type="button"
            className="pjh-proj3d__arrow pjh-proj3d__arrow--next"
            onClick={nextSlide}
            aria-label="Next project"
          >
            <ChevronRight size={22} />
          </button>

          <div className="pjh-proj3d__stage">
            {PROJECTS.map((project, index) => {
              const slot = getSlot(index);
              const isActive = slot === 0;

              let slotClass = "is-hidden";
              if (slot === 0) slotClass = "is-center";
              else if (slot === -1) slotClass = "is-left";
              else if (slot === 1) slotClass = "is-right";
              else if (slot === -2) slotClass = "is-far-left";
              else if (slot === 2) slotClass = "is-far-right";

              return (
                <article
                  key={project.id}
                  className={`pjh-proj3d__card ${slotClass}`}
                  onClick={() => setActiveIndex(index)}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${TOTAL}: ${project.title}`}
                  aria-hidden={!isActive}
                >
                  <div className="pjh-proj3d__card-inner">
                    <div className="pjh-proj3d__media-box">
                      <img
                        src={project.image}
                        alt={project.alt || project.title}
                        className="pjh-proj3d__img"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="pjh-proj3d__category-badge">
                        <span>{project.category}</span>
                      </div>
                    </div>

                    <div className="pjh-proj3d__card-body">
                      <h3 className="pjh-proj3d__card-title">{project.title}</h3>
                      <p className="pjh-proj3d__card-desc">{project.description}</p>
                      <div className="pjh-proj3d__card-footer">
                        <ProjectRating rating={project.rating} />
                        <span className="pjh-proj3d__link-hint">
                          <span>View Details</span>
                          <ExternalLink size={13} aria-hidden="true" />
                        </span>
                      </div>
                    </div>

                    {isActive && <div className="pjh-proj3d__card-glow" />}
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Dots Pagination */}
        <div className="pjh-proj3d__dots" role="tablist" aria-label="Project selector">
          {PROJECTS.map((project, index) => (
            <button
              key={project.id}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Select ${project.title}`}
              className={`pjh-proj3d__dot ${index === activeIndex ? "is-active" : ""}`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>

        {/* Action Button Below */}
        <div className="pjh-proj3d__action-row">
          <Link to="/products" className="pjh-proj3d__btn">
            <span>Explore All Systems &amp; Case Studies</span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
