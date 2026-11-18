import { useRef } from "react";

import useScrollReveal from "../../hooks/useScrollReveal.js";
import useMetaDescription from "../../hooks/useMetaDescription.js";
import "../../styles/pages/HomePage.css";

import HomeHero from "../../Components/Home/HomeHero/HomeHero.jsx";
import WhoWeAre from "../../Components/Home/WhoWeAre/WhoWeAre.jsx";
import OurServices from "../../Components/Home/OurServices/OurServices.jsx";
import OurTrainingProgram from "../../Components/Home/OurTrainingProgram/OurTrainingProgram.jsx";
import HighlightsUpdates from "../../Components/Home/HighlightsUpdates/HighlightsUpdates.jsx";
import OurProducts from "../../Components/Home/OurProducts/OurProducts.jsx";
import OurProjects from "../../Components/Home/OurProjects/OurProjects.jsx";
import HomeAchievements from "../../Components/Home/HomeAchievements/HomeAchievements.jsx";
import ContactSection from "../../Components/Home/ContactSection/ContactSection.jsx";

/* Homepage flow: Hero → Who We Are → Services → Training → Highlights & Updates
   → Products & Innovations → Projects → Achievements → Let's Work Together
   (the Footer is rendered by App). One shared observer drives every
   [data-reveal] element on the page (see useScrollReveal). */
export default function Home() {
    const pageRef = useRef(null);
    useMetaDescription("Explore ProJenius Innovation Technology in Madurai: software and hardware solutions, product development, hands-on courses, internships and workshops.");
    useScrollReveal(pageRef);

    return (
        <main ref={pageRef} className="pjh-page">
            <HomeHero />
            <WhoWeAre />
            <OurServices />
            <OurTrainingProgram />
            <HighlightsUpdates />
            <OurProducts />
            <OurProjects />
            <HomeAchievements />
            <ContactSection />
        </main>
    );
}
