import React from "react";

import CareerGuidanceHero from "../../Components/CareerGuidance/CareerGuidanceHero/CareerGuidanceHero";
import ASmallFee from "../../Components/CareerGuidance/ASmallFee/ASmallFee";
import EverythingYouNeed from "../../Components/CareerGuidance/EverythingYouNeed/EverythingYouNeed";
import GuidanceProcess from "../../Components/CareerGuidance/GuidanceProcess/GuidanceProcess";
import NotJustAdvice from "../../Components/CareerGuidance/NotJustAdvice/NotJustAdvice";
import TargetAudience from "../../Components/CareerGuidance/TargetAudience/TargetAudience";
import NotJustAnother from "../../Components/CareerGuidance/NotJustAnother/NotJustAnother";
import ProvenResults from "../../Components/CareerGuidance/ProvenResults/ProvenResults";
import LookingForAnswer from "../../Components/CareerGuidance/LookingForAnswer/LookingForAnswer";
import BuildWithProJenius from "../../Components/CareerGuidance/BuildWithProJenius/BuildWithProJenius";

/* =========================================================
   CAREER GUIDANCE PAGE
   - Page-level component composition only
   - Each section manages its own JSX and external CSS
   - No inline or internal CSS
========================================================= */

const CareerGuidancePage = () => {
  return (
    <main className="career-guidance-page-root">
      {/* HERO SECTION */}
      <CareerGuidanceHero />

      {/* A SMALL FEE / 1:1 BOOKING & SCHEDULING */}
      <ASmallFee />

      {/* EVERYTHING YOU NEED TO GET HIRED */}
      <EverythingYouNeed />

      {/* GUIDANCE PROCESS */}
      <GuidanceProcess />

      {/* NOT JUST ADVICE */}
      <NotJustAdvice />

      {/* TARGET AUDIENCE */}
      <TargetAudience />

      {/* NOT JUST ANOTHER */}
      <NotJustAnother />

      {/* PROVEN RESULTS */}
      <ProvenResults />

      {/* LOOKING FOR ANSWERS / FAQ */}
      <LookingForAnswer />

      {/* BUILD WITH PROJENIUS / FINAL CTA */}
      <BuildWithProJenius />
    </main>
  );
};

export default CareerGuidancePage;