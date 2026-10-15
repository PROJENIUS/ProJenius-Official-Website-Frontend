import React from "react";
import "./LookingForAnswer.css";

/* =========================================================
   SESSION 1: COMPONENT
========================================================= */

const LookingForAnswer = () => {
  return (
    <section id="looking-for-answer" className="lfa-section">
      <div className="lfa-ambient-glow" aria-hidden="true"></div>
      <div className="lfa-container">
        {/* ===================================================
            SESSION 2: TITLE & DESCRIPTION
        =================================================== */}
        <h2 className="lfa-title">Looking for Answers?</h2>
        <p className="lfa-subtitle">
          Before booking a call, please check our comprehensive FAQ section. You
          might find the solution instantly!
        </p>

        {/* ===================================================
            SESSION 3: ACTION BUTTON
        =================================================== */}
        <div className="lfa-action">
          <a href="#faq" className="lfa-btn">
            Visit Our FAQ
          </a>
        </div>
      </div>
    </section>
  );
};

export default LookingForAnswer;
