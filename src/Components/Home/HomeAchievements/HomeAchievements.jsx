import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { ArrowRight, Award, ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

import "./HomeAchievements.css";
import { ACHIEVEMENT_GALLERY, ACHIEVEMENT_STATS } from "./achievementsData.js";

/* =============================================================================
   ACHIEVEMENTS & RECOGNITION — a data-driven bento "spotlight":
   one featured achievement and up to three supporting tiles, all image-led,
   plus an optional row of verified statistics. Content lives in
   achievementsData.js; the full gallery is on the About page.
   ============================================================================= */

const TILE_POSITIONS = ["featured", "wide", "small", "small"];
const ACHIEVEMENT_PHRASES = ["of Our Innovators", "Across Our Community", "Through Innovation"];

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function AchievementsTypingLine({ active }) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const reduceMotion = prefersReducedMotion();
  const phrase = ACHIEVEMENT_PHRASES[phraseIndex];

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
        setPhraseIndex((value) => (value + 1) % ACHIEVEMENT_PHRASES.length);
      };
    }

    const timer = window.setTimeout(next, delay);
    return () => window.clearTimeout(timer);
  }, [active, reduceMotion, isDeleting, length, phrase]);

  const shown = reduceMotion ? ACHIEVEMENT_PHRASES[0] : phrase.slice(0, length);
  return (
    <span className="pjh-achievements__typed">
      <span className="pjds-sr-only">{ACHIEVEMENT_PHRASES.join(", ")}</span>
      <span className="pjh-achievements__typed-text" aria-hidden="true">
        {shown}
        {!reduceMotion && <span className="pjh-achievements__cursor">|</span>}
      </span>
    </span>
  );
}

export default function HomeAchievements() {
  const sectionRef = useRef(null);
  const openerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(() => typeof IntersectionObserver === "undefined");
  const [isPaused, setIsPaused] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(null);
  const [zoom, setZoom] = useState(1);
  const slideCount = Math.max(1, ACHIEVEMENT_GALLERY.length - TILE_POSITIONS.length + 1);
  const items = Array.from({ length: Math.min(TILE_POSITIONS.length, ACHIEVEMENT_GALLERY.length) }, (_, index) => ACHIEVEMENT_GALLERY[slideIndex + index]);
  const closeViewer = useCallback(() => setActiveIndex(null), []);
  const showNext = useCallback(() => {
    setZoom(1);
    setActiveIndex((index) => index === null ? index : (index + 1) % ACHIEVEMENT_GALLERY.length);
  }, []);
  const showPrevious = useCallback(() => {
    setZoom(1);
    setActiveIndex((index) => index === null ? index : (index - 1 + ACHIEVEMENT_GALLERY.length) % ACHIEVEMENT_GALLERY.length);
  }, []);

  const openViewer = (index, event) => {
    openerRef.current = event.currentTarget;
    setZoom(1);
    setActiveIndex(index);
  };

  useEffect(() => {
    if (activeIndex === null) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") closeViewer();
      if (event.key === "ArrowRight") showNext();
      if (event.key === "ArrowLeft") showPrevious();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, closeViewer, showNext, showPrevious]);

  useEffect(() => {
    if (activeIndex === null && openerRef.current) {
      openerRef.current.focus({ preventScroll: true });
      openerRef.current = null;
    }
  }, [activeIndex]);

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

  useEffect(() => {
    if (!isVisible || isPaused || activeIndex !== null || slideCount < 2 || prefersReducedMotion()) return undefined;
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        setSlideIndex((current) => (current + 1) % slideCount);
      }
    }, 5000);
    return () => window.clearInterval(timer);
  }, [activeIndex, isPaused, isVisible, slideCount]);

  return (
    <section ref={sectionRef} id="home-achievements" className="pjh-achievements" aria-labelledby="pjh-achievements-title">
      <div className="pjds-container">
        <header className="pjh-achievements__header">
          <div>
            <p className="pjds-eyebrow" data-reveal="up">Achievements &amp; Recognition</p>
            <h2 id="pjh-achievements-title" className="pjds-title pjh-achievements__section-title" data-reveal="up" data-reveal-delay="1">
              <span className="pjh-achievements__title-static">Celebrating the Milestones</span>
              <AchievementsTypingLine active={isVisible} />
            </h2>
            <span className="pjh-title-line" aria-hidden="true" data-reveal="line" data-reveal-delay="2" />
          </div>
          <div className="pjh-achievements__header-side" data-reveal="up" data-reveal-delay="2">
            <p className="pjds-lead pjh-achievements__intro">
              Celebrating the achievements, innovation, and milestones of the students and teams who
              build with ProJenius.
            </p>
            <Link to="/about#about-achievements" className="pjds-link">
              See all achievements
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </header>

        <ul
          className="pjh-achievements__bento"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
          }}
        >
          {items.map((item, index) => (
            /* Keep each slot mounted while its photo changes, preserving the
               bento geometry and the page's scroll-reveal state. */
            <li
              key={`${TILE_POSITIONS[index]}-${index}`}
              className={`pjh-achievements__cell pjh-achievements__cell--${TILE_POSITIONS[index]}`}
              data-reveal={index === 0 ? "scale" : "up"}
              data-reveal-delay={String(index + 1)}
            >
              <button type="button" className="pjh-achievements__tile" onClick={(event) => openViewer(slideIndex + index, event)} aria-label={`View photo: ${item.title}`}>
                <img key={item.id} src={item.src} alt={item.alt} loading="lazy" decoding="async" />
                <div key={`${item.id}-caption`} className="pjh-achievements__overlay">
                  <span className="pjh-achievements__chip">
                    {index === 0 && <Award size={14} aria-hidden="true" />}
                    {item.category}
                  </span>
                  <h3 className="pjh-achievements__title">{item.title}</h3>
                  <p className="pjh-achievements__text">{item.description}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>

        {slideCount > 1 && (
          <nav
            className="pjh-achievements__gallery-controls"
            aria-label="Achievement photo slides"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocusCapture={() => setIsPaused(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
            }}
          >
            <button type="button" onClick={() => setSlideIndex((current) => (current - 1 + slideCount) % slideCount)} aria-label="Previous achievement photos">
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <span aria-hidden="true">{slideIndex + 1} / {slideCount}</span>
            <button type="button" onClick={() => setSlideIndex((current) => (current + 1) % slideCount)} aria-label="Next achievement photos">
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </nav>
        )}

        {ACHIEVEMENT_STATS.length > 0 && (
          <dl className="pjh-achievements__stats" data-reveal="up">
            {ACHIEVEMENT_STATS.map((stat) => (
              <div key={stat.label} className="pjh-achievements__stat">
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
      {activeIndex !== null && createPortal(
        <div className="pjh-achievements-viewer" role="dialog" aria-modal="true" aria-label={`Achievement photo: ${ACHIEVEMENT_GALLERY[activeIndex].title}`} onClick={closeViewer}>
          <button type="button" className="pjh-achievements-viewer__close" onClick={closeViewer} aria-label="Close photo viewer" autoFocus><X size={22} /></button>
          <button type="button" className="pjh-achievements-viewer__nav pjh-achievements-viewer__prev" onClick={(event) => { event.stopPropagation(); setZoom(1); showPrevious(); }} aria-label="Previous photo"><ChevronLeft size={26} /></button>
          <figure className="pjh-achievements-viewer__stage" onClick={(event) => event.stopPropagation()}>
            <img src={ACHIEVEMENT_GALLERY[activeIndex].src} alt={ACHIEVEMENT_GALLERY[activeIndex].alt} draggable="false" style={{ transform: `scale(${zoom})` }} />
            <figcaption>{ACHIEVEMENT_GALLERY[activeIndex].title}<span>{activeIndex + 1} / {ACHIEVEMENT_GALLERY.length}</span></figcaption>
          </figure>
          <div className="pjh-achievements-viewer__tools" onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={() => setZoom((value) => Math.max(1, +(value - 0.25).toFixed(2)))} aria-label="Zoom out" disabled={zoom <= 1}><ZoomOut size={18} /></button>
            <button type="button" onClick={() => setZoom(1)} aria-label="Reset zoom"><RotateCcw size={17} /></button>
            <button type="button" onClick={() => setZoom((value) => Math.min(3, +(value + 0.25).toFixed(2)))} aria-label="Zoom in" disabled={zoom >= 3}><ZoomIn size={18} /></button>
          </div>
          <button type="button" className="pjh-achievements-viewer__nav pjh-achievements-viewer__next" onClick={(event) => { event.stopPropagation(); setZoom(1); showNext(); }} aria-label="Next photo"><ChevronRight size={26} /></button>
        </div>, document.body
      )}
    </section>
  );
}
