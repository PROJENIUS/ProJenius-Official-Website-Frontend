import CinematicHero from "../../../Common/CinematicHero/CinematicHero.jsx";
import { HeroPhone } from "../../../Common/CinematicHero/HeroPanels.jsx";
import { heroPhotos } from "../../../Common/HeroPhotoStack/heroPhotos.js";
import classroomPhoto from "../../../../assets/About/Achievements/Achievements_6.webp";

/* =============================================================================
   COURSES HERO — the shared cinematic hero with a phone showing an example
   learning path (concepts, then code, then a project). The course data in
   the code is still placeholder text, so no course names are shown here.
   Photo: src/assets/Heroes/courses/backdrop.* (see its README).
   ============================================================================= */

const HERO = heroPhotos("courses", { backdrop: classroomPhoto });

const PATH = [
  { title: "Fundamentals", meta: "Module 1 · Concepts", progress: 100 },
  { title: "Hands-on practice", meta: "Module 2 · Code", progress: 60 },
  { title: "Real project", meta: "Module 3 · Build", progress: 20 },
  { title: "Portfolio review", meta: "Final step", progress: 0 },
  { title: "Career ready", meta: "Show what you built" },
];

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
      aside={<HeroPhone kicker="Example" title="Your learning path" cards={PATH} note="Example learning path" />}
      band={["Modern Technologies", "Practical Courses", "Real Projects", "Students", "Professionals", "Career Ready"]}
      className="pjc-hero"
    />
  );
}
