import { useRef } from "react";
import useMetaDescription from "../../../hooks/useMetaDescription.js";
import useScrollReveal from "../../../hooks/useScrollReveal.js";

import DesignedAroundYourInstitution from "../../../Components/Learning/Workshops/DesignedAroundYourInstitution/DesignedAroundYourInstitution.jsx";
import ExploreOurWorkshopAreas from "../../../Components/Learning/Workshops/ExploreOurWorkshopAreas/ExploreOurWorkshopAreas.jsx";
import HaveAWorkshopInMind from "../../../Components/Learning/Workshops/HaveAWorkshopInMind/HaveAWorkshopInMind.jsx";
import HowWeTurnARequirementIntoAWorkshop from "../../../Components/Learning/Workshops/HowWeTurnARequirementIntoAWorkshop/HowWeTurnARequirementIntoAWorkshop.jsx";
import OurWorkshopExperiences from "../../../Components/Learning/Workshops/OurWorkshopExperiences/OurWorkshopExperiences.jsx";
import QuestionsInstitutionsAsk from "../../../Components/Learning/Workshops/QuestionsInstitutionsAsk/QuestionsInstitutionsAsk.jsx";
import WorkshopGallery from "../../../Components/Learning/Workshops/WorkshopGallery/WorkshopGallery.jsx";
import WhatParticipantsExperienced from "../../../Components/Learning/Workshops/WhatParticipantsExperienced/WhatParticipantsExperienced.jsx";
import WorkshopThatGoesBeyondTheClassroom from "../../../Components/Learning/Workshops/WorkshopThatGoesBeyondTheClassroom/WorkshopThatGoesBeyondTheClassroom.jsx";
import "../../../styles/pages/LearningPages.css";

const DESCRIPTION =
  "Hands-on technology workshops by ProJenius for colleges and institutions in AI, IoT, robotics, software, electronics and rapid prototyping, designed around your students.";

/* Page flow (backgrounds alternate like the homepage):
   hero (navy) → formats (white) → areas (navy) → process (light) →
   experiences / participant stories (shown once real content is added) →
   workshop gallery (navy) → FAQ (white) → closing call to action. */
export default function Workshop() {
  const pageRef = useRef(null);
  useMetaDescription(DESCRIPTION);
  useScrollReveal(pageRef);

  return (
    <main ref={pageRef} className="pjl-page pjl-workshops">
      <WorkshopThatGoesBeyondTheClassroom />
      <DesignedAroundYourInstitution />
      <ExploreOurWorkshopAreas />
      <HowWeTurnARequirementIntoAWorkshop />
      <OurWorkshopExperiences />
      <WhatParticipantsExperienced />
      <WorkshopGallery />
      <QuestionsInstitutionsAsk />
      <HaveAWorkshopInMind />
    </main>
  );
}
