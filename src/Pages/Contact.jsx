import ContactHero from "../Components/Contact/ContactHero/ContactHero";
import WhatCanWeHelpYouWith from "../Components/Contact/WhatCanWeHelpYouWith/WhatCanWeHelpYouWith";
import PreferToReachUsDirectly from "../Components/Contact/PreferToReachUsDirectly/PreferToReachUsDirectly";
import WhatHappensNext from "../Components/Contact/WhatHappensNext/WhatHappensNext";

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