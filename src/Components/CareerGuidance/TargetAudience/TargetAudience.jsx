import React, { useEffect, useRef, useState } from "react";
import {
  GraduationCap,
  Briefcase,
  RefreshCw,
  Award,
} from "lucide-react";
import "./TargetAudience.css";

/* =========================================================
   SESSION 1: AUDIENCE PROFILES DATA
========================================================= */

const AUDIENCE_PROFILES = [
  {
    id: "students",
    indexNum: 1,
    title: "College Students",
    subtitle: "2nd, 3rd & Final Year Undergrads",
    description:
      "Get ahead of campus placements with an industry-vetted tech stack, real-world portfolio projects, and structured coding practice.",
    colorTheme: "blue",
    Icon: GraduationCap,
    benefits: ["Targeted campus drive roadmap", "Resume without empty fillers", "GitHub project showcase"],
  },
  {
    id: "graduates",
    indexNum: 2,
    title: "Recent Graduates",
    subtitle: "Freshers seeking First Tech Role",
    description:
      "Bridge the disconnect between college theory and actual software engineering expectations. Learn what modern hiring teams test for.",
    colorTheme: "teal",
    Icon: Award,
    benefits: ["Fix resume rejections", "High-frequency interview prep", "Off-campus referral tactics"],
  },
  {
    id: "switchers",
    indexNum: 3,
    title: "Career Switchers",
    subtitle: "Non-IT & Different Domains",
    description:
      "Pivot into high-growth software, cloud, or data roles smoothly without wasting months on disorganized YouTube tutorials.",
    colorTheme: "orange",
    Icon: RefreshCw,
    benefits: ["Zero-to-hirable transition path", "Translate prior experience", "Dedicated mentor checks"],
  },
  {
    id: "professionals",
    indexNum: 4,
    title: "Working Professionals",
    subtitle: "Early & Mid-Level Techies",
    description:
      "Break through career stagnation, level up from service to product companies, or prepare for senior engineering roles.",
    colorTheme: "purple",
    Icon: Briefcase,
    benefits: ["System design & advanced concepts", "Salary negotiation strategies", "Confidential 1:1 guidance"],
  },
];

/* =========================================================
   SESSION 2: COMPONENT LOGIC
========================================================= */

const TargetAudience = () => {
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
      id="target-audience"
      ref={sectionRef}
      className={`cgaud-section ${isVisible ? "cgaud-section-visible" : ""}`}
    >
      <div className="cgaud-container">
        {/* =================================================
            SESSION 3: SECTION HEADER
        ================================================= */}
        <div className="cgaud-header">
          <span className="cgaud-badge">TARGET AUDIENCE</span>
          <h2 className="cgaud-title">
            Who is This <span className="cgaud-highlight">Mentorship</span> For?
          </h2>
          <p className="cgaud-subtitle">
            Whether you are starting from campus or looking to upgrade your tech
            career, our 1:1 guidance is tailored to your unique inflection point.
          </p>
        </div>

        {/* =================================================
            SESSION 4: 4-COLUMN AUDIENCE CARDS
        ================================================= */}
        <div className="cgaud-grid">
          {AUDIENCE_PROFILES.map((profile) => {
            const Icon = profile.Icon;

            return (
              <article
                key={profile.id}
                className={`cgaud-card cgaud-card-${profile.indexNum} cgaud-card-${profile.colorTheme}`}
              >
                {/* ICON BADGE */}
                <div
                  className={`cgaud-icon-wrapper cgaud-icon-${profile.colorTheme}`}
                >
                  <Icon size={26} strokeWidth={2} />
                </div>

                {/* TITLES */}
                <div className="cgaud-meta">
                  <span className="cgaud-card-subtitle">
                    {profile.subtitle}
                  </span>
                  <h3 className="cgaud-card-title">{profile.title}</h3>
                </div>

                {/* DESCRIPTION */}
                <p className="cgaud-card-desc">{profile.description}</p>

                {/* BULLET HIGHLIGHTS */}
                <ul className="cgaud-points-list">
                  {profile.benefits.map((benefit, i) => (
                    <li key={i} className="cgaud-point-item">
                      <span className="cgaud-point-bullet">•</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TargetAudience;
