import { Link } from "react-router-dom";

/* =============================================================================
   COURSES PAGE — FAQ (shown with the shared ServiceFaq layout).
   Answers follow how the course checkout actually works (Razorpay checkout,
   instant confirmation, phone follow-up, secure receipt link, terms page).
   ============================================================================= */

export const COURSE_FAQ = [
  {
    q: "Are the classes online or offline?",
    a: "Our courses run in a hybrid format, so you can join online or attend at the ProJenius centre. Each course page shows its format.",
  },
  {
    q: "Which course should I choose?",
    a: "Search by the skill you want or filter by track, level and price above. If you are still unsure, ask us and we will suggest a starting point for your level.",
  },
  {
    q: "Do I need any prior experience?",
    a: "It depends on the course. Each course page lists its level and what you need before joining under “Audience and outcomes”.",
  },
  {
    q: "How do I enrol in a course?",
    a: "Open the course, enter your name, email and phone, accept the terms and continue to the secure Razorpay checkout to pay.",
  },
  {
    q: "Which payment methods can I use?",
    a: "Payments go through Razorpay’s secure checkout, where you can pay by UPI, debit or credit card, net banking or wallet.",
  },
  {
    q: "What happens after I pay?",
    a: "Your seat is confirmed straight away. You get a reference number and the payment receipt by email, and our team calls you with your batch details and the next steps.",
  },
  {
    q: "Can I choose my class days and timings?",
    a: "Yes, you can share your preferred days and time slots while enrolling. They are not a confirmed booking; our team confirms the batch with you.",
  },
  {
    q: "Will I get a payment receipt?",
    a: "Yes. After a successful payment you get a secure receipt link, valid for seven days. You can request a new link by email from the course page.",
  },
  {
    q: "Do I get a certificate?",
    a: "Courses that include a certificate show it on the course page, with what you need to complete to earn it.",
  },
  {
    q: "What is the refund policy?",
    a: <>Fees, cancellations and refunds are covered in our <Link to="/services/courses/terms">Course Terms &amp; Refund Policy</Link>. Please read it before you pay.</>,
  },
];
