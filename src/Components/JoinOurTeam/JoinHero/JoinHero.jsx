import CinematicHero from "../../Common/CinematicHero/CinematicHero.jsx";
import usePageHero from "../../../pageHeroes/usePageHero.js";
import { accentProp, HERO_DEFAULTS } from "../../../pageHeroes/heroDefaults.js";

/* =============================================================================
   JOIN OUR TEAM — HERO (the shared cinematic hero)
   Text and photo cards: Admin → Page Heroes → Join Our Team
   (built-in: src/pageHeroes/heroDefaults.js).
   ============================================================================= */

export default function JoinHero() {
  const hero = usePageHero("join-our-team", HERO_DEFAULTS["join-our-team"]);
  return (
    <CinematicHero
      id="pjj-hero-title"
      eyebrow={hero.eyebrow}
      title={hero.title}
      accent={accentProp(hero.accent)}
      description={hero.description}
      primary={hero.primary}
      secondary={hero.secondary}
      cards={hero.cards}
      className="pjj-hero"
    />
  );
}
