import CinematicHero from "../../Common/CinematicHero/CinematicHero.jsx";
import { heroPhotos } from "../../Common/HeroPhotoStack/heroPhotos.js";
import recognitionEvent from "../../../assets/Home/HeroSlides/hero-slide-5.webp";

/* =============================================================================
   STARTUP & INNOVATION HERO — the shared cinematic hero.
   Photo: src/assets/Heroes/startup/backdrop.* (see its README); the real
   event photo below is used until one is added there.
   ============================================================================= */

const HERO = heroPhotos("startup", { backdrop: recognitionEvent });

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
      facts={[
        { label: "The journey", title: "Idea, validate, build, protect, grow", to: "#idea-journey" },
        { label: "Who it's for", title: "Founders, students and innovators", chips: ["Prototype", "MVP"] },
      ]}
      band={["Idea Validation", "Technical Feasibility", "Prototype & MVP", "IP & Patents", "Registration", "Ongoing Support"]}
      className="pjsi-hero"
    />
  );
}
