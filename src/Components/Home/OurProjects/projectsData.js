/* =============================================================================
   OUR PROJECTS — DATA
   -----------------------------------------------------------------------------
   The showcase rotates through this list in order. To add a project, append an
   entry; the layout adapts automatically (it needs at least 2 projects).

   `image` is optional. Only attach a photo or screenshot that genuinely shows
   that project; without one, the card shows the `Icon` on a branded panel.

   `rating` is out of 5. The card always shows five stars and fills this many
   (rounded to the nearest whole star), e.g. 4 → four filled, one empty.
   ============================================================================= */

import { Bot, Droplets, Recycle, TriangleAlert } from "lucide-react";

import waterMonitoringImage from "../../../assets/Home/OurProjects/OurProjects_4.webp";
import roadSafetyImage from "../../../assets/Home/OurProjects/OurProjects_5.webp";

export const PROJECTS = [
  {
    id: "water-quality",
    title: "AI-Based Water Quality Monitoring System",
    category: "IoT & AI",
    description:
      "IoT and AI-based system for monitoring water quality parameters, detecting changes, and supporting real-time environmental monitoring.",
    image: waterMonitoringImage,
    alt: "Screenshot of the AI-Powered Water Health Monitoring web application",
    Icon: Droplets,
    rating: 5,
  },
  {
    id: "road-hazard",
    title: "AI-Based Road Hazard Detection System",
    category: "Road Safety & IoT",
    description:
      "Smart road safety system that detects hazards and accidents, provides location-based alerts, and supports faster emergency response.",
    image: roadSafetyImage,
    alt: "Screenshot of the IRADERS emergency response web application",
    Icon: TriangleAlert,
    rating: 5,
  },
  {
    id: "smart-waste",
    title: "Smart Waste Management System",
    category: "IoT & Automation",
    description:
      "IoT-enabled waste segregation and monitoring system designed to improve waste classification, collection, and resource management.",
    image: null,
    alt: "",
    Icon: Recycle,
    rating: 5,
  },
  {
    id: "follower-robot",
    title: "Autonomous Follower Robot",
    category: "Hardware & Embedded Systems",
    description:
      "Embedded robotics solution designed for autonomous following, obstacle detection, and smart material transportation.",
    image: null,
    alt: "",
    Icon: Bot,
    rating: 5,
  },
];
