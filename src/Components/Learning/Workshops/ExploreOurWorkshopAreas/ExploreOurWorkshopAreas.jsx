import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";

import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import { whatsappHref } from "../../../../utils/whatsapp.js";
import "./ExploreOurWorkshopAreas.css";

const CUSTOM_WORKSHOP_MESSAGE =
  "Hi ProJenius, we would like to plan a customized workshop for our students. Could you please share the details?";

/* 24x24 stroke icons */
const icons = {
  cpu: (<><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2" /></>),
  wifi: (<><path d="M12 20h.01" /><path d="M2 8.82a15 15 0 0 1 20 0" /><path d="M5 12.859a10 10 0 0 1 14 0" /><path d="M8.5 16.429a5 5 0 0 1 7 0" /></>),
  bot: (<><path d="M12 8V4H8" /><rect x="4" y="8" width="16" height="12" rx="2" /><path d="M2 14h2M20 14h2M15 13v2M9 13v2" /></>),
  code: (<><path d="m16 18 6-6-6-6" /><path d="m8 6-6 6 6 6" /></>),
  board: (<><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M11 9h4a2 2 0 0 0 2-2V3" /><circle cx="9" cy="9" r="2" /><path d="M7 21v-4a2 2 0 0 1 2-2h4" /><circle cx="15" cy="15" r="2" /></>),
  box: (<><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5M12 22V12" /></>),
  rocket: (<><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></>),
  spark: (<path d="M12 2v4M16.2 7.8l2.9-2.9M18 12h4M16.2 16.2l2.9 2.9M12 18v4M4.9 19.1l2.9-2.9M2 12h4M4.9 4.9l2.9 2.9" />),
};

/* Row 1: three equal cards. Row 2: narrow-mid-wide. Row 3: half-half. */
const rows = [
  {
    cls: "ew-row-1",
    cards: [
      { icon: "cpu", title: "AI & Machine Learning",
        topics: ["Artificial Intelligence", "Generative AI", "Machine Learning", "Practical AI Applications", "Computer Vision"] },
      { icon: "wifi", title: "IoT & Smart Systems",
        topics: ["IoT fundamentals", "ESP32", "Sensors", "Connected devices", "Smart systems"] },
      { icon: "bot", title: "Robotics & Automation",
        topics: ["Robotics fundamentals", "Sensors and actuators", "Robot building", "Automation", "Robot control"] },
    ],
  },
  {
    cls: "ew-row-2",
    cards: [
      { icon: "code", title: "Software & Development",
        topics: ["Web development", "Application development", "Python", "AI-powered applications", "Software projects"] },
      { icon: "board", title: "Electronics & PCB",
        topics: ["Electronics fundamentals", "Circuit building", "PCB design", "Embedded systems", "Hardware integration"] },
      { icon: "box", title: "Product & Rapid Prototyping", twoCol: true,
        topics: ["3D printing", "MVP concepts", "Product design", "Hardware integration", "Rapid prototyping"] },
    ],
  },
  {
    cls: "ew-row-3",
    cards: [
      { icon: "rocket", title: "Innovation & Startup", twoCol: true,
        topics: ["Problem identification", "MVP thinking", "Ideation", "Innovation", "Design thinking"] },
      { icon: "spark", title: "Emerging Technologies", soft: true,
        text: "Customized workshops built around the technologies your students or institution want to explore right now." },
    ],
  },
];

export default function Exploreourworkshoparea() {
  return (
    <section id="workshop-areas" className="ew-section">
      <div className="ew-container">
        <header className="ew-head">
          <p className="pjds-eyebrow pjds-eyebrow--on-dark" data-reveal="up">Workshop Areas</p>
          <h2 data-reveal="up" data-reveal-delay="1">
            <span className="ew-head-static">Explore Our</span>
            <TypedPhrase tone="dark" phrases={["Workshop Areas", "Technology Topics", "Hands-On Sessions"]} />
          </h2>
          <p data-reveal="up" data-reveal-delay="2">Pick a technology area your students want to explore. Every workshop is hands-on.</p>
        </header>

        {rows.map((row) => (
          <div key={row.cls} className={`ew-row ${row.cls}`} data-reveal="up" data-reveal-delay="1">
            {row.cards.map((c) => (
              <article key={c.title} className={`ew-card ${c.soft ? "is-soft" : ""}`}>
                <span className="ew-icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">{icons[c.icon]}</svg>
                </span>
                <h3>{c.title}</h3>

                {c.topics ? (
                  <>
                    <span className="ew-sub">Topics may include</span>
                    <ul className={`ew-topics ${c.twoCol ? "is-two" : ""}`}>
                      {c.topics.map((t) => <li key={t}>{t}</li>)}
                    </ul>
                  </>
                ) : (
                  <p className="ew-text">{c.text}</p>
                )}

                <Link to="/contact?type=workshop" className="ew-link">Request this workshop</Link>
              </article>
            ))}
          </div>
        ))}

        {/* Call to action: shape a workshop that is not listed. */}
        <div className="ew-cta" data-reveal="up" data-reveal-delay="1">
          <span className="ew-cta-icon" aria-hidden="true"><Sparkles size={26} strokeWidth={1.8} /></span>
          <div className="ew-cta-copy">
            <h3>These are areas, not fixed syllabi.</h3>
            <p>Tell us what your students want to explore and we will shape the workshop around it.</p>
          </div>
          <div className="ew-cta-actions">
            <Link to="/contact?type=workshop" className="ew-cta-btn ew-cta-btn--primary">
              Request a Customized Workshop <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
            </Link>
            <a href={whatsappHref(CUSTOM_WORKSHOP_MESSAGE)} className="ew-cta-btn ew-cta-btn--whatsapp" target="_blank" rel="noopener noreferrer">
              <MessageCircle size={18} strokeWidth={2.2} aria-hidden="true" /> Chat on WhatsApp
              <span className="pjds-sr-only">(opens WhatsApp in a new tab)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}