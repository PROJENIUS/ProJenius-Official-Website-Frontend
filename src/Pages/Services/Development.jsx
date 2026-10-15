/* =========================================================
   DEVELOPMENT PAGE
   Only composes the Development sections.
   Each section manages its own JSX and external CSS.
========================================================= */

import DevelopmentHero from "../../Components/Development/DevelopmentHero/DevelopmentHero";
import OurApproach from "../../Components/Development/OurApproach/OurApproach";
import WhereverYouAre from "../../Components/Development/WhereverYouAre/WhereverYouAre";
import WhatCanWeBuild from "../../Components/Development/WhatCanWeBuild/WhatCanWeBuild";
import HowWeTurn from "../../Components/Development/HowWeTurn/HowWeTurn";
import DifferentTechnologies from "../../Components/Development/DifferentTechnologies/DifferentTechnologies";
import AlreadyHaveADigitalProduct from "../../Components/Development/AlreadyHaveADigitalProduct/AlreadyHaveADigitalProduct";
import AlreadyBuiltDoesntMeanDone from "../../Components/Development/AlreadyBuiltDoesntMeanDone/AlreadyBuiltDoesntMeanDone";
import LaunchingIsNotTheEnd from "../../Components/Development/LaunchingIsNotTheEnd/LaunchingIsNotTheEnd";
import WhyBuildWithProJenius from "../../Components/Development/WhyBuildWithProJenius/WhyBuildWithProJenius";

const Development = () => {
  return (
    <>
      {/* DEVELOPMENT HERO */}
      <DevelopmentHero />

      {/* OUR APPROACH */}
      <OurApproach />

      {/* WHEREVER YOU ARE */}
      <WhereverYouAre />

      {/* WHAT CAN WE BUILD */}
      <WhatCanWeBuild />

      {/* HOW WE TURN */}
      <HowWeTurn />

      {/* DIFFERENT TECHNOLOGIES */}
      <DifferentTechnologies />

      {/* ALREADY HAVE A DIGITAL PRODUCT */}
      <AlreadyHaveADigitalProduct />

      {/* ALREADY BUILT DOESN'T MEAN DONE */}
      <AlreadyBuiltDoesntMeanDone />

      {/* LAUNCHING IS NOT THE END */}
      <LaunchingIsNotTheEnd />

      {/* WHY BUILD WITH PROJENIUS */}
      <WhyBuildWithProJenius />
    </>
  );
};

export default Development;