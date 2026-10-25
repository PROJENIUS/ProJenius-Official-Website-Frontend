import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import useScrollReveal from "../../hooks/useScrollReveal.js";
import useMetaDescription from "../../hooks/useMetaDescription.js";
import AboutHero from "../../Components/About/AboutHero/AboutHero.jsx";
import LeadershipTeam from "../../Components/About/LeadershipTeam/LeadershipTeam.jsx";
import OurStory from "../../Components/About/OurStory/OurStory.jsx";
import Achievements from "../../Components/About/Achievements/Achievements.jsx";
import Magazine from "../../Components/About/Magazine/Magazine.jsx";
import Testimonials from "../../Components/About/Testimonials/Testimonials.jsx";
import ContactSection from "../../Components/About/ContactSection/ContactSection.jsx";

import "../../styles/pages/AboutPage.css";

/* About page. One shared observer (useScrollReveal) drives every [data-reveal]
   element on the page; the motion rules are scoped beneath .pja-page. */

const ABOUT_DESCRIPTION =
    "Meet ProJenius Innovation Technology, Madurai: our founders, our journey from technical training to product engineering, our achievements and what clients and learners say about us.";

export default function About() {
    const pageRef = useRef(null);
    const location = useLocation();
    useScrollReveal(pageRef);
    useMetaDescription(ABOUT_DESCRIPTION);

    useEffect(() => {
        if (!location.hash) return undefined;
        let secondFrame = 0;
        const firstFrame = window.requestAnimationFrame(() => {
            secondFrame = window.requestAnimationFrame(() => {
                const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
                if (!target) return;
                const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
                target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
            });
        });
        return () => {
            window.cancelAnimationFrame(firstFrame);
            if (secondFrame) window.cancelAnimationFrame(secondFrame);
        };
    }, [location.hash]);

    return (
        <main ref={pageRef} className="pja-page">
            <AboutHero />
            <LeadershipTeam />
            <OurStory />
            <Achievements />
            <Magazine />
            <Testimonials />
            <ContactSection />
        </main>
    );
}
