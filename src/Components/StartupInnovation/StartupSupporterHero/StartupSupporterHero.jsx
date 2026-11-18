import CinematicHero from "../../Common/CinematicHero/CinematicHero.jsx";
import { HeroBuilder } from "../../Common/CinematicHero/HeroPanels.jsx";
import { heroPhotos } from "../../Common/HeroPhotoStack/heroPhotos.js";
import recognitionEvent from "../../../assets/Home/HeroSlides/hero-slide-5.webp";

/* =============================================================================
   STARTUP & INNOVATION HERO — the shared cinematic hero with "What does your
   idea need?" switches that show which ProJenius teams would work on it.
   Photo: src/assets/Heroes/startup/backdrop.* (see its README).
   ============================================================================= */

const HERO = heroPhotos("startup", { backdrop: recognitionEvent });

const NEEDS = [
  { label: "A mobile or web app", team: "Software", on: true },
  { label: "An electronic device", team: "Hardware", on: true },
  { label: "AI or automation", team: "AI" },
  { label: "3D-printed parts", team: "Prototyping" },
  { label: "Patent or IP support", team: "IP support" },
];

export default function StartupSupporterHero() {
  return (
    <CinematicHero
      id="startup-hero-title"
      eyebrow="Startup & Innovation"
      title="From an Idea"
      accent={["to One Complete Product", "to a Working Product"]}
      description="Have only an idea? We take it all the way: understanding the problem, connections, field visits, prototyping, PCB and software, until it is one complete product."
      primary={{ label: "Submit Your Idea", to: "#submit-idea" }}
      secondary={{ label: "See the Path", to: "#startup-path" }}
      photo={HERO.backdrop}
      aside={<HeroBuilder title="What does your idea need?" hint="Switch on everything that applies." options={NEEDS} />}
      band={["Problem Understanding", "Networking & Connections", "Field Visits", "Prototyping", "PCB Design", "Software Building", "One Complete Product"]}
      className="pjsi-hero"
    />
  );
}
