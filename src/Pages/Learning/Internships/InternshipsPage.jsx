import InternshipHero from "../../../Components/Learning/Internships/InternshipHero/InternshipHero.jsx";
import WatchTheOverview from "../../../Components/Learning/Internships/WatchTheOverview/WatchTheOverview.jsx";
import InternshipDomains from "../../../Components/Learning/Internships/InternshipDomains/InternshipDomains.jsx";
import TechnologiesCovered from "../../../Components/Learning/Internships/TechnologiesCovered/TechnologiesCovered.jsx";
import LearningAndBenefits from "../../../Components/Learning/Internships/LearningAndBenefits/LearningAndBenefits.jsx";
import SuccessStories from "../../../Components/Learning/Internships/SuccessStories/SuccessStories.jsx";
import GetStarted from "../../../Components/Learning/Internships/GetStarted/GetStarted.jsx";
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
      {/* Order (backgrounds alternate by position):
          hero (dark) → video overview (white) → what you gain (dark) →
          domains (white) → technologies (dark, moving strip) →
          success stories (white) → ready to start (last, light). */}
      <InternshipHero />
      <WatchTheOverview />
      <LearningAndBenefits />
      <InternshipDomains />
      <TechnologiesCovered />
      <SuccessStories />

      {/* STUDENT VIDEOS — hidden until real videos are added (every card
          currently says "Video coming soon"). Put <StudentVideos /> back
          here, before <GetStarted />, when they are ready. */}

      <GetStarted />
    </main>
  );
};

export default Internship;
