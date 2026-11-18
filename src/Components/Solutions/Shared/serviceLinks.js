/* =============================================================================
   Engineering & innovation service routes and enquiry links, in one place so
   every page links to the same destinations.

   Software, hardware, PCB and prototyping enquiries use the Contact page's
   "development" form; ?from= records which page the visitor came from.
   ============================================================================= */

export const SERVICE_ROUTES = {
  software: "/services/development",
  hardware: "/services/hardware-embedded-systems",
  pcb: "/services/pcb-design-fabrication",
  prototyping: "/services/rapid-prototyping",
  startup: "/startup",
  /* Incubation is a section of the Startup page (no separate page). */
  incubate: "/startup#startup-incubate",
};

export const contactLink = (type, from) => `/contact?type=${type}&from=${from}`;

/* Contextual cross-links. Each page picks only the ones that fit. */
export const RELATED = {
  software: { to: SERVICE_ROUTES.software, label: "Software Development" },
  hardware: { to: SERVICE_ROUTES.hardware, label: "Hardware & Embedded Systems" },
  pcb: { to: SERVICE_ROUTES.pcb, label: "PCB Design & Fabrication" },
  prototyping: { to: SERVICE_ROUTES.prototyping, label: "Rapid Prototyping" },
  startup: { to: SERVICE_ROUTES.startup, label: "Startup & Innovation" },
  incubate: { to: SERVICE_ROUTES.incubate, label: "Incubate at ProJenius" },
};
