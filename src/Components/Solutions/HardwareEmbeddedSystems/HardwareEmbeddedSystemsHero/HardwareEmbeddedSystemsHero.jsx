import CinematicHero, { HeroTerminal } from "../../../Common/CinematicHero/CinematicHero.jsx";
import { contactLink } from "../../Shared/serviceLinks.js";
import { heroPhotos } from "../../../Common/HeroPhotoStack/heroPhotos.js";
import benchPhoto from "../../../../assets/About/Achievements/Achievements_4.webp";

/* =============================================================================
   HARDWARE & EMBEDDED SYSTEMS HERO — the shared cinematic hero with the
   typing terminal. The steps follow the page's own system layers (sensors,
   microcontroller, firmware, results).
   Photo: src/assets/Heroes/hardware/backdrop.* (see its README).
   ============================================================================= */

const HERO = heroPhotos("hardware", { backdrop: benchPhoto });

const TERMINAL = [
  { kind: "cmd", text: "projenius build --device \"sensor node\"" },
  { kind: "info", text: "reading the requirements..." },
  { kind: "ok", text: "sensors selected and wired" },
  { kind: "ok", text: "firmware running on the microcontroller" },
  { kind: "ok", text: "data reaching the dashboard" },
  { kind: "ok", text: "tested in real conditions" },
  { kind: "done", text: "working, testable system" },
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
      aside={<HeroTerminal file="firmware.sh" label="How a hardware project comes together" lines={TERMINAL} />}
      band={["Embedded Systems", "Firmware Development", "Sensor Integration", "IoT & Connected Devices", "Circuit Design", "Hardware–Software Integration"]}
      className="pjhw-hero"
    />
  );
}
