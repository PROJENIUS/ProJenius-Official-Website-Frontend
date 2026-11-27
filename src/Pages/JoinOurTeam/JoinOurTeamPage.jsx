import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, Lightbulb, Rocket, Users } from "lucide-react";

import useMetaDescription from "../../hooks/useMetaDescription.js";
import useScrollReveal from "../../hooks/useScrollReveal.js";
import JoinHero from "../../Components/JoinOurTeam/JoinHero/JoinHero.jsx";
import WhyProjenius from "../../Components/JoinOurTeam/WhyProjenius/WhyProjenius.jsx";
import OpenRoles from "../../Components/JoinOurTeam/OpenRoles/OpenRoles.jsx";
import HiringProcess from "../../Components/JoinOurTeam/HiringProcess/HiringProcess.jsx";
import QuestionsInstitutionsAsk from "../../Components/Learning/Workshops/QuestionsInstitutionsAsk/QuestionsInstitutionsAsk.jsx";
import ContactSection from "../../Components/About/ContactSection/ContactSection.jsx";
import { whatsappHref } from "../../utils/whatsapp.js";
import "../../styles/pages/LearningPages.css";

/* =========================================================
   JOIN OUR TEAM PAGE
   Page flow (backgrounds alternate like the homepage):
   Sections follow the site colour cadence (navy / light / navy …):
   hero → why join → open roles (from Admin → Job Openings) → hiring
   process → apply band → FAQ → closing card.
   Each role has its own page (/join-our-team/:slug) and the application
   form has its own page (/join-our-team/apply), like a careers portal.
========================================================= */

const DESCRIPTION =
  "Careers at ProJenius Innovation Technology, Madurai. See open roles in software, hardware and training, learn how hiring works and apply online with your resume.";

const JOIN_FAQS = [
  {
    question: "How do I apply?",
    answer:
      "Open a role and press Apply, or use the Apply page for a general application. Upload your resume as a PDF, DOC or DOCX file of up to 5 MB.",
  },
  {
    question: "Can I apply if no listed role matches me?",
    answer:
      "Yes. Choose \"General application\" in the form and tell us about your skills and the kind of work you are looking for.",
  },
  {
    question: "What should I write in \"Why do you want to join ProJenius?\"",
    answer:
      "A short, honest note of 20 to 300 words: what you have built or learned so far, what you want to work on and why ProJenius interests you.",
  },
  {
    question: "How will I hear back?",
    answer:
      "After you submit, you see a reference number. Our team reviews every application and contacts shortlisted applicants by email or phone.",
  },
  {
    question: "I am a student. Should I apply here?",
    answer:
      "If you are looking for an internship with live projects and mentoring, see the Internship page. For other roles you can apply here.",
  },
];

const CLOSING_FEATURES = [
  { title: "Real Projects", text: "Work that ships to real users", Icon: Rocket },
  { title: "Growing Team", text: "Learn with people who build", Icon: Users },
  { title: "New Ideas", text: "Room to try and improve", Icon: Lightbulb },
];

export default function JoinOurTeamPage() {
  const pageRef = useRef(null);
  useMetaDescription(DESCRIPTION);
  useScrollReveal(pageRef);

  return (
    <main ref={pageRef} className="pjl-page pj-join-page">
      <JoinHero />
      <WhyProjenius />
      <OpenRoles />
      <HiringProcess />
      <section className="pjc-band" aria-labelledby="pjc-band-title">
        <div className="pjds-container pjc-band__inner">
          <span className="pjc-band__icon" aria-hidden="true"><FileText size={26} /></span>
          <div>
            <h2 id="pjc-band-title" className="pjc-band__title">Ready to apply?</h2>
            <p className="pjc-band__text">Apply for an open role or send a general application. It takes about 5 minutes with your resume ready.</p>
          </div>
          <Link className="pjc-btn pjc-btn--primary" to="/join-our-team/apply">Start your application <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
      </section>
      <QuestionsInstitutionsAsk
        faqs={JOIN_FAQS}
        title="Questions"
        phrases={["Applicants Ask", "Freshers Ask", "Engineers Ask"]}
        contactTo="/contact?type=join-our-team"
        idPrefix="joinfaq"
      />
      <ContactSection
        id="join-cta-title"
        title="Don't See the Right Role?"
        description="Tell us what you are good at and what you want to build. We would like to hear from people who love solving real problems with technology."
        features={CLOSING_FEATURES}
        primary={{
          label: "Message Us on WhatsApp",
          href: whatsappHref("Hi ProJenius, I would like to know about career opportunities at ProJenius."),
        }}
        secondary={{ label: "Talk to Our Team", href: "tel:+918925450473" }}
      />
    </main>
  );
}
