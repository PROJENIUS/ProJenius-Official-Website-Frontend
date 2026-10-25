import { useRef } from "react";
import useMetaDescription from "../../../hooks/useMetaDescription.js";
import useScrollReveal from "../../../hooks/useScrollReveal.js";

import CareerGuidanceHero from "../../../Components/Learning/CareerGuidance/CareerGuidanceHero/CareerGuidanceHero.jsx";
import ASmallFee from "../../../Components/Learning/CareerGuidance/ASmallFee/ASmallFee.jsx";
import TargetAudience from "../../../Components/Learning/CareerGuidance/TargetAudience/TargetAudience.jsx";
import NotJustAdvice from "../../../Components/Learning/CareerGuidance/NotJustAdvice/NotJustAdvice.jsx";
import GuidanceProcess from "../../../Components/Learning/CareerGuidance/GuidanceProcess/GuidanceProcess.jsx";
import NotJustAnother from "../../../Components/Learning/CareerGuidance/NotJustAnother/NotJustAnother.jsx";
import CareerFaq from "../../../Components/Learning/CareerGuidance/CareerFaq/CareerFaq.jsx";
import CareerClosing from "../../../Components/Learning/CareerGuidance/CareerClosing/CareerClosing.jsx";
import "../../../styles/pages/LearningPages.css";

const DESCRIPTION =
  "1:1 career guidance from ProJenius mentors: career roadmaps, resume building, interview preparation and LinkedIn optimization for students and freshers in technology.";

/* =========================================================
   CAREER GUIDANCE PAGE
   Backgrounds alternate like the homepage:
   hero (navy) → booking (white) → who it is for (light) →
   deliverables (navy) → process (white) → why ProJenius
   (navy) → FAQ (white) → closing card (the same
   card as the Home, About and Workshop pages).
========================================================= */

const CareerGuidancePage = () => {
  const pageRef = useRef(null);
  useMetaDescription(DESCRIPTION);
  useScrollReveal(pageRef);

  return (
    <main ref={pageRef} className="career-guidance-page-root pjl-page pjl-career">
      <CareerGuidanceHero />
      <ASmallFee />
      <TargetAudience />
      <NotJustAdvice />
      <GuidanceProcess />
      <NotJustAnother />
      <CareerFaq />
      <CareerClosing />
    </main>
  );
};

export default CareerGuidancePage;
