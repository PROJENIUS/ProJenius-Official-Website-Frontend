import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, Keyboard, Navigation, Pagination } from "swiper/modules";
import { ArrowUpRight, ChevronLeft, ChevronRight, Quote } from "lucide-react";

import "swiper/css";
import "./Testimonials.css";

import {
    GOOGLE_PROFILE_URL,
    GOOGLE_REVIEWS_API_CONFIGURED,
    GOOGLE_REVIEWS_URL,
    fetchGoogleReviews,
} from "./googleReviews.js";

/* =============================================================================
   TESTIMONIALS — Google reviews
   -----------------------------------------------------------------------------
   1. Asks the ProJenius backend for live Google reviews (/api/reviews).
   2. While waiting: skeleton cards.
   3. Live reviews → shown as returned (name, rating, date, text).
      Live but empty → a short message and the Google link.
      Unavailable (no endpoint / network error) → the verified snapshot from
      googleReviews.js, labelled with the date it was checked.
   Autoplay pauses on hover, on keyboard focus and while off screen, and is
   off with prefers-reduced-motion.
   ============================================================================= */

const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const TESTIMONIAL_PHRASES = ["Clients Say", "Learners Say", "Partners Say"];

function TestimonialTypingLine({ active }) {
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [length, setLength] = useState(0);
    const [deleting, setDeleting] = useState(false);
    const reduce = prefersReducedMotion();
    const phrase = TESTIMONIAL_PHRASES[phraseIndex];
    const longestPhrase = TESTIMONIAL_PHRASES.reduce(
        (longest, current) => current.length > longest.length ? current : longest,
        ""
    );

    useEffect(() => {
        if (!active || reduce) return undefined;

        let delay;
        let next;
        if (!deleting && length < phrase.length) {
            delay = length === 0 ? 250 : 90;
            next = () => setLength((value) => value + 1);
        } else if (!deleting) {
            delay = 1600;
            next = () => setDeleting(true);
        } else if (length > 0) {
            delay = 55;
            next = () => setLength((value) => value - 1);
        } else {
            delay = 350;
            next = () => {
                setDeleting(false);
                setPhraseIndex((value) => (value + 1) % TESTIMONIAL_PHRASES.length);
            };
        }

        const timer = window.setTimeout(next, delay);
        return () => window.clearTimeout(timer);
    }, [active, deleting, length, phrase, reduce]);

    const shown = reduce ? TESTIMONIAL_PHRASES[0] : phrase.slice(0, length);

    return (
        <span className="pja-testi__typed">
            <span className="pjds-sr-only">{TESTIMONIAL_PHRASES.join(", ")}</span>
            <span className="pja-testi__typed-sizer" aria-hidden="true">{longestPhrase}</span>
            <span className="pja-testi__typed-live" aria-hidden="true">
                {shown}
                {!reduce && active && <span className="pja-testi__cursor" />}
            </span>
        </span>
    );
}

function Stars({ rating, size = "md" }) {
    const filled = Math.max(0, Math.min(5, Math.round(rating)));
    return (
        <span className={`pja-testi__stars pja-testi__stars--${size}`} aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => (
                <span key={index} className={index < filled ? "is-filled" : ""}>★</span>
            ))}
        </span>
    );
}

function GoogleMark() {
    return (
        <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
        </svg>
    );
}

function ReviewCard({ review }) {
    const [avatarFailed, setAvatarFailed] = useState(false);

    return (
        <article className="pja-testi__card">
            <div className="pja-testi__card-top">
                <Stars rating={review.rating} />
                {review.reviewUrl ? (
                    <a className="pja-testi__source" href={review.reviewUrl} target="_blank" rel="noopener noreferrer">
                        <GoogleMark /> Google review
                    </a>
                ) : (
                    <span className="pja-testi__source"><GoogleMark /> Google review</span>
                )}
            </div>
            <p className={`pja-testi__text${review.text ? "" : " pja-testi__text--empty"}`}>
                <span className="pjds-sr-only">Rated {review.rating} out of 5. </span>
                {review.text || "No written comment."}
            </p>
            <footer className="pja-testi__author">
                <span className="pja-testi__avatar" aria-hidden="true">
                    {review.profilePhotoUrl && !avatarFailed ? (
                        <img
                            src={review.profilePhotoUrl}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            onError={() => setAvatarFailed(true)}
                        />
                    ) : review.name.trim().charAt(0).toUpperCase()}
                </span>
                <span>
                    <span className="pja-testi__name">{review.name}</span>
                    {review.date && <span className="pja-testi__date">{review.date}</span>}
                </span>
            </footer>
        </article>
    );
}

export default function Testimonials() {
    const sectionRef = useRef(null);
    const swiperRef = useRef(null);
    const [data, setData] = useState({ status: "loading" });
    const [retryCount, setRetryCount] = useState(0);
    const [isOnScreen, setIsOnScreen] = useState(() => typeof IntersectionObserver === "undefined");
    const reduceMotion = prefersReducedMotion();

    useEffect(() => {
        let controller;
        let disposed = false;
        let requestInFlight = false;

        const refreshReviews = async () => {
            if (requestInFlight || disposed) return;
            requestInFlight = true;
            controller = new AbortController();
            try {
                const result = await fetchGoogleReviews(controller.signal);
                if (!disposed) setData(result);
            } catch (error) {
                if (disposed || controller.signal.aborted) return;
                if (import.meta.env.DEV) console.warn("Google reviews unavailable:", error.message);
                setData((current) => current.status === "live" ? { ...current, refreshError: true } : { status: "error" });
            } finally {
                requestInFlight = false;
            }
        };

        refreshReviews();
        // Refresh live reviews periodically and when a visitor returns to the tab.
        // Google credentials and synchronization stay on the backend.
        const refreshTimer = GOOGLE_REVIEWS_API_CONFIGURED
            ? window.setInterval(refreshReviews, 15 * 60 * 1000)
            : undefined;
        const onVisibilityChange = () => {
            if (GOOGLE_REVIEWS_API_CONFIGURED && document.visibilityState === "visible") refreshReviews();
        };
        document.addEventListener("visibilitychange", onVisibilityChange);
        return () => {
            disposed = true;
            if (refreshTimer !== undefined) window.clearInterval(refreshTimer);
            document.removeEventListener("visibilitychange", onVisibilityChange);
            controller?.abort();
        };
    }, [retryCount]);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section || typeof IntersectionObserver === "undefined") return undefined;
        const observer = new IntersectionObserver(([entry]) => setIsOnScreen(entry.isIntersecting), { threshold: 0.2 });
        observer.observe(section);
        return () => observer.disconnect();
    }, []);

    // Autoplay only while the carousel is on screen (and motion is allowed).
    useEffect(() => {
        const autoplay = swiperRef.current?.autoplay;
        if (!autoplay || reduceMotion) return;
        if (isOnScreen) autoplay.start();
        else autoplay.stop();
    }, [isOnScreen, reduceMotion, data.status]);

    const isLive = data.status === "live" || data.status === "empty";
    const reviews = data.status === "live" ? data.reviews : [];
    const rating = isLive ? data.rating : null;
    const totalReviews = isLive ? data.totalReviews : null;
    const reviewsUrl = isLive ? data.url : GOOGLE_REVIEWS_URL;

    return (
        <section ref={sectionRef} className="pja-testi" aria-labelledby="pja-testi-title" aria-busy={data.status === "loading"}>
            <div className="pjds-container">
                <header className="pja-testi__header">
                    <p className="pjds-eyebrow" data-reveal="up">Testimonials</p>
                    <h2 id="pja-testi-title" className="pja-testi__title" data-reveal="up" data-reveal-delay="1">
                        What Our <TestimonialTypingLine active={isOnScreen} />
                    </h2>
                    <span className="pja-testi__line" aria-hidden="true" data-reveal="line" data-reveal-delay="2" />
                    <p className="pja-testi__intro" data-reveal="up" data-reveal-delay="2">
                        Reviews from students, interns, startups and businesses, as published on our Google
                        Business Profile.
                    </p>
                </header>

                <div className="pja-testi__layout">
                    {/* Rating summary ---------------------------------------- */}
                    <aside className="pja-testi__summary" data-reveal="up" data-reveal-delay="2" aria-label="Google rating">
                        <span className="pja-testi__summary-brand"><GoogleMark /> Google Reviews</span>
                        {rating ? (
                            <>
                                <p className="pja-testi__score">
                                    <b>{rating.toFixed(1)}</b>
                                    <span>/ 5</span>
                                </p>
                                <Stars rating={rating} size="lg" />
                                <p className="pja-testi__count">
                                    {totalReviews ? `Based on ${totalReviews} Google reviews` : "Google rating"}
                                    <span className="pjds-sr-only">: rated {rating.toFixed(1)} out of 5</span>
                                </p>
                            </>
                        ) : (
                            <p className="pja-testi__count">See our rating on Google.</p>
                        )}
                        {data.status === "error" && <p className="pja-testi__note">Live review data is temporarily unavailable.</p>}
                        {data.refreshError && <p className="pja-testi__note">Showing the latest reviews we could load. Refresh failed.</p>}
                        <div className="pja-testi__summary-actions">
                            <a className="pjds-btn pjds-btn--primary" href={reviewsUrl} target="_blank" rel="noopener noreferrer">
                                Read all reviews
                                <ArrowUpRight size={17} aria-hidden="true" />
                                <span className="pjds-sr-only">(opens Google in a new tab)</span>
                            </a>
                            <a className="pja-testi__text-link" href={GOOGLE_PROFILE_URL} target="_blank" rel="noopener noreferrer">
                                View our Google profile
                                <span className="pjds-sr-only">(opens in a new tab)</span>
                            </a>
                        </div>
                    </aside>

                    {/* Reviews ------------------------------------------------- */}
                    <div
                        className="pja-testi__reviews"
                        data-reveal="up"
                        data-reveal-delay="3"
                        onFocus={(event) => { if (event.target.matches?.(":focus-visible")) swiperRef.current?.autoplay?.stop(); }}
                        onBlur={(event) => {
                            if (!event.currentTarget.contains(event.relatedTarget) && isOnScreen && !reduceMotion) swiperRef.current?.autoplay?.start();
                        }}
                    >
                        {data.status === "loading" && (
                            <div className="pja-testi__skeletons" role="status">
                                <span className="pjds-sr-only">Loading reviews…</span>
                                <span className="pja-testi__skeleton" aria-hidden="true" />
                                <span className="pja-testi__skeleton" aria-hidden="true" />
                            </div>
                        )}

                        {data.status === "empty" && (
                            <div className="pja-testi__empty">
                                <Quote size={28} aria-hidden="true" />
                                <p>No reviews to show right now. Read and write reviews on our Google profile.</p>
                            </div>
                        )}

                        {data.status === "error" && (
                            <div className="pja-testi__empty" role="alert">
                                <Quote size={28} aria-hidden="true" />
                                <p>Google reviews are temporarily unavailable. Try again or view our Google profile.</p>
                                <button type="button" className="pja-testi__retry" onClick={() => {
                                    setData({ status: "loading" });
                                    setRetryCount((count) => count + 1);
                                }}>
                                    Try again
                                </button>
                            </div>
                        )}

                        {reviews.length > 0 && (
                            <>
                                <Swiper
                                    modules={[A11y, Autoplay, Keyboard, Navigation, Pagination]}
                                    className="pja-testi__swiper"
                                    slidesPerView={1}
                                    spaceBetween={20}
                                    breakpoints={{ 760: { slidesPerView: 2 } }}
                                    loop={reviews.length > 2}
                                    speed={reduceMotion ? 0 : 600}
                                    autoplay={reduceMotion ? false : { delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                                    keyboard={{ enabled: true, onlyInViewport: true }}
                                    navigation={{ prevEl: ".pja-testi__nav--prev", nextEl: ".pja-testi__nav--next" }}
                                    pagination={{ el: ".pja-testi__dots", clickable: true, dynamicBullets: true, dynamicMainBullets: 3, bulletClass: "pja-testi__dot", bulletActiveClass: "is-active" }}
                                    a11y={{ prevSlideMessage: "Previous review", nextSlideMessage: "Next review", paginationBulletMessage: "Go to review {{index}}" }}
                                    onSwiper={(swiper) => { swiperRef.current = swiper; if (!reduceMotion) swiper.autoplay?.stop(); }}
                                >
                                    {reviews.map((review) => (
                                        <SwiperSlide key={review.id} className="pja-testi__slide">
                                            <ReviewCard review={review} />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>

                                {reviews.length > 1 && <div className="pja-testi__controls">
                                    <button type="button" className="pja-testi__nav pja-testi__nav--prev" aria-label="Previous review">
                                        <ChevronLeft size={20} aria-hidden="true" />
                                    </button>
                                    <div className="pja-testi__dots" />
                                    <button type="button" className="pja-testi__nav pja-testi__nav--next" aria-label="Next review">
                                        <ChevronRight size={20} aria-hidden="true" />
                                    </button>
                                </div>}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
