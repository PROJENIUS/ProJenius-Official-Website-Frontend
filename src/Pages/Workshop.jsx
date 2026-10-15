

import React from "react";

import BringAProJeniusWorkshopToYourCampus from "../Components/Workshop/BringAProJeniusWorkshopToYourCampus/BringAProJeniusWorkshopToYourCampus";
import DesignedAroundYourInstitution from "../Components/Workshop/DesignedAroundYourInstitution/DesignedAroundYourInstitution";
import ExploreOurWorkshopAreas from "../Components/Workshop/ExploreOurWorkshopAreas/ExploreOurWorkshopAreas";
import HaveAWorkshopInMind from "../Components/Workshop/HaveAWorkshopInMind/HaveAWorkshopInMind";
import HowWeTurnARequirementIntoAWorkshop from "../Components/Workshop/HowWeTurnARequirementIntoAWorkshop/HowWeTurnARequirementIntoAWorkshop";
import InsideOurWorkshops from "../Components/Workshop/InsideOurWorkshops/InsideOurWorkshops";
import MoreThanKnowledgePracticalExperience from "../Components/Workshop/MoreThanKnowledgePracticalExperience/MoreThanKnowledgePracticalExperience";
import NotJustAWorkshopAHandsOnExperience from "../Components/Workshop/NotJustAWorkshopAHandsOnExperience/NotJustAWorkshopAHandsOnExperience";
import OneWorkshopCanBeTheBeginning from "../Components/Workshop/OneWorkshopCanBeTheBeginning/OneWorkshopCanBeTheBeginning";
import OurWorkshopExperiences from "../Components/Workshop/OurWorkshopExperiences/OurWorkshopExperiences";
import QuestionsInstitutionsAsk from "../Components/Workshop/QuestionsInstitutionsAsk/QuestionsInstitutionsAsk";
import WhatParticipantsExperienced from "../Components/Workshop/WhatParticipantsExperienced/WhatParticipantsExperienced";
import WorkshopThatGoesBeyondTheClassroom from "../Components/Workshop/WorkshopThatGoesBeyondTheClassroom/WorkshopThatGoesBeyondTheClassroom.jsx";

export default function Workshop() {
  return (
    <main>
      <WorkshopThatGoesBeyondTheClassroom />
      <NotJustAWorkshopAHandsOnExperience />
      <ExploreOurWorkshopAreas />
      <DesignedAroundYourInstitution />
      <HowWeTurnARequirementIntoAWorkshop />
      <OurWorkshopExperiences />
      <InsideOurWorkshops />
      <WhatParticipantsExperienced />
      <MoreThanKnowledgePracticalExperience />
      <OneWorkshopCanBeTheBeginning />
      <BringAProJeniusWorkshopToYourCampus />
      <QuestionsInstitutionsAsk />
      <HaveAWorkshopInMind />
    </main>
  );
}