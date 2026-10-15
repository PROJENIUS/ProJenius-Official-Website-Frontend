import React from "react";
import "./CoursesHero.css";

// positions in % so they scale with the screen
const DOTS = [
  { top: "12%", left: "12%", size: 14 },
  { top: "14%", left: "69%", size: 15 },
  { top: "28%", left: "88%", size: 17 },
  { top: "55%", left: "54%", size: 6, delay: "1s" },
  { top: "68%", left: "8%", size: 10, delay: "2s" },
  { top: "70%", left: "81%", size: 11, delay: "3s" },
];

export default function ProJenius() {
  return (
    <section className="pj-hero">
      {DOTS.map((d, i) => (
        <span
          key={i}
          className="pj-dot"
          style={{
            top: d.top,
            left: d.left,
            width: d.size,
            height: d.size,
            animationDelay: d.delay || "0s",
          }}
        />
      ))}

      <div className="pj-content">
        <div className="pj-text">
          <h3 className="pj-eyebrow">Courses &amp; Learning</h3>
          <h1 className="pj-title">
            Learn <span className="accent">Build</span>
            <br />
            with Real-World Skills
          </h1>
          <p className="pj-sub">
            Practical courses designed by ProJenius to help students and
            professionals learn modern technologies, build real projects and
            become career ready.
          </p>
        </div>

        <div className="pj-orbs">
          <div className="pj-orb lg">Projenius technology</div>
          <div className="pj-orb md">Projenius technology</div>
          <div className="pj-orb md">Projenius technology</div>
        </div>
      </div>

      <svg className="pj-wave" viewBox="0 0 1917 110" preserveAspectRatio="none" aria-hidden="true">
        <polygon fill="#2ec8ff" points="0,14 152,60 325,0 1917,84 1917,110 0,110" />
        <polygon fill="#ffffff" points="0,28 152,65 325,14 1917,98 1917,110 0,110" />
      </svg>
      <div className="pj-strip" />
    </section>
  );
}