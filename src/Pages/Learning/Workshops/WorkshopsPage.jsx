import { useRef } from "react";
import useMetaDescription from "../../../hooks/useMetaDescription.js";
import useScrollReveal from "../../../hooks/useScrollReveal.js";

import DesignedAroundYourInstitution from "../../../Components/Learning/Workshops/DesignedAroundYourInstitution/DesignedAroundYourInstitution.jsx";
import ExploreOurWorkshop from "../../../Components/Learning/Workshops/ExploreOurWorkshop/ExploreOurWorkshop.jsx";
import HowWeTurnARequirement from "../../../Components/Learning/Workshops/HowWeTurnARequirement/HowWeTurnARequirement.jsx";
import OurWorkshopExperiences from "../../../Components/Learning/Workshops/OurWorkshopExperiences/OurWorkshopExperiences.jsx";
import ServiceFaq from "../../../Components/Common/ServiceFaq/ServiceFaq.jsx";
import { WORKSHOP_FAQS } from "../../../Components/Learning/Workshops/QuestionsInstitutionsAsk/workshopFaqData.js";

const FAQ_ITEMS = WORKSHOP_FAQS.map(({ question, answer }) => ({ q: question, a: answer }));
import WorkshopGallery from "../../../Components/Learning/Workshops/WorkshopGallery/WorkshopGallery.jsx";
import WhatParticipantsExperienced from "../../../Components/Learning/Workshops/WhatParticipantsExperienced/WhatParticipantsExperienced.jsx";
import WorkshopThatGoesBeyondTheClassroom from "../../../Components/Learning/Workshops/WorkshopThatGoesBeyondTheClassroom/WorkshopThatGoesBeyondTheClassroom.jsx";
import "../../../styles/pages/LearningPages.css";

const DESCRIPTION =
  "Hands-on technology workshops by ProJenius for colleges and institutions in AI, IoT, robotics, software, electronics and rapid prototyping, designed around your students.";

/* Page flow (backgrounds alternate like the homepage):
   hero (navy) → areas (light) → formats (navy) → process (light) →
   experiences / participant stories (shown once real content is added) →
   workshop gallery (navy) → FAQ (last, light). */
export default function Workshop() {
  const pageRef = useRef(null);
  useMetaDescription(DESCRIPTION);
  useScrollReveal(pageRef);

  return (
    <main ref={pageRef} className="pjl-page pjl-workshops">
      <WorkshopThatGoesBeyondTheClassroom />
      <ExploreOurWorkshop />
      <DesignedAroundYourInstitution />
      <HowWeTurnARequirement />
      <OurWorkshopExperiences />
      <WhatParticipantsExperienced />
      <WorkshopGallery />
      <ServiceFaq
        id="workshop-faq"
        items={FAQ_ITEMS}
        askTo="/contact?type=workshop"
        secondary={{ label: "Plan a Workshop", to: "/contact?type=workshop" }}
        lead="Can’t find your answer? Ask us directly and our team will help you plan the right workshop."
      />
    </main>
  );
}
