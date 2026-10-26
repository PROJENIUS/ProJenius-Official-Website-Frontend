import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import HeroBackdrop from "../../../Common/HeroPhotoStack/HeroBackdrop.jsx";
import HeroPhotoStack from "../../../Common/HeroPhotoStack/HeroPhotoStack.jsx";
import { heroPhotos } from "../../../Common/HeroPhotoStack/heroPhotos.js";
import classroomPhoto from "../../../../assets/About/Achievements/Achievements_6.webp";
import sessionPhoto from "../../../../assets/About/Achievements/Achievements_3.webp";
import prototypePhoto from "../../../../assets/About/Achievements/Achievements_4.webp";
import "./CoursesHero.css";

/* =============================================================================
   COURSES HERO
   Left: pill, static line + typed line, intro and action. Right: the shared
   rotating photo stack; a classroom photo is faded behind the navy.
   Photos: src/assets/Heroes/courses/ (see its README); the real photos
   below are used until photos are added there.
   ============================================================================= */

const HERO = heroPhotos("courses", {
  backdrop: classroomPhoto,
  cards: [
    { image: classroomPhoto, category: "Classroom", title: "Learning concepts step by step" },
    { image: sessionPhoto, category: "Practice", title: "Hands-on learning sessions" },
    { image: prototypePhoto, category: "Projects", title: "Building real projects" },
  ],
});

export default function CoursesHero() {
  return (
    <section className="pjc-hero" aria-labelledby="pjc-hero-title">
      <HeroBackdrop image={HERO.backdrop} />
      <div className="pjds-container pjc-hero__layout">
        <div className="pjc-hero__copy">
          <p className="pjds-eyebrow pjds-eyebrow--on-dark">Courses &amp; Learning</p>
          <h1 className="pjc-hero__title" id="pjc-hero-title">
            <span className="pjc-hero__title-static">Learn. Build. Grow</span>
            <TypedPhrase tone="dark" phrases={["With Real-World Skills", "With Practical Projects", "Into Your Tech Career"]} />
          </h1>
          <p className="pjc-hero__description">
            Practical courses designed by ProJenius to help students and professionals learn modern technologies, build real projects and become career ready.
          </p>
          <Link className="pjds-btn pjds-btn--primary" to="#course-catalog">
            Explore courses <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <HeroPhotoStack
          items={HERO.cards}
          label="Learning at ProJenius"
          badge={{ title: "Learn by building", text: "Courses by ProJenius" }}
        />
      </div>
    </section>
  );
}
