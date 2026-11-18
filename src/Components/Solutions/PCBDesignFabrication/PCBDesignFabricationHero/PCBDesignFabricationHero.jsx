import SplitHero from "../../../Common/SplitHero/SplitHero.jsx";
import { contactLink } from "../../Shared/serviceLinks.js";
import { heroPhotos } from "../../../Common/HeroPhotoStack/heroPhotos.js";
import benchPhoto from "../../../../assets/Home/OurProjects/OurProjects_2.webp";

/* =============================================================================
   PCB DESIGN & FABRICATION HERO — split hero: copy on the left, a photo card
   on the right, the four stages along the bottom.
   Photo: src/assets/Heroes/pcb/backdrop.* (see its README); until one is
   added, a real ProJenius bench photo (board and wiring) is used.
   Previous version used the shared CinematicHero.
   ============================================================================= */

const HERO = heroPhotos("pcb", { backdrop: benchPhoto });

export default function PCBDesignFabricationHero() {
  return (
    <SplitHero
      id="pcb-hero-title"
      className="pjpcb-hero"
      kicker="ProJenius / PCB Design & Fabrication"
      title="From Circuit Ideas to"
      typed={["Physical Reality.", "Working Hardware."]}
      description="Thoughtful circuit design and precise layout. Our manufacturing partner makes your board, one or as many as you need; we test it, demo it and hand it over."
      primary={{ label: "Start Your PCB Project", to: contactLink("development", "pcb-design-fabrication") }}
      secondary={{ label: "Explore Capabilities", to: "#pcb-build" }}
      tags={["PCB Design", "Prototyping", "Fabrication"]}
      photo={HERO.backdrop}
      photoAlt="A ProJenius hardware build on the bench: a circuit board wired to sensors"
      badge={{ kicker: "Engineering the next generation", title: "Hardware Innovation by ProJenius" }}
      steps={[
        { label: "Design", text: "Schematic & PCB Layout" },
        { label: "Development", text: "Prototype Engineering" },
        { label: "Fabrication", text: "Partner Manufacturing" },
        { label: "Support", text: "Testing, Demo & Handover" },
      ]}
    />
  );
}
