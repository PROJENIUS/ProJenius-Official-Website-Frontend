import CinematicHero from "../../../Common/CinematicHero/CinematicHero.jsx";
import { HeroScope } from "../../../Common/CinematicHero/HeroPanels.jsx";
import { contactLink } from "../../Shared/serviceLinks.js";
import { heroPhotos } from "../../../Common/HeroPhotoStack/heroPhotos.js";
import benchPhoto from "../../../../assets/About/Achievements/Achievements_4.webp";

/* =============================================================================
   HARDWARE & EMBEDDED SYSTEMS HERO — the shared cinematic hero with an
   oscilloscope showing live signals (an illustration, not measured data).
   Photo: src/assets/Heroes/hardware/backdrop.* (see its README).
   ============================================================================= */

const HERO = heroPhotos("hardware", { backdrop: benchPhoto });

const READINGS = [
  { label: "CH1 · Sensor", value: "3.3 V" },
  { label: "CH2 · PWM", value: "50 %" },
  { label: "Frequency", value: "1.0 kHz" },
];

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
      aside={<HeroScope readings={READINGS} />}
      band={["Embedded Systems", "Firmware Development", "Sensor Integration", "IoT & Connected Devices", "Circuit Design", "Hardware–Software Integration"]}
      className="pjhw-hero"
    />
  );
}
