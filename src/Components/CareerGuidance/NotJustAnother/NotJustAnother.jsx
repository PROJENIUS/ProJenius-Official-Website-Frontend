import React from "react";
import {
  Target,
  MessageSquare,
  CalendarCheck,
  FileText,
  Briefcase,
  Headphones,
  CheckCircle2,
  X,
  MinusCircle,
} from "lucide-react";
import "./NotJustAnother.css";

/* =========================================================
   SESSION 1: COMPARISON FEATURES DATA
========================================================= */

const COMPARISON_ROWS = [
  {
    id: "personalized",
    title: "Personalized to your background",
    Icon: Target,
    youtube: "no",
    generic: "no",
    projenius: "yes",
  },
  {
    id: "feedback",
    title: "Live human feedback",
    Icon: MessageSquare,
    youtube: "no",
    generic: "no",
    projenius: "yes",
  },
  {
    id: "accountability",
    title: "Accountability & deadlines",
    Icon: CalendarCheck,
    youtube: "partial",
    generic: "no",
    projenius: "yes",
  },
  {
    id: "resume-review",
    title: "Resume reviewed by a real person",
    Icon: FileText,
    youtube: "no",
    generic: "no",
    projenius: "yes",
  },
  {
    id: "placement-support",
    title: "Direct placement support",
    Icon: Briefcase,
    youtube: "no",
    generic: "no",
    projenius: "yes",
  },
  {
    id: "mentor-access",
    title: "Access to a mentor for questions",
    Icon: Headphones,
    youtube: "no",
    generic: "partial",
    projenius: "yes",
  },
];

/* =========================================================
   SESSION 2: COMPONENT LOGIC & ICON RENDERER
========================================================= */

const NotJustAnother = () => {
  const renderStatus = (status) => {
    if (status === "yes") {
      return (
        <span className="njac-status-yes" aria-label="Included">
          <CheckCircle2 size={22} className="njac-icon-yes" />
        </span>
      );
    }
    if (status === "partial") {
      return (
        <span className="njac-status-partial" aria-label="Partial support">
          <MinusCircle size={20} className="njac-icon-partial" />
        </span>
      );
    }
    return (
      <span className="njac-status-no" aria-label="Not included">
        <X size={18} className="njac-icon-no" />
      </span>
    );
  };

  return (
    <section id="not-just-another" className="njac-section">
      {/* AMBIENT GLOW EFFECTS */}
      <div className="njac-ambient-glow" />

      <div className="njac-container">
        {/* ===================================================
            SESSION 3: SECTION HEADER
        =================================================== */}
        <div className="njac-header">
          <span className="njac-badge">WHY PROJENIUS</span>
          <h2 className="njac-title">Not Just Another Online Course</h2>
        </div>

        {/* ===================================================
            SESSION 4: COMPARISON TABLE
        =================================================== */}
        <div className="njac-table-wrapper">
          <div className="njac-table-card">
            {/* TABLE HEADER */}
            <div className="njac-table-row njac-header-row">
              <div className="njac-col-feature njac-header-cell">
                <span>Feature</span>
              </div>
              <div className="njac-col-comp njac-header-cell">
                <span>Self-Study (YouTube)</span>
              </div>
              <div className="njac-col-comp njac-header-cell">
                <span>Generic Online Courses</span>
              </div>
              <div className="njac-col-pro njac-header-cell njac-pro-header">
                {/* RECOMMENDED BADGE */}
                <div className="njac-recommended-badge">
                  <span>RECOMMENDED</span>
                </div>
                <span className="njac-pro-title">ProJenius Mentorship</span>
              </div>
            </div>

            {/* TABLE BODY (6 COMPARISON ROWS) */}
            <div className="njac-table-body">
              {COMPARISON_ROWS.map((row) => {
                const Icon = row.Icon;

                return (
                  <div key={row.id} className="njac-table-row njac-body-row">
                    {/* FEATURE NAME & ICON */}
                    <div className="njac-col-feature njac-body-cell">
                      <div className="njac-feature-content">
                        <Icon size={18} className="njac-feature-icon" />
                        <span className="njac-feature-text">{row.title}</span>
                      </div>
                    </div>

                    {/* SELF-STUDY (YOUTUBE) */}
                    <div className="njac-col-comp njac-body-cell">
                      {renderStatus(row.youtube)}
                    </div>

                    {/* GENERIC ONLINE COURSES */}
                    <div className="njac-col-comp njac-body-cell">
                      {renderStatus(row.generic)}
                    </div>

                    {/* PROJENIUS MENTORSHIP (GOLD COLUMN) */}
                    <div className="njac-col-pro njac-body-cell njac-pro-cell">
                      {renderStatus(row.projenius)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ===================================================
                SESSION 5: WINNER SUMMARY FOOTER
            =================================================== */}
            <div className="njac-table-footer">
              <span className="njac-footer-lead">
                ProJenius wins on every category
              </span>
              <span className="njac-footer-score">✓ 6/6 categories</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotJustAnother;
