import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import "./HomeHero.css";
import { HERO_CAPABILITIES, HERO_SLIDES } from "./heroSlides.js";

/* =============================================================================
   HOME HERO — image-led carousel
   -----------------------------------------------------------------------------
   Left: eyebrow, heading, description, two CTAs and the capability list.
   Right: a large featured image with its caption, and exactly three
   thumbnails underneath. The active image also fills the background under a
   navy overlay.

   Thumbnails are the only manual navigation (no prev/next/pause buttons).
   Thumbnail window — always three visible, never duplicated:
     active 1 → 1 2 3 · active 2 → 2 3 4 · active 3, 4, 5 → 3 4 5
   i.e. first visible index = clamp(active, 0, total − 3).

   Autoplay uses no JavaScript timer: the active thumbnail's progress bar is a
   CSS animation (--pjh-hero-interval in HomeHero.css); when it ends the
   carousel advances, looping from the last slide to the first. A thumbnail
   click restarts the bar from the chosen slide. Autoplay pauses while the
   mouse is over the image showcase or a thumbnail has keyboard focus, and
   while the hero is off-screen; it is off with prefers-reduced-motion. Nothing needs cleaning up on unmount beyond the
   IntersectionObserver and media-query listener below.

   Slide images and copy are configured in heroSlides.js.
   ============================================================================= */

const SLIDE_COUNT = HERO_SLIDES.length;
const VISIBLE_THUMBS = 3;

const reducedMotionQuery = () =>
  typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;

/* The active image leads the strip; at the end the window stops at the last
   three so it is always full: 1→[1 2 3] 2→[2 3 4] 3→[3 4 5] 4,5→[3 4 5]. */
const thumbWindowStart = (activeIndex) =>
  Math.max(0, Math.min(activeIndex, SLIDE_COUNT - VISIBLE_THUMBS));

/* The cyan heading line of the active slide types in, holds, deletes and
   types again, like the other homepage section headings. An invisible copy of
   the full text keeps its space so the layout never jumps. */
const TYPE_SPEED = 70;
const DELETE_SPEED = 40;
const HOLD_TIME = 2200;
const RESTART_DELAY = 350;

function HeroTypedHighlight({ text, active, reduceMotion }) {
  const [length, setLength] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const animate = active && !reduceMotion;

  useEffect(() => {
    if (!animate) return undefined;
    let delay;
    let next;
    if (!isDeleting && length < text.length) {
      delay = TYPE_SPEED;
      next = () => setLength((value) => value + 1);
    } else if (!isDeleting) {
      delay = HOLD_TIME;
      next = () => setIsDeleting(true);
    } else if (length > 0) {
      delay = DELETE_SPEED;
      next = () => setLength((value) => value - 1);
    } else {
      delay = RESTART_DELAY;
      next = () => setIsDeleting(false);
    }
    const timer = window.setTimeout(next, delay);
    return () => window.clearTimeout(timer);
  }, [animate, isDeleting, length, text]);

  const shown = animate ? text.slice(0, length) : text;
  return (
    <span className="pjh-hero__title-highlight">
      <span className="pjds-sr-only">{text}</span>
      <span className="pjh-hero__title-ghost" aria-hidden="true">{text}</span>
      <span className="pjh-hero__title-typed" aria-hidden="true">
        {shown}
        {animate && <span className="pjh-hero__title-cursor">|</span>}
      </span>
    </span>
  );
}

/* In-page targets (#...) stay plain anchors; routes use client-side links. */
function HeroCta({ cta, className, children }) {
  if (cta.to.startsWith("#")) {
    return <a className={className} href={cta.to}>{children}</a>;
  }
  return <Link className={className} to={cta.to}>{children}</Link>;
}

export default function HomeHero() {
  const heroRef = useRef(null);
  const showcaseRef = useRef(null);
  const thumbRefs = useRef([]);
  const focusAfterChangeRef = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplayEnabled, setAutoplayEnabled] = useState(() => !reducedMotionQuery()?.matches);
  const [isHovered, setIsHovered] = useState(false);
  const [hasKeyboardFocus, setHasKeyboardFocus] = useState(false);
  const [isOnScreen, setIsOnScreen] = useState(true);

  const isRunning = autoplayEnabled && !isHovered && !hasKeyboardFocus && isOnScreen;
  const windowStart = thumbWindowStart(activeIndex);
  const activeSlide = HERO_SLIDES[activeIndex];

  /* Pause while the hero is scrolled out of view. */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setIsOnScreen(entry.isIntersecting),
      { threshold: 0.25 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  /* Follow the visitor's reduced-motion setting if it changes mid-visit. */
  useEffect(() => {
    const query = reducedMotionQuery();
    if (!query) return undefined;
    const handleChange = (event) => setAutoplayEnabled(!event.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  /* After keyboard navigation, move focus to the newly active thumbnail. */
  useEffect(() => {
    if (!focusAfterChangeRef.current) return;
    focusAfterChangeRef.current = false;
    // preventScroll: the strip slides with a CSS transform; letting the browser
    // scroll the clipped strip to the focused thumbnail would misalign it.
    thumbRefs.current[activeIndex]?.focus({ preventScroll: true });
  }, [activeIndex]);

  const goTo = useCallback((index) => {
    setActiveIndex((index + SLIDE_COUNT) % SLIDE_COUNT);
  }, []);

  const handleProgressEnd = (event) => {
    if (event.target === event.currentTarget) goTo(activeIndex + 1);
  };

  const handleThumbKeyDown = (event) => {
    const targets = {
      ArrowRight: activeIndex + 1,
      ArrowDown: activeIndex + 1,
      ArrowLeft: activeIndex - 1,
      ArrowUp: activeIndex - 1,
      Home: 0,
      End: SLIDE_COUNT - 1,
    };
    if (!(event.key in targets)) return;
    event.preventDefault();
    focusAfterChangeRef.current = true;
    goTo(targets[event.key]);
  };

  /* Pausing is scoped to the image showcase (the carousel itself). It used to
     be attached to the whole full-screen hero, so a mouse resting anywhere on
     the first screen — or keyboard focus on a CTA — paused autoplay
     indefinitely, which looked like the carousel "stopping".

     Only keyboard focus pauses; a mouse click on a thumbnail must not. */
  const handleFocus = (event) => {
    if (event.target.matches?.(":focus-visible")) setHasKeyboardFocus(true);
  };

  const handleBlur = (event) => {
    if (!showcaseRef.current?.contains(event.relatedTarget)) setHasKeyboardFocus(false);
  };

  /* Touch "hover" never ends reliably, so only a real mouse pauses on hover. */
  const handlePointerEnter = (event) => {
    if (event.pointerType === "mouse") setIsHovered(true);
  };

  return (
    <section
      ref={heroRef}
      className="pjh-hero"
      aria-roledescription="carousel"
      aria-label="ProJenius highlights"
    >
      <h1 className="pjds-sr-only">
        ProJenius Innovation Technology: technology solutions, innovation and training
      </h1>

      {/* Full-width backdrop: the active image under a navy overlay. */}
      <div className="pjh-hero__backdrop" aria-hidden="true">
        {HERO_SLIDES.map((slide, index) => (
          <img
            key={slide.id}
            className={`pjh-hero__backdrop-image${index === activeIndex ? " is-active" : ""}`}
            src={slide.image}
            alt=""
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
            draggable="false"
          />
        ))}
      </div>

      <div className="pjds-container pjh-hero__layout">
        {/* Left column ---------------------------------------------------- */}
        <div className="pjh-hero__copy">
          <div className="pjh-hero__slides">
            {HERO_SLIDES.map((slide, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={slide.id}
                  className={`pjh-hero__slide${isActive ? " is-active" : ""}`}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${SLIDE_COUNT}: ${slide.caption}`}
                  aria-hidden={!isActive}
                  inert={!isActive}
                >
                  <p className="pjh-hero__eyebrow">{slide.eyebrow}</p>
                  <h2 className="pjh-hero__title">
                    {slide.title}{" "}
                    {/* The key change restarts the typing each time a slide opens. */}
                    <HeroTypedHighlight
                      key={isActive ? `${slide.id}-active` : slide.id}
                      text={slide.highlight}
                      active={isActive}
                      reduceMotion={!autoplayEnabled}
                    />
                  </h2>
                  <p className="pjh-hero__description">{slide.description}</p>
                  <div className="pjh-hero__actions">
                    <HeroCta cta={slide.primary} className="pjds-btn pjds-btn--primary pjds-btn--on-dark">
                      {slide.primary.label}
                      <ArrowRight size={18} aria-hidden="true" />
                    </HeroCta>
                    <HeroCta cta={slide.secondary} className="pjds-btn pjds-btn--ghost">
                      {slide.secondary.label}
                    </HeroCta>
                  </div>
                </div>
              );
            })}
          </div>

          <ul className="pjh-hero__capabilities" aria-label="What we build">
            {HERO_CAPABILITIES.map((capability) => (
              <li key={capability}>{capability}</li>
            ))}
          </ul>
        </div>

        {/* Right column: featured image + three thumbnails --------------- */}
        <div
          ref={showcaseRef}
          className="pjh-hero__showcase"
          onPointerEnter={handlePointerEnter}
          onPointerLeave={() => setIsHovered(false)}
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          <figure className="pjh-hero__feature">
            {HERO_SLIDES.map((slide, index) => {
              const isActive = index === activeIndex;
              return (
                <img
                  key={slide.id}
                  className={`pjh-hero__feature-image${isActive ? " is-active" : ""}`}
                  src={slide.image}
                  alt={isActive ? slide.alt : ""}
                  aria-hidden={!isActive}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  decoding="async"
                  draggable="false"
                />
              );
            })}
            <figcaption className="pjh-hero__feature-caption">
              <span key={activeSlide.id} className="pjh-hero__feature-caption-text">
                {activeSlide.caption}
              </span>
            </figcaption>
          </figure>

          <div className="pjh-hero__thumbs" role="group" aria-label="Choose a slide">
            <ol className={`pjh-hero__thumbs-track pjh-hero__thumbs-track--shift-${windowStart}`}>
              {HERO_SLIDES.map((slide, index) => {
                const isActive = index === activeIndex;
                const isInWindow = index >= windowStart && index < windowStart + VISIBLE_THUMBS;
                return (
                  <li key={slide.id} className="pjh-hero__thumb-item" aria-hidden={!isInWindow}>
                    <button
                      ref={(node) => { thumbRefs.current[index] = node; }}
                      type="button"
                      className={`pjh-hero__thumb${isActive ? " is-active" : ""}`}
                      aria-label={`Show slide ${index + 1} of ${SLIDE_COUNT}: ${slide.caption}`}
                      aria-current={isActive ? "true" : undefined}
                      tabIndex={isActive ? 0 : -1}
                      onClick={() => goTo(index)}
                      onKeyDown={handleThumbKeyDown}
                    >
                      <img src={slide.image} alt="" loading="lazy" decoding="async" draggable="false" />
                      <span className="pjh-hero__thumb-caption" aria-hidden="true">{slide.caption}</span>
                      {isActive && autoplayEnabled && (
                        <span
                          key={activeIndex}
                          className={`pjh-hero__thumb-progress${isRunning ? "" : " is-paused"}`}
                          aria-hidden="true"
                          onAnimationEnd={handleProgressEnd}
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        {/* Stacked layouts only (CSS): the active slide's CTAs below the
            image. On wide screens the CTAs inside each slide are used. */}
        <div key={activeSlide.id} className="pjh-hero__actions pjh-hero__actions--stacked">
          <HeroCta cta={activeSlide.primary} className="pjds-btn pjds-btn--primary pjds-btn--on-dark">
            {activeSlide.primary.label}
            <ArrowRight size={18} aria-hidden="true" />
          </HeroCta>
          <HeroCta cta={activeSlide.secondary} className="pjds-btn pjds-btn--ghost">
            {activeSlide.secondary.label}
          </HeroCta>
        </div>
      </div>

      <p className="pjds-sr-only" aria-live={isRunning ? "off" : "polite"} aria-atomic="true">
        {`Slide ${activeIndex + 1} of ${SLIDE_COUNT}: ${activeSlide.title} ${activeSlide.highlight}`}
      </p>
    </section>
  );
}
