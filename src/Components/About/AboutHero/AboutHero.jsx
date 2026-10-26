import { useEffect, useRef, useState } from "react";
import {
    ArrowDown,
    ArrowRight,
    BookOpen,
    Boxes,
    Code2,
    Cpu,
    GraduationCap,
    Lightbulb,
    MapPin,
    Rocket,
    ShieldCheck,
    Wifi,
} from "lucide-react";

import TypedPhrase from "../../Common/TypedPhrase/TypedPhrase.jsx";
import useOnScreen from "../../../hooks/useOnScreen.js";
import "./AboutHero.css";

import logo from "../../../assets/About/AboutHero/AboutHero_1.png";
import teamPhoto from "../../../assets/Home/Optimized/who-we-are-team-900.webp";
import HeroBackdrop from "../../Common/HeroPhotoStack/HeroBackdrop.jsx";
import { heroPhotos } from "../../Common/HeroPhotoStack/heroPhotos.js";

/* Background photo: src/assets/Heroes/about/backdrop.* (see its README). */
const HERO = heroPhotos("about", { backdrop: teamPhoto });

/* =============================================================================
   ABOUT HERO
   -----------------------------------------------------------------------------
   Copy on the left (pill, static line + typed line, lead, buttons); on the
   right a clean ecosystem panel: the ProJenius name and a 3 × 3 grid of the
   nine practice areas. One tile is highlighted at a time and the highlight
   moves on every 2.2 s (paused on hover, off screen and with reduced motion).
   - Every class is prefixed pja-hero and scoped beneath .pja-hero.
   - Only transform / opacity / colours animate, so the motion stays cheap.
   ============================================================================= */

const ECOSYSTEM_ITEMS = [
    { id: "software", title: "Software Development", Icon: Code2 },
    { id: "iot", title: "IoT & Embedded Systems", Icon: Wifi },
    { id: "product", title: "Product Development", Icon: Boxes },
    { id: "fabrication", title: "3D Design & Fabrication", Icon: Cpu },
    { id: "training", title: "Workshops & Training", Icon: GraduationCap },
    { id: "startup", title: "Startup Support", Icon: Rocket },
    { id: "patent", title: "Patent Support", Icon: ShieldCheck },
    { id: "academia", title: "Academia", Icon: BookOpen },
    { id: "innovation", title: "Innovation", Icon: Lightbulb },
];

const HIGHLIGHT_MS = 2200;

const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function AboutHero() {
    const panelRef = useRef(null);
    const isOnScreen = useOnScreen(panelRef);
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (!isOnScreen || paused || prefersReducedMotion()) return undefined;
        const timer = window.setInterval(
            () => setActive((current) => (current + 1) % ECOSYSTEM_ITEMS.length),
            HIGHLIGHT_MS
        );
        return () => window.clearInterval(timer);
    }, [isOnScreen, paused]);

    return (
        <section className="pja-hero" aria-labelledby="pja-hero-title">
            <div className="pja-hero__backdrop" aria-hidden="true" />
            <HeroBackdrop image={HERO.backdrop} />

            <div className="pjds-container pja-hero__layout">
                {/* Copy ------------------------------------------------------ */}
                <div className="pja-hero__copy">
                    <p className="pjds-eyebrow pjds-eyebrow--on-dark" data-reveal="up">About ProJenius</p>

                    <h1 id="pja-hero-title" className="pja-hero__title" data-reveal="up" data-reveal-delay="1">
                        <span className="pja-hero__title-static">Technology. Innovation.</span>
                        <TypedPhrase tone="dark" phrases={["Possibility.", "Real-World Impact.", "Built in Madurai."]} />
                    </h1>

                    <p className="pja-hero__lead" data-reveal="up" data-reveal-delay="2">
                        ProJenius Innovation Technology is a multidisciplinary organization in Madurai,
                        bringing technology, learning, innovation and collaboration together in one
                        evolving ecosystem.
                    </p>

                    <div className="pja-hero__actions" data-reveal="up" data-reveal-delay="3">
                        <a href="#about-leadership" className="pjds-btn pjds-btn--primary pjds-btn--on-dark">
                            Meet Our Team
                            <ArrowDown size={18} aria-hidden="true" />
                        </a>
                        <a href="#about-journey" className="pjds-btn pjds-btn--ghost">
                            Our Journey
                            <ArrowRight size={18} aria-hidden="true" />
                        </a>
                    </div>
                </div>

                {/* Ecosystem panel ------------------------------------------- */}
                <div
                    ref={panelRef}
                    className="pja-hero__panel"
                    data-reveal="right"
                    data-reveal-delay="2"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                >
                    <div className="pja-hero__panel-head">
                        <span className="pja-hero__logo">
                            <img src={logo} alt="" width="56" height="56" decoding="async" />
                        </span>
                        <span className="pja-hero__panel-name">
                            <strong>ProJenius Innovation Technology</strong>
                            <span><MapPin size={14} aria-hidden="true" /> Madurai, Tamil Nadu</span>
                        </span>
                    </div>

                    <h2 className="pja-hero__panel-title">One ecosystem, nine practice areas</h2>

                    <ul className="pja-hero__grid">
                        {ECOSYSTEM_ITEMS.map(({ id, title, Icon }, index) => (
                            <li
                                key={id}
                                className={`pja-hero__tile pja-hero__tile--${(index % 3) + 1}${index === active ? " is-active" : ""}`}
                            >
                                <span className="pja-hero__tile-icon" aria-hidden="true">
                                    <Icon size={22} strokeWidth={1.9} />
                                </span>
                                <span className="pja-hero__tile-label">{title}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
