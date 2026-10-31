import CinematicHero from "../../../Common/CinematicHero/CinematicHero.jsx";
import { HeroTabs } from "../../../Common/CinematicHero/HeroPanels.jsx";
import { heroPhotos } from "../../../Common/HeroPhotoStack/heroPhotos.js";
import { whatsappHref } from "../../../../utils/whatsapp.js";
import sessionPhoto from "../../../../assets/About/Achievements/Achievements_3.webp";

/* =========================================================
   WORKSHOP HERO — the shared cinematic hero with tabs for
   the four workshop formats (the same formats and wording as
   DesignedAroundYourInstitution). Photo: src/assets/Heroes/
   workshop/backdrop.* (see its README).
========================================================= */

const HERO = heroPhotos("workshop", { backdrop: sessionPhoto });

const FORMATS = [
  { label: "One day", tag: "Single Day", title: "One-Day Workshop", text: "An intensive practical learning experience focused on a specific technology or topic." },
  { label: "Bootcamp", tag: "Multi-Session", title: "Hands-On Bootcamp", text: "A multi-session experience combining learning, practical activities, and project building." },
  { label: "Department", tag: "Per Department", title: "Department Workshop", text: "A customized workshop aligned with a specific academic department or student group." },
  { label: "Institution", tag: "Institution-Wide", title: "Institution / Club Workshop", text: "Technology and innovation sessions designed for technical clubs, innovation clubs, student communities, or institution-wide programs." },
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
      aside={<HeroTabs label="Workshop formats" tabs={FORMATS} idPrefix="wh-format" />}
      band={["AI & Machine Learning", "IoT & Smart Systems", "Robotics & Automation", "Software & Development", "Electronics & PCB", "Rapid Prototyping"]}
      className="wh-hero"
    />
  );
}
