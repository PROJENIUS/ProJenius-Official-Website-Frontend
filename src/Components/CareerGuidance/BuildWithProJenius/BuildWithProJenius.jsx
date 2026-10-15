import React from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import "./BuildWithProJenius.css";

/* =========================================================
   SESSION 1: PILLARS CHECKLIST DATA
========================================================= */

const PURPOSE_PILLARS = [
  { id: 1, title: "Resume and profile guidance" },
  { id: 2, title: "Interview preparation" },
  { id: 3, title: "Career roadmaps" },
  { id: 4, title: "Industry direction" },
];

/* =========================================================
   SESSION 2: COMPONENT LOGIC & SCROLL HANDLER
========================================================= */

const BuildWithProJenius = () => {
  const handleScrollToBooking = () => {
    const el = document.getElementById("book-call");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="build-with-projenius" className="bwpj-section">
      <div className="bwpj-container">
        {/* ===================================================
            SESSION 3: LEFT CONTENT & CTA
        =================================================== */}
        <div className="bwpj-left-col">
          <span className="bwpj-badge">BUILT WITH PURPOSE</span>

          <h2 className="bwpj-title">
            Simple, practical and
            <br />
            outcome-focused.
          </h2>

          <p className="bwpj-subtitle">
            Explore what ProJenius can help you build, learn or improve.
          </p>

          <div className="bwpj-action">
            <button
              type="button"
              className="bwpj-btn"
              onClick={handleScrollToBooking}
            >
              <span>Talk to ProJenius</span>
              <ArrowRight size={18} className="bwpj-btn-arrow" />
            </button>
          </div>
        </div>

        {/* ===================================================
            SESSION 4: RIGHT CARD WITH 4 CHECKLIST ITEMS
        =================================================== */}
        <div className="bwpj-right-col">
          <div className="bwpj-checklist-card">
            {PURPOSE_PILLARS.map((pillar) => (
              <div key={pillar.id} className="bwpj-checklist-item">
                <div className="bwpj-check-icon-wrapper">
                  <CheckCircle2 size={20} className="bwpj-check-icon" />
                </div>
                <span className="bwpj-checklist-text">{pillar.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BuildWithProJenius;
