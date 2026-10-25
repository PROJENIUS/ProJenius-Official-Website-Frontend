import QuestionsInstitutionsAsk from "../../Workshops/QuestionsInstitutionsAsk/QuestionsInstitutionsAsk.jsx";

/* =========================================================
   CAREER GUIDANCE FAQ — same layout and behaviour as the
   Workshop FAQ (one answer open at a time). Every answer
   repeats what the booking section on this page states.
========================================================= */

const CAREER_FAQS = [
  {
    question: "What happens in the 1:1 mentoring call?",
    answer:
      "It is a 30-minute call with a mentor. You get a real assessment of your resume or profile against your target role, a personalized first-draft roadmap, direct feedback on your biggest current gap and a clear recommendation on next steps.",
  },
  {
    question: "Why does the call cost ₹99 instead of being free?",
    answer:
      "A nominal fee brings in students who are genuinely serious, so mentors can give each call their full, undistracted attention instead of rushing through many low-commitment calls.",
  },
  {
    question: "Is the ₹99 refundable?",
    answer: "Yes. The fee is fully refundable if you are not satisfied with the call.",
  },
  {
    question: "Will the ₹99 be adjusted if I join a ProJenius program?",
    answer: "Yes. The call fee is credited toward the program fee if you enroll.",
  },
  {
    question: "Do I keep the roadmap if I don't continue with ProJenius?",
    answer:
      "Yes. The first-draft roadmap from your call is yours to keep, whether or not you continue with ProJenius. The mentor will also tell you honestly if ProJenius is not the right fit.",
  },
  {
    question: "Which career areas can a mentor help with?",
    answer:
      "Full stack, frontend and React, backend and APIs, AI and data science, cloud and DevOps, campus placement preparation and career transitions.",
  },
  {
    question: "Who is this guidance for?",
    answer:
      "College students, recent graduates, people switching into tech and working professionals who want to grow in their careers.",
  },
  {
    question: "How do I book a call?",
    answer:
      "Choose a date and time in the booking section on this page, add your details and send the request. The team confirms your slot. If online booking is unavailable, contact us on WhatsApp or by phone.",
  },
];

export default function CareerFaq() {
  return (
    <QuestionsInstitutionsAsk
      faqs={CAREER_FAQS}
      title="Questions"
      phrases={["Students Ask", "Freshers Ask", "Career Switchers Ask"]}
      contactTo="/contact?type=general"
      idPrefix="cgfaq"
    />
  );
}
