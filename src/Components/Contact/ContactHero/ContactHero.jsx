import CinematicHero from "../../Common/CinematicHero/CinematicHero.jsx";
import { whatsappHref } from "../../../utils/whatsapp.js";
import { heroPhotos } from "../../Common/HeroPhotoStack/heroPhotos.js";
import teamPhoto from "../../../assets/Home/Optimized/who-we-are-team-900.webp";

/* =============================================================================
   CONTACT HERO — the shared cinematic hero.
   Photo: src/assets/Heroes/contact/backdrop.* (see its README). The two
   fact cards are the direct phone and email links; enquiry types are
   chosen in the form below (#pj-contact-help).
   ============================================================================= */

const HERO = heroPhotos("contact", { backdrop: teamPhoto });

const PHONE_DISPLAY = "+91 89254 50473";
const PHONE_HREF = "tel:+918925450473";
const EMAIL = "teamprojenius@gmail.com";

export default function ContactHero() {
  return (
    <CinematicHero
      id="pj-contact-hero-title"
      eyebrow="Contact ProJenius"
      title="Let’s Start"
      accent="a Conversation"
      description="An idea to build, a workshop to run, a technology to learn or a project to discuss: tell us what you need and we’ll connect you with the right ProJenius team."
      primary={{ label: "Start an Enquiry", to: "#pj-contact-help" }}
      secondary={{
        label: "Chat on WhatsApp",
        to: whatsappHref("Hi ProJenius, I would like to discuss an enquiry with your team."),
      }}
      photo={HERO.backdrop}
      facts={[
        { label: "Call us", title: PHONE_DISPLAY, text: "Madurai, Tamil Nadu", to: PHONE_HREF },
        { label: "Email us", title: EMAIL, to: `mailto:${EMAIL}` },
      ]}
      band={["Startup & Innovation", "Development", "Workshops", "Courses & Learning", "Internships", "Join Our Team"]}
      className="pj-contact-hero"
    />
  );
}
