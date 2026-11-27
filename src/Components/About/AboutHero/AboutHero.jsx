import CinematicHero from "../../Common/CinematicHero/CinematicHero.jsx";
import usePageHero from "../../../pageHeroes/usePageHero.js";
import { accentProp, HERO_DEFAULTS } from "../../../pageHeroes/heroDefaults.js";

/* Content: Admin → Page Heroes → About Us (built-in: src/pageHeroes/heroDefaults.js). */
export default function AboutHero() {
  const hero = usePageHero("about", HERO_DEFAULTS.about);
  return (
    <CinematicHero
      id="pja-hero-title"
      eyebrow={hero.eyebrow}
      title={hero.title}
      accent={accentProp(hero.accent)}
      description={hero.description}
      primary={hero.primary}
      secondary={hero.secondary}
      cards={hero.cards}
      className="pja-hero"
    />
  );
}
