import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, CalendarDays, Lightbulb, Newspaper, Rocket, Trophy, Users } from "lucide-react";

import "./HighlightsUpdates.css";
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
const SLIDE_INTERVAL = 4000;

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

export default function HighlightsUpdates() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [items, setItems] = useState(EXPLORE_FALLBACK);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  /* Autoplay: move to the next card every 4 seconds, looping back to the
     first. The timer restarts whenever the open card changes (also on a
     click), and waits while the mouse rests on the cards, while the section
     is off screen, or when the visitor prefers reduced motion. */
  useEffect(() => {
    if (!isVisible || isPaused || items.length < 2 || prefersReducedMotion()) return undefined;
    const timer = window.setTimeout(
      () => setActiveIdx((idx) => (idx + 1) % items.length),
      SLIDE_INTERVAL
    );
    return () => window.clearTimeout(timer);
  }, [activeIdx, isVisible, isPaused, items.length]);

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
            cta: "Read Update",
          }));
          setItems(merged);
          setActiveIdx(0);
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

        {/* ===================================================================
            INNOVATIVE EXPANDING ACCORDION CARDS (Inspiration 1 & 5)
            =================================================================== */}
        <div
          className="pjh-updates__accordion"
          role="region"
          aria-label="Interactive Highlights Carousel"
          onPointerEnter={(event) => { if (event.pointerType === "mouse") setIsPaused(true); }}
          onPointerLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false); }}
        >
          {items.map((item, idx) => {
            const isActive = idx === activeIdx;
            const Icon = iconFor(item);

            return (
              <div
                key={item.id}
                className={`pjh-updates__card${isActive ? " is-active" : ""}`}
                onClick={() => setActiveIdx(idx)}
                onMouseEnter={() => setActiveIdx(idx)}
                tabIndex={0}
                role="button"
                aria-expanded={isActive}
                aria-label={`Highlight: ${item.title}`}
              >
                {/* Background Image */}
                <img
                  src={item.image}
                  alt={item.imageAlt || item.title}
                  className="pjh-updates__card-bg"
                  loading="lazy"
                  decoding="async"
                />

                {/* Dark Gradient Overlay */}
                <div className="pjh-updates__card-overlay" />

                {/* Active Expanded Content */}
                <div className="pjh-updates__card-expanded-content">
                  <div className="pjh-updates__card-top">
                    <span className="pjh-updates__card-category">
                      {item.category || "Highlight"}
                    </span>
                    <span className="pjh-updates__card-num">0{idx + 1}</span>
                  </div>

                  <div className="pjh-updates__card-body">
                    <h3 className="pjh-updates__card-title">{item.title}</h3>
                    {item.summary && (
                      <p className="pjh-updates__card-summary">{item.summary}</p>
                    )}
                    <Link
                      to={item.href}
                      className="pjh-updates__card-cta"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>{item.cta || "Explore More"}</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>

                {/* Inactive Vertical Pill Bar */}
                <div className="pjh-updates__card-collapsed-content">
                  <div className="pjh-updates__card-icon-pill">
                    <Icon size={18} />
                  </div>
                  <div className="pjh-updates__card-collapsed-title">
                    <span>{item.title}</span>
                  </div>
                  <span className="pjh-updates__card-collapsed-num">0{idx + 1}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
