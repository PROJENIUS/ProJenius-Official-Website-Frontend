import CinematicHero, { HeroLinks } from "../../../Common/CinematicHero/CinematicHero.jsx";
import { heroPhotos } from "../../../Common/HeroPhotoStack/heroPhotos.js";
import { whatsappHref } from "../../../../utils/whatsapp.js";
import sessionPhoto from "../../../../assets/About/Achievements/Achievements_5.webp";

/* =========================================================
   CAREER GUIDANCE HERO — the shared cinematic hero with "On
   this page" links. Photo: src/assets/Heroes/career-guidance/
   backdrop.* (see its README).
========================================================= */

const HERO = heroPhotos("career-guidance", { backdrop: sessionPhoto });

const PAGE_LINKS = [
  { label: "Who it's for", to: "#target-audience" },
  { label: "What you get", to: "#not-just-advice" },
  { label: "How it works", to: "#guidance-process" },
  { label: "Questions", to: "#cgfaq-faq" },
];

export default function CareerGuidanceHero() {
  return (
    <CinematicHero
      id="cghero-title"
      eyebrow="Career Guidance"
      title="Build Your Technology Career"
      accent="With a Clear Roadmap"
      description="Get practical guidance, skill recommendations and career preparation to move confidently toward your technology career."
      primary={{ label: "Book a Mentoring Call", to: "#book-call" }}
      secondary={{ label: "Ask on WhatsApp", to: whatsappHref("Hi ProJenius, I have a question about career guidance.") }}
      photo={HERO.backdrop}
      aside={<HeroLinks items={PAGE_LINKS} />}
      band={["Profile Review", "Goal Discussion", "Skill Gap Analysis", "Roadmap Creation", "Resume & Prep", "Placement Support"]}
      className="cghero-section"
    />
  );
}
