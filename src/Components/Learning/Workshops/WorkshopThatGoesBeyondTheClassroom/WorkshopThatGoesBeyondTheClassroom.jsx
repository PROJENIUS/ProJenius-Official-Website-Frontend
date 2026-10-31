import CinematicHero, { HeroLinks } from "../../../Common/CinematicHero/CinematicHero.jsx";
import { heroPhotos } from "../../../Common/HeroPhotoStack/heroPhotos.js";
import sessionPhoto from "../../../../assets/About/Achievements/Achievements_3.webp";

/* =========================================================
   WORKSHOP HERO — the shared cinematic hero with "On this
   page" links. Photo: src/assets/Heroes/workshop/backdrop.*
   (see its README); a real session photo is used until one
   is added there.
========================================================= */

const HERO = heroPhotos("workshop", { backdrop: sessionPhoto });

const PAGE_LINKS = [
  { label: "Workshop areas", to: "#workshop-areas" },
  { label: "Workshop gallery", to: "#wg-title" },
  { label: "Plan a workshop", to: "#hwm-title" },
];

export default function WorkshopHero() {
  return (
    <CinematicHero
      id="wh-hero-title"
      eyebrow="Workshops & Training"
      title="Workshops That Go"
      accent="Beyond the Classroom"
      description="Hands-on technology workshops designed to help students explore, experiment, build, and experience emerging technologies through practical learning."
      primary={{ label: "Explore Workshops", to: "#workshop-areas" }}
      secondary={{ label: "Host a Workshop", to: "/contact?type=workshop" }}
      photo={HERO.backdrop}
      aside={<HeroLinks items={PAGE_LINKS} />}
      band={["AI & Machine Learning", "IoT & Smart Systems", "Robotics & Automation", "Software & Development", "Electronics & PCB", "Rapid Prototyping"]}
      className="wh-hero"
    />
  );
}
