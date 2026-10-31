import CinematicHero, { HeroTerminal } from "../../../Common/CinematicHero/CinematicHero.jsx";
import { heroPhotos } from "../../../Common/HeroPhotoStack/heroPhotos.js";
import classroomPhoto from "../../../../assets/About/Achievements/Achievements_6.webp";

/* =============================================================================
   COURSES HERO — the shared cinematic hero with the typing terminal.
   The steps follow how the courses run: concepts, then code, then a project.
   Photo: src/assets/Heroes/courses/backdrop.* (see its README).
   ============================================================================= */

const HERO = heroPhotos("courses", { backdrop: classroomPhoto });

const TERMINAL = [
  { kind: "cmd", text: "projenius learn --track \"full stack\"" },
  { kind: "info", text: "starting with the concepts..." },
  { kind: "ok", text: "fundamentals understood" },
  { kind: "ok", text: "code written, step by step" },
  { kind: "ok", text: "real project built" },
  { kind: "ok", text: "portfolio ready to show" },
  { kind: "done", text: "career ready" },
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
      aside={<HeroTerminal file="learn.sh" label="How a ProJenius course works" lines={TERMINAL} />}
      band={["Artificial Intelligence", "Full Stack Development", "Data Science", "Real Projects", "Career Ready", "Modern Technologies"]}
      className="pjc-hero"
    />
  );
}
