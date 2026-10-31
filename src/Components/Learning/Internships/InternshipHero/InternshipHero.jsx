import CinematicHero from "../../../Common/CinematicHero/CinematicHero.jsx";
import { heroPhotos } from "../../../Common/HeroPhotoStack/heroPhotos.js";
import internsPhoto from "../../../../assets/About/Achievements/Achievements_2.webp";

/* =========================================================
   INTERNSHIP HERO — the shared cinematic hero.
   Photo: src/assets/Heroes/internship/backdrop.* (see its
   README). Fact cards: mode and eligibility from the
   programme details.
========================================================= */

const HERO = heroPhotos("internship", { backdrop: internsPhoto });

const InternshipHero = () => (
    <CinematicHero
        id="pj-internship-hero-title"
        eyebrow="About the Internship"
        title="Practical Training Built on"
        accent="Real Work"
        description="Gain hands-on experience through structured training, mentor support, live projects, and career preparation designed for students and freshers entering the tech industry."
        primary={{ label: "Start Your Journey", to: "/contact?type=internship" }}
        secondary={{ label: "Explore Domains", to: "#internship-domains" }}
        photo={HERO.backdrop}
        facts={[
            { label: "How you learn", title: "Guided internship program", chips: ["Online", "Offline", "Hybrid"] },
            { label: "Who can join", title: "Students, freshers and career switchers", to: "#internship-domains" },
        ]}
        band={["Live Projects", "Mentor Support", "Structured Training", "Career Preparation", "Online & Offline", "Certification"]}
        className="pj-internship-hero"
    />
);

export default InternshipHero;
