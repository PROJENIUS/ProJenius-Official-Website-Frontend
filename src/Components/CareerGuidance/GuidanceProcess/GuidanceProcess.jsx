import React, { useEffect, useRef, useState } from "react";
import {
  Search,
  Target,
  ListChecks,
  Compass,
  FileText,
  Briefcase,
} from "lucide-react";
import "./GuidanceProcess.css";

/* =========================================================
   SESSION 1: PROCESS STEPS DATA MODEL
   Follows exact structure:
   - Alternating Blue, Orange, Teal badges
   - 6 sequential milestones with icons and descriptions
========================================================= */

const GUIDANCE_STEPS = [
  {
    id: 1,
    stepNum: "01",
    badgeNum: "1",
    title: "Profile Review",
    shortDesc: "In-depth audit of your academic background, current skill set, and core career interests.",
    color: "blue",
    Icon: Search,
  },
  {
    id: 2,
    stepNum: "02",
    badgeNum: "2",
    title: "Goal Discussion",
    shortDesc: "Target specific industry roles, clarify aspirations, and establish realistic placement timelines.",
    color: "orange",
    Icon: Target,
  },
  {
    id: 3,
    stepNum: "03",
    badgeNum: "3",
    title: "Skill Gap Analysis",
    shortDesc: "Identify missing technical competencies and required tools for high-demand tech roles.",
    color: "teal",
    Icon: ListChecks,
  },
  {
    id: 4,
    stepNum: "04",
    badgeNum: "4",
    title: "Career Roadmap",
    shortDesc: "Build an actionable, week-by-week learning blueprint tailored to your dream job profile.",
    color: "blue",
    Icon: Compass,
  },
  {
    id: 5,
    stepNum: "05",
    badgeNum: "5",
    title: "Resume & Prep",
    shortDesc: "Craft ATS-optimized resumes and undergo rigorous mock technical and HR interview rounds.",
    color: "orange",
    Icon: FileText,
  },
  {
    id: 6,
    stepNum: "06",
    badgeNum: "6",
    title: "Placement Support",
    shortDesc: "Continuous 1:1 mentor backing during campus drives, company interviews, and offer negotiations.",
    color: "teal",
    Icon: Briefcase,
  },
];

/* =========================================================
   SESSION 2: GUIDANCE PROCESS ROOT COMPONENT
   Strict Rules:
   - Zero inline styles (all styling handled in GuidanceProcess.css)
   - Unique "gp-*" class name namespace
   - Clean, lag-free state transitions
========================================================= */

const GuidanceProcess = () => {
  const [hoveredStepId, setHoveredStepId] = useState(null);
  const [selectedStepId, setSelectedStepId] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  /* INTERSECTION OBSERVER FOR SMOOTH VISIBILITY */
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  /* ACTIVE STEP RESOLVER (HOVER HAS PRIORITY OVER SELECTION) */
  const activeId = hoveredStepId || selectedStepId;
  const activeStep = activeId ? GUIDANCE_STEPS.find((s) => s.id === activeId) : null;

  const handleStepClick = (id) => {
    setSelectedStepId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="guidance-process"
      ref={sectionRef}
      className={`gp-section ${isVisible ? "gp-section-visible" : ""}`}
    >
      {/* AMBIENT GLOW BACKDROP */}
      <div className="gp-ambient-glow" />

      <div className="gp-container">
        {/* =================================================
            SESSION 3: CIRCULAR ORBIT GRAPHIC (DESKTOP & LAPTOP)
            Deep Navy Theme with Electric Cyan Accent:
            - Sleek cyan orbit ring
            - Center title: "6 Steps to Your Career Breakthrough"
            - Subtitle: "Hover over any step to see details."
            - All 6 nodes mounted symmetrically on the circle
        ================================================= */}
        <div
          className="gp-circular-view"
          onMouseLeave={() => setHoveredStepId(null)}
        >
          <div className="gp-orbit-wrapper">
            {/* GLOWING CYAN CIRCULAR ORBIT RING */}
            <div className="gp-orbit-ring" />

            {/* CENTER CONTENT HUB */}
            <div
              className={`gp-center-hub ${
                activeStep
                  ? `gp-center-hub-active gp-theme-${activeStep.color}`
                  : "gp-center-hub-idle"
              }`}
            >
              {activeStep ? (
                <div className="gp-hub-active-content">
                  <div className={`gp-hub-bar gp-hub-bar-${activeStep.color}`} />
                  <span className={`gp-hub-tag gp-hub-tag-${activeStep.color}`}>
                    STEP {activeStep.stepNum}
                  </span>
                  <h3 className="gp-hub-active-title">{activeStep.title}</h3>
                  <p className="gp-hub-active-desc">{activeStep.shortDesc}</p>
                </div>
              ) : (
                <div className="gp-hub-default-content">
                  <div className="gp-hub-bar gp-hub-bar-default" />
                  <h3 className="gp-hub-default-title">
                    6 Steps to Your Career<br />
                    <span className="gp-hub-highlight">Breakthrough</span>
                  </h3>
                  <p className="gp-hub-default-sub">
                    Hover over any step to see details.
                  </p>
                </div>
              )}
            </div>

            {/* 6 NODES MATHEMATICALLY ALIGNED ON THE ORBIT */}
            {GUIDANCE_STEPS.map((step) => {
              const Icon = step.Icon;
              const isActive = activeId === step.id;

              return (
                <div
                  key={step.id}
                  className={`gp-node gp-node-pos-${step.id} gp-node-color-${step.color} ${
                    isActive ? "gp-node-active" : ""
                  }`}
                  onMouseEnter={() => setHoveredStepId(step.id)}
                  onClick={() => handleStepClick(step.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleStepClick(step.id);
                    }
                  }}
                  aria-label={`Step ${step.stepNum}: ${step.title}`}
                >
                  {/* CIRCULAR BADGE MOUNTED ON ORBIT */}
                  <div className="gp-node-badge">
                    <Icon className="gp-node-icon" size={17} />
                    <span className="gp-node-badge-num">{step.badgeNum}</span>
                  </div>

                  {/* STEP LABEL EXTENDING OUTWARD */}
                  <span className="gp-node-label">{step.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* =================================================
            SESSION 4: LINEAR RESPONSIVE TIMELINE (TABLET & MOBILE)
            Matches dark theme with touch-friendly cards
        ================================================= */}
        <div className="gp-linear-view">
          {/* MOBILE SECTION HEADER */}
          <div className="gp-linear-header">
            <div className="gp-hub-bar gp-hub-bar-default" />
            <h3 className="gp-linear-heading">
              6 Steps to Your Career{" "}
              <span className="gp-hub-highlight">Breakthrough</span>
            </h3>
            <p className="gp-linear-sub">
              A proven sequential path designed to take you from uncertainty to high-confidence job readiness.
            </p>
          </div>

          {/* TIMELINE LIST */}
          <div className="gp-linear-timeline">
            {GUIDANCE_STEPS.map((step) => {
              const Icon = step.Icon;
              const isActive = activeId === step.id;

              return (
                <div
                  key={`linear-${step.id}`}
                  className={`gp-linear-card gp-linear-color-${step.color} ${
                    isActive ? "gp-linear-card-active" : ""
                  }`}
                  onClick={() => handleStepClick(step.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleStepClick(step.id);
                    }
                  }}
                >
                  <div className="gp-linear-badge">
                    <Icon className="gp-linear-icon" size={18} />
                    <span className="gp-linear-num">{step.badgeNum}</span>
                  </div>
                  <div className="gp-linear-info">
                    <h4 className="gp-linear-title">{step.title}</h4>
                    <p className="gp-linear-desc">{step.shortDesc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuidanceProcess;
