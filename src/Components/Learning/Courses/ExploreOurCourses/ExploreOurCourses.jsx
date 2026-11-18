import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import "./ExploreOurCourses.css";

import CourseDetail from "../CourseDetail/CourseDetail.jsx";
import CoursesHero from "../CoursesHero/CoursesHero.jsx";
import CourseCatalog from "../CourseCatalog/CourseCatalog.jsx";
import { PRICE_RANGES } from "../CourseCatalog/catalogData.js";
import ServiceFaq from "../../../Common/ServiceFaq/ServiceFaq.jsx";
import { COURSE_FAQ } from "../CourseFaq/courseFaqData.jsx";
import CourseReviews from "../CourseReviews/CourseReviews.jsx";
import { api } from "../courseApi.js";

/* =============================================================================
   COURSES — /services/courses and /services/courses/:slug
   List page (backgrounds alternate navy / light):
     hero (search + tracks) → catalogue (filters, 8 per page) →
     FAQ (shared layout) → reviews (last, light)
   Detail page: CourseDetail.

   All published courses are loaded once (the API allows up to 100 per
   request) so search, filters, sorting and paging are instant. When the
   course service is unreachable the offline list below is shown; it holds
   no ratings or review counts.
   ============================================================================= */

const FALLBACK_COURSES = [
  {
    _id: "fb-fsd",
    slug: "full-stack-web-development",
    title: "Full Stack Web Development",
    category: "Software Development",
    shortDescription: "Build modern end-to-end web applications with React, Node.js, Express, databases and real cloud deployments.",
    badgeLabel: "Popular Track",
    duration: "8 Weeks",
    priceMinor: 1499900,
    listPriceMinor: 2499900,
    deliveryMode: "hybrid",
    certificate: { available: true },
    projects: [
      { tag: "Full Stack", title: "E-commerce web application", description: "Build a shop with product pages, login, cart and order flow.", technologies: ["React", "Node.js", "MongoDB"] },
      { tag: "Backend", title: "Task manager with login", description: "REST APIs with secure sign-in and a React front end.", technologies: ["Express", "JWT", "React"] },
      { tag: "Deployment", title: "Deploy to the cloud", description: "Put your application live with a proper build and hosting setup.", technologies: ["Vercel", "AWS"] },
    ],
    curriculum: [
      { module: "Frontend Engineering", topics: ["HTML5", "CSS3", "JavaScript ES6+", "React Hooks"] },
      { module: "Backend & APIs", topics: ["Node.js", "Express", "REST APIs", "Auth JWT"] },
      { module: "Databases & Cloud", topics: ["MongoDB", "PostgreSQL", "AWS / Vercel Deploy"] },
    ],
  },
  {
    _id: "fb-aiml",
    slug: "ai-and-machine-learning-mastery",
    title: "AI & Machine Learning Mastery",
    category: "Artificial Intelligence",
    shortDescription: "Master Python data science, neural networks, predictive modelling, and generative AI workflow integration.",
    badgeLabel: "Trending",
    duration: "10 Weeks",
    priceMinor: 1899900,
    listPriceMinor: 2999900,
    deliveryMode: "hybrid",
    certificate: { available: true },
    projects: [
      { tag: "Data Science", title: "Sales prediction model", description: "Clean a real dataset and predict future sales.", technologies: ["Python", "Pandas", "scikit-learn"] },
      { tag: "Deep Learning", title: "Image classifier", description: "Train a model that recognises objects in photos.", technologies: ["Python", "PyTorch"] },
      { tag: "AI Project", title: "Document Q&A chatbot", description: "A chatbot that answers questions from your own documents.", technologies: ["LLM APIs", "RAG"] },
    ],
    curriculum: [
      { module: "Data Science with Python", topics: ["NumPy", "Pandas", "Matplotlib"] },
      { module: "Machine Learning Algorithms", topics: ["Regression", "Classification", "Clustering"] },
      { module: "Deep Learning & GenAI", topics: ["PyTorch Basics", "LLM APIs", "RAG Systems"] },
    ],
  },
  {
    _id: "fb-iot",
    slug: "iot-embedded-systems-engineering",
    title: "IoT & Embedded Systems Engineering",
    category: "Hardware & IoT",
    shortDescription: "Design connected smart hardware devices with ESP32, microcontrollers, sensor arrays and MQTT cloud telemetry.",
    badgeLabel: "Hands-on Lab",
    duration: "6 Weeks",
    priceMinor: 1299900,
    listPriceMinor: 1999900,
    deliveryMode: "hybrid",
    certificate: { available: true },
    projects: [
      { tag: "IoT", title: "Smart room monitor", description: "Read temperature and humidity and send them to the cloud.", technologies: ["ESP32", "Sensors", "MQTT"] },
      { tag: "Dashboard", title: "Live sensor dashboard", description: "See your device data on a live web dashboard.", technologies: ["MQTT", "Dashboard"] },
      { tag: "Embedded", title: "Automatic plant watering", description: "Water a plant when the soil gets dry.", technologies: ["ESP32", "Soil sensor", "Relay"] },
    ],
    curriculum: [
      { module: "Microcontroller Fundamentals", topics: ["ESP32", "Arduino C++", "GPIO & Sensors"] },
      { module: "IoT Protocols & Cloud", topics: ["MQTT", "HTTP Telemetry", "Dashboard Integration"] },
      { module: "Hardware Prototyping", topics: ["Breadboarding", "Power Management", "Enclosure Integration"] },
    ],
  },
  {
    _id: "fb-uiux",
    slug: "ui-ux-design-product-strategy",
    title: "UI/UX Design & Product Strategy",
    category: "Design & UX",
    shortDescription: "Craft intuitive, accessible user interfaces and design systems with modern Figma workflows and user testing.",
    badgeLabel: "Industry Standard",
    duration: "6 Weeks",
    priceMinor: 999900,
    listPriceMinor: 1699900,
    deliveryMode: "hybrid",
    certificate: { available: true },
    projects: [
      { tag: "UX Research", title: "Mobile app redesign", description: "Research users and redesign a real app screen by screen.", technologies: ["Figma", "User research"] },
      { tag: "UI Design", title: "Design system kit", description: "Colours, type and reusable components for a product.", technologies: ["Figma", "Components"] },
      { tag: "Prototype", title: "Clickable prototype", description: "A working prototype tested with real users.", technologies: ["Figma", "Usability testing"] },
    ],
    curriculum: [
      { module: "UX Research & Wireframing", topics: ["User Personas", "Journey Maps", "Low-fi Wireframes"] },
      { module: "Visual Design & Systems", topics: ["Typography", "Color Systems", "Components & Variants"] },
      { module: "Interactive Prototyping", topics: ["Smart Animate", "Usability Testing", "Dev Handoff"] },
    ],
  },
];

const FILTER_KEYS = ["q", "track", "level", "price", "sort", "page"];

const searchText = (course) => [
  course.title, course.shortDescription, course.description, course.category,
  ...(course.skills || []), ...(course.tools || []),
  ...(course.curriculum || []).flatMap((m) => [m.title || m.module, ...(m.topics || []).map((t) => (typeof t === "string" ? t : t.title))]),
].filter(Boolean).join(" ").toLowerCase();

/* "You may also like": every other course; same track first, then the closest price. */
const relatedCourses = (all, current) => all
  .filter((c) => c.slug !== current.slug && c._id !== current._id)
  .map((c) => ({ c, score: (c.category === current.category ? 0 : 1e9) + Math.abs((c.priceMinor || 0) - (current.priceMinor || 0)) }))
  .sort((a, b) => a.score - b.score)
  .map(({ c }) => c);

const scrollToCatalog = () => {
  window.requestAnimationFrame(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("course-catalog")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  });
};

export default function ExploreOurCourses() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState(null);
  const [loadedKey, setLoadedKey] = useState("");
  const requestKey = slug ? `slug:${slug}` : "list";
  const loading = loadedKey !== requestKey;

  useEffect(() => {
    let active = true;
    /* The list is loaded on the detail page too, for "You may also like". */
    const list = api("/?page=1&limit=100").then((data) => (data.items?.length ? data.items : FALLBACK_COURSES)).catch(() => FALLBACK_COURSES);
    const detail = slug
      ? api(`/slug/${encodeURIComponent(slug)}`).then((data) => data.item).catch(() => null)
      : Promise.resolve(null);
    Promise.all([list, detail]).then(([items, item]) => {
      if (!active) return;
      setCourses(items);
      if (slug) setCourse(item || items.find((c) => c.slug === slug) || FALLBACK_COURSES.find((c) => c.slug === slug) || FALLBACK_COURSES[0]);
      setLoadedKey(requestKey);
    });
    return () => { active = false; };
  }, [slug, requestKey]);

  useEffect(() => {
    document.title = slug && course ? `${course.title} | ProJenius Innovation Technology` : "Explore Courses | ProJenius Innovation Technology";
  }, [slug, course]);

  /* "#course-catalog" links land on the catalogue once it has loaded */
  useEffect(() => {
    if (!slug && !loading && window.location.hash === "#course-catalog") scrollToCatalog();
  }, [slug, loading]);

  /* ---- Filters (kept in the URL) ---- */
  const filters = useMemo(() => Object.fromEntries(FILTER_KEYS.map((k) => [k, searchParams.get(k) || ""])), [searchParams]);
  const updateFilters = useCallback((patch) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      Object.entries(patch).forEach(([k, v]) => { if (v) next.set(k, v); else next.delete(k); });
      return next;
    }, { replace: true, preventScrollReset: true });
  }, [setSearchParams]);
  const clearFilters = useCallback(() => updateFilters(Object.fromEntries(FILTER_KEYS.map((k) => [k, ""]))), [updateFilters]);

  const categories = useMemo(() => {
    const counts = new Map();
    courses.forEach((c) => { if (c.category) counts.set(c.category, (counts.get(c.category) || 0) + 1); });
    return [...counts].map(([name, count]) => ({ name, count }));
  }, [courses]);
  const levels = useMemo(() => [...new Set(courses.map((c) => c.level).filter(Boolean))], [courses]);

  const results = useMemo(() => {
    const words = filters.q.toLowerCase().split(/\s+/).filter(Boolean);
    const range = PRICE_RANGES.find((r) => r.id === filters.price);
    const list = courses.filter((c) => {
      if (filters.track && c.category !== filters.track) return false;
      if (filters.level && c.level !== filters.level) return false;
      if (range?.test && !range.test(c.priceMinor || 0)) return false;
      if (words.length) {
        const text = searchText(c);
        if (!words.every((w) => text.includes(w))) return false;
      }
      return true;
    });
    const off = (c) => (c.listPriceMinor > c.priceMinor ? 1 - c.priceMinor / c.listPriceMinor : 0);
    if (filters.sort === "price-asc") list.sort((a, b) => a.priceMinor - b.priceMinor);
    if (filters.sort === "price-desc") list.sort((a, b) => b.priceMinor - a.priceMinor);
    if (filters.sort === "discount") list.sort((a, b) => off(b) - off(a));
    return list;
  }, [courses, filters]);

  if (slug) {
    if (loading || !course) return <div className="explore-page"><div className="wrap"><p role="status">Loading course…</p></div></div>;
    return <CourseDetail key={course._id} course={course} related={relatedCourses(courses, course)} onBack={() => navigate("/services/courses")} />;
  }

  return (
    <>
      <CoursesHero
        query={filters.q}
        onQueryChange={(q) => updateFilters({ q, page: "" })}
        onSearch={scrollToCatalog}
      />
      <CourseCatalog
        loading={loading}
        courses={courses}
        results={results}
        filters={filters}
        categories={categories}
        levels={levels}
        onChange={updateFilters}
        onClear={clearFilters}
      />
      <ServiceFaq
        id="course-faq"
        items={COURSE_FAQ}
        askTo="/contact?type=course&from=courses-faq"
        lead="Not sure which course fits you, or have a doubt before you enrol? Ask us directly."
      />
      <CourseReviews courses={courses} />
    </>
  );
}
