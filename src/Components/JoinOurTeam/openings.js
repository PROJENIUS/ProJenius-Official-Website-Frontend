/* =============================================================================
   JOIN OUR TEAM — OPEN ROLES
   -----------------------------------------------------------------------------
   Edit this list to publish or close a hiring post; the page and the
   application form update automatically. Remove a role to close it. With an
   empty list the page shows "No open roles right now" and the form still
   takes general applications.

   Fields
     id           unique, used for the card anchor
     title        role name (also sent with the application)
     team         short team label shown as a tag
     type         Full-time / Part-time / Internship / Contract
     location     where the work happens
     experience   who it suits
     summary      one or two sentences
     points       three or four things the person will do
     placeholder  true = SAMPLE post written to show the layout. Replace it
                  with a real opening (or delete it) before publishing, then
                  remove this flag.
   ============================================================================= */

export const OPENINGS = [
  {
    // PLACEHOLDER — sample post, confirm or replace before publishing.
    id: "full-stack-developer",
    title: "Full Stack Developer",
    team: "Software",
    type: "Full-time",
    location: "Madurai (On-site)",
    experience: "Freshers and experienced",
    summary:
      "Build web applications and dashboards for client projects and ProJenius products, from the interface to the API.",
    points: [
      "Develop React front ends and Node.js / Express APIs",
      "Work with databases and connect to IoT device data",
      "Test, deploy and improve live projects",
    ],
    placeholder: true,
  },
  {
    // PLACEHOLDER — sample post, confirm or replace before publishing.
    id: "embedded-iot-engineer",
    title: "Embedded & IoT Engineer",
    team: "Hardware",
    type: "Full-time",
    location: "Madurai (On-site)",
    experience: "Freshers and experienced",
    summary:
      "Design and build the electronics and firmware inside our IoT products, prototypes and client hardware projects.",
    points: [
      "Write firmware for microcontrollers and sensors",
      "Prototype circuits and help with PCB bring-up",
      "Connect devices to cloud dashboards",
    ],
    placeholder: true,
  },
  {
    // PLACEHOLDER — sample post, confirm or replace before publishing.
    id: "technical-trainer",
    title: "Technical Trainer",
    team: "Learning",
    type: "Full-time / Part-time",
    location: "Madurai and on campus",
    experience: "Teaching or project experience",
    summary:
      "Lead hands-on workshops, courses and internships for students in software, IoT and emerging technologies.",
    points: [
      "Run practical sessions in colleges and at our centre",
      "Prepare project-based course material",
      "Mentor interns through live projects",
    ],
    placeholder: true,
  },
];

/* Options for the application form. */
export const SKILL_AREAS = [
  "Software Development",
  "AI / ML",
  "IoT & Embedded Systems",
  "Robotics",
  "3D Design & Prototyping",
  "UI/UX Design",
  "Training & Teaching",
  "Business / Operations",
];

export const EXPERIENCE_LEVELS = ["Student", "Fresher", "1–2 years", "3–5 years", "5+ years"];

export const WORK_MODES = ["On-site (Madurai)", "Hybrid", "Remote"];

export const START_OPTIONS = ["Immediately", "Within 15 days", "Within 30 days", "After 30 days"];

export const GENERAL_APPLICATION = "General application (no specific role)";
