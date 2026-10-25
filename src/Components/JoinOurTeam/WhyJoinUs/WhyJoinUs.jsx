import { GraduationCap, Layers, Rocket, Users } from "lucide-react";

import TypedPhrase from "../../Common/TypedPhrase/TypedPhrase.jsx";
import "./WhyJoinUs.css";

/* =============================================================================
   JOIN OUR TEAM — WHY JOIN US
   White section after the navy hero: four equal cards, each with its own
   accent colour. Icons turn 180° on hover and back on leave.
   ============================================================================= */

const REASONS = [
  {
    title: "Work on Real Projects",
    text: "Client software, IoT systems and our own products, not practice tasks.",
    Icon: Rocket,
  },
  {
    title: "Learn Across Technologies",
    text: "Software, electronics, 3D printing and AI are built under one roof.",
    Icon: Layers,
  },
  {
    title: "Grow With Guidance",
    text: "Work alongside engineers and trainers who review your work and help you improve.",
    Icon: Users,
  },
  {
    title: "Share What You Know",
    text: "Help students learn through our workshops, courses and internships.",
    Icon: GraduationCap,
  },
];

export default function WhyJoinUs() {
  return (
    <section className="pjj-why" aria-labelledby="pjj-why-title">
      <div className="pjds-container">
        <header className="pjj-why__head">
          <p className="pjds-eyebrow" data-reveal="up">Why ProJenius</p>
          <h2 id="pjj-why-title" className="pjj-why__title" data-reveal="up" data-reveal-delay="1">
            <span className="pjj-why__title-static">A Place to Learn,</span>
            <TypedPhrase phrases={["Build and Grow", "Ship Real Work", "Lead New Ideas"]} />
          </h2>
          <p className="pjj-why__intro" data-reveal="up" data-reveal-delay="2">
            Every role at ProJenius touches real work: products, client projects and the students we train.
          </p>
        </header>

        <ul className="pjj-why__grid">
          {REASONS.map(({ title, text, Icon }, index) => (
            <li
              key={title}
              className={`pjj-why__card pjj-why__card--${index + 1}`}
              data-reveal="up"
              data-reveal-delay={String(index + 1)}
            >
              <span className="pjj-why__icon" aria-hidden="true">
                <Icon size={26} strokeWidth={1.9} />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
