import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

import "./Achievements.css";

import { ACHIEVEMENT_GALLERY as ACHIEVEMENTS } from "../../Home/HomeAchievements/achievementsData.js";

const TYPED_WORDS = ["Recognition", "Achievements"];
const TYPE_SPEED = 110;
const DELETE_SPEED = 65;
const HOLD_TIME = 1800;
const EMPTY_PAUSE = 450;

const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Typed heading word. Only this component re-renders while typing, and only
   while it is on screen. */
function TypedWord({ words }) {
    const ref = useRef(null);
    const [active, setActive] = useState(false);
    const [length, setLength] = useState(0);
    const [deleting, setDeleting] = useState(false);
    const [wordIndex, setWordIndex] = useState(0);
    const reduce = prefersReducedMotion();
    const word = words[wordIndex];
    const longestWord = words.reduce((longest, current) => current.length > longest.length ? current : longest, "");

    useEffect(() => {
        const el = ref.current;
        if (!el || reduce || typeof IntersectionObserver === "undefined") return undefined;
        const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { threshold: 0.6 });
        observer.observe(el);
        return () => observer.disconnect();
    }, [reduce]);

    useEffect(() => {
        if (!active) return undefined;
        let delay;
        let next;
        if (!deleting && length < word.length) {
            delay = TYPE_SPEED;
            next = () => setLength((value) => value + 1);
        } else if (!deleting) {
            delay = HOLD_TIME;
            next = () => setDeleting(true);
        } else if (length > 0) {
            delay = DELETE_SPEED;
            next = () => setLength((value) => value - 1);
        } else {
            delay = EMPTY_PAUSE;
            next = () => {
                setDeleting(false);
                setWordIndex((index) => (index + 1) % words.length);
            };
        }
        const timer = window.setTimeout(next, delay);
        return () => window.clearTimeout(timer);
    }, [active, deleting, length, word, words.length]);

    const shown = reduce || typeof IntersectionObserver === "undefined" ? words[0] : word.slice(0, length);

    return (
        <span ref={ref} className="pja-achv__typed" aria-hidden="true">
            <span className="pja-achv__typed-sizer">{longestWord}</span>
            <span className="pja-achv__typed-live">
                {shown}
                {!reduce && <span className="pja-achv__cursor" />}
            </span>
        </span>
    );
}

export default function Achievements() {
    const [activeIndex, setActiveIndex] = useState(null);
    const openerRef = useRef(null);
    const total = ACHIEVEMENTS.length;

    const open = (index, event) => {
        openerRef.current = event.currentTarget;
        setActiveIndex(index);
    };
    const close = useCallback(() => setActiveIndex(null), []);
    const showNext = useCallback(() => setActiveIndex((i) => (i === null ? i : (i + 1) % total)), [total]);
    const showPrev = useCallback(() => setActiveIndex((i) => (i === null ? i : (i - 1 + total) % total)), [total]);

    // Lightbox: keyboard, scroll lock, and focus back to the opening card.
    useEffect(() => {
        if (activeIndex === null) return undefined;
        const onKey = (event) => {
            if (event.key === "Escape") close();
            if (event.key === "ArrowRight") showNext();
            if (event.key === "ArrowLeft") showPrev();
        };
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", onKey);
        };
    }, [activeIndex, close, showNext, showPrev]);

    useEffect(() => {
        if (activeIndex === null && openerRef.current) {
            openerRef.current.focus({ preventScroll: true });
            openerRef.current = null;
        }
    }, [activeIndex]);

    const touchStartX = useRef(null);
    const onTouchStart = (event) => { touchStartX.current = event.touches[0].clientX; };
    const onTouchEnd = (event) => {
        if (touchStartX.current === null) return;
        const delta = event.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(delta) > 50) (delta < 0 ? showNext : showPrev)();
    };

    const activeImage = activeIndex !== null ? ACHIEVEMENTS[activeIndex] : null;

    return (
        <section id="about-achievements" className="pja-achv" aria-labelledby="pja-achv-title">
            <div className="pjds-container">
                <header className="pja-achv__header">
                    <p className="pjds-eyebrow" data-reveal="up">Achievements</p>
                    <h2 id="pja-achv-title" className="pja-achv__title" data-reveal="up" data-reveal-delay="1">
                        <span className="pjds-sr-only">Awards &amp; Recognition. Awards &amp; Achievements.</span>
                        <span aria-hidden="true">Awards &amp; </span>
                        <TypedWord words={TYPED_WORDS} />
                    </h2>
                    <span className="pja-achv__line" aria-hidden="true" data-reveal="line" data-reveal-delay="2" />
                    <p className="pja-achv__intro" data-reveal="up" data-reveal-delay="2">
                        Moments from the sessions, awards and project showcases that mark our journey with
                        students, institutions and innovators.
                    </p>
                </header>

                <ul className="pja-achv__grid">
                    {ACHIEVEMENTS.map((item, index) => (
                        <li
                            key={item.id}
                            className={`pja-achv__item pja-achv__item--${index + 1}`}
                            data-reveal="up"
                            data-reveal-delay={String((index % 3) + 1)}
                        >
                            <button
                                type="button"
                                className="pja-achv__card"
                                onClick={(event) => open(index, event)}
                                aria-label={`Open photo: ${item.title}`}
                            >
                                <img
                                    src={item.src}
                                    alt={item.alt}
                                    width={item.width}
                                    height={item.height}
                                    loading="lazy"
                                    decoding="async"
                                    draggable="false"
                                />
                                <span className="pja-achv__caption">
                                    <span>{item.title}</span>
                                    <Maximize2 size={15} aria-hidden="true" />
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {activeImage && createPortal(
                <div className="pja-achv-lightbox" role="dialog" aria-modal="true" aria-label={`Photo: ${activeImage.title}`} onClick={close}>
                    <button type="button" className="pja-achv-lightbox__btn pja-achv-lightbox__close" onClick={close} aria-label="Close photo viewer" autoFocus>
                        <X size={22} aria-hidden="true" />
                    </button>
                    <button
                        type="button"
                        className="pja-achv-lightbox__btn pja-achv-lightbox__prev"
                        onClick={(event) => { event.stopPropagation(); showPrev(); }}
                        aria-label="Previous photo"
                    >
                        <ChevronLeft size={26} aria-hidden="true" />
                    </button>
                    <figure className="pja-achv-lightbox__stage" onClick={(event) => event.stopPropagation()} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
                        <img key={activeImage.id} src={activeImage.src} alt={activeImage.alt} width={activeImage.width} height={activeImage.height} draggable="false" />
                        <figcaption>
                            {activeImage.title}
                            <span>{activeIndex + 1} / {total}</span>
                        </figcaption>
                    </figure>
                    <button
                        type="button"
                        className="pja-achv-lightbox__btn pja-achv-lightbox__next"
                        onClick={(event) => { event.stopPropagation(); showNext(); }}
                        aria-label="Next photo"
                    >
                        <ChevronRight size={26} aria-hidden="true" />
                    </button>
                </div>,
                document.body
            )}
        </section>
    );
}
