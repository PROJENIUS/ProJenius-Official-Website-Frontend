import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, Keyboard, Navigation, Pagination } from "swiper/modules";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "./Testimonials.css";

import {
    GOOGLE_PROFILE_URL,
    GOOGLE_REVIEWS_URL,
    VERIFIED_SNAPSHOT,
    fetchGoogleReviews,
} from "./googleReviews.js";

import SectionTitleLine from "../../Common/SectionTitleLine/SectionTitleLine.jsx";
import TypedPhrase from "../../Common/TypedPhrase/TypedPhrase.jsx";

const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
    return (
        <article className="pja-testi__card">
            <div className="pja-testi__card-top">
                <Stars rating={review.rating} />
                <a className="pja-testi__source" href={review.reviewUrl || GOOGLE_PROFILE_URL} target="_blank" rel="noopener noreferrer">
                    <GoogleMark /> Google Review
                </a>
            </div>
            <p className="pja-testi__text">
                <span className="pjds-sr-only">Rated {review.rating} out of 5. </span>
                "{review.text || "Exceptional technical expertise and dedicated support."}"
            </p>
            <footer className="pja-testi__author">
                <span className="pja-testi__avatar" aria-hidden="true">
                    {review.name.trim().charAt(0).toUpperCase()}
                </span>
                <span>
                    <span className="pja-testi__name">{review.name}</span>
                    <span className="pja-testi__role">{review.role || "Verified Google Reviewer"}</span>
                    {review.date && <span className="pja-testi__date">{review.date}</span>}
                </span>
            </footer>
        </article>
    );
}

export default function Testimonials() {
    const sectionRef = useRef(null);
    const swiperRef = useRef(null);
    const [data, setData] = useState(VERIFIED_SNAPSHOT);
    const reduceMotion = prefersReducedMotion();

    useEffect(() => {
        let disposed = false;
        const controller = new AbortController();

        fetchGoogleReviews(controller.signal)
            .then((res) => {
                if (!disposed && res) setData(res);
            })
            .catch(() => {
                if (!disposed) setData(VERIFIED_SNAPSHOT);
            });

        return () => {
            disposed = true;
            controller.abort();
        };
    }, []);

    const reviews = data.reviews && data.reviews.length ? data.reviews : VERIFIED_SNAPSHOT.reviews;
    const rating = data.rating || VERIFIED_SNAPSHOT.rating;
    const totalReviews = data.totalReviews || VERIFIED_SNAPSHOT.totalReviews;
    const reviewsUrl = data.url || GOOGLE_REVIEWS_URL;

    return (
        <section
            ref={sectionRef}
            id="testimonials-section"
            className="pja-testi"
            aria-labelledby="pja-testi-title"
        >
            {/* =========================================================================
                2. CENTER HERO COPY & ACTION (Image 2 Reference)
                ========================================================================= */}
            <div className="pjds-container">
                <header className="pja-testi__hero-header">
                    <p className="pjds-eyebrow pja-testi__pill-tag" data-reveal="up">
                        Testimonials
                    </p>

                    <h2 id="pja-testi-title" className="pja-testi__hero-title" data-reveal="up" data-reveal-delay="1">
                        Trusted by Leaders <TypedPhrase phrases={["from Various Industries", "from Startups", "from Institutions"]} />
                    </h2>
                    <SectionTitleLine />

                    <p className="pja-testi__hero-desc" data-reveal="up" data-reveal-delay="2">
                        Why founders, institutions and enterprise clients partner with ProJenius.
                    </p>
                </header>

                {/* =========================================================================
                    3. DETAILS SECTION AS PER 1ST IMAGE (Google Summary + Review Cards)
                    ========================================================================= */}
                <div id="testimonials-reviews" className="pja-testi__reviews-section">
                    <div className="pja-testi__layout">
                        {/* Rating summary card */}
                        <aside className="pja-testi__summary" data-reveal="up" data-reveal-delay="2" aria-label="Google rating">
                            <span className="pja-testi__summary-brand">
                                <GoogleMark /> Google Reviews
                            </span>

                            <p className="pja-testi__score">
                                <b>{rating.toFixed(1)}</b>
                                <span>/ 5</span>
                            </p>

                            <Stars rating={rating} size="lg" />

                            <p className="pja-testi__count">
                                Based on {totalReviews}+ verified Google reviews
                                <span className="pjds-sr-only">: rated {rating.toFixed(1)} out of 5</span>
                            </p>

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

                        {/* Verified Reviews Swiper */}
                        <div
                            className="pja-testi__reviews"
                            data-reveal="up"
                            data-reveal-delay="3"
                        >
                            <Swiper
                                modules={[A11y, Autoplay, Keyboard, Navigation, Pagination]}
                                className="pja-testi__swiper"
                                slidesPerView={1}
                                spaceBetween={20}
                                breakpoints={{ 760: { slidesPerView: 2 } }}
                                loop={reviews.length > 2}
                                speed={reduceMotion ? 0 : 600}
                                autoplay={reduceMotion ? false : { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                                keyboard={{ enabled: true, onlyInViewport: true }}
                                navigation={{ prevEl: ".pja-testi__nav--prev", nextEl: ".pja-testi__nav--next" }}
                                pagination={{ el: ".pja-testi__dots", clickable: true, dynamicBullets: true, dynamicMainBullets: 3, bulletClass: "pja-testi__dot", bulletActiveClass: "is-active" }}
                                a11y={{ prevSlideMessage: "Previous review", nextSlideMessage: "Next review" }}
                                onSwiper={(swiper) => { swiperRef.current = swiper; }}
                            >
                                {reviews.map((review) => (
                                    <SwiperSlide key={review.id} className="pja-testi__slide">
                                        <ReviewCard review={review} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            <div className="pja-testi__controls">
                                <button type="button" className="pja-testi__nav pja-testi__nav--prev" aria-label="Previous review">
                                    <ChevronLeft size={20} aria-hidden="true" />
                                </button>
                                <div className="pja-testi__dots" />
                                <button type="button" className="pja-testi__nav pja-testi__nav--next" aria-label="Next review">
                                    <ChevronRight size={20} aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
