import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, CalendarDays, ChevronLeft, ChevronRight, Lightbulb, Newspaper, Rocket, Trophy, Users } from "lucide-react";

import "./HighlightsAndUpdates.css";
import { EXPLORE_FALLBACK, fetchHomeUpdates } from "./homeUpdates.js";

/* Icon shown on the collapsed card, chosen from what the card is about
   (its category and title), so a news story never gets a course icon. */
const ICONS = {
  milestones: Trophy,
  courses: BookOpen,
  workshops: Users,
  startup: Rocket,
  events: CalendarDays,
  insights: Lightbulb,
  news: Newspaper,
};

const ICON_RULES = [
  [/milestone|award|achiev|recogni|prize|winner/i, "milestones"],
  [/course|learn|training|curriculum|class/i, "courses"],
  [/workshop|bootcamp|hands-on session/i, "workshops"],
  [/startup|venture|founder|incubat|innovation/i, "startup"],
  [/event|summit|conference|meetup|expo|fest/i, "events"],
  [/insight|blog|article|perspective|guide/i, "insights"],
];

const iconFor = (item) => {
  if (item?.icon && ICONS[item.icon]) return ICONS[item.icon];
  const text = `${item?.category || ""} ${item?.title || ""}`;
  const match = ICON_RULES.find(([pattern]) => pattern.test(text));
  return match ? ICONS[match[1]] : Newspaper;
};

/* Each card moves on to the next after this long. */
const SLIDE_INTERVAL = 5000;

/* Cards on screen at once. With more updates than this the row becomes an
   endless queue: the open card is always first, and moving on slides it out. */
const VISIBLE_CARDS = 4;

/* Finger travel (px) that counts as a swipe. */
const SWIPE_DISTANCE = 45;

const wrap = (value, length) => ((value % length) + length) % length;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* The blue words in the heading follow the open card: the current words are
   deleted and the open card's words typed in their place. */
const headlineFor = (item) => item?.headline || (item?.category ? `in ${item.category}` : "at ProJenius");

function UpdatesTypingLine({ phrase }) {
  const [shown, setShown] = useState("");
  const reduce = prefersReducedMotion();

  useEffect(() => {
    if (reduce || shown === phrase) return undefined;
    const typing = phrase.startsWith(shown);
    const timer = window.setTimeout(
      () => setShown(typing ? phrase.slice(0, shown.length + 1) : shown.slice(0, -1)),
      typing ? 55 : 30
    );
    return () => window.clearTimeout(timer);
  }, [phrase, shown, reduce]);

  return (
    <span className="pjh-updates__typed">
      <span className="pjh-updates__typed-text">
        {reduce ? phrase : shown}
        <span className="pjh-updates__cursor" aria-hidden="true">|</span>
      </span>
    </span>
  );
}

export default function HighlightsAndUpdates() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [items, setItems] = useState(EXPLORE_FALLBACK);
  /* Runs past the ends of the list (-1, 0, 1 ... 10, 11); wrap() gives the item. */
  const [position, setPosition] = useState(0);
  const touchStart = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const total = items.length;
  const slides = total > VISIBLE_CARDS;
  const activeIdx = wrap(position, total);

  /* Neighbours just outside the row stay mounted so they can slide in or out,
     even when a click on the last card moves the row three places. */
  const margin = VISIBLE_CARDS - 1;
  const cards = slides
    ? Array.from({ length: VISIBLE_CARDS + margin * 2 }, (_, i) => position - margin + i)
    : items.map((_, i) => i);

  const step = (amount) =>
    setPosition((current) => (slides ? current + amount : wrap(current + amount, total)));

  /* Autoplay: restarts whenever the open card changes, and waits while the
     mouse or keyboard focus is on the cards, while the section is off screen,
     or when the visitor prefers reduced motion. */
  useEffect(() => {
    if (!isVisible || isPaused || total < 2 || prefersReducedMotion()) return undefined;
    const timer = window.setTimeout(
      () => setPosition((current) => (slides ? current + 1 : wrap(current + 1, total))),
      SLIDE_INTERVAL
    );
    return () => window.clearTimeout(timer);
  }, [position, isVisible, isPaused, total, slides]);

  const onTouchStart = (event) => {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (event) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const dx = event.changedTouches[0].clientX - start.x;
    const dy = event.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) >= SWIPE_DISTANCE && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchHomeUpdates(controller.signal)
      .then((data) => {
        if (data && data.length >= 3) {
          // Merge API items with fallback images so every card has high-res visuals
          const merged = data.map((d, i) => ({
            ...d,
            image: d.image || EXPLORE_FALLBACK[i % EXPLORE_FALLBACK.length].image,
            cta: d.ctaLabel || "Read Update",
          }));
          setItems(merged);
          setPosition(0);
        }
      })
      .catch(() => {
        // Fallback already pre-set
      });

    return () => controller.abort();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home-updates"
      className="pjh-updates"
      aria-labelledby="pjh-updates-title"
    >
      <div className="pjds-container">
        {/* Header */}
        <header className="pjh-updates__header">
          <div>
            <p className="pjds-eyebrow pjds-eyebrow--on-dark pjh-updates__eyebrow">Highlights &amp; Updates</p>
            <h2 id="pjh-updates-title" className="pjh-updates__title">
              What&rsquo;s Happening <UpdatesTypingLine phrase={headlineFor(items[activeIdx])} />
            </h2>
            <span className="pjh-title-line pjh-title-line--start" aria-hidden="true" data-reveal="line" data-reveal-delay="2" />
          </div>
          <Link to="/news-insights" className="pjh-updates__view-all-btn">
            <span>View All Insights</span>
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </header>

        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Highlights and updates"
          onPointerEnter={(event) => { if (event.pointerType === "mouse") setIsPaused(true); }}
          onPointerLeave={() => setIsPaused(false)}
          onFocus={(event) => { if (event.target.matches(":focus-visible")) setIsPaused(true); }}
          onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false); }}
        >
          <div
            className="pjh-updates__accordion"
            style={{ "--visible": slides ? VISIBLE_CARDS : total }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onTouchCancel={() => { touchStart.current = null; }}
          >
            {cards.map((cardPosition) => {
              const idx = wrap(cardPosition, total);
              const item = items[idx];
              const isActive = cardPosition === position;
              const offset = cardPosition - position;
              const slot = slides ? offset : cardPosition;
              const isOff = slides && (offset < 0 || offset >= VISIBLE_CARDS);
              const Icon = iconFor(item);
              const number = String(idx + 1).padStart(2, "0");
              const open = () => setPosition(cardPosition);

              return (
                <div
                  key={`${cardPosition}-${item.id}`}
                  className={`pjh-updates__card${isActive ? " is-active" : ""}${isOff ? " is-off" : ""}`}
                  style={{ "--slot": slot, "--offset": offset, "--after": offset > 0 ? 1 : 0 }}
                  onClick={isActive ? undefined : open}
                  onKeyDown={(event) => {
                    if (isActive || (event.key !== "Enter" && event.key !== " ")) return;
                    event.preventDefault();
                    open();
                  }}
                  tabIndex={isActive ? -1 : 0}
                  role={isActive ? "group" : "button"}
                  aria-hidden={isOff || undefined}
                  aria-label={`Highlight ${idx + 1} of ${total}: ${item.title}`}
                >
                  <img
                    src={item.image}
                    alt={item.imageAlt || item.title}
                    className="pjh-updates__card-bg"
                    loading="lazy"
                    decoding="async"
                  />

                  <div className="pjh-updates__card-overlay" />

                  {/* Open card */}
                  <div className="pjh-updates__card-expanded-content" aria-hidden={!isActive || undefined}>
                    <div className="pjh-updates__card-top">
                      <span className="pjh-updates__card-category">
                        {item.category || "Highlight"}
                      </span>
                      <span className="pjh-updates__card-num">{number}</span>
                    </div>

                    <div className="pjh-updates__card-body">
                      <h3 className="pjh-updates__card-title">{item.title}</h3>
                      {item.summary && (
                        <p className="pjh-updates__card-summary">{item.summary}</p>
                      )}
                      <Link
                        to={item.href}
                        className="pjh-updates__card-cta"
                        tabIndex={isActive ? undefined : -1}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>{item.cta || "Explore More"}</span>
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>

                  {/* Waiting card */}
                  <div className="pjh-updates__card-collapsed-content" aria-hidden="true">
                    <div className="pjh-updates__card-icon-pill">
                      <Icon size={18} />
                    </div>
                    <div className="pjh-updates__card-collapsed-title">
                      <span>{item.title}</span>
                    </div>
                    <span className="pjh-updates__card-collapsed-num">{number}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {total > 1 && (
            <div className="pjh-updates__controls">
              <button type="button" className="pjh-updates__arrow" aria-label="Previous update" onClick={() => step(-1)}>
                <ChevronLeft size={20} aria-hidden="true" />
              </button>
              <span className="pjh-updates__counter">
                <strong>{activeIdx + 1}</strong> / {total}
              </span>
              <button type="button" className="pjh-updates__arrow" aria-label="Next update" onClick={() => step(1)}>
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
