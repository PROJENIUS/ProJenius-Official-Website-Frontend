import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Breadcrumbs from "../../Components/Common/Breadcrumbs/Breadcrumbs.jsx";
import ApplyNow from "../../Components/JoinOurTeam/ApplyNow/ApplyNow.jsx";
import { GENERAL_APPLICATION } from "../../Components/JoinOurTeam/openings.js";
import { useOpenings } from "../../Components/JoinOurTeam/careersApi.js";
import useMetaDescription from "../../hooks/useMetaDescription.js";
import useScrollReveal from "../../hooks/useScrollReveal.js";
import "../../Components/JoinOurTeam/OpenRoles/OpenRoles.css";
import "./JobOpeningPage.css";

/* =============================================================================
   APPLY — /join-our-team/apply[?role=<slug>]
   The application form on its own page, like a company careers portal. A
   role link (?role=…) chooses that role; without one, or for a closed role,
   it is a general application. Applications are stored by the backend and
   appear in Admin → Enquiries → Career applications with the resume.
   ============================================================================= */

export default function JoinApplyPage() {
  const pageRef = useRef(null);
  const [params] = useSearchParams();
  const { status, items } = useOpenings();
  const wanted = params.get("role") || "";
  const [picked, setPicked] = useState(null);
  useMetaDescription("Apply to ProJenius Innovation Technology, Madurai: choose an open role or send a general application with your resume. Takes about 5 minutes.");
  useScrollReveal(pageRef);

  /* The role from the link (once the roles have loaded) until the visitor picks one. */
  const fromLink = items.find((item) => item.slug === wanted)?.title || (status === "loading" ? "" : GENERAL_APPLICATION);
  const role = picked ?? fromLink;

  const chosen = items.find((item) => item.title === role);
  const crumbs = [{ label: "Home", to: "/" }, { label: "Join Our Team", to: "/join-our-team" }, { label: "Apply" }];

  return (
    <main ref={pageRef} className="pjc-apply-page">
      <section className="pjc-job-head" aria-labelledby="pjc-apply-title">
        <div className="pjds-container">
          <Breadcrumbs items={crumbs} />
          <p className="pjc-job-head__team">Careers at ProJenius</p>
          <h1 id="pjc-apply-title">{chosen ? `Apply for ${chosen.title}` : "Apply to ProJenius"}</h1>
          <p className="pjc-job-head__intro">
            {chosen
              ? `${chosen.employmentType} · ${chosen.location} (${chosen.workMode}). Fill in your details and upload your resume; our team reviews every application.`
              : "Choose an open role, or send a general application if none fits yet. Our team reviews every application and contacts shortlisted applicants."}
            {wanted && status === "ready" && !items.some((item) => item.slug === wanted) && " The role in your link is no longer open, so this is a general application."}
          </p>
        </div>
      </section>
      <ApplyNow role={role} onRoleChange={setPicked} openings={items} />
    </main>
  );
}
