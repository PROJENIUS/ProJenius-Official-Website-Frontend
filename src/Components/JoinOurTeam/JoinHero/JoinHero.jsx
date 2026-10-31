import CinematicHero, { HeroLinks } from "../../Common/CinematicHero/CinematicHero.jsx";
import { OPENINGS } from "../openings.js";
import { heroPhotos } from "../../Common/HeroPhotoStack/heroPhotos.js";
import labPhoto from "../../../assets/Home/HeroSlides/hero-slide-3.webp";

/* =============================================================================
   JOIN OUR TEAM — HERO (the shared cinematic hero with "On this page" links)
   Photo: src/assets/Heroes/join-our-team/backdrop.* (see its README).
   The "Open roles" link shows the live count from openings.js.
   ============================================================================= */

const HERO = heroPhotos("join-our-team", { backdrop: labPhoto });

const PAGE_LINKS = [
  { label: "Why join us", to: "#pjj-why-title" },
  { label: OPENINGS.length ? `Open roles (${OPENINGS.length})` : "Open roles", to: "#open-roles" },
  { label: "Hiring process", to: "#pjj-process-title" },
  { label: "Apply now", to: "#apply" },
];

export default function JoinHero() {
  return (
    <CinematicHero
      id="pjj-hero-title"
      eyebrow="Careers at ProJenius"
      title="Build the Future"
      accent="With ProJenius"
      description="Join a team that builds software, IoT systems and products, and trains the next generation of engineers. See our open roles and apply in a few minutes."
      primary={{ label: "View Open Roles", to: "#open-roles" }}
      secondary={{ label: "Apply Now", to: "#apply" }}
      photo={HERO.backdrop}
      aside={<HeroLinks items={PAGE_LINKS} />}
      band={["Software", "IoT Systems", "Products", "Training", "Real Projects", "Madurai"]}
      className="pjj-hero"
    />
  );
}
