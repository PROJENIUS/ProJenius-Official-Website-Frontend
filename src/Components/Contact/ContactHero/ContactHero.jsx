import CinematicHero from "../../Common/CinematicHero/CinematicHero.jsx";
import { HeroChooser } from "../../Common/CinematicHero/HeroPanels.jsx";
import { whatsappHref } from "../../../utils/whatsapp.js";
import { heroPhotos } from "../../Common/HeroPhotoStack/heroPhotos.js";
import teamPhoto from "../../../assets/Home/Optimized/who-we-are-team-900.webp";

/* =============================================================================
   CONTACT HERO — the shared cinematic hero with "What brings you here?"
   choices. Each choice scrolls to the enquiry form and announces its type
   with ENQUIRY_REQUEST_EVENT, which WhatCanWeHelpYouWith listens for. The
   keys match its ENQUIRY_TYPES.
   Photo: src/assets/Heroes/contact/backdrop.* (see its README).
   ============================================================================= */

const HERO = heroPhotos("contact", { backdrop: teamPhoto });

const ENQUIRY_REQUEST_EVENT = "pj-contact-enquiry-request";

const CHOICES = [
  { key: "development", title: "I need something built", text: "Software, hardware, PCB or a prototype" },
  { key: "startup", title: "I have a product idea", text: "Startup and innovation support" },
  { key: "workshop", title: "I want a workshop", text: "For a college, department or club" },
  { key: "course", title: "I want to learn", text: "Courses and internships" },
  { key: "career", title: "I want to join the team", text: "Careers at ProJenius" },
];

export default function ContactHero() {
  return (
    <CinematicHero
      id="pj-contact-hero-title"
      eyebrow="Contact ProJenius"
      title="Let’s Start"
      accent="a Conversation"
      description="An idea to build, a workshop to run, a technology to learn or a project to discuss: tell us what you need and we’ll connect you with the right ProJenius team."
      primary={{ label: "Call +91 89254 50473", to: "tel:+918925450473" }}
      secondary={{
        label: "Chat on WhatsApp",
        to: whatsappHref("Hi ProJenius, I would like to discuss an enquiry with your team."),
      }}
      photo={HERO.backdrop}
      aside={<HeroChooser title="What brings you here?" choices={CHOICES} target="#pj-contact-help" eventName={ENQUIRY_REQUEST_EVENT} />}
      band={["Startup & Innovation", "Development", "Workshops", "Courses & Learning", "Internships", "Join Our Team"]}
      className="pj-contact-hero"
    />
  );
}
