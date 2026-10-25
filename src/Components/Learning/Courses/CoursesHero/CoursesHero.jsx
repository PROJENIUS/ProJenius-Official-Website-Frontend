import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import trainingImage from "../../../../assets/Home/Optimized/training-courses-737.webp";
import "./CoursesHero.css";

export default function CoursesHero() {
  return (
    <section className="pjc-hero" aria-labelledby="pjc-hero-title">
      <div className="pjds-container pjc-hero__layout">
        <div className="pjc-hero__copy">
          <p className="pjds-eyebrow pjds-eyebrow--on-dark">Courses &amp; Learning</p>
          <h1 className="pjc-hero__title" id="pjc-hero-title">
            Learn. Build. <span>Grow with real-world skills.</span>
          </h1>
          <p className="pjc-hero__description">
            Practical courses designed by ProJenius to help students and professionals learn modern technologies, build real projects and become career ready.
          </p>
          <Link className="pjds-btn pjds-btn--primary" to="#course-catalog">
            Explore courses <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <figure className="pjc-hero__visual">
          <img src={trainingImage} alt="Students learning together through a practical technology project" fetchPriority="high" />
          <figcaption>Practical learning, built around real projects</figcaption>
        </figure>
      </div>
    </section>
  );
}
