/* =============================================================================
   HOME HERO — SLIDE CONFIGURATION
   -----------------------------------------------------------------------------
   HOW TO REPLACE THE IMAGES
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

export const HERO_SLIDES = [
  {
    id: "company",
    caption: "Company Introduction",
    eyebrow: "ProJenius Innovation Technology",
    title: "Ideas Into Innovation.",
    highlight: "Innovation Into Impact.",
    description:
      "We build intelligent software, connected systems, and real-world products that solve meaningful problems.",
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
      "We help businesses, startups, institutions, and organizations turn ideas into practical, scalable technology.",
    image: heroSlide2,
    alt: "Speakers on stage at the CII Connect Madurai AI event",
    primary: { label: "Explore Solutions", to: "#home-services" },
    secondary: { label: "Start a Conversation", to: "/contact?type=partnership#pj-contact-help" },
  },
  {
    id: "learning",
    caption: "Learning & Development",
    eyebrow: "Learn. Build. Innovate.",
    title: "Build Skills Through",
    highlight: "Real-World Technology",
    description:
      "Gain practical experience through industry-oriented courses, internships, workshops, and hands-on engineering.",
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
      "Explore the ideas, prototypes, and technologies we develop to create meaningful impact.",
    image: heroSlide4,
    alt: "Hand holding a phone surrounded by connected IoT device icons",
    primary: { label: "Explore Projects", to: "#home-projects" },
    secondary: { label: "Work With Us", to: "/contact?type=general" },
  },
  {
    id: "opportunities",
    caption: "Learning Opportunities",
    eyebrow: "Your Next Opportunity",
    title: "Your Next Learning",
    highlight: "Opportunity Starts Here",
    description:
      "Discover our technical courses, upcoming learning opportunities, and hands-on programs.",
    image: heroSlide5,
    alt: "Students and mentors on stage at a science and innovation recognition event",
    primary: { label: "View Courses", to: "/services/courses#course-catalog" },
    secondary: { label: "Explore Learning", to: "#home-training" },
  },
];

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
