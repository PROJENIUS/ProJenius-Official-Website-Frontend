import React from "react";
import "./BringAProJeniusWorkshopToYourCampus.css";

const offerings = [
  "Customized topics",
  "Department-specific workshops",
  "Hands-on activities",
  "Technical bootcamps",
  "Innovation programs",
  "Project-based sessions",
  "Student development programs",
  "Technology-focused events",
];

const audiences = [
  "Colleges",
  "Departments",
  "Faculty",
  "Innovation clubs",
  "Technical clubs",
  "Institutions",
];

export default function BringAProJeniusWorkshopToYourCampus() {
  return (
    <section className="bpw-section">
      <div className="bpw-container">
        <div className="bpw-left">
          <h2 className="bpw-title">Bring a ProJenius Workshop to Your Campus</h2>
          <p className="bpw-description">
            Whether you are planning a department-level session, technical club
            activity, bootcamp, or institution-wide program, we can structure
            the workshop around your requirements.
          </p>
          <div className="bpw-actions">
            <a href="#plan-workshop" className="bpw-btn bpw-btn-primary">
              Plan a Workshop With Us
            </a>
            <a href="#contact" className="bpw-btn bpw-btn-outline">
              Contact ProJenius
            </a>
          </div>
        </div>

        <div className="bpw-right">
          <ul className="bpw-grid">
            {offerings.map((item) => (
              <li className="bpw-item" key={item}>
                <span className="bpw-bullet" aria-hidden="true" />
                <span className="bpw-item-text">{item}</span>
              </li>
            ))}
          </ul>

          <div className="bpw-made-for">
            <h3 className="bpw-made-for-title">Made for</h3>
            <div className="bpw-tags">
              {audiences.map((tag) => (
                <span className="bpw-tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}