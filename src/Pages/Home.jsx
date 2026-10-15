import React from "react";

import HomeHero from "../Components/HomePage/HomeHero/HomeHero";
import WhoWeAre from "../Components/HomePage/WhoWeAre/WhoWeAre";
import OurServices from "../Components/HomePage/OurServices/OurServices";
import OurProducts from "../Components/HomePage/OurProducts/OurProducts";
import OurTrainingProgram from "../Components/HomePage/OurTrainingProgram/OurTrainingProgram";
import OurProjects from "../Components/HomePage/OurProjects/OurProjects";
import ContactSection from "../Components/HomePage/ContactSection/ContactSection";

export default function Home() {
    return (
        <>
            <HomeHero />
            <WhoWeAre />
            <OurServices />
            <OurProducts />
            <OurTrainingProgram />
            <OurProjects />
            <ContactSection />
        </>
    );
}
