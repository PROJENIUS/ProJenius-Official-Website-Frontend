import CinematicHero from "../../Common/CinematicHero/CinematicHero.jsx";
import { HeroPhotoCards } from "../../Common/CinematicHero/HeroPanels.jsx";
import { heroPhotos } from "../../Common/HeroPhotoStack/heroPhotos.js";
import teamPhoto from "../../../assets/Home/Optimized/who-we-are-team-900.webp";
import recognitionPhoto from "../../../assets/Home/Optimized/hero-recognition-960.webp";
import aiEventPhoto from "../../../assets/Home/Optimized/hero-ai-event-960.webp";
import handsOnPhoto from "../../../assets/About/Achievements/Achievements_4.webp";

/* =============================================================================
   ABOUT HERO — the shared cinematic hero with three overlapping real photos.
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

const PHOTOS = [
  { image: recognitionPhoto, label: "Recognition", title: "Science and innovation recognition", alt: "ProJenius team at a science and innovation recognition event" },
  { image: aiEventPhoto, label: "Industry", title: "CII Connect Madurai AI event", alt: "Speakers on stage at the CII Connect Madurai AI event" },
  { image: handsOnPhoto, label: "Hands-on", title: "Students building with ProJenius", alt: "Students working together during a hands-on session" },
];

export default function AboutHero() {
  return (
    <CinematicHero
      id="pja-hero-title"
      eyebrow="About ProJenius"
      title="Technology. Innovation."
      accent="Possibility."
      description="ProJenius Innovation Technology is a multidisciplinary organization in Madurai, bringing technology, learning, innovation and collaboration together in one evolving ecosystem."
      primary={{ label: "Talk to Our Team", to: "/contact" }}
      secondary={{ label: "Our Journey", to: "#about-journey" }}
      photo={HERO.backdrop}
      aside={<HeroPhotoCards items={PHOTOS} />}
      band={PRACTICE_AREAS}
      className="pja-hero"
    />
  );
}
