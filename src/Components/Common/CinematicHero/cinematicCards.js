/* Photo cards the cinematic hero shows when a page gives none (also the
   Join Our Team default in src/pageHeroes/heroDefaults.js). */
import aiEventPhoto from "../../../assets/Home/Optimized/hero-ai-event-960.webp";
import labPhoto from "../../../assets/Home/Optimized/training-courses-737.webp";
import iotPhoto from "../../../assets/Home/HeroSlides/hero-slide-2.webp";
import recognitionPhoto from "../../../assets/Home/Optimized/hero-recognition-960.webp";
import codePhoto from "../../../assets/Home/HeroSlides/hero-slide-3.webp";

export const DEFAULT_CINEMATIC_CARDS = [
  {
    image: aiEventPhoto,
    category: "Ecosystem Collaboration",
    title: "Startups & Institutions",
    alt: "Ecosystem Collaboration at ProJenius AI Event",
  },
  {
    image: labPhoto,
    category: "Talent Incubation",
    title: "Learning & Development",
    alt: "Talent Incubation & Technical Labs",
  },
  {
    image: iotPhoto,
    category: "Deeptech Deployment",
    title: "Projects & Innovation",
    alt: "Deeptech Deployment and IoT Engineering",
  },
  {
    image: recognitionPhoto,
    category: "Industry Recognition",
    title: "Learning Opportunities",
    alt: "Industry Recognition and Awards",
  },
  {
    image: codePhoto,
    category: "Software Architecture",
    title: "Ideas Into Innovation",
    alt: "Software Architecture and Modern Systems",
  },
];

