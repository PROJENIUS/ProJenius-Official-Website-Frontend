import { ArrowRight } from "lucide-react";

import ServiceHero from "../../Shared/ServiceHero/ServiceHero.jsx";
import { contactLink } from "../../Shared/serviceLinks.js";
import labPhoto from "../../../../assets/Home/HeroSlides/hero-slide-3.webp";
import "./HardwareEmbeddedSystemsHero.css";

/* =============================================================================
   HARDWARE & EMBEDDED SYSTEMS HERO
   Visual: the homepage lab photo (students working on a hardware
   prototype) with the signal chain the page explains below.
   ============================================================================= */

const CHAIN = ["Sensor", "Controller", "Firmware", "Output / Cloud"];

function HardwareHeroVisual() {
  return (
    <figure className="pjhw-hero-visual">
      <img
        src={labPhoto}
        width="1600"
        height="721"
        alt="Students working together on a hardware prototype in a lab"
        decoding="async"
      />
      <figcaption className="pjhw-hero-visual__chain">
        {CHAIN.map((step, index) => (
          <span key={step} className="pjhw-hero-visual__step">
            {step}
            {index < CHAIN.length - 1 && <ArrowRight size={14} strokeWidth={2.4} aria-hidden="true" />}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}

export default function HardwareEmbeddedSystemsHero() {
  return (
    <ServiceHero
      id="hardware-hero-title"
      eyebrow="Hardware & Embedded Systems"
      title="Electronics and Firmware"
      highlight="Built for the Real World"
      description="Embedded systems, firmware, sensor integration and connected IoT devices, from the first circuit to a working, testable system."
      primary={{ label: "Discuss Hardware Requirements", to: contactLink("development", "hardware-embedded-systems") }}
      secondary={{ label: "See How It Fits Together", to: "#hardware-system" }}
      visual={<HardwareHeroVisual />}
      className="pjhw-hero"
    />
  );
}
