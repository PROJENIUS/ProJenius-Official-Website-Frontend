import React, { useEffect, useRef } from "react";
import {
  Compass,
  FileText,
  MessageSquare,
  FolderKanban,
  Award,
} from "lucide-react";
import "./EverythingYouNeed.css";

import roadmapImg from "../../../assets/career-guidance/everything-you-need/everything-you-need1.jpg";
import resumeImg from "../../../assets/career-guidance/everything-you-need/everything-you-need2.jpg";
import interviewImg from "../../../assets/career-guidance/everything-you-need/everything-you-need3.jpg";
import linkedinImg from "../../../assets/career-guidance/everything-you-need/everything-you-need4.jpg";
import portfolioImg from "../../../assets/career-guidance/everything-you-need/everything-you-need5.jpg";
import placementImg from "../../../assets/career-guidance/everything-you-need/everything-you-need6.jpg";

/* =========================================================
   SESSION 1: CUSTOM ICONS
========================================================= */

const LinkedInIcon = ({ size = 22, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.77v8.37H6.46v-8.37M7.85 6.25c-.96 0-1.74.78-1.74 1.74 0 .97.78 1.75 1.74 1.75.96 0 1.74-.78 1.74-1.75 0-.96-.78-1.74-1.74-1.74Z" />
  </svg>
);

/* =========================================================
   SESSION 2: SECTION CARDS DATA
========================================================= */

const SERVICES_CARDS = [
  {
    id: "roadmap",
    title: "Career Roadmap Planning",
    description:
      "Walk away with a clear, step-by-step learning roadmap tailored to your skills and target role.",
    image: roadmapImg,
    alt: "Career Roadmap Planning with laptop and code",
    theme: "blue",
    Icon: Compass,
  },
  {
    id: "resume",
    title: "Resume Building",
    description:
      "Transform your resume from generic to job-ready by highlighting exactly what recruiters want to see.",
    image: resumeImg,
    alt: "Resume building and profile review",
    theme: "orange",
    Icon: FileText,
  },
  {
    id: "interview",
    title: "Interview Preparation",
    description:
      "Gain confidence with mock interviews, technical problem-solving, and HR round strategies.",
    image: interviewImg,
    alt: "Interview preparation and group collaboration",
    theme: "teal",
    Icon: MessageSquare,
  },
  {
    id: "linkedin",
    title: "LinkedIn Optimization",
    description:
      "Build a professional profile that ranks higher in recruiter searches and attracts the right connections.",
    image: linkedinImg,
    alt: "LinkedIn optimization for career growth",
    theme: "blue",
    Icon: LinkedInIcon,
  },
  {
    id: "portfolio",
    title: "Project Portfolio Support",
    description:
      "Develop and showcase practical projects that prove your real-world problem-solving abilities.",
    image: portfolioImg,
    alt: "Project portfolio support and checklist",
    theme: "orange",
    Icon: FolderKanban,
  },
  {
    id: "placement",
    title: "Placement & Offer Support",
    description:
      "Navigate placement drives, interview rounds, and salary negotiations with dedicated mentor guidance.",
    image: placementImg,
    alt: "Placement and job offer support",
    theme: "teal",
    Icon: Award,
  },
];

/* =========================================================
   SESSION 2: COMPONENT LOGIC & SCROLL ANIMATION
========================================================= */

const EverythingYouNeed = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = section.querySelectorAll(".eynh-card");
    if (!cards.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("eynh-card-pop");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px 20px 0px",
      }
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="everything-you-need" ref={sectionRef} className="eynh-section">
      {/* AMBIENT BACKGROUND GLOW MATCHING HERO */}
      <div className="eynh-ambient-glow-top" />
      <div className="eynh-ambient-glow-bottom" />

      <div className="eynh-container">
        {/* ===================================================
            SESSION 3: SECTION HEADER
        =================================================== */}
        <div className="eynh-header">
          <h2 className="eynh-title">
            <strong>Everything You Need to Get Hired</strong>
          </h2>
        </div>

        {/* ===================================================
            SESSION 4: CARDS LIST (ANIMATED POP STACK)
        =================================================== */}
        <div className="eynh-cards-stack">
          {SERVICES_CARDS.map((card) => {
            const Icon = card.Icon;

            return (
              <div
                key={card.id}
                className={`eynh-card eynh-card-${card.theme}`}
              >
                {/* IMAGE BANNER WITH TOP ACCENT BORDER */}
                <div className="eynh-image-wrapper">
                  <img
                    src={card.image}
                    alt={card.alt}
                    className="eynh-card-image"
                    loading="lazy"
                  />
                </div>

                {/* CONTENT AREA WITH OVERLAPPING BADGE */}
                <div className="eynh-content">
                  {/* FLOATING CIRCULAR ICON BADGE */}
                  <div
                    className={`eynh-badge-icon eynh-badge-icon-${card.theme}`}
                  >
                    <Icon size={22} strokeWidth={2.2} />
                  </div>

                  {/* TITLE & DESCRIPTION */}
                  <h3 className="eynh-card-title">{card.title}</h3>
                  <p className="eynh-card-desc">{card.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EverythingYouNeed;
