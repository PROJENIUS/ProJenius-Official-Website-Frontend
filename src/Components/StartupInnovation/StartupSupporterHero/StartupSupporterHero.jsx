import ServiceHero from "../../Solutions/Shared/ServiceHero/ServiceHero.jsx";
import HeroPhotoStack from "../../Common/HeroPhotoStack/HeroPhotoStack.jsx";
import { heroPhotos } from "../../Common/HeroPhotoStack/heroPhotos.js";
import recognitionEvent from "../../../assets/Home/HeroSlides/hero-slide-5.webp";
import aiEventPhoto from "../../../assets/Home/HeroSlides/hero-slide-2.webp";
import recognitionPhoto from "../../../assets/Home/Optimized/hero-recognition-960.webp";
import labPhoto from "../../../assets/Home/HeroSlides/hero-slide-3.webp";

/* =============================================================================
   STARTUP & INNOVATION HERO
   Backdrop: the science-and-innovation event photo under the navy layer.
   Visual: the shared rotating photo stack of ProJenius events and work.
   Photos: src/assets/Heroes/startup/ (see its README); the real photos
   below are used until photos are added there.
   ============================================================================= */

const HERO = heroPhotos("startup", {
  backdrop: recognitionEvent,
  cards: [
    { image: aiEventPhoto, category: "Ecosystem", title: "Connect Madurai AI event" },
    { image: recognitionEvent, category: "Recognition", title: "Science and innovation recognition" },
    { image: labPhoto, category: "Prototype", title: "Ideas becoming working prototypes" },
    { image: recognitionPhoto, category: "Recognition", title: "Innovation recognition" },
  ],
});

export default function StartupSupporterHero() {
  return (
    <ServiceHero
      id="startup-hero-title"
      eyebrow="Startup & Innovation"
      title="From an Idea"
      phrases={["to a Working Product", "to a Tested Prototype", "to a Launch-Ready MVP"]}
      description="For founders, students and innovators with a product idea: we help clarify the problem, check what is feasible and build the prototype or MVP across software, electronics and product design."
      primary={{ label: "Submit Your Idea", to: "#submit-idea" }}
      secondary={{ label: "See What Happens Next", to: "#idea-journey" }}
      backdrop={HERO.backdrop}
      visual={<HeroPhotoStack items={HERO.cards} label="ProJenius innovation events and work" badge={{ title: "Idea to product", text: "Supported by ProJenius" }} />}
      className="pjsi-hero"
    />
  );
}
