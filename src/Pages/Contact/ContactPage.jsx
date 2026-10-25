import ContactHero from "../../Components/Contact/ContactHero/ContactHero.jsx";
import WhatCanWeHelpYouWith from "../../Components/Contact/WhatCanWeHelpYouWith/WhatCanWeHelpYouWith.jsx";
import PreferToReachUsDirectly from "../../Components/Contact/PreferToReachUsDirectly/PreferToReachUsDirectly.jsx";
import WhatHappensNext from "../../Components/Contact/WhatHappensNext/WhatHappensNext.jsx";

/* =========================================================
   CONTACT PAGE
   Page-level composition only.

   Each section manages its own:
   - JSX
   - External CSS
   - Local state
   - Section-specific interactions
========================================================= */

const Contact = () => {
  return (
    <>
      <ContactHero />
      <WhatCanWeHelpYouWith />
      <PreferToReachUsDirectly />
      <WhatHappensNext />
    </>
  );
};

export default Contact;