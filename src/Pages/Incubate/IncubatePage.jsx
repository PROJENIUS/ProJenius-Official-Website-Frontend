/* =========================================================
   INCUBATE AT PROJENIUS
   Hero (facility photos) → facilities → what incubated teams
   get → how to join → apply (separate form page /incubate/apply).
   Content lives in Components/Incubate/incubateData.js.
========================================================= */

import { useRef } from "react";
import { Building2, GraduationCap, Handshake, Rocket } from "lucide-react";

import CinematicHero from "../../Components/Common/CinematicHero/CinematicHero.jsx";
import IncubateFacilities from "../../Components/Incubate/IncubateFacilities/IncubateFacilities.jsx";
import { FACILITIES } from "../../Components/Incubate/incubateData.js";
import ServiceOfferings from "../../Components/Solutions/Shared/ServiceOfferings/ServiceOfferings.jsx";
import ServiceProcess from "../../Components/Solutions/Shared/ServiceProcess/ServiceProcess.jsx";
import ServiceCTA from "../../Components/Solutions/Shared/ServiceCTA/ServiceCTA.jsx";
import { RELATED } from "../../Components/Solutions/Shared/serviceLinks.js";
import useMetaDescription from "../../hooks/useMetaDescription.js";
import useScrollReveal from "../../hooks/useScrollReveal.js";
import "../../styles/pages/SolutionsPages.css";

const DESCRIPTION =
  "Incubate at ProJenius: workspace and seats, 24/7 access for incubated teams, soldering stations, 3D printers, lab tools, mentoring and support to build your product.";

const APPLY = "/incubate/apply";

const HERO_CARDS = FACILITIES.filter((f) => f.image).map((f) => ({
  image: f.image,
  category: "ProJenius Incubation",
  title: f.title,
  alt: "",
}));

const BENEFITS = [
  {
    id: "space",
    Icon: Building2,
    title: "Space & Lab Access",
    points: ["A seat in the shared workspace", "Soldering stations, 3D printers and lab tools", "24/7 access for incubated teams"],
  },
  {
    id: "mentoring",
    Icon: GraduationCap,
    title: "Mentoring",
    points: ["Understanding the real problem", "Technical guidance from the team", "Help planning each next step"],
  },
  {
    id: "network",
    Icon: Handshake,
    title: "Network & Field Visits",
    points: ["Connections with the right people", "Field visits to meet real users", "A community of builders around you"],
  },
  {
    id: "build",
    Icon: Rocket,
    title: "Build Support",
    points: ["Prototyping and 3D design", "PCB design", "Software and apps"],
  },
];

export default function IncubatePage() {
  const pageRef = useRef(null);
  useMetaDescription(DESCRIPTION);
  useScrollReveal(pageRef);

  return (
    <main ref={pageRef} className="pjsv-page pjsv-incubate">
      <CinematicHero
        id="incubate-hero-title"
        eyebrow="Incubate at ProJenius"
        title="Build Your Product"
        accent={["at ProJenius", "With Our Team", "in Our Lab"]}
        description="A seat in our workspace, 24/7 access, soldering stations, 3D printers and a team to guide you, from idea to a complete product."
        primary={{ label: "Apply for Incubation", to: APPLY }}
        secondary={{ label: "See the Facilities", to: "#incubate-facilities" }}
        cards={HERO_CARDS}
      />

      <IncubateFacilities />

      <ServiceOfferings
        id="incubate-benefits"
        eyebrow="What You Get"
        title="More Than a Desk,"
        typed={["a Team Behind You", "a Place to Build"]}
        topic="Incubation"
        items={BENEFITS}
      />

      <ServiceProcess
        id="incubate-join"
        eyebrow="How to Join"
        title="Five Steps to"
        typed={["Your Seat", "Start Building"]}
        intro="Seats, fees and the incubation rules are explained during the discussion."
        steps={[
          { title: "Apply Online", text: "Answer a few short questions about you and your idea." },
          { title: "Review", text: "The team reads every application." },
          { title: "Discussion", text: "We meet to understand your idea and explain seats, fees and rules." },
          { title: "Agreement & Seat", text: "Join as per the incubation rules and get your seat." },
          { title: "Start Building", text: "Use the space, the lab and the team to build your product." },
        ]}
        note="Applying does not guarantee a seat. 24/7 access is for incubated teams with a seat, as per the incubation rules."
      />

      <ServiceCTA
        id="incubate-cta"
        eyebrow="Apply Now"
        title="Ready to Build"
        typed={["at ProJenius?", "With Us?"]}
        text="Tell us about you and your idea. The team will get back to you to talk about seats and the next steps."
        primary={{ label: "Apply for Incubation", to: APPLY }}
        checklistTitle="Good to have ready"
        checklist={[
          "The problem you are solving",
          "Your idea or solution in a few lines",
          "Your team and their skills",
          "How many seats you need",
          "When you would like to start",
        ]}
        related={[
          { ...RELATED.startup, question: "Only have an idea so far?" },
          { ...RELATED.prototyping, question: "Need a prototype built for you?" },
          { ...RELATED.pcb, question: "Need a custom board designed?" },
        ]}
      />
    </main>
  );
}
