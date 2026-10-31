import CinematicHero from "../../Common/CinematicHero/CinematicHero.jsx";
import { heroPhotos } from "../../Common/HeroPhotoStack/heroPhotos.js";
import teamPhoto from "../../../assets/Home/Optimized/who-we-are-team-900.webp";
import logo from "../../../assets/About/AboutHero/AboutHero_1.png";

/* =============================================================================
   ABOUT HERO — the shared cinematic hero.
   Photo: src/assets/Heroes/about/backdrop.* (see its README); the team
   photo below is used until one is added there. The band lists the nine
   practice areas.
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
      facts={[
        {
          label: "Based in",
          title: "Madurai, Tamil Nadu",
          text: "ProJenius Innovation Technology",
          icon: <img src={logo} alt="" width="34" height="34" decoding="async" />,
        },
        { label: "One ecosystem", title: "Nine practice areas", chips: ["Software", "IoT", "Training"] },
      ]}
      band={PRACTICE_AREAS}
      className="pja-hero"
    />
  );
}
