import CinematicHero from "../../../Common/CinematicHero/CinematicHero.jsx";
import { HeroCircuit } from "../../../Common/CinematicHero/HeroPanels.jsx";
import { contactLink } from "../../Shared/serviceLinks.js";
import { heroPhotos } from "../../../Common/HeroPhotoStack/heroPhotos.js";
import benchPhoto from "../../../../assets/Home/OurProjects/OurProjects_2.webp";

/* =============================================================================
   PCB DESIGN & FABRICATION HERO — the shared cinematic hero with a circuit
   board whose traces carry light pulses out to each workflow stage.
   Photo: src/assets/Heroes/pcb/backdrop.* (see its README).
   ============================================================================= */

const HERO = heroPhotos("pcb", { backdrop: benchPhoto });

export default function PCBDesignFabricationHero() {
  return (
    <CinematicHero
      id="pcb-hero-title"
      eyebrow="PCB Design & Fabrication"
      title="From Schematic"
      accent="to a Finished Board"
      description="Circuit design, PCB layout and fabrication support for electronic products, prototypes and MVPs, with a clear output at every stage."
      primary={{ label: "Discuss PCB Requirements", to: contactLink("development", "pcb-design-fabrication") }}
      secondary={{ label: "View the Workflow", to: "#pcb-workflow" }}
      photo={HERO.backdrop}
      aside={<HeroCircuit chip={["YOUR", "BOARD"]} nodes={["Schematic", "Layout", "Checks", "Fabrication", "Assembly", "Testing"]} />}
      band={["Schematic & Circuit Design", "PCB Layout", "Prototype Electronics", "Fabrication", "Assembly", "Board Bring-Up"]}
      className="pjpcb-hero"
    />
  );
}
