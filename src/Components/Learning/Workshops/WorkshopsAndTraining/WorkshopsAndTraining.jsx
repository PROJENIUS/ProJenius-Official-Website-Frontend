import React from "react";
import "./WorkshopsAndTraining.css";

const dots = [
  { top: "24%", left: "12%", size: 14, delay: "0s" },
  { top: "69%", left: "8%", size: 9, delay: "1.2s" },
  { top: "18%", left: "69.8%", size: 16, delay: "0.6s" },
  { top: "30%", left: "87.7%", size: 18, delay: "1.8s" },
  { top: "71%", left: "81.5%", size: 11, delay: "0.9s" },
];

const circles = [
  { id: 1, label: "Projenius technology", active: true },
  { id: 2, label: "Projenius technology", active: false },
  { id: 3, label: "Projenius technology", active: false },
];

const WorkshopsAndTraining = () => {
  return (
    <section className="wt-hero">
      {/* floating dots */}
      {dots.map((d, i) => (
        <span
          key={i}
          className="wt-dot"
          style={{
            top: d.top,
            left: d.left,
            width: d.size,
            height: d.size,
            animationDelay: d.delay,
          }}
        />
      ))}

      <div className="wt-container">
        {/* left content */}
        <div className="wt-content">
          <h3 className="wt-eyebrow">Workshops &amp; Training</h3>
          <h1 className="wt-title">
            Learn <span className="wt-accent">Build</span>
            <br />
            with Practical Technology
          </h1>
          <p className="wt-subtitle">
            Hands-on workshops designed to help students and professionals
            develop practical technical skills through real-world learning.
          </p>
        </div>

        {/* right circles */}
        <div className="wt-circles">
          {circles.map((c) => (
            <div
              key={c.id}
              className={`wt-circle ${c.active ? "wt-circle--active" : ""}`}
            >
              <span>{c.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* bottom cyan slanted edge */}
      <svg
        className="wt-wave"
        viewBox="0 0 1917 110"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polygon
          fill="#2fd0ff"
          points="0,20 152,55 325,8 1917,78 1917,110 0,110"
        />
        <polygon fill="#ffffff" points="0,37 152,72 325,25 1917,95 1917,110 0,110" />
      </svg>
    </section>
  );
};

export default WorkshopsAndTraining;