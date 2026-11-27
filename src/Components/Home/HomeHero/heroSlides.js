/* =============================================================================
   HOME HERO — SLIDE CONFIGURATION
   -----------------------------------------------------------------------------
   The live slides are edited in Admin → Home Hero (see heroContent.js).
   These built-in slides are the fallback.

   HOW TO REPLACE THE BUILT-IN IMAGES
   The five images live in:  src/assets/Home/HeroSlides/

       Slide 1  →  hero-slide-1.webp   (Company Introduction)
       Slide 2  →  hero-slide-2.webp   (Startups & Institutions)
       Slide 3  →  hero-slide-3.webp   (Learning & Development)
       Slide 4  →  hero-slide-4.webp   (Projects & Innovation)
       Slide 5  →  hero-slide-5.webp   (Learning Opportunities)

   They are temporary copies of existing ProJenius photos. Overwrite each file
   with your own image using the SAME file name and nothing else needs to
   change. If your image is a different format (e.g. .jpg), update the matching
   import line below. Use landscape images (ideally 16:10 or 3:2, at least
   1600px wide); they are cropped with object-fit: cover.
   Remember to update the matching `alt` text to describe the new image.

   Fields per slide:
     image / alt          featured image, backdrop and thumbnail + description
     caption              short title on the featured image and thumbnail label
     eyebrow              small label above the heading
     title + highlight    the heading (highlight shown in cyan on its own line)
     description          supporting text
     primary / secondary  CTA label and destination (route or #section anchor)
   ============================================================================= */

import heroSlide1 from "../../../assets/Home/HeroSlides/hero-slide-1.webp";
import heroSlide2 from "../../../assets/Home/HeroSlides/hero-slide-2.webp";
import heroSlide3 from "../../../assets/Home/HeroSlides/hero-slide-3.webp";
import heroSlide4 from "../../../assets/Home/HeroSlides/hero-slide-4.webp";
import heroSlide5 from "../../../assets/Home/HeroSlides/hero-slide-5.webp";

/* Built-in slides: shown at once and whenever the API has nothing saved.
   Admin → Home Hero replaces them. Kept word-for-word equal to
   projenius-backend/src/modules/homepage/homeHero.defaults.js. */
export const HERO_SLIDES = [
  {
    id: "company",
    caption: "Company Introduction",
    eyebrow: "Technology Company in Madurai",
    title: "Ideas Into Innovation.",
    highlight: "Innovation Into Impact.",
    description:
      "Software development, IoT and embedded systems, and product engineering for businesses, startups and institutions across India.",
    image: heroSlide1,
    alt: "Developer workstation with code on two monitors",
    primary: { label: "Explore Services", to: "#home-services" },
    secondary: { label: "Talk to Us", to: "/contact?type=general#pj-contact-help" },
  },
  {
    id: "partners",
    caption: "Startups & Institutions",
    eyebrow: "Technology Partner",
    title: "Technology Solutions for",
    highlight: "Startups & Institutions",
    description:
      "From MVP development to IoT products and custom software, we turn ideas into scalable technology that works in the real world.",
    image: heroSlide2,
    alt: "Speakers on stage at the CII Connect Madurai AI event",
    primary: { label: "Explore Solutions", to: "/services/development" },
    secondary: { label: "Start a Conversation", to: "/contact?type=partnership#pj-contact-help" },
  },
  {
    id: "learning",
    caption: "Learning & Development",
    eyebrow: "Courses · Internships · Workshops",
    title: "Build Skills Through",
    highlight: "Real-World Technology",
    description:
      "Industry-oriented courses, internships and hands-on workshops in AI, IoT, embedded systems and full-stack development.",
    image: heroSlide3,
    alt: "Students working together on a hardware prototype in a lab",
    primary: { label: "Explore Courses", to: "/services/courses#course-catalog" },
    secondary: { label: "Discover Internships", to: "/services/internship#internship-domains" },
  },
  {
    id: "projects",
    caption: "Projects & Innovation",
    eyebrow: "Engineering Real-World Solutions",
    title: "From Real-World Problems",
    highlight: "to Working Products",
    description:
      "See the IoT, AI and embedded prototypes we design, build and test to solve practical problems for industry and society.",
    image: heroSlide4,
    alt: "Hand holding a phone surrounded by connected IoT device icons",
    primary: { label: "Explore Projects", to: "#home-projects" },
    secondary: { label: "Work With Us", to: "/contact?type=general#pj-contact-help" },
  },
  {
    id: "opportunities",
    caption: "Learning Opportunities",
    eyebrow: "Your Next Opportunity",
    title: "Your Next Learning",
    highlight: "Opportunity Starts Here",
    description:
      "Explore upcoming technical courses, career guidance and hands-on programs for students and working professionals.",
    image: heroSlide5,
    alt: "Students and mentors on stage at a science and innovation recognition event",
    primary: { label: "View Courses", to: "/services/courses#course-catalog" },
    secondary: { label: "Explore Learning", to: "#home-training" },
  },
];

/* Photos an admin slide may keep instead of an upload (same keys as the backend). */
export const BUILTIN_HERO_IMAGES = Object.freeze({
  "hero-slide-1": heroSlide1,
  "hero-slide-2": heroSlide2,
  "hero-slide-3": heroSlide3,
  "hero-slide-4": heroSlide4,
  "hero-slide-5": heroSlide5,
});

/* Technology capability strip shown under the hero copy. */
export const HERO_CAPABILITIES = [
  "Web",
  "Mobile Apps",
  "Software",
  "AI/ML",
  "IoT",
  "Product Engineering",
  "3D Design",
];
