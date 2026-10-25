import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import coursesImage from "../../../assets/Home/Optimized/training-courses-737.webp";
import internshipsImage from "../../../assets/Home/Optimized/training-internships-739.webp";
import workshopsImage from "../../../assets/About/Achievements/Achievements_5.webp";
import careerImage from "../../../assets/career-guidance/everything-you-need/everything-you-need2.jpg";
import "./B3Learn.css";

/* =============================================================================
   HOME V3 — LEARNING
   Four photo panels (the homepage training photos and the SRM session
   photo from the About page). On wide screens the
   hovered or focused panel widens and shows its line of text; on phones they
   stack. Each panel is a link to its real page.
   ============================================================================= */

const PANELS = [
  {
    to: "/services/courses",
    title: "Courses",
    text: "Practical courses built around real projects.",
    image: coursesImage,
    alt: "Learners building practical skills at shared workstations",
  },
  {
    to: "/services/internship",
    title: "Internships",
    text: "Work on real builds alongside mentors.",
    image: internshipsImage,
    alt: "Interns and mentors working with robotics and electronics",
  },
  {
    to: "/workshop",
    title: "Workshops",
    text: "Hands-on sessions on IoT, programming and more.",
    image: workshopsImage,
    alt: "ProJenius session at SRM Institute of Science and Technology, Chennai",
  },
  {
    to: "/services/career-guidance",
    title: "Career Guidance",
    text: "Plan the next step with people who build.",
    image: careerImage,
    alt: "Learners receiving guidance for their technology careers",
  },
];

export default function B3Learn() {
  return (
    <section className="b3l" aria-labelledby="b3l-title">
      <div className="b3-wrap">
        <p className="b3-label" data-reveal="up"><b>04</b> / Learning</p>
        <h2 id="b3l-title" className="b3-h2" data-reveal="up" data-reveal-delay="1">
          We also build <span className="b3-lit">engineers.</span>
        </h2>
        <p className="b3-lead" data-reveal="up" data-reveal-delay="1">
          Courses, internships, workshops and career guidance, taught by the same team that builds the products.
        </p>

        <ul className="b3l__panels" data-reveal="up" data-reveal-delay="2">
          {PANELS.map((panel, index) => (
            <li key={panel.to + panel.title} className="b3l__panel">
              <Link className="b3l__link" to={panel.to}>
                <img src={panel.image} alt={panel.alt} loading="lazy" decoding="async" />
                <span className="b3l__shade" aria-hidden="true" />
                <span className="b3l__num" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <span className="b3l__copy">
                  <span className="b3l__title">
                    {panel.title} <ArrowUpRight size={20} strokeWidth={2.2} aria-hidden="true" />
                  </span>
                  <span className="b3l__text">{panel.text}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
