import CinematicHero from "../../Common/CinematicHero/CinematicHero.jsx";
import teamPhoto from "../../../assets/Home/Optimized/who-we-are-team-900.webp";
import labPhoto from "../../../assets/Home/Optimized/who-we-are-lab-800.webp";
import recognitionPhoto from "../../../assets/Home/Optimized/hero-recognition-960.webp";
import aiEventPhoto from "../../../assets/Home/Optimized/hero-ai-event-960.webp";
import handsOnPhoto from "../../../assets/About/Achievements/Achievements_4.webp";

const ABOUT_CARDS = [
  {
    image: recognitionPhoto,
    category: "Recognition",
    title: "Science & Innovation Honours",
    alt: "ProJenius team receiving recognition",
  },
  {
    image: aiEventPhoto,
    category: "Industry Keynote",
    title: "CII Connect Madurai AI Summit",
    alt: "ProJenius founders on stage at CII AI Event",
  },
  {
    image: handsOnPhoto,
    category: "Hands-on Engineering",
    title: "Minds Building Solutions",
    alt: "Students and engineers building prototypes",
  },
  {
    image: labPhoto,
    category: "R&D Facility",
    title: "Prototyping & Testing Labs",
    alt: "Hardware and embedded testing laboratory",
  },
  {
    image: teamPhoto,
    category: "Our Foundation",
    title: "Multidisciplinary Leadership",
    alt: "The ProJenius engineering team",
  },
];

export default function AboutHero() {
  return (
    <CinematicHero
      id="pja-hero-title"
      eyebrow=""
      title="Technology. Innovation."
      accent={["Real-World Impact.", "Built in Madurai."]}
      description="A multidisciplinary organization in Madurai, bringing technology, learning and innovation together."
      primary={{ label: "Talk to Our Team", to: "/contact" }}
      secondary={{ label: "Our Journey", to: "#about-journey" }}
      cards={ABOUT_CARDS}
      className="pja-hero"
    />
  );
}
