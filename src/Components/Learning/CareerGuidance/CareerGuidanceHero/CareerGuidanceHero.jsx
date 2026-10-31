import CinematicHero from "../../../Common/CinematicHero/CinematicHero.jsx";
import { HeroSteps } from "../../../Common/CinematicHero/HeroPanels.jsx";
import { heroPhotos } from "../../../Common/HeroPhotoStack/heroPhotos.js";
import { whatsappHref } from "../../../../utils/whatsapp.js";
import sessionPhoto from "../../../../assets/About/Achievements/Achievements_5.webp";

/* =========================================================
   CAREER GUIDANCE HERO — the shared cinematic hero with the
   guidance steps lighting up in turn (the same steps and
   wording as GuidanceProcess). Photo: src/assets/Heroes/
   career-guidance/backdrop.* (see its README).
========================================================= */

const HERO = heroPhotos("career-guidance", { backdrop: sessionPhoto });

const STEPS = [
  { title: "Profile Review", text: "We evaluate your current background and skills." },
  { title: "Goal Discussion", text: "We align your interests with real industry roles." },
  { title: "Skill Gap Analysis", text: "We flag exactly what's missing for your target job." },
  { title: "Roadmap Creation", text: "You receive a clear, actionable learning timeline." },
  { title: "Resume & Prep", text: "We refine your materials and practice interviews." },
  { title: "Placement Support", text: "We guide you through applications and hiring." },
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
      aside={<HeroSteps label="How it works" steps={STEPS} />}
      band={["Profile Review", "Goal Discussion", "Skill Gap Analysis", "Roadmap Creation", "Resume & Prep", "Placement Support"]}
      className="cghero-section"
    />
  );
}
