import CinematicHero from "../../../Common/CinematicHero/CinematicHero.jsx";
import { heroPhotos } from "../../../Common/HeroPhotoStack/heroPhotos.js";
import classroomPhoto from "../../../../assets/About/Achievements/Achievements_6.webp";

/* =============================================================================
   COURSES HERO — the shared cinematic hero.
   Photo: src/assets/Heroes/courses/backdrop.* (see its README); the real
   classroom photo below is used until one is added there.
   ============================================================================= */

const HERO = heroPhotos("courses", { backdrop: classroomPhoto });

export default function CoursesHero() {
  return (
    <CinematicHero
      id="pjc-hero-title"
      eyebrow="Courses & Learning"
      title="Learn. Build. Grow"
      accent="With Real-World Skills"
      description="Practical courses designed by ProJenius to help students and professionals learn modern technologies, build real projects and become career ready."
      primary={{ label: "Explore Courses", to: "#course-catalog" }}
      photo={HERO.backdrop}
      facts={[
        { label: "Built for", title: "Students and professionals", chips: ["AI", "Full Stack", "Data Science"] },
        { label: "How you learn", title: "Concepts, then code, then a project", to: "#course-catalog" },
      ]}
      band={["Artificial Intelligence", "Full Stack Development", "Data Science", "Real Projects", "Career Ready", "Modern Technologies"]}
      className="pjc-hero"
    />
  );
}
