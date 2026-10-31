import CinematicHero from "../../../Common/CinematicHero/CinematicHero.jsx";
import { heroPhotos } from "../../../Common/HeroPhotoStack/heroPhotos.js";
import sessionPhoto from "../../../../assets/About/Achievements/Achievements_5.webp";

/* =========================================================
   CAREER GUIDANCE HERO — the shared cinematic hero.
   Photo: src/assets/Heroes/career-guidance/backdrop.* (see
   its README); a real campus-session photo is used until
   one is added there.
========================================================= */

const HERO = heroPhotos("career-guidance", { backdrop: sessionPhoto });

export default function CareerGuidanceHero() {
  return (
    <CinematicHero
      id="cghero-title"
      eyebrow="Career Guidance"
      title="Build Your Technology Career"
      accent="With a Clear Roadmap"
      description="Get practical guidance, skill recommendations and career preparation to move confidently toward your technology career."
      primary={{ label: "Book a Mentoring Call", to: "#book-call" }}
      secondary={{ label: "See How It Works", to: "#guidance-process" }}
      photo={HERO.backdrop}
      facts={[
        { label: "Start with", title: "A 1:1 mentor call", text: "30 minutes, just you", to: "#book-call" },
        { label: "You leave with", title: "A clear roadmap", chips: ["Skill gaps", "Resume", "Interview prep"] },
      ]}
      band={["Profile Review", "Goal Discussion", "Skill Gap Analysis", "Roadmap Creation", "Resume & Prep", "Placement Support"]}
      className="cghero-section"
    />
  );
}
