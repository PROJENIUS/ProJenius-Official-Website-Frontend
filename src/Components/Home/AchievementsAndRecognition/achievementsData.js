/* =============================================================================
   ACHIEVEMENTS & RECOGNITION — DATA
   -----------------------------------------------------------------------------
   The section renders whatever is in these arrays; no layout changes are needed
   to update it.

   IMPORTANT: only add verified information. The entries below describe what
   the existing ProJenius photos show; they deliberately name no award,
   result, prize, date or figure because none is recorded in the project.
   When verified details are available (e.g. competition name, award, year),
   add them to the matching entry's title/description.

   ACHIEVEMENT_ITEMS  – the first item is the featured spotlight; up to three
                        more are shown as supporting tiles.
   ACHIEVEMENT_STATS  – verified figures only, e.g. { value: "12", label: "…" }.
                        The stats row is hidden while this list is empty.
   ============================================================================= */

import recognitionStage from "../../../assets/Home/Optimized/hero-recognition-960.webp";
import aiEvent from "../../../assets/Home/Optimized/hero-ai-event-960.webp";
import certificatePhoto from "../../../assets/Home/Optimized/who-we-are-team-900.webp";
import classroomRecognition from "../../../assets/About/Achievements/Achievements_2.webp";
import gallery1 from "../../../assets/About/Achievements/Achievements_1.webp";
import gallery3 from "../../../assets/About/Achievements/Achievements_3.webp";
import gallery4 from "../../../assets/About/Achievements/Achievements_4.webp";
import gallery5 from "../../../assets/About/Achievements/Achievements_5.webp";
import gallery6 from "../../../assets/About/Achievements/Achievements_6.webp";

export const ACHIEVEMENT_ITEMS = [
  {
    id: "science-innovation-stage",
    category: "Recognition",
    title: "On Stage at a Science & Innovation Recognition Event",
    description:
      "Students and mentors recognised on stage during a science and innovation event.",
    image: recognitionStage,
    alt: "Students and mentors on stage at a science and innovation recognition event",
  },
  {
    id: "cii-connect-madurai",
    category: "Event Highlight",
    title: "CII Connect Madurai",
    description: "On stage at CII Connect Madurai, an event on building the AI future of Tamil Nadu.",
    image: aiEvent,
    alt: "Speakers on stage at the CII Connect Madurai AI event",
  },
  {
    id: "certificate-of-recognition",
    category: "Student Achievement",
    title: "Certificate of Recognition",
    description: "Students and mentors celebrating a certificate of recognition.",
    image: certificatePhoto,
    alt: "Students and mentors holding a certificate of recognition",
  },
  {
    id: "classroom-recognition",
    category: "Recognition",
    title: "Recognition in the Classroom",
    description: "Students recognised for their work during a classroom session.",
    image: classroomRecognition,
    alt: "Students receiving recognition in a classroom",
  },
];

export const ACHIEVEMENT_STATS = [];

/* The homepage keeps its four featured tiles, while both pages share this full
   viewer/gallery list. Add future verified photos here to expose them on both. */
export const ACHIEVEMENT_GALLERY = [
  ...ACHIEVEMENT_ITEMS.map((item) => ({ ...item, src: item.image })),
  { id: "student-prize-presentation", category: "Recognition", title: "Prize presentation", description: "A student team receives recognition at a college event.", alt: "A student team receiving a prize from the ProJenius team at a college event", src: gallery1, width: 632, height: 468 },
  { id: "prototype-demonstration", category: "Project Showcase", title: "Prototype demonstration", description: "Students explore a working technology prototype during a hands-on session.", alt: "Students watching a live hardware prototype demonstration", src: gallery4, width: 1600, height: 721 },
  { id: "innovation-lab-session", category: "Learning & Development", title: "Innovation lab session", description: "Learners and mentors share a practical technology session.", alt: "Students gathered around a ProJenius team member in a college innovation lab", src: gallery3, width: 1040, height: 468 },
  { id: "srm-session", category: "Campus Session", title: "Session at SRM IST, Chennai", description: "The ProJenius team meets with students at SRM Institute of Science and Technology.", alt: "ProJenius team with students after a session at SRM Institute of Science and Technology, Chennai", src: gallery5, width: 1280, height: 963 },
  { id: "student-presentation", category: "Learning & Development", title: "Student presentation", description: "Students share their work during a technology presentation.", alt: "Two ProJenius team members presenting to students at SRM Institute of Science and Technology", src: gallery6, width: 720, height: 1280 },
];
