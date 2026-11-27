import SplitHero from "../../../Common/SplitHero/SplitHero.jsx";
import usePageHero from "../../../../pageHeroes/usePageHero.js";
import { HERO_DEFAULTS } from "../../../../pageHeroes/heroDefaults.js";

/* =============================================================================
   PCB DESIGN & FABRICATION HERO — split hero: copy on the left, a photo card
   on the right, the four stages along the bottom.
   Content and photo: Admin → Page Heroes → PCB Design & Fabrication
   (built-in: src/pageHeroes/heroDefaults.js; a photo in
   src/assets/Heroes/pcb/backdrop.* still replaces the built-in one).
   ============================================================================= */

export default function PCBDesignFabricationHero() {
  const hero = usePageHero("pcb-design-fabrication", HERO_DEFAULTS["pcb-design-fabrication"]);
  return (
    <SplitHero
      id="pcb-hero-title"
      className="pjpcb-hero"
      kicker={hero.kicker}
      title={hero.title}
      typed={hero.typed}
      description={hero.description}
      primary={hero.primary}
      secondary={hero.secondary}
      tags={hero.tags}
      photo={hero.photo}
      photoAlt={hero.photoAlt}
      badge={{ kicker: hero.badgeKicker, title: hero.badgeTitle }}
      steps={hero.steps}
      breadcrumbs={[{ label: "Home", to: "/" }, { label: "Solutions" }, { label: "PCB Design & Fabrication" }]}
    />
  );
}
