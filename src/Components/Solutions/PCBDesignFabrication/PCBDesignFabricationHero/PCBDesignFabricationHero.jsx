import CinematicHero, { HeroTerminal } from "../../../Common/CinematicHero/CinematicHero.jsx";
import { contactLink } from "../../Shared/serviceLinks.js";
import { heroPhotos } from "../../../Common/HeroPhotoStack/heroPhotos.js";
import benchPhoto from "../../../../assets/Home/OurProjects/OurProjects_2.webp";

/* =============================================================================
   PCB DESIGN & FABRICATION HERO — the shared cinematic hero with the typing
   terminal. The steps follow the page's PCB workflow.
   Photo: src/assets/Heroes/pcb/backdrop.* (see its README).
   ============================================================================= */

const HERO = heroPhotos("pcb", { backdrop: benchPhoto });

const TERMINAL = [
  { kind: "cmd", text: "projenius pcb --board \"controller v1\"" },
  { kind: "info", text: "capturing the circuit..." },
  { kind: "ok", text: "schematic reviewed" },
  { kind: "ok", text: "board placed and routed" },
  { kind: "ok", text: "design checks passed" },
  { kind: "ok", text: "board fabricated and assembled" },
  { kind: "done", text: "powered up and tested" },
];

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
      aside={<HeroTerminal file="board.sh" label="How a board goes from schematic to tested" lines={TERMINAL} />}
      band={["Schematic & Circuit Design", "PCB Layout", "Prototype Electronics", "Fabrication", "Assembly", "Board Bring-Up"]}
      className="pjpcb-hero"
    />
  );
}
