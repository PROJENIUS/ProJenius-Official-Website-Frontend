import React from "react";

import AboutHero from "../Components/About/AboutHero/AboutHero";
import LeadershipTeam from "../Components/About/LeadershipTeam/LeadershipTeam";
import OurStory from "../Components/About/OurStory/OurStory";
import Achievements from "../Components/About/Achievements/Achievements";
import Magazine from "../Components/About/Magazine/Magazine";
import Testimonials from "../Components/About/Testimonials/Testimonials";
import ContactSection from "../Components/About/ContactSection/ContactSection";

export default function About() {
    return (
        <>
            <AboutHero />
            <LeadershipTeam />
            <OurStory />
            <Achievements />
            <Magazine />
            <Testimonials />
            <ContactSection />
        </>
    );
}