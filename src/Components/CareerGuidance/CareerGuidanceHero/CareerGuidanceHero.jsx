import React, { useEffect, useState } from "react";
import "./CareerGuidanceHero.css";
import heroSlide1 from "../../../assets/career-guidance/hero/hero-slide-1.webp";
import heroSlide2 from "../../../assets/career-guidance/hero/hero-slide-2.webp";
import heroSlide3 from "../../../assets/career-guidance/hero/hero-slide-3.webp";

/* =========================================================
   SESSION 1: HERO SLIDES & DATA
========================================================= */

const HERO_SLIDES = [
  {
    bg: heroSlide1,
    thumb: heroSlide1,
  },
  {
    bg: heroSlide2,
    thumb: heroSlide2,
  },
  {
    bg: heroSlide3,
    thumb: heroSlide3,
  },
];

/* =========================================================
   SESSION 2: COMPONENT LOGIC
========================================================= */

const CareerGuidanceHero = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);

    return () => clearInterval(timer);
  }, []);

  const getSlideIndex = (offset) => {
    return (activeSlide + offset + HERO_SLIDES.length) % HERO_SLIDES.length;
  };

  return (
    <section className="cghero-section">
      {/* ===================================================
          SESSION 3: BACKGROUND & GLOW EFFECTS
      =================================================== */}
      <div className="cghero-bg-layer" />
      <div className="cghero-glow-top" />
      <div className="cghero-glow-bottom" />

      <div className="cghero-container">
        {/* ===================================================
            SESSION 4: LEFT TEXT CONTENT
        =================================================== */}
        <div className="cghero-content">
          <div className="cghero-badge">
            <span className="cghero-badge-dot" />
            <span className="cghero-badge-text">Career Guidance</span>
          </div>

          <h1 className="cghero-title">
            <span className="cghero-title-line">
              Build <span className="cghero-title-highlight">Your Career</span>
            </span>
            <span className="cghero-title-line cghero-title-sub">
              with the Right Direction
            </span>
          </h1>

          <p className="cghero-description">
            Get practical guidance, skill recommendations and career preparation
            to move confidently toward your technology career.
          </p>

          <div className="cghero-actions">
            <a href="#book-call" className="cghero-btn-primary">
              Book Mentoring Call
            </a>
            <a href="#everything-you-need" className="cghero-btn-secondary">
              Explore Roadmap
            </a>
          </div>
        </div>

        {/* ===================================================
            SESSION 5: RIGHT CIRCULAR VISUAL SLIDER
        =================================================== */}
        <div className="cghero-visual">
          <div className="cghero-orb-ring cghero-orb-ring-large">
            <div className="cghero-orb-image-wrapper">
              <img
                src={HERO_SLIDES[getSlideIndex(0)].thumb}
                alt="Career Guidance ProJenius"
                className="cghero-orb-image"
              />
            </div>
          </div>

          <div className="cghero-orb-ring cghero-orb-ring-medium">
            <div className="cghero-orb-image-wrapper">
              <img
                src={HERO_SLIDES[getSlideIndex(1)].thumb}
                alt="Technology Mentoring"
                className="cghero-orb-image"
              />
            </div>
          </div>

          <div className="cghero-orb-ring cghero-orb-ring-small">
            <div className="cghero-orb-image-wrapper">
              <img
                src={HERO_SLIDES[getSlideIndex(2)].thumb}
                alt="Student Career Breakthrough"
                className="cghero-orb-image"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerGuidanceHero;
