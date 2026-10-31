import CinematicHero, { HeroLinks } from "../../Common/CinematicHero/CinematicHero.jsx";
import { whatsappHref } from "../../../utils/whatsapp.js";
import { heroPhotos } from "../../Common/HeroPhotoStack/heroPhotos.js";
import teamPhoto from "../../../assets/Home/Optimized/who-we-are-team-900.webp";

/* =============================================================================
   CONTACT HERO — the shared cinematic hero with "On this page" links.
   Photo: src/assets/Heroes/contact/backdrop.* (see its README). Phone,
   email and enquiry types are in the sections the links point to.
   ============================================================================= */

const HERO = heroPhotos("contact", { backdrop: teamPhoto });

const PAGE_LINKS = [
  { label: "Start an enquiry", to: "#pj-contact-help" },
  { label: "What happens next", to: "#pj-contact-next" },
  { label: "Reach us directly", to: "#pj-contact-direct" },
];

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
      aside={<HeroLinks items={PAGE_LINKS} />}
      band={["Startup & Innovation", "Development", "Workshops", "Courses & Learning", "Internships", "Join Our Team"]}
      className="pj-contact-hero"
    />
  );
}
