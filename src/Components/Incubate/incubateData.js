import { Clock, Cpu, Printer, Router, Users, Wrench } from "lucide-react";

/* =============================================================================
   INCUBATE AT PROJENIUS — all page content in one place.

   FACILITY PHOTOS: src/assets/Incubate/<facility-id>/
     cover.webp (or .jpg / .png) → the photo shown for that facility.
     Replace it with a real photo; no code change is needed.

   APPLICATION QUESTIONS: edit QUESTIONS below (add, remove, reword).
     type      text | email | tel | textarea | select | radio | checkbox
     required  true → must be answered before sending
     options   for select / radio / checkbox
     The answers are sent as a "startup" enquiry from the page
     "incubate-apply". `stage` and `needs` map to the enquiry's required
     stage / support fields; the long answers form its message.
   ============================================================================= */

const PHOTOS = import.meta.glob("../../assets/Incubate/*/*.{webp,jpg,jpeg,png}", {
  eager: true,
  import: "default",
});

const photoFor = (id) => {
  const entry = Object.entries(PHOTOS)
    .sort(([a], [b]) => a.localeCompare(b))
    .find(([path]) => path.includes(`/Incubate/${id}/`));
  return entry ? entry[1] : null;
};

/* INCUBATION FEES — shown on the Startup page and the application form.
   Change the amounts or wording here and both places update. */
export const PRICING = {
  registration: "₹1,000",
  steps: [
    { label: "Apply", value: "Free", text: "Send your application. There is no charge to apply." },
    { label: "Join", value: "₹1,000", text: "One-time registration fee, paid once your application is accepted." },
    { label: "Build", value: "As you need", text: "Seat and services (lab use, prototyping, PCB, software, mentoring) are charged separately, based on what you need." },
  ],
};

export const FACILITIES = [
  { id: "workspace", Icon: Users, title: "Workspace & Seats", text: "A desk for you and your team in a shared work area, so you can build every day." },
  { id: "access-24-7", Icon: Clock, title: "24/7 Access", text: "Work any time. Round-the-clock access is for incubated teams with a seat, as per the incubation rules." },
  { id: "soldering", Icon: Cpu, title: "Soldering Stations", text: "Build, fix and test your circuits right where you work." },
  { id: "3d-printing", Icon: Printer, title: "3D Printers", text: "Print enclosures, parts and quick prototypes in the lab." },
  { id: "tools", Icon: Wrench, title: "Lab Tools", text: "Tools and test equipment to assemble and debug your hardware." },
  { id: "network", Icon: Router, title: "Network & Internet", text: "Reliable internet and network for your development and testing." },
].map((facility) => ({ ...facility, image: photoFor(facility.id) }));

/* Placeholder questions — the ProJenius team will refine these. */
export const QUESTION_GROUPS = [
  {
    title: "About You",
    questions: [
      { id: "name", label: "Full name", type: "text", required: true, autoComplete: "name" },
      { id: "email", label: "Email address", type: "email", required: true, autoComplete: "email" },
      { id: "phone", label: "Phone / WhatsApp number", type: "tel", required: true, autoComplete: "tel" },
      { id: "city", label: "City", type: "text", autoComplete: "address-level2" },
      { id: "organisation", label: "College, company or organisation", type: "text", autoComplete: "organization" },
      {
        id: "teamSize",
        label: "How many people are in your team?",
        type: "select",
        required: true,
        options: ["Just me", "2–3 people", "4–5 people", "6 or more"],
      },
      { id: "teamSkills", label: "What are your team's roles and skills?", type: "textarea", rows: 2 },
    ],
  },
  {
    title: "Your Idea",
    questions: [
      { id: "startupName", label: "Startup or project name", type: "text", required: true },
      { id: "problem", label: "What problem are you solving?", type: "textarea", required: true, rows: 3 },
      { id: "solution", label: "Describe your solution in a few lines", type: "textarea", required: true, rows: 3 },
      { id: "users", label: "Who are your target users or customers?", type: "textarea", rows: 2 },
      {
        id: "stage",
        label: "What stage are you at?",
        type: "select",
        required: true,
        options: ["Just an idea", "Research / validation", "Prototype", "MVP", "Early customers"],
      },
      {
        id: "domain",
        label: "Which area does your product fall under?",
        type: "radio",
        required: true,
        options: ["Hardware / IoT", "Software / AI", "Hardware + Software", "Other"],
      },
      {
        id: "registered",
        label: "Is your startup registered?",
        type: "radio",
        options: ["Not yet", "Proprietorship / Partnership", "LLP", "Private Limited", "Other"],
      },
    ],
  },
  {
    title: "What You Need",
    questions: [
      {
        id: "needs",
        label: "What do you need from ProJenius?",
        hint: "Choose all that apply.",
        type: "checkbox",
        required: true,
        options: [
          "Workspace / seat",
          "24/7 access",
          "Soldering station",
          "3D printing",
          "Lab tools",
          "Mentoring",
          "Networking & connections",
          "Field visits",
          "Prototyping",
          "PCB design",
          "Software development",
        ],
      },
      { id: "seats", label: "How many seats do you need?", type: "select", required: true, options: ["1", "2–3", "4–5", "6 or more"] },
      {
        id: "startWhen",
        label: "When would you like to start?",
        type: "select",
        required: true,
        options: ["Immediately", "Within a month", "In 1–3 months", "Not sure yet"],
      },
      {
        id: "duration",
        label: "How long do you plan to incubate?",
        type: "select",
        options: ["3 months", "6 months", "12 months", "Not sure yet"],
      },
      {
        id: "funding",
        label: "How is your startup funded so far?",
        type: "select",
        options: ["Self-funded", "Grant", "Angel / investor", "No funding yet"],
      },
      {
        id: "heardFrom",
        label: "How did you hear about ProJenius?",
        type: "select",
        options: ["Social media", "Friend / referral", "Event or workshop", "College", "Google search", "Other"],
      },
    ],
  },
];

export const QUESTIONS = QUESTION_GROUPS.flatMap((group) => group.questions);
