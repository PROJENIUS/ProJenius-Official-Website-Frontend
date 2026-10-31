import CinematicHero from "../../../Common/CinematicHero/CinematicHero.jsx";
import { contactLink } from "../../Shared/serviceLinks.js";
import { heroPhotos } from "../../../Common/HeroPhotoStack/heroPhotos.js";
import benchPhoto from "../../../../assets/Home/OurProjects/OurProjects_2.webp";

/* =============================================================================
   PCB DESIGN & FABRICATION HERO — the shared cinematic hero.
   Photo: src/assets/Heroes/pcb/backdrop.* (see its README); the real photo
   below is used until a PCB photo is added there.
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
      facts={[
        { label: "Workflow", title: "Schematic, layout, fabrication, assembly", to: "#pcb-workflow" },
        { label: "Built for", title: "Products, prototypes and MVPs", chips: ["Circuit design", "Board layout"] },
      ]}
      band={["Schematic & Circuit Design", "PCB Layout", "Prototype Electronics", "Fabrication", "Assembly", "Board Bring-Up"]}
      className="pjpcb-hero"
    />
  );
}
