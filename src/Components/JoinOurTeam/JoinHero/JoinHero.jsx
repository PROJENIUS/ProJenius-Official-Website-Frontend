import CinematicHero from "../../Common/CinematicHero/CinematicHero.jsx";
import { OPENINGS } from "../openings.js";
import { heroPhotos } from "../../Common/HeroPhotoStack/heroPhotos.js";
import labPhoto from "../../../assets/Home/HeroSlides/hero-slide-3.webp";

/* =============================================================================
   JOIN OUR TEAM — HERO (the shared cinematic hero)
   Photo: src/assets/Heroes/join-our-team/backdrop.* (see its README).
   The first fact card counts the open roles in openings.js.
   ============================================================================= */

const HERO = heroPhotos("join-our-team", { backdrop: labPhoto });

const hiringFact = OPENINGS.length
  ? {
      label: "Now hiring",
      title: `${OPENINGS.length} open ${OPENINGS.length === 1 ? "role" : "roles"}`,
      chips: [...new Set(OPENINGS.map((role) => role.team))].slice(0, 3),
      to: "#open-roles",
    }
  : { label: "Applications", title: "General applications open", to: "#apply" };

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
      facts={[
        hiringFact,
        { label: "Don't see your role?", title: "Send a general application", to: "#apply" },
      ]}
      band={["Software", "IoT Systems", "Products", "Training", "Real Projects", "Madurai"]}
      className="pjj-hero"
    />
  );
}
