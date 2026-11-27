import { useRef } from "react";

import useScrollReveal from "../../hooks/useScrollReveal.js";
import useMetaDescription from "../../hooks/useMetaDescription.js";
import "../../styles/pages/HomePage.css";

import HomeHero from "../../Components/Home/HomeHero/HomeHero.jsx";
import WhoWeAre from "../../Components/Home/WhoWeAre/WhoWeAre.jsx";
import OurServices from "../../Components/Home/OurServices/OurServices.jsx";
import OurTrainingProgram from "../../Components/Home/OurTrainingProgram/OurTrainingProgram.jsx";
import HighlightsAndUpdates from "../../Components/Home/HighlightsAndUpdates/HighlightsAndUpdates.jsx";
import ProductsAndInnovations from "../../Components/Home/ProductsAndInnovations/ProductsAndInnovations.jsx";
import OurProjects from "../../Components/Home/OurProjects/OurProjects.jsx";
import AchievementsAndRecognition from "../../Components/Home/AchievementsAndRecognition/AchievementsAndRecognition.jsx";
import ContactSection from "../../Components/Home/ContactSection/ContactSection.jsx";

/* Homepage flow: Hero → Who We Are → Services → Training → Highlights & Updates
   → Products & Innovations → Projects → Achievements → Let's Work Together
   (the Footer is rendered by App). One shared observer drives every
   [data-reveal] element on the page (see useScrollReveal). */
export default function Home() {
    const pageRef = useRef(null);
    useMetaDescription("ProJenius in Madurai builds software, IoT and embedded systems, PCBs and prototypes, and runs hands-on courses, internships and workshops for students.");
    useScrollReveal(pageRef);

    return (
        <main ref={pageRef} className="pjh-page">
            <HomeHero />
            <WhoWeAre />
            <OurServices />
            <OurTrainingProgram />
            <HighlightsAndUpdates />
            <ProductsAndInnovations />
            <OurProjects />
            <AchievementsAndRecognition />
            <ContactSection />
        </main>
    );
}
