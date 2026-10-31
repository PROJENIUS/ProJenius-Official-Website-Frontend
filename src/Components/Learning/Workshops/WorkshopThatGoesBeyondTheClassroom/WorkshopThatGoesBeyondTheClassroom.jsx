import CinematicHero from "../../../Common/CinematicHero/CinematicHero.jsx";
import { heroPhotos } from "../../../Common/HeroPhotoStack/heroPhotos.js";
import sessionPhoto from "../../../../assets/About/Achievements/Achievements_3.webp";

/* =========================================================
   WORKSHOP HERO — the shared cinematic hero.
   Photo: src/assets/Heroes/workshop/backdrop.* (see its
   README); a real session photo is used until one is added.
   Fact cards: who it is for, from the audience notes.
========================================================= */

const HERO = heroPhotos("workshop", { backdrop: sessionPhoto });

export default function WorkshopHero() {
  return (
    <CinematicHero
      id="wh-hero-title"
      eyebrow="Workshops & Training"
      title="Workshops That Go"
      accent="Beyond"
      after="the Classroom"
      description="Hands-on technology workshops designed to help students explore, experiment, build, and experience emerging technologies through practical learning."
      primary={{ label: "Explore Workshops", to: "#workshop-areas" }}
      secondary={{ label: "Host a Workshop", to: "/contact?type=workshop" }}
      photo={HERO.backdrop}
      facts={[
        { label: "For students", title: "Learn a technology, then build something with it", chips: ["AI", "IoT", "Robotics"] },
        { label: "For institutions", title: "A practical session designed around your students", to: "/contact?type=workshop" },
      ]}
      band={["AI & Machine Learning", "IoT & Smart Systems", "Robotics & Automation", "Software & Development", "Electronics & PCB", "Rapid Prototyping"]}
      className="wh-hero"
    />
  );
}
