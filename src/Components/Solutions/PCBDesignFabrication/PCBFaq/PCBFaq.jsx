import { Link } from "react-router-dom";

import ServiceFaq from "../../../Common/ServiceFaq/ServiceFaq.jsx";
import { contactLink } from "../../Shared/serviceLinks.js";

/* =============================================================================
   PCB FAQ — the PCB questions, shown with the shared ServiceFaq layout
   (sticky heading on the left, questions on the right). Answers state only
   what ProJenius has confirmed (no prices or fixed timelines).
   ============================================================================= */

const FAQ_ITEMS = [
  {
    q: "Can you design a PCB from my project idea?",
    a: "Yes. Tell us what the board must do. We take it through schematic and PCB layout, and you approve the design before anything is made.",
  },
  {
    q: "Do you support custom PCB fabrication?",
    a: "Yes. Our manufacturing partner makes the board, one custom board or as many as you need. We then test it, show you a working demo and hand it over.",
  },
  {
    q: "Can students and startups approach ProJenius?",
    a: (
      <>
        Yes. Students, startups and businesses can all approach us. If you are building a startup product,
        see <Link to="/startup">Startup &amp; Innovation</Link>.
      </>
    ),
  },
  {
    q: "Can I request only PCB design services?",
    a: "Yes. You can ask for the design alone (schematic and layout files), or for the design together with manufacturing, testing and handover.",
  },
  {
    q: "How many boards can you make?",
    a: "One custom board, or as many as you need. Tell us the quantity at the start and we plan the manufacturing for it.",
  },
  {
    q: "Do I approve the design before manufacturing?",
    a: "Yes. You review the schematic and PCB layout, and nothing is made until you approve the design.",
  },
  {
    q: "Will the board be tested before handover?",
    a: "Yes. The board is powered up and tested with its firmware, we show you a working demo, and then it is handed over to you.",
  },
  {
    q: "What should I share to get started?",
    a: "A schematic or block diagram if you have one, the key components, board size, connectors and mounting needs, how many boards you need and your timeline. A clear description of what the board must do is also enough to begin.",
  },
  {
    q: "Can you also write the firmware or build the app?",
    a: (
      <>
        Yes. Firmware and electronics are covered on <Link to="/services/hardware-embedded-systems">Hardware &amp; Embedded Systems</Link>,
        and dashboards and apps on <Link to="/services/development">Software Development</Link>.
      </>
    ),
  },
  {
    q: "How do I start a PCB project?",
    a: "Use \"Discuss PCB Requirements\" below or message us on WhatsApp. Share what the board must do and we will suggest the right starting point.",
  },
];

export default function PCBFaq() {
  return <ServiceFaq id="pcb-faq" items={FAQ_ITEMS} askTo={contactLink("development", "pcb-faq")} />;
}
