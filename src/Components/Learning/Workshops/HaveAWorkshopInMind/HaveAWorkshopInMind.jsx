import { Hammer, SlidersHorizontal, Trophy } from "lucide-react";

import ContactSection from "../../../About/ContactSection/ContactSection.jsx";
import { whatsappHref } from "../../../../utils/whatsapp.js";

/* =========================================================
   HAVE A WORKSHOP IN MIND? — the Workshop page's closing call
   to action. Uses the same card as the Home and About pages
   (About/ContactSection), so it has exactly the same size,
   spacing and motion; only the words and buttons change.
========================================================= */

const FEATURES = [
    { title: "Hands-On Sessions", text: "Students build, not just listen", Icon: Hammer },
    { title: "Customized Topics", text: "Shaped around your students", Icon: SlidersHorizontal },
    { title: "Practical Outcomes", text: "Something students can show", Icon: Trophy },
];

export default function HaveAWorkshopInMind() {
    return (
        <ContactSection
            id="hwm-title"
            title="Have a Workshop in Mind?"
            description="Tell us what your students or institution want to explore and the format that suits you. Let’s design a practical, hands-on workshop around it."
            features={FEATURES}
            primary={{
                label: "Plan a Workshop",
                href: whatsappHref("Hi ProJenius, we would like to plan a workshop for our students. Could you please share the details?"),
            }}
            secondary={{ label: "Talk to Our Team", href: "tel:+918925450473" }}
        />
    );
}
