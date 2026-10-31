import CinematicHero, { HeroLinks } from "../../../Common/CinematicHero/CinematicHero.jsx";
import { heroPhotos } from "../../../Common/HeroPhotoStack/heroPhotos.js";
import { whatsappHref } from "../../../../utils/whatsapp.js";
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
  { label: "How we plan a workshop", to: "#workshop-process" },
  { label: "Workshop gallery", to: "#wg-title" },
  { label: "Questions institutions ask", to: "#qia-faq" },
];

export default function WorkshopHero() {
  return (
    <CinematicHero
      id="wh-hero-title"
      eyebrow="Workshops & Training"
      title="Workshops That Go"
      accent="Beyond the Classroom"
      description="Hands-on technology workshops designed to help students explore, experiment, build, and experience emerging technologies through practical learning."
      primary={{ label: "Host a Workshop", to: "/contact?type=workshop" }}
      secondary={{ label: "Ask on WhatsApp", to: whatsappHref("Hi ProJenius, I would like to know about hosting a workshop at our institution.") }}
      photo={HERO.backdrop}
      aside={<HeroLinks items={PAGE_LINKS} />}
      band={["AI & Machine Learning", "IoT & Smart Systems", "Robotics & Automation", "Software & Development", "Electronics & PCB", "Rapid Prototyping"]}
      className="wh-hero"
    />
  );
}
