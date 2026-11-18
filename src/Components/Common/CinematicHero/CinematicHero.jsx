import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";

import { scrollToHash } from "./heroUtils.js";
import "./CinematicHero.css";

// High-resolution default cards matching the executive 3D curved gallery
import aiEventPhoto from "../../../assets/Home/Optimized/hero-ai-event-960.webp";
import labPhoto from "../../../assets/Home/Optimized/training-courses-737.webp";
import iotPhoto from "../../../assets/Home/HeroSlides/hero-slide-2.webp";
import recognitionPhoto from "../../../assets/Home/Optimized/hero-recognition-960.webp";
import codePhoto from "../../../assets/Home/HeroSlides/hero-slide-3.webp";

const DEFAULT_CARDS = [
  {
    image: aiEventPhoto,
    category: "Ecosystem Collaboration",
    title: "Startups & Institutions",
    alt: "Ecosystem Collaboration at ProJenius AI Event",
  },
  {
    image: labPhoto,
    category: "Talent Incubation",
    title: "Learning & Development",
    alt: "Talent Incubation & Technical Labs",
  },
  {
    image: iotPhoto,
    category: "Deeptech Deployment",
    title: "Projects & Innovation",
    alt: "Deeptech Deployment and IoT Engineering",
  },
  {
    image: recognitionPhoto,
    category: "Industry Recognition",
    title: "Learning Opportunities",
    alt: "Industry Recognition and Awards",
  },
  {
    image: codePhoto,
    category: "Software Architecture",
    title: "Ideas Into Innovation",
    alt: "Software Architecture and Modern Systems",
  },
];

const isExternal = (to) => /^(https?:|tel:|mailto:)/.test(to);

function SmartLink({ to, className, children }) {
  if (isExternal(to)) {
    const newTab = to.startsWith("http");
    return (
      <a className={className} href={to} {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
        {newTab && <span className="pjds-sr-only"> (opens in a new tab)</span>}
      </a>
    );
  }
  if (to.startsWith("#")) {
    return (
      <a className={className} href={to} onClick={(event) => scrollToHash(event, to)}>
        {children}
      </a>
    );
  }
  return (
    <Link className={className} to={to}>
      {children}
    </Link>
  );
}

function Action({ action, variant = "primary" }) {
  const Icon = action.to.startsWith("#") ? ArrowDown : isExternal(action.to) ? ArrowUpRight : ArrowRight;
  const className = `pj-cine__btn pj-cine__btn--${variant}`;
  return (
    <SmartLink to={action.to} className={className}>
      <span>{action.label}</span>
      <Icon size={18} strokeWidth={2.2} aria-hidden="true" />
    </SmartLink>
  );
}

export function HeroLinks({ label = "On this page", items = [] }) {
  return (
    <nav className="pj-cine__links" aria-label={label}>
      <p className="pj-cine__links-label" aria-hidden="true">{label}</p>
      <ol>
        {items.map((item) => (
          <li key={item.to}>
            <SmartLink to={item.to} className="pj-cine__link">
              <span>{item.label}</span>
              <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
            </SmartLink>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function HeroTerminal({ file = "build.sh", label = "Terminal", lines = [] }) {
  return (
    <figure className="pj-cine__term">
      <div className="pj-cine__term-bar" aria-hidden="true">
        <i /><i /><i />
        <span>{file}</span>
      </div>
      <div className="pj-cine__term-body" aria-hidden="true">
        <pre className="pj-cine__term-live">
          {lines.map((line, i) => (
            <span key={i} className={`is-${line.kind}`}>
              {line.text}
              {"\n"}
            </span>
          ))}
        </pre>
      </div>
      <figcaption className="pjds-sr-only">{label}</figcaption>
    </figure>
  );
}

/* accent can be a list of phrases: they type, hold, delete and move on, like
   the homepage section headings. The longest phrase is laid out invisibly so
   the heading never changes size while typing. */
const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function TypedAccent({ phrases }) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const reduceMotion = prefersReducedMotion();
  const phrase = phrases[phraseIndex % phrases.length];
  const longest = phrases.reduce((a, b) => (b.length > a.length ? b : a), "");

  useEffect(() => {
    if (reduceMotion) return undefined;
    let delay;
    let next;
    if (!isDeleting && length < phrase.length) {
      delay = 90;
      next = () => setLength((value) => value + 1);
    } else if (!isDeleting) {
      delay = 1600;
      next = () => setIsDeleting(true);
    } else if (length > 0) {
      delay = 50;
      next = () => setLength((value) => value - 1);
    } else {
      delay = 350;
      next = () => {
        setIsDeleting(false);
        setPhraseIndex((value) => (value + 1) % phrases.length);
      };
    }
    const timer = window.setTimeout(next, delay);
    return () => window.clearTimeout(timer);
  }, [reduceMotion, isDeleting, length, phrase, phrases.length]);

  return (
    <span className="pj-cine__title-cyan pj-cine__title-typed">
      <span className="pjds-sr-only">{phrases.join(" ")}</span>
      <span className="pj-cine__title-ghost" aria-hidden="true">{longest}</span>
      <span className="pj-cine__title-live" aria-hidden="true">
        {reduceMotion ? phrases[0] : phrase.slice(0, length)}
        {!reduceMotion && <span className="pj-cine__title-cursor">|</span>}
      </span>
    </span>
  );
}

export default function CinematicHero({
  id,
  eyebrow = "ENGINEERING WHAT IS NEXT",
  title,
  accent,
  description,
  primary,
  secondary,
  cards,
  aside,
  className = "",
}) {
  const displayCards = cards && cards.length >= 3 ? cards : DEFAULT_CARDS;

  const total = displayCards.length;

  const [activeIndex, setActiveIndex] = useState(2); // Center card active by default
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-scrolling 3D carousel effect (cycles every 3.8s, pauses on hover/focus)
  useEffect(() => {
    if (isPaused) return undefined;
    const interval = setInterval(() => {
      nextSlide();
    }, 3800);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

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

  // Helper to calculate circular relative offset (-2, -1, 0, 1, 2)
  const getSlot = (index) => {
    let diff = index - activeIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    if (diff === 0) return 0;
    if (diff === -1) return -1;
    if (diff === 1) return 1;
    if (diff <= -2) return -2;
    return 2;
  };

  return (
    <section className={`pj-cine${className ? ` ${className}` : ""}`} aria-labelledby={id}>
      {/* Background glow and subtle cyber grid */}
      <div className="pj-cine__bg" aria-hidden="true">
        <div className="pj-cine__glow pj-cine__glow--top" />
        <div className="pj-cine__glow pj-cine__glow--center" />
        <div className="pj-cine__grid-lines" />
      </div>

      <div className="pjds-container pj-cine__container">
        {/* Header content: Eyebrow, Heading, Lead, CTAs */}
        <header className="pj-cine__header">
          {eyebrow && (
            <div className="pj-cine__eyebrow-wrap">
              <span className="pj-cine__eyebrow">
                <span className="pj-cine__eyebrow-dot" />
                {eyebrow}
              </span>
            </div>
          )}

          <h1 id={id} className="pj-cine__title">
            {title}{" "}
            {Array.isArray(accent) ? (
              <TypedAccent phrases={accent} />
            ) : (
              accent && <span className="pj-cine__title-cyan">{accent}</span>
            )}
          </h1>

          {description && <p className="pj-cine__lead">{description}</p>}

          {(primary || secondary) && (
            <div className="pj-cine__actions">
              {primary && <Action action={primary} variant="primary" />}
              {secondary && <Action action={secondary} variant="ghost" />}
            </div>
          )}
        </header>

        {/* 3D Curved Carousel (Curved scrolling arc matching reference design) */}
        <div
          className="pj-cine__carousel-wrap"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          role="region"
          aria-roledescription="carousel"
          aria-label="Featured capabilities"
        >
          <div className="pj-cine__carousel-stage">
            {displayCards.map((card, index) => {
              const slot = getSlot(index);
              const isActive = slot === 0;

              let slotClass = "is-hidden";
              if (slot === 0) slotClass = "is-center";
              else if (slot === -1) slotClass = "is-left";
              else if (slot === 1) slotClass = "is-right";
              else if (slot === -2) slotClass = "is-far-left";
              else if (slot === 2) slotClass = "is-far-right";

              return (
                <div
                  key={`${card.title}-${index}`}
                  className={`pj-cine__card ${slotClass}`}
                  onClick={() => setActiveIndex(index)}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${total}: ${card.title}`}
                  aria-hidden={!isActive}
                >
                  <div className="pj-cine__card-inner">
                    <img
                      src={card.image}
                      alt={card.alt || card.title}
                      className="pj-cine__card-img"
                      loading="eager"
                      decoding="async"
                    />
                    <div className="pj-cine__card-overlay">
                      <span className="pj-cine__card-category">{card.category}</span>
                      <h3 className="pj-cine__card-title">{card.title}</h3>
                    </div>
                    {isActive && <div className="pj-cine__card-border-glow" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
