import { useRef } from "react";

import ContactHero from "../../Components/Contact/ContactHero/ContactHero.jsx";
import WhatCanWeHelpYouWith from "../../Components/Contact/WhatCanWeHelpYouWith/WhatCanWeHelpYouWith.jsx";
import OurOffice from "../../Components/Contact/OurOffice/OurOffice.jsx";
import AfterYouWrite from "../../Components/Contact/AfterYouWrite/AfterYouWrite.jsx";
import useMetaDescription from "../../hooks/useMetaDescription.js";
import useScrollReveal from "../../hooks/useScrollReveal.js";
import "../../styles/pages/LearningPages.css";

/* =========================================================
   CONTACT PAGE
   Page flow (backgrounds alternate like the homepage):
   hero (navy) → enquiry form (light) → what happens next
   (navy) → direct channels (white).

   Each section manages its own JSX, CSS, state and
   interactions; the shared reveal motion comes from
   useScrollReveal + LearningPages.css (main.pjl-page).
========================================================= */

const DESCRIPTION =
  "Contact ProJenius Innovation Technology, Madurai, for product development, workshops, courses, internships, careers and partnerships. Send an enquiry or reach us by phone, WhatsApp or email.";

const Contact = () => {
  const pageRef = useRef(null);
  useMetaDescription(DESCRIPTION);
  useScrollReveal(pageRef);

  return (
    <main ref={pageRef} className="pjl-page pj-contact-page">
      <ContactHero />
      <WhatCanWeHelpYouWith />
      <AfterYouWrite />
      <OurOffice />
    </main>
  );
};

export default Contact;
