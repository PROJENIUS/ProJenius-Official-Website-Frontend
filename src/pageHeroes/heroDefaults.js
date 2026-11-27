/* =============================================================================
   PAGE HEROES — BUILT-IN CONTENT
   -----------------------------------------------------------------------------
   What each editable page hero shows until something is saved in
   Admin → Page Heroes, and whenever the API is unavailable. Field names and
   shapes match projenius-backend src/modules/pageheroes/pageHero.schemas.js
   (test/pageHeroes.test.js checks the website side). Images are imported
   files; photos dropped into src/assets/Heroes/<page>/ still replace them.
   ============================================================================= */

import { DEFAULT_CINEMATIC_CARDS } from "../Components/Common/CinematicHero/cinematicCards.js";
import { heroPhotos } from "../Components/Common/HeroPhotoStack/heroPhotos.js";
import { contactLink } from "../Components/Solutions/Shared/serviceLinks.js";

import teamPhoto from "../assets/Home/Optimized/who-we-are-team-900.webp";
import labPhoto from "../assets/Home/Optimized/who-we-are-lab-800.webp";
import recognitionPhoto from "../assets/Home/Optimized/hero-recognition-960.webp";
import aiEventPhoto from "../assets/Home/Optimized/hero-ai-event-960.webp";
import handsOnPhoto from "../assets/About/Achievements/Achievements_4.webp";
import sessionPhoto from "../assets/About/Achievements/Achievements_3.webp";
import studentsPhoto from "../assets/About/Achievements/Achievements_6.webp";
import codeBackdrop from "../assets/Home/HeroSlides/hero-slide-1.webp";
import waterMonitoringImage from "../assets/Home/OurProjects/OurProjects_4.webp";
import roadSafetyImage from "../assets/Home/OurProjects/OurProjects_5.webp";
import benchPhoto from "../assets/Home/OurProjects/OurProjects_2.webp";

/* Photos from src/assets/Heroes/<page>/ win over the files above (heroPhotos). */
function folderPhotos(page, fallback) {
  const uploaded = heroPhotos(page).cards || [];
  return uploaded.length >= 3
    ? uploaded.slice(0, 3).map((photo) => ({ image: photo.image, alt: photo.title || "ProJenius" }))
    : fallback;
}

const coursePhotos = folderPhotos("courses", [
  { image: handsOnPhoto, alt: "Students working on a hands-on build with the ProJenius team" },
  { image: studentsPhoto, alt: "Students presenting during a ProJenius session" },
  { image: sessionPhoto, alt: "Students in a ProJenius lab session" },
]);

const workshopPhotos = folderPhotos("workshop", [
  { image: handsOnPhoto, alt: "Students exploring a working prototype at a ProJenius workshop" },
  { image: studentsPhoto, alt: "Explaining concepts in the classroom" },
  { image: sessionPhoto, alt: "Students during a hands-on session" },
]);

const threePhotos = (photos) => ({
  photo1: photos[0].image, photo1Alt: photos[0].alt,
  photo2: photos[1].image, photo2Alt: photos[1].alt,
  photo3: photos[2].image, photo3Alt: photos[2].alt,
});

export const HERO_DEFAULTS = {
  about: {
    eyebrow: "",
    title: "Technology. Innovation.",
    accent: ["Real-World Impact.", "Built in Madurai."],
    description: "A multidisciplinary organization in Madurai, bringing technology, learning and innovation together.",
    primary: { label: "Talk to Our Team", to: "/contact" },
    secondary: { label: "Our Journey", to: "#about-journey" },
    cards: [
      { image: recognitionPhoto, alt: "ProJenius team receiving recognition", category: "Recognition", title: "Science & Innovation Honours" },
      { image: aiEventPhoto, alt: "ProJenius founders on stage at CII AI Event", category: "Industry Keynote", title: "CII Connect Madurai AI Summit" },
      { image: handsOnPhoto, alt: "Students and engineers building prototypes", category: "Hands-on Engineering", title: "Minds Building Solutions" },
      { image: labPhoto, alt: "Hardware and embedded testing laboratory", category: "R&D Facility", title: "Prototyping & Testing Labs" },
      { image: teamPhoto, alt: "The ProJenius engineering team", category: "Our Foundation", title: "Multidisciplinary Leadership" },
    ],
  },

  "software-development": {
    eyebrow: "Software Development",
    title: "Software That Moves",
    phrases: ["Your Business Forward", "Ideas Into Products"],
    description: "We design and build websites, web and mobile applications, SaaS platforms, AI solutions and automation tools around what your business actually needs.",
    primary: { label: "Discuss Your Project", to: contactLink("development", "software-development") },
    secondary: { label: "Explore Our Capabilities", to: "#pj-development-build" },
    backdrop: codeBackdrop,
    screen1: waterMonitoringImage,
    screen1Alt: "Screenshot of the AI-Powered Water Health Monitoring web application built by ProJenius",
    screen2: roadSafetyImage,
    screen2Alt: "Screenshot of the IRADERS emergency response web application built by ProJenius",
  },

  "pcb-design-fabrication": {
    kicker: "PCB Design & Fabrication",
    title: "From Circuit Ideas to",
    typed: ["Physical Reality.", "Working Hardware."],
    description: "Thoughtful circuit design and precise layout. Our manufacturing partner makes your board, one or as many as you need; we test it, demo it and hand it over.",
    primary: { label: "Start Your PCB Project", to: contactLink("development", "pcb-design-fabrication") },
    secondary: { label: "Explore Capabilities", to: "#pcb-build" },
    tags: ["PCB Design", "Prototyping", "Fabrication"],
    photo: heroPhotos("pcb", { backdrop: benchPhoto }).backdrop,
    photoAlt: "A ProJenius hardware build on the bench: a circuit board wired to sensors",
    badgeKicker: "Engineering the next generation",
    badgeTitle: "Hardware Innovation by ProJenius",
    steps: [
      { label: "Design", text: "Schematic & PCB Layout" },
      { label: "Development", text: "Prototype Engineering" },
      { label: "Fabrication", text: "Partner Manufacturing" },
      { label: "Support", text: "Testing, Demo & Handover" },
    ],
  },

  courses: {
    eyebrow: "Courses & Learning",
    title: "Learn. Build. Grow With",
    phrases: ["Real-World Skills.", "Live Classes.", "Practical Projects."],
    lead: "Practical courses designed by ProJenius to help students and professionals learn modern technologies, build real projects and become career ready.",
    ...threePhotos(coursePhotos),
    steps: [
      { title: "Choose a course", text: "Pick the track that matches your goal." },
      { title: "Learn in live classes", text: "Sessions with the ProJenius team." },
      { title: "Build real projects", text: "Practical work in every module." },
      { title: "Show what you built", text: "Projects you can present." },
    ],
  },

  "career-guidance": {
    eyebrow: "Career Guidance",
    title: "Build Your Tech Career",
    phrases: ["With a Clear Roadmap.", "With a Mentor.", "With Confidence."],
    lead: "Get practical guidance, skill recommendations and career preparation from a mentor, so you move confidently toward your technology career.",
    primaryLabel: "Book a ₹99 Mentor Call",
    facts: ["30-minute 1:1 call", "Fully refundable", "For students & freshers"],
  },

  workshops: {
    eyebrow: "Workshops & Training",
    title: "Workshops That Go",
    phrases: ["Beyond the Classroom.", "Hands-On.", "Into Real Projects."],
    lead: "Hands-on technology workshops designed to help students explore, experiment, build and experience emerging technologies through practical learning.",
    primary: { label: "Plan a Workshop", to: "/contact?type=workshop" },
    ...threePhotos(workshopPhotos),
    floats: [
      { title: "Hands-on sessions", text: "Students build, not just listen" },
      { title: "Customized topics", text: "Shaped around your students" },
      { title: "For colleges & clubs", text: "Departments, clubs, institutions" },
    ],
  },

  products: {
    eyebrow: "Products & Innovations",
    title: "Products Engineered for",
    phrases: ["Real-World Problems.", "Smarter Farming.", "Hands-On Learning."],
    lead: "Products designed and built by ProJenius, from the first idea to a working product people use. Have an idea of your own? We build those too.",
    primaryLabel: "Explore Products",
    secondaryLabel: "Build Your Own Product",
    facts: ["Idea to plan", "Hardware + software", "Ready to use"],
  },

  "news-insights": {
    eyebrow: "News & Insights",
    title: "Stories and Ideas",
    phrases: ["From the ProJenius Lab.", "From Our Team.", "Worth Reading."],
    lead: "Company news, project updates and practical insights on technology, products and building ideas into reality.",
  },

  "join-our-team": {
    eyebrow: "Careers at ProJenius",
    title: "Build the Future",
    accent: ["With ProJenius"],
    description: "Join a team that builds software, IoT systems and products, and trains the next generation of engineers. See our open roles and apply in a few minutes.",
    primary: { label: "See Open Roles", to: "#open-roles" },
    secondary: { label: "Apply Now", to: "/join-our-team/apply" },
    cards: DEFAULT_CINEMATIC_CARDS,
  },
};

/* One typed phrase shows as fixed blue text, as before; two or more type. */
export const accentProp = (phrases) => (phrases.length === 1 ? phrases[0] : phrases);
