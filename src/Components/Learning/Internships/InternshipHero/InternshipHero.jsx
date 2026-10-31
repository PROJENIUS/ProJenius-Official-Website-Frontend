import CinematicHero from "../../../Common/CinematicHero/CinematicHero.jsx";
import { HeroRadar } from "../../../Common/CinematicHero/HeroPanels.jsx";
import { heroPhotos } from "../../../Common/HeroPhotoStack/heroPhotos.js";
import internsPhoto from "../../../../assets/About/Achievements/Achievements_2.webp";

/* =========================================================
   INTERNSHIP HERO — the shared cinematic hero with a skill
   chart growing from day 1 to after the internship. The
   values are an example, and the chart says so.
   Photo: src/assets/Heroes/internship/backdrop.* (see its README).
========================================================= */

const HERO = heroPhotos("internship", { backdrop: internsPhoto });

const SKILLS = ["Coding", "Electronics", "AI", "Projects", "Problem solving", "Teamwork"];
const DAY_ONE = [0.35, 0.25, 0.2, 0.3, 0.4, 0.35];
const AFTER = [0.85, 0.75, 0.7, 0.9, 0.85, 0.85];

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
        aside={
            <HeroRadar
                label="Example: how an intern's skills grow"
                axes={SKILLS}
                before={DAY_ONE}
                after={AFTER}
                beforeLabel="Day 1"
                afterLabel="After the internship"
            />
        }
        band={["Live Projects", "Mentor Support", "Structured Training", "Career Preparation", "Online & Offline", "Certification"]}
        className="pj-internship-hero"
    />
);

export default InternshipHero;
