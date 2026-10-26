import ServiceHero from "../../Shared/ServiceHero/ServiceHero.jsx";
import { contactLink } from "../../Shared/serviceLinks.js";
import HeroPhotoStack from "../../../Common/HeroPhotoStack/HeroPhotoStack.jsx";
import { heroPhotos } from "../../../Common/HeroPhotoStack/heroPhotos.js";
import labPhoto from "../../../../assets/Home/HeroSlides/hero-slide-3.webp";
import benchPhoto from "../../../../assets/Home/OurProjects/OurProjects_2.webp";
import iotKitPhoto from "../../../../assets/Home/OurProducts/OurProducts_2.webp";
import machinePhoto from "../../../../assets/Home/OurProducts/OurProducts_1.webp";

/* =============================================================================
   HARDWARE & EMBEDDED SYSTEMS HERO
   Backdrop: the lab photo (students working on a hardware prototype) under
   the navy layer. Visual: the shared rotating photo stack.
   Photos: src/assets/Heroes/hardware/ (see its README); the real photos
   below are used until photos are added there.
   ============================================================================= */

const HERO = heroPhotos("hardware", {
  backdrop: labPhoto,
  cards: [
    { image: labPhoto, category: "Prototype", title: "Testing a hardware prototype" },
    { image: benchPhoto, category: "Embedded", title: "Circuit and firmware testing" },
    { image: iotKitPhoto, category: "IoT Product", title: "ProJenius IoT Learning Kit" },
    { image: machinePhoto, category: "Automation", title: "Groundnut processing machine" },
  ],
});

export default function HardwareEmbeddedSystemsHero() {
  return (
    <ServiceHero
      id="hardware-hero-title"
      eyebrow="Hardware & Embedded Systems"
      title="Electronics and Firmware"
      phrases={["Built for the Real World", "Connected Devices", "Reliable Embedded Systems"]}
      description="Embedded systems, firmware, sensor integration and connected IoT devices, from the first circuit to a working, testable system."
      primary={{ label: "Discuss Hardware Requirements", to: contactLink("development", "hardware-embedded-systems") }}
      secondary={{ label: "See How It Fits Together", to: "#hardware-system" }}
      backdrop={HERO.backdrop}
      visual={<HeroPhotoStack items={HERO.cards} label="Hardware work by ProJenius" badge={{ title: "Circuit to system", text: "Built and tested by ProJenius" }} />}
      className="pjhw-hero"
    />
  );
}
