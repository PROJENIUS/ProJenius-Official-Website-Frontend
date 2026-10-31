import CinematicHero, { HeroLinks } from "../../Common/CinematicHero/CinematicHero.jsx";
import { heroPhotos } from "../../Common/HeroPhotoStack/heroPhotos.js";
import teamPhoto from "../../../assets/Home/Optimized/who-we-are-team-900.webp";

/* =============================================================================
   ABOUT HERO — the shared cinematic hero with "On this page" links.
   Photo: src/assets/Heroes/about/backdrop.* (see its README). The band
   lists the nine practice areas.
   ============================================================================= */

const HERO = heroPhotos("about", { backdrop: teamPhoto });

const PRACTICE_AREAS = [
  "Software Development",
  "IoT & Embedded Systems",
  "Product Development",
  "3D Design & Fabrication",
  "Workshops & Training",
  "Startup Support",
  "Patent Support",
  "Academia",
  "Innovation",
];

const PAGE_LINKS = [
  { label: "Leadership", to: "#about-leadership" },
  { label: "Our journey", to: "#about-journey" },
  { label: "Achievements", to: "#about-achievements" },
  { label: "Magazine", to: "#hpmag-heading" },
];

export default function AboutHero() {
  return (
    <CinematicHero
      id="pja-hero-title"
      eyebrow="About ProJenius"
      title="Technology. Innovation."
      accent="Possibility."
      description="ProJenius Innovation Technology is a multidisciplinary organization in Madurai, bringing technology, learning, innovation and collaboration together in one evolving ecosystem."
      primary={{ label: "Meet Our Team", to: "#about-leadership" }}
      secondary={{ label: "Our Journey", to: "#about-journey" }}
      photo={HERO.backdrop}
      aside={<HeroLinks items={PAGE_LINKS} />}
      band={PRACTICE_AREAS}
      className="pja-hero"
    />
  );
}
