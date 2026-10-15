import React, { useEffect, useRef, useState } from "react";
import {
  FileText,
  UserCheck,
  Video,
  CheckSquare,
} from "lucide-react";
import "./NotJustAdvice.css";

/* =========================================================
   SESSION 1: CUSTOM SVG ICONS & DATA
========================================================= */

const LinkedInIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.77v8.37H6.46v-8.37M7.85 6.25c-.96 0-1.74.78-1.74 1.74 0 .97.78 1.75 1.74 1.75.96 0 1.74-.78 1.74-1.75 0-.96-.78-1.74-1.74-1.74Z" />
  </svg>
);

const DELIVERABLES_LIST = [
  {
    id: 1,
    title: "A personalized career roadmap document (PDF)",
    Icon: FileText,
  },
  {
    id: 2,
    title: "An ATS-optimized resume reviewed line-by-line",
    Icon: UserCheck,
  },
  {
    id: 3,
    title: "2 live mock interview sessions with recorded feedback",
    Icon: Video,
  },
  {
    id: 4,
    title: "A LinkedIn audit report with before/after recommendations",
    Icon: LinkedInIcon,
  },
  {
    id: 5,
    title: "A portfolio review checklist for your projects",
    Icon: CheckSquare,
  },
];

/* =========================================================
   SESSION 2: COMPONENT LOGIC & SCROLL OBSERVER
========================================================= */

const NotJustAdvice = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="not-just-advice"
      ref={sectionRef}
      className={`nja-section ${isVisible ? "nja-section-visible" : ""}`}
    >
      {/* AMBIENT BACKGROUND GLOW */}
      <div className="nja-ambient-glow" />

      <div className="nja-container">
        {/* ===================================================
            SESSION 3: LEFT COLUMN (TITLE & VALUE PROP)
        =================================================== */}
        <div className="nja-left-col">
          <span className="nja-badge">TANGIBLE OUTCOMES</span>

          <h2 className="nja-title">
            <span className="nja-title-line">Not Just Advice.</span>
            <span className="nja-title-accent">Real Deliverables.</span>
          </h2>

          <div className="nja-descriptions">
            <p className="nja-desc-text">
              We don't just tell you what to do — we work with you to create the
              actual assets you need to land interviews.
            </p>
            <p className="nja-desc-text">
              Walk away with concrete materials that prove your value to
              employers.
            </p>
          </div>
        </div>

        {/* ===================================================
            SESSION 4: RIGHT COLUMN (DELIVERABLES LIST)
        =================================================== */}
        <div className="nja-right-col">
          <div className="nja-items-stack">
            {DELIVERABLES_LIST.map((item) => {
              const Icon = item.Icon;

              return (
                <article
                  key={item.id}
                  className={`nja-item-card nja-item-${item.id}`}
                >
                  <div className="nja-item-icon-box">
                    <Icon size={20} className="nja-item-icon" />
                  </div>
                  <span className="nja-item-text">{item.title}</span>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotJustAdvice;
