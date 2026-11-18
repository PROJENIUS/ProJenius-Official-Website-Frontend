import { Bot, Cpu, Droplets, Recycle, TriangleAlert } from "lucide-react";

/* =============================================================================
   PROJECTS — the one list of ProJenius projects used across the site
   (Home "Our Projects", Hardware, PCB and Rapid Prototyping pages).

   PHOTOS: each project has its own folder in src/assets/Projects/<id>/.
     - cover.webp (or .jpg / .png)  → the main photo on the card
     - any other image in the folder → extra photos (gallery), in name order
   Drop new photos in and they appear after the dev server reloads. No code
   change is needed for photos.

   FIELDS
     id           folder name in src/assets/Projects/
     title        project name shown on the card
     confidential true → the name is hidden; the card shows `category` as
                  its title and an "NDA project" tag instead
     category     short domain label
     description  one or two sentences
     tech         short tags (taken from the description)
     services     which service pages show this project:
                  "software" | "hardware" | "pcb" | "prototyping" | "startup"
     Icon, rating used by the Home "Our Projects" section

   TO CONFIRM (ProJenius team): the `services` tags below were set from each
   project's description. Add or remove pages as needed.
   ============================================================================= */

const PHOTOS = import.meta.glob("../../../assets/Projects/*/*.{webp,jpg,jpeg,png}", {
  eager: true,
  import: "default",
});

/* { "<id>": { cover, gallery: [] } } built from the folders */
const photosById = Object.entries(PHOTOS)
  .sort(([a], [b]) => a.localeCompare(b))
  .reduce((acc, [path, url]) => {
    const [, id, file] = path.match(/Projects\/([^/]+)\/([^/]+)$/) || [];
    if (!id) return acc;
    const entry = acc[id] || (acc[id] = { cover: null, gallery: [] });
    if (/^cover\./i.test(file)) entry.cover = url;
    else entry.gallery.push(url);
    return acc;
  }, {});

const RAW = [
  {
    id: "water-quality",
    title: "AI Water Quality Monitoring System",
    category: "IoT & Environmental AI",
    description:
      "IoT and AI-based system for monitoring water quality parameters, detecting contamination, and supporting real-time environmental telemetry.",
    alt: "AI-Powered Water Health Monitoring dashboard and hardware",
    tech: ["Sensors", "AI", "Live dashboard"],
    services: ["hardware", "prototyping", "software"],
    Icon: Droplets,
    rating: 5,
  },
  {
    id: "road-hazard",
    title: "AI Road Hazard Detection System",
    category: "Vision AI & Safety",
    description:
      "Smart road safety system that detects hazards and accidents, triggers instant location alerts, and assists emergency response teams.",
    alt: "IRADERS emergency response and safety system",
    tech: ["Vision AI", "Location alerts", "Embedded"],
    services: ["hardware", "prototyping", "software"],
    Icon: TriangleAlert,
    rating: 5,
  },
  {
    id: "smart-waste",
    title: "Smart Waste Classification Unit",
    category: "IoT & Automation",
    description:
      "Automated sensor-based segregation and capacity monitoring unit to streamline waste classification and urban sustainability.",
    alt: "Smart Waste Segregation and Monitoring Unit",
    tech: ["Sensors", "Automation", "IoT"],
    services: ["hardware", "prototyping"],
    Icon: Recycle,
    rating: 5,
  },
  {
    id: "follower-robot",
    title: "Autonomous Logistics Follower Robot",
    category: "Robotics & Hardware",
    description:
      "Embedded autonomous mobile robot with ultrasonic and LiDAR obstacle avoidance for industrial material transport.",
    alt: "Autonomous Follower Robot prototype and circuit",
    tech: ["Embedded", "LiDAR", "Robotics"],
    services: ["hardware", "prototyping", "pcb"],
    Icon: Bot,
    rating: 5,
  },
  {
    id: "industrial-telemetry",
    title: "Industrial Multi-Sensor Edge Gateway",
    category: "Embedded & Edge AI",
    description:
      "High-reliability multi-sensor telemetry gateway designed for machine health diagnostics, predictive maintenance, and cloud sync.",
    alt: "Industrial multi-sensor edge gateway board",
    tech: ["Custom board", "Edge AI", "Cloud sync"],
    services: ["hardware", "prototyping", "pcb"],
    Icon: Cpu,
    rating: 5,
  },
];

export const PROJECTS = RAW.map((project) => {
  const photos = photosById[project.id] || { cover: null, gallery: [] };
  return {
    confidential: false,
    ...project,
    image: photos.cover || photos.gallery[0] || null,
    gallery: photos.gallery,
  };
});

/* Projects for one service page, in list order ("all" = every project). */
export const projectsFor = (service) =>
  service === "all" ? PROJECTS : PROJECTS.filter((p) => p.services.includes(service));
