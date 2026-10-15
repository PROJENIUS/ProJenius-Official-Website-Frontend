import InternshipHero from "../../Components/Internship/InternshipHero/InternshipHero";
import RealWorldExperience from "../../Components/Internship/RealWorldExperience/RealWorldExperience";
import InternshipDomains from "../../Components/Internship/InternshipDomains/InternshipDomains";
import TechnologiesCovered from "../../Components/Internship/TechnologiesCovered/TechnologiesCovered";
import WhatInternsWillLearnAndBenefits from "../../Components/Internship/WhatInternsWillLearnAndBenefits/WhatInternsWillLearnAndBenefits";
import SuccessStories from "../../Components/Internship/SuccessStories/SuccessStories";
import ReadyToStart from "../../Components/Internship/ReadyToStart/ReadyToStart";

const Internship = () => {
  return (
    <>
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

      {/* READY TO START */}
      <ReadyToStart />
    </>
  );
};

export default Internship;