import React, { useEffect, useRef, useState } from "react";
import "./HomeHero.css";

// =========================================================
// HOME HERO IMAGES
// =========================================================

import HomeHero_1 from "../../../assets/Home/HomeHero/HomeHero_1.jpeg";
import HomeHero_2 from "../../../assets/Home/HomeHero/HomeHero_2.jpeg";
import HomeHero_3 from "../../../assets/Home/HomeHero/HomeHero_3.jpeg";

// =========================================================
// HERO DATA
// =========================================================

const HERO_SLIDES = [
    { id: 0, image: HomeHero_1, title: "Businesses & Organizations" },
    { id: 1, image: HomeHero_2, title: "Startups & Institutions" },
    { id: 2, image: HomeHero_3, title: "Innovators & Entrepreneurs" },
];

const SERVICES = [
    "Web",
    "Mobile Apps",
    "Software",
    "AI/ML",
    "IoT",
    "Product Engineering",
    "3D Design",
];

// =========================================================
// CONFIG
// =========================================================

const SLIDE_DURATION = 5000; // ms per slide
const TYPING_SPEED = 60; // ms per character

const pad = (n) => String(n).padStart(2, "0");

// =========================================================
// DOT INDICATORS (tablet / mobile only)
// =========================================================

function DotIndicators({ active, onDotClick }) {
    return (
        <div className="hero-dots">
            {HERO_SLIDES.map((slide, index) => (
                <button
                    key={slide.id}
                    type="button"
                    className={`hero-dot ${index === active ? "is-active" : ""}`}
                    aria-label={`Show ${slide.title}`}
                    onClick={() => onDotClick(index)}
                />
            ))}
        </div>
    );
}

// =========================================================
// HOME HERO SECTION
// =========================================================

export default function HomeHero() {
    const [activeSlide, setActiveSlide] = useState(0);
    const [typedText, setTypedText] = useState("");
    const [isVisible, setIsVisible] = useState(true);

    const heroRef = useRef(null);

    const activeHero = HERO_SLIDES[activeSlide];

    // -----------------------------------------------------
    // Preload images
    // -----------------------------------------------------
    useEffect(() => {
        HERO_SLIDES.forEach((slide) => {
            const image = new Image();
            image.src = slide.image;
        });
    }, []);

    // -----------------------------------------------------
    // Pause the carousel while the hero is off-screen
    // -----------------------------------------------------
    useEffect(() => {
        const el = heroRef.current;
        if (!el || typeof IntersectionObserver === "undefined") return;

        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.35 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // -----------------------------------------------------
    // Auto slide. Depends on activeSlide, so a manual click
    // restarts the 5s timer instead of skipping early.
    // -----------------------------------------------------
    useEffect(() => {
        if (!isVisible) return;

        const timer = setTimeout(() => {
            setActiveSlide((current) => (current + 1) % HERO_SLIDES.length);
        }, SLIDE_DURATION);

        return () => clearTimeout(timer);
    }, [activeSlide, isVisible]);

    // -----------------------------------------------------
    // Typing effect for the current slide title
    // -----------------------------------------------------
    useEffect(() => {
        const text = HERO_SLIDES[activeSlide].title;
        const reduceMotion =
            typeof window !== "undefined" &&
            window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (reduceMotion) {
            setTypedText(text);
            return;
        }

        setTypedText("");

        let count = 0;
        let timer;

        const tick = () => {
            count += 1;
            setTypedText(text.slice(0, count));
            if (count < text.length) {
                timer = setTimeout(tick, TYPING_SPEED);
            }
        };

        timer = setTimeout(tick, 250);

        return () => clearTimeout(timer);
    }, [activeSlide]);

    // =====================================================
    // JSX
    // =====================================================

    return (
        <section ref={heroRef} className="hero-wrapper">
            {/* BACKGROUND (cross-fades between slides) */}
            <div className="hero-bg" aria-hidden="true">
                {HERO_SLIDES.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`hero-bg-layer ${
                            index === activeSlide ? "is-active" : ""
                        }`}
                        style={{ backgroundImage: `url(${slide.image})` }}
                    />
                ))}
            </div>

            <div className="hero-inner">
                <div className="hero-content">
                    {/* LEFT: MESSAGE */}
                    <div className="hero-text">
                        <p className="hero-eyebrow">
                            We Design, Develop &amp; Deliver Impactful Technology
                        </p>

                        <h1
                            className="hero-heading"
                            aria-label={`Technology Solutions for ${activeHero.title}`}
                        >
                            <span className="hero-heading-static" aria-hidden="true">
                                Technology Solutions for
                            </span>
                            <span className="hero-heading-typed" aria-hidden="true">
                                {typedText}
                                <span className="hero-cursor" />
                            </span>
                        </h1>

                        <p className="hero-description">
                            ProJenius is a technology solutions and innovation
                            company. We help businesses, startups, institutions,
                            and organizations turn ideas into practical,
                            scalable technology.
                        </p>

                        <div className="hero-actions">
                            <a className="hero-btn hero-btn-primary" href="/services">
                                Explore Services
                            </a>
                            <a className="hero-btn hero-btn-ghost" href="/contact">
                                Talk to Us
                            </a>
                        </div>

                        <ul className="hero-services" aria-label="What we build">
                            {SERVICES.map((service) => (
                                <li key={service}>{service}</li>
                            ))}
                        </ul>

                        <div className="hero-dots-wrap">
                            <DotIndicators
                                active={activeSlide}
                                onDotClick={setActiveSlide}
                            />
                        </div>
                    </div>

                    {/* RIGHT: FEATURED IMAGE + THUMBNAILS (desktop only) */}
                    <div className="hero-visual">
                        <figure className="hero-stage">
                            {HERO_SLIDES.map((slide, index) => (
                                <img
                                    key={slide.id}
                                    className={`hero-stage-img ${
                                        index === activeSlide ? "is-active" : ""
                                    }`}
                                    src={slide.image}
                                    alt={slide.title}
                                    draggable="false"
                                />
                            ))}

                            <figcaption className="hero-stage-caption">
                                <span>{activeHero.title}</span>
                                <span className="hero-stage-count">
                                    {pad(activeSlide + 1)} / {pad(HERO_SLIDES.length)}
                                </span>
                            </figcaption>
                        </figure>

                        <div className="hero-thumbs">
                            {HERO_SLIDES.map((slide, index) => (
                                <button
                                    key={slide.id}
                                    type="button"
                                    className={`hero-thumb ${
                                        index === activeSlide ? "is-active" : ""
                                    }`}
                                    style={{ "--slide-duration": `${SLIDE_DURATION}ms` }}
                                    aria-label={`Show ${slide.title}`}
                                    aria-current={index === activeSlide}
                                    onClick={() => setActiveSlide(index)}
                                >
                                    <img src={slide.image} alt="" draggable="false" />
                                    {index === activeSlide && (
                                        <span
                                            key={`${activeSlide}-${isVisible}`}
                                            className="hero-thumb-progress"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}