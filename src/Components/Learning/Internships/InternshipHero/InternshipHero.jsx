import CinematicHero, { HeroLinks } from "../../../Common/CinematicHero/CinematicHero.jsx";
import { heroPhotos } from "../../../Common/HeroPhotoStack/heroPhotos.js";
import internsPhoto from "../../../../assets/About/Achievements/Achievements_2.webp";

/* =========================================================
   INTERNSHIP HERO — the shared cinematic hero with "On this
   page" links. Photo: src/assets/Heroes/internship/backdrop.*
   (see its README).
========================================================= */

const HERO = heroPhotos("internship", { backdrop: internsPhoto });

const PAGE_LINKS = [
  { label: "Internship domains", to: "#internship-domains" },
  { label: "Technologies covered", to: "#pj-internship-tech-title" },
  { label: "What you'll learn", to: "#pj-internship-learning-title" },
  { label: "Success stories", to: "#pj-internship-success-title" },
];

const InternshipHero = () => (
    <CinematicHero
        id="pj-internship-hero-title"
        eyebrow="About the Internship"
        title="Practical Training"
        accent="Built on Real Work"
        description="Gain hands-on experience through structured training, mentor support, live projects, and career preparation designed for students and freshers entering the tech industry."
        primary={{ label: "Start Your Journey", to: "/contact?type=internship" }}
        secondary={{ label: "Explore Domains", to: "#internship-domains" }}
        photo={HERO.backdrop}
        aside={<HeroLinks items={PAGE_LINKS} />}
        band={["Live Projects", "Mentor Support", "Structured Training", "Career Preparation", "Online & Offline", "Certification"]}
        className="pj-internship-hero"
    />
);

export default InternshipHero;
