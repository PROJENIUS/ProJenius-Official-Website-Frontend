import { CalendarCheck, Compass, FileText } from "lucide-react";

import ContactSection from "../../../About/ContactSection/ContactSection.jsx";
import { whatsappHref } from "../../../../utils/whatsapp.js";

/* =========================================================
   CAREER GUIDANCE CLOSING CARD — the same card as the Home,
   About and Workshop pages (About/ContactSection), with this
   page's words and buttons.
========================================================= */

const FEATURES = [
  { title: "1:1 Mentor Call", text: "30 minutes, just you", Icon: CalendarCheck },
  { title: "Clear Roadmap", text: "Yours to keep", Icon: Compass },
  { title: "Honest Feedback", text: "On your biggest gap", Icon: FileText },
];

export default function CareerClosing() {
  return (
    <ContactSection
      id="cg-closing-title"
      title="Ready to Plan Your Tech Career?"
      description="Talk to a mentor about where you are now and where you want to be. We will help you map the next steps, from skills to your first offer."
      features={FEATURES}
      primary={{
        label: "Talk to a Mentor",
        href: whatsappHref("Hi ProJenius, I would like career guidance. Could you please help me book a mentoring call?"),
      }}
      secondary={{ label: "Call Our Team", href: "tel:+918925450473" }}
    />
  );
}
