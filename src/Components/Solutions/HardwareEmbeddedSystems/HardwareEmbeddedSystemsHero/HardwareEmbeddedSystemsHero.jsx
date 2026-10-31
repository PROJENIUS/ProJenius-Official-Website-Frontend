import CinematicHero from "../../../Common/CinematicHero/CinematicHero.jsx";
import { contactLink } from "../../Shared/serviceLinks.js";
import { heroPhotos } from "../../../Common/HeroPhotoStack/heroPhotos.js";
import benchPhoto from "../../../../assets/About/Achievements/Achievements_4.webp";

/* =============================================================================
   HARDWARE & EMBEDDED SYSTEMS HERO — the shared cinematic hero.
   Photo: src/assets/Heroes/hardware/backdrop.* (see its README); the real
   photo below is used until one is added there.
   ============================================================================= */

const HERO = heroPhotos("hardware", { backdrop: benchPhoto });

export default function HardwareEmbeddedSystemsHero() {
  return (
    <CinematicHero
      id="hardware-hero-title"
      eyebrow="Hardware & Embedded Systems"
      title="Electronics and Firmware"
      accent="Built for the Real World"
      description="Embedded systems, firmware, sensor integration and connected IoT devices, from the first circuit to a working, testable system."
      primary={{ label: "Discuss Hardware Requirements", to: contactLink("development", "hardware-embedded-systems") }}
      secondary={{ label: "See How It Fits Together", to: "#hardware-system" }}
      photo={HERO.backdrop}
      facts={[
        { label: "What we build", title: "Embedded systems and firmware", chips: ["Sensors", "IoT", "Circuits"] },
        { label: "How it fits", title: "Sensors, controller, firmware, results", to: "#hardware-system" },
      ]}
      band={["Embedded Systems", "Firmware Development", "Sensor Integration", "IoT & Connected Devices", "Circuit Design", "Hardware–Software Integration"]}
      className="pjhw-hero"
    />
  );
}
