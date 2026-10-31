import CinematicHero, { HeroTerminal } from "../../Common/CinematicHero/CinematicHero.jsx";
import { heroPhotos } from "../../Common/HeroPhotoStack/heroPhotos.js";
import recognitionEvent from "../../../assets/Home/HeroSlides/hero-slide-5.webp";

/* =============================================================================
   STARTUP & INNOVATION HERO — the shared cinematic hero with the typing
   terminal. The steps follow the page's idea journey.
   Photo: src/assets/Heroes/startup/backdrop.* (see its README).
   ============================================================================= */

const HERO = heroPhotos("startup", { backdrop: recognitionEvent });

const TERMINAL = [
  { kind: "cmd", text: "projenius start --idea \"your product\"" },
  { kind: "info", text: "clarifying the problem..." },
  { kind: "ok", text: "idea validated" },
  { kind: "ok", text: "technical feasibility checked" },
  { kind: "ok", text: "prototype and MVP built" },
  { kind: "ok", text: "IP and registration options reviewed" },
  { kind: "done", text: "ready to grow" },
];

export default function StartupSupporterHero() {
  return (
    <CinematicHero
      id="startup-hero-title"
      eyebrow="Startup & Innovation"
      title="From an Idea"
      accent="to a Working Product"
      description="For founders, students and innovators with a product idea: we help clarify the problem, check what is feasible and build the prototype or MVP across software, electronics and product design."
      primary={{ label: "Submit Your Idea", to: "#submit-idea" }}
      secondary={{ label: "See What Happens Next", to: "#idea-journey" }}
      photo={HERO.backdrop}
      aside={<HeroTerminal file="idea.sh" label="How an idea becomes a product" lines={TERMINAL} />}
      band={["Idea Validation", "Technical Feasibility", "Prototype & MVP", "IP & Patents", "Registration", "Ongoing Support"]}
      className="pjsi-hero"
    />
  );
}
