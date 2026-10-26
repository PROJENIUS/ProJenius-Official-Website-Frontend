import { Link } from "react-router-dom";
import {
    ArrowDown,
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    GraduationCap,
    Monitor,
    UsersRound,
} from "lucide-react";
import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import HeroBackdrop from "../../../Common/HeroPhotoStack/HeroBackdrop.jsx";
import { heroPhotos } from "../../../Common/HeroPhotoStack/heroPhotos.js";
import internsPhoto from "../../../../assets/About/Achievements/Achievements_2.webp";
import "./InternshipHero.css";

/* Background photo: src/assets/Heroes/internship/backdrop.* (see its README). */
const HERO = heroPhotos("internship", { backdrop: internsPhoto });

/* =========================================================
   INTERNSHIP HERO
   Left:  label, heading with typed line, intro, actions, highlights
   Right: "Programme at a glance" panel with the four key facts
   Entrance motion uses the page's shared [data-reveal] system.
========================================================= */

const HERO_PHRASES = ["Built on Real Work", "With Live Projects", "Guided by Mentors"];

/* Taken from the intro text below, not new claims. */
const HIGHLIGHTS = ["Live projects", "Mentor support", "Career preparation"];

const internshipDetails = [
    {
        id: "duration",
        title: "Duration",
        value: "1 Month, 3 Months, 6 Months",
        icon: CalendarDays,
    },
    {
        id: "mode",
        title: "Mode",
        value: "Online, Offline, Hybrid",
        icon: Monitor,
    },
    {
        id: "type",
        title: "Type",
        value: "Guided Internship Program",
        icon: GraduationCap,
    },
    {
        id: "eligibility",
        title: "Eligibility",
        value: "Students, freshers, and career switchers",
        icon: UsersRound,
    },
];

const InternshipHero = () => {
    return (
        <section
            className="pj-internship-hero"
            aria-labelledby="pj-internship-hero-title"
        >
            <div className="pj-internship-hero-backdrop" aria-hidden="true" />
            <HeroBackdrop image={HERO.backdrop} />

            <div className="pj-internship-hero-container">

                {/* CONTENT */}
                <div className="pj-internship-hero-content">

                    <p className="pj-internship-hero-label" data-reveal="up">
                        About the Internship
                    </p>

                    <h1
                        id="pj-internship-hero-title"
                        className="pj-internship-hero-title"
                        data-reveal="up"
                        data-reveal-delay="1"
                    >
                        <span className="pj-internship-hero-title-static">Practical Training</span>
                        <TypedPhrase tone="dark" phrases={HERO_PHRASES} />
                    </h1>

                    <p className="pj-internship-hero-description" data-reveal="up" data-reveal-delay="2">
                        Gain hands-on experience through structured training, mentor
                        support, live projects, and career preparation designed for
                        students and freshers entering the tech industry.
                    </p>

                    <div className="pj-internship-hero-actions" data-reveal="up" data-reveal-delay="3">
                        <Link
                            to="/contact?type=internship"
                            className="pjds-btn pjds-btn--primary pj-internship-hero-btn"
                        >
                            Start Your Journey
                            <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
                        </Link>

                        {/* No syllabus file is published yet, so this points to the
                            domain-by-domain programme details on this page. */}
                        <a
                            href="#internship-domains"
                            className="pjds-btn pjds-btn--ghost pj-internship-hero-btn"
                        >
                            Explore Domains
                            <ArrowDown size={17} strokeWidth={2.2} aria-hidden="true" />
                        </a>
                    </div>

                    <ul className="pj-internship-hero-highlights" data-reveal="up" data-reveal-delay="4">
                        {HIGHLIGHTS.map((item) => (
                            <li key={item}>
                                <CheckCircle2 size={17} strokeWidth={2.2} aria-hidden="true" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* PROGRAMME AT A GLANCE */}
                <aside
                    className="pj-internship-hero-panel"
                    aria-labelledby="pj-internship-hero-panel-title"
                    data-reveal="right"
                    data-reveal-delay="2"
                >
                    <div className="pj-internship-hero-panel-head">
                        <p id="pj-internship-hero-panel-title" className="pj-internship-hero-panel-title">
                            Programme at a glance
                        </p>
                        <span className="pj-internship-hero-panel-tag">Internship</span>
                    </div>

                    <dl className="pj-internship-hero-facts">
                        {internshipDetails.map(({ id, title, value, icon: Icon }) => (
                            <div key={id} className="pj-internship-hero-fact">
                                <span className="pj-internship-hero-fact-icon" aria-hidden="true">
                                    <Icon size={22} strokeWidth={2} />
                                </span>
                                <div className="pj-internship-hero-fact-text">
                                    <dt>{title}</dt>
                                    <dd>{value}</dd>
                                </div>
                            </div>
                        ))}
                    </dl>
                </aside>

            </div>
        </section>
    );
};

export default InternshipHero;
