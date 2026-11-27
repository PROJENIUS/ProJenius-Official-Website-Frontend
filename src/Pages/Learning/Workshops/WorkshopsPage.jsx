import { useRef } from "react";
import useMetaDescription from "../../../hooks/useMetaDescription.js";
import useScrollReveal from "../../../hooks/useScrollReveal.js";

import WorkshopFormats from "../../../Components/Learning/Workshops/WorkshopFormats/WorkshopFormats.jsx";
import WorkshopAreas from "../../../Components/Learning/Workshops/WorkshopAreas/WorkshopAreas.jsx";
import OurProcess from "../../../Components/Learning/Workshops/OurProcess/OurProcess.jsx";
import OurWorkshopExperiences from "../../../Components/Learning/Workshops/OurWorkshopExperiences/OurWorkshopExperiences.jsx";
import ServiceFaq from "../../../Components/Common/ServiceFaq/ServiceFaq.jsx";
import { WORKSHOP_FAQS } from "../../../Components/Learning/Workshops/QuestionsInstitutionsAsk/workshopFaqData.js";

const FAQ_ITEMS = WORKSHOP_FAQS.map(({ question, answer }) => ({ q: question, a: answer }));
import WorkshopGallery from "../../../Components/Learning/Workshops/WorkshopGallery/WorkshopGallery.jsx";
import WhatParticipantsExperienced from "../../../Components/Learning/Workshops/WhatParticipantsExperienced/WhatParticipantsExperienced.jsx";
import WorkshopsAndTraining from "../../../Components/Learning/Workshops/WorkshopsAndTraining/WorkshopsAndTraining.jsx";
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
      <WorkshopsAndTraining />
      <WorkshopAreas />
      <WorkshopFormats />
      <OurProcess />
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
