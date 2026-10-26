import ServiceHero from "../../Shared/ServiceHero/ServiceHero.jsx";
import { contactLink } from "../../Shared/serviceLinks.js";
import PCBBoard from "../PCBBoard/PCBBoard.jsx";
import HeroPhotoStack from "../../../Common/HeroPhotoStack/HeroPhotoStack.jsx";
import { heroPhotos } from "../../../Common/HeroPhotoStack/heroPhotos.js";
import benchPhoto from "../../../../assets/Home/OurProjects/OurProjects_2.webp";
import "./PCBDesignFabricationHero.css";

/* Hero photos: src/assets/Heroes/pcb/ (see its README). No real PCB photos
   yet, so the illustrated board stays until card photos are added there;
   then the rotating photo stack replaces it automatically. */
const HERO = heroPhotos("pcb", { backdrop: benchPhoto });

/* =============================================================================
   PCB DESIGN & FABRICATION HERO
   Visual: the illustrated board, its copper traces drawing in once.
   ============================================================================= */

function PCBHeroVisual() {
  return (
    <figure className="pjpcb-hero-visual">
      <PCBBoard stage="hero" />
      <figcaption className="pjpcb-hero-visual__caption">
        <span>Schematic</span>
        <span>Layout</span>
        <span>Fabrication</span>
        <span>Assembly</span>
      </figcaption>
    </figure>
  );
}

export default function PCBDesignFabricationHero() {
  return (
    <ServiceHero
      id="pcb-hero-title"
      eyebrow="PCB Design & Fabrication"
      title="From Schematic"
      phrases={["to a Finished Board", "to a Tested Prototype", "to Product Integration"]}
      description="Circuit design, PCB layout and fabrication support for electronic products, prototypes and MVPs, with a clear output at every stage."
      primary={{ label: "Discuss PCB Requirements", to: contactLink("development", "pcb-design-fabrication") }}
      secondary={{ label: "View the Workflow", to: "#pcb-workflow" }}
      backdrop={HERO.backdrop}
      visual={
        HERO.cards.length >= 3
          ? <HeroPhotoStack items={HERO.cards} label="PCB work by ProJenius" badge={{ title: "Schematic to board", text: "Designed by ProJenius" }} />
          : <PCBHeroVisual />
      }
      className="pjpcb-hero"
    />
  );
}
