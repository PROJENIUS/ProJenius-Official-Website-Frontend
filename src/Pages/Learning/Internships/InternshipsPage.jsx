import InternshipHero from "../../../Components/Learning/Internships/InternshipHero/InternshipHero.jsx";
import RealWorldExperience from "../../../Components/Learning/Internships/RealWorldExperience/RealWorldExperience.jsx";
import InternshipDomains from "../../../Components/Learning/Internships/InternshipDomains/InternshipDomains.jsx";
import TechnologiesCovered from "../../../Components/Learning/Internships/TechnologiesCovered/TechnologiesCovered.jsx";
import WhatInternsWillLearnAndBenefits from "../../../Components/Learning/Internships/WhatInternsWillLearnAndBenefits/WhatInternsWillLearnAndBenefits.jsx";
import SuccessStories from "../../../Components/Learning/Internships/SuccessStories/SuccessStories.jsx";
import StudentVideos from "../../../Components/Learning/Internships/StudentVideos/StudentVideos.jsx";
import ReadyToStart from "../../../Components/Learning/Internships/ReadyToStart/ReadyToStart.jsx";
import { useRef } from "react";
import useMetaDescription from "../../../hooks/useMetaDescription.js";
import useScrollReveal from "../../../hooks/useScrollReveal.js";
import "../../../styles/pages/LearningPages.css";

const DESCRIPTION =
  "Technology internships at ProJenius Innovation Technology, Madurai: guided 1, 3 or 6 month programmes with mentor support and live projects in software, IoT, AI and embedded systems.";

const Internship = () => {
  const pageRef = useRef(null);
  useMetaDescription(DESCRIPTION);
  useScrollReveal(pageRef);

  return (
    <main ref={pageRef} className="pjl-page pjl-internships">
      {/* INTERNSHIP HERO */}
      <InternshipHero />

      {/* REAL-WORLD EXPERIENCE */}
      <RealWorldExperience />

      {/* INTERNSHIP DOMAINS */}
      <InternshipDomains />

      {/* TECHNOLOGIES COVERED */}
      <TechnologiesCovered />

      {/* WHAT INTERNS WILL LEARN + BENEFITS */}
      <WhatInternsWillLearnAndBenefits />

      {/* SUCCESS STORIES */}
      <SuccessStories />

      {/* STUDENT STORIES (video testimonials) */}
      <StudentVideos />

      {/* READY TO START */}
      <ReadyToStart />
    </main>
  );
};

export default Internship;
