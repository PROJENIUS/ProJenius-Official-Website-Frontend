/* =========================================================
   INCUBATION APPLICATION PAGE — /incubate/apply
   One section: the application form (questions in
   Components/Incubate/incubateData.js).
========================================================= */

import { useRef } from "react";

import IncubateApplyForm from "../../Components/Incubate/IncubateApplyForm/IncubateApplyForm.jsx";
import useMetaDescription from "../../hooks/useMetaDescription.js";
import useScrollReveal from "../../hooks/useScrollReveal.js";
import "../../styles/pages/SolutionsPages.css";

const DESCRIPTION = "Apply to incubate at ProJenius: tell us about you, your idea and what you need.";

export default function IncubateApplyPage() {
  const pageRef = useRef(null);
  useMetaDescription(DESCRIPTION);
  useScrollReveal(pageRef);

  return (
    <main ref={pageRef} className="pjsv-page pjsv-incubate-apply">
      <IncubateApplyForm />
    </main>
  );
}
