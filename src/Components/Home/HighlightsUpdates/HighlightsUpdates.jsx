import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, GraduationCap, Newspaper, Presentation, Rocket } from "lucide-react";

import "./HighlightsUpdates.css";
import { EXPLORE_FALLBACK, fetchHomeUpdates, formatUpdateDate } from "./homeUpdates.js";

/* =============================================================================
   HIGHLIGHTS & UPDATES — one featured update and up to three supporting ones,
   loaded from the existing News & Insights API. Falls back to clearly
   labelled "Explore" links (never invented news) if nothing can be loaded.
   ============================================================================= */

const FALLBACK_ICONS = {
  news: Newspaper,
  courses: GraduationCap,
  workshops: Presentation,
  startup: Rocket,
};

const UPDATE_PHRASES = ["at ProJenius", "Across Our Community", "In Technology & Innovation"];

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function UpdatesTypingLine({ active }) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const reduceMotion = prefersReducedMotion();
  const phrase = UPDATE_PHRASES[phraseIndex];

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
        setPhraseIndex((value) => (value + 1) % UPDATE_PHRASES.length);
      };
    }

    const timer = window.setTimeout(next, delay);
    return () => window.clearTimeout(timer);
  }, [active, reduceMotion, isDeleting, length, phrase]);

  const shown = reduceMotion ? UPDATE_PHRASES[0] : phrase.slice(0, length);
  return (
    <span className="pjh-updates__typed">
      <span className="pjds-sr-only">{UPDATE_PHRASES.join(", ")}</span>
      <span className="pjh-updates__typed-text" aria-hidden="true">
        {shown}
        {!reduceMotion && <span className="pjh-updates__cursor">|</span>}
      </span>
    </span>
  );
}

function UpdateImage({ src, alt, eager = false }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <span className="pjh-updates__placeholder" aria-hidden="true">
        <Newspaper size={28} strokeWidth={1.6} />
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

function UpdateMeta({ category, publishedAt }) {
  const date = formatUpdateDate(publishedAt);
  return (
    <p className="pjh-updates__meta">
      <span className="pjh-updates__category">{category}</span>
      {date && <time dateTime={new Date(publishedAt).toISOString()}>{date}</time>}
    </p>
  );
}

function FeaturedUpdate({ item }) {
  return (
    <article className="pjh-updates__featured">
      <Link to={item.href} className="pjh-updates__featured-link">
        <div className="pjh-updates__featured-media">
          <UpdateImage src={item.image} alt={item.imageAlt} />
        </div>
        <div className="pjh-updates__featured-body">
          <UpdateMeta category={item.category} publishedAt={item.publishedAt} />
          <h3 className="pjh-updates__featured-title">{item.title}</h3>
          {item.summary && <p className="pjh-updates__summary">{item.summary}</p>}
          <span className="pjh-updates__read">
            Read update <ArrowRight size={16} aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  );
}

function SupportingUpdate({ item }) {
  return (
    <li>
      <article className="pjh-updates__item">
        <Link to={item.href} className="pjh-updates__item-link">
          <div className="pjh-updates__item-media">
            <UpdateImage src={item.image} alt={item.imageAlt} />
          </div>
          <div className="pjh-updates__item-body">
            <UpdateMeta category={item.category} publishedAt={item.publishedAt} />
            <h3 className="pjh-updates__item-title">{item.title}</h3>
          </div>
        </Link>
      </article>
    </li>
  );
}

function LoadingState() {
  return (
    <div className="pjh-updates__layout" aria-hidden="true">
      <div className="pjh-updates__skeleton pjh-updates__skeleton--featured" />
      <div className="pjh-updates__list">
        <div className="pjh-updates__skeleton" />
        <div className="pjh-updates__skeleton" />
        <div className="pjh-updates__skeleton" />
      </div>
    </div>
  );
}

function FallbackState() {
  const [featured, ...others] = EXPLORE_FALLBACK;
  const FeaturedIcon = FALLBACK_ICONS[featured.icon];

  return (
    <>
      <p className="pjh-updates__notice">
        Discover our current programs, from practical courses and institutional workshops to startup and innovation support.
      </p>
      <div className="pjh-updates__layout">
        <article className="pjh-updates__featured pjh-updates__featured--explore">
          <Link to={featured.href} className="pjh-updates__featured-link">
            <div className="pjh-updates__featured-media pjh-updates__featured-media--icon" aria-hidden="true">
              <FeaturedIcon size={48} strokeWidth={1.4} />
            </div>
            <div className="pjh-updates__featured-body">
              <p className="pjh-updates__meta">
                <span className="pjh-updates__category">Explore</span>
              </p>
              <h3 className="pjh-updates__featured-title">{featured.title}</h3>
              <p className="pjh-updates__summary">{featured.summary}</p>
              <span className="pjh-updates__read">
                {featured.cta} <ArrowRight size={16} aria-hidden="true" />
              </span>
            </div>
          </Link>
        </article>

        <ul className="pjh-updates__list">
          {others.map((item) => {
            const Icon = FALLBACK_ICONS[item.icon];
            return (
              <li key={item.id}>
                <article className="pjh-updates__item">
                  <Link to={item.href} className="pjh-updates__item-link">
                    <div className="pjh-updates__item-media pjh-updates__item-media--icon" aria-hidden="true">
                      <Icon size={26} strokeWidth={1.6} />
                    </div>
                    <div className="pjh-updates__item-body">
                      <p className="pjh-updates__meta">
                        <span className="pjh-updates__category">Explore</span>
                      </p>
                      <h3 className="pjh-updates__item-title">{item.title}</h3>
                      <span className="pjh-updates__item-summary">{item.summary}</span>
                    </div>
                  </Link>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default function HighlightsUpdates() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(() => typeof IntersectionObserver === "undefined");
  const [state, setState] = useState({ status: "loading", items: [] });

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
    const controller = new AbortController();

    fetchHomeUpdates(controller.signal)
      .then((items) => setState({ status: items.length ? "ready" : "fallback", items }))
      .catch((error) => {
        if (error.name === "AbortError") return;
        if (import.meta.env.DEV) console.warn("Home updates unavailable:", error.message);
        setState({ status: "fallback", items: [] });
      });

    return () => controller.abort();
  }, []);

  const [featured, ...others] = state.items;

  return (
    <section ref={sectionRef} id="home-updates" className="pjh-updates" aria-labelledby="pjh-updates-title" aria-busy={state.status === "loading"}>
      <div className="pjds-container">
        <header className="pjh-updates__header">
          <div>
            <p className="pjds-eyebrow" data-reveal="up">Highlights &amp; Updates</p>
            <h2 id="pjh-updates-title" className="pjds-title pjh-updates__title" data-reveal="up" data-reveal-delay="1">
              <span className="pjh-updates__title-static">What&rsquo;s Happening</span>
              <UpdatesTypingLine active={isVisible} />
            </h2>
          </div>
          {/* Wrapper carries the reveal so the button keeps its own hover transitions. */}
          <div data-reveal="up" data-reveal-delay="2">
            <Link to="/news-insights" className="pjds-btn pjds-btn--outline">
              View All Updates
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </header>

        {/* Static wrapper so the reveal observer sees it before data arrives. */}
        <div className="pjh-updates__body" data-reveal="up" data-reveal-delay="3">
        {state.status === "loading" && <LoadingState />}

        {state.status === "fallback" && <FallbackState />}

        {state.status === "ready" && (
          <div className="pjh-updates__layout">
            <FeaturedUpdate item={featured} />
            {others.length > 0 && (
              <ul className="pjh-updates__list">
                {others.map((item) => (
                  <SupportingUpdate key={item.id} item={item} />
                ))}
              </ul>
            )}
          </div>
        )}
        </div>
      </div>
    </section>
  );
}
