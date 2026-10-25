import { Link } from "react-router-dom";
import { FlaskConical, Lightbulb, Package, Rocket, Wrench } from "lucide-react";

import ServiceHero from "../../Solutions/Shared/ServiceHero/ServiceHero.jsx";
import { SERVICE_ROUTES } from "../../Solutions/Shared/serviceLinks.js";
import recognitionEvent from "../../../assets/Home/HeroSlides/hero-slide-5.webp";
import "./StartupSupporterHero.css";

/* =============================================================================
   STARTUP & INNOVATION HERO
   Backdrop: the homepage science-and-innovation event photo under the navy
   layer. Visual: the idea-to-product path, each stage linked to the service
   that supports it.
   ============================================================================= */

const PATH = [
  { Icon: Lightbulb, stage: "Idea", text: "A problem worth solving" },
  { Icon: FlaskConical, stage: "Validate", text: "Feasibility and research" },
  { Icon: Wrench, stage: "Prototype", text: "Hardware, PCB or 3D parts", links: [
    { to: SERVICE_ROUTES.hardware, label: "Hardware" },
    { to: SERVICE_ROUTES.pcb, label: "PCB" },
    { to: SERVICE_ROUTES.prototyping, label: "Prototyping" },
  ] },
  { Icon: Package, stage: "MVP", text: "A first version for real users", links: [
    { to: SERVICE_ROUTES.software, label: "Software" },
  ] },
  { Icon: Rocket, stage: "Next stage", text: "IP, registration and readiness guidance" },
];

function JourneyCard() {
  return (
    <figure className="pjsi-hero-path">
      <figcaption className="pjsi-hero-path__title">From idea to product</figcaption>
      <ol className="pjsi-hero-path__list">
        {PATH.map(({ Icon, stage, text, links }) => (
          <li key={stage} className="pjsi-hero-path__item">
            <span className="pjsi-hero-path__icon" aria-hidden="true"><Icon size={18} strokeWidth={2.1} /></span>
            <div className="pjsi-hero-path__text">
              <span className="pjsi-hero-path__stage">{stage}</span>
              <span className="pjsi-hero-path__desc">{text}</span>
              {links && (
                <span className="pjsi-hero-path__links">
                  {links.map((link) => <Link key={link.to} to={link.to}>{link.label}</Link>)}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </figure>
  );
}

export default function StartupSupporterHero() {
  return (
    <ServiceHero
      id="startup-hero-title"
      eyebrow="Startup & Innovation"
      title="From an Idea"
      highlight="to a Working Product"
      description="For founders, students and innovators with a product idea: we help clarify the problem, check what is feasible and build the prototype or MVP across software, electronics and product design."
      primary={{ label: "Submit Your Idea", to: "#submit-idea" }}
      secondary={{ label: "See What Happens Next", to: "#idea-journey" }}
      backdrop={recognitionEvent}
      visual={<JourneyCard />}
      className="pjsi-hero"
    />
  );
}
