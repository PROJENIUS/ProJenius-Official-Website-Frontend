import { createElement, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Award, BookOpen, ChevronLeft, ChevronRight, FileCheck2, Share2, CalendarDays, Check, ChevronDown, Clock, CreditCard, Globe, Headphones,
  Landmark, Layers, Lock, MessageCircle, Monitor, ShieldCheck, Smartphone, Star, Users, Video, Wallet, Wrench,
  Briefcase, ClipboardCheck, Lightbulb, PlayCircle, Presentation, Hammer, GraduationCap,
} from "lucide-react";

import { loadRazorpayCheckout, validateCheckoutOrder } from "../ExploreOurCourses/razorpayCheckout.js";
import { api, inr, mediaUrl } from "../courseApi.js";
import { whatsappHref } from "../../../../utils/whatsapp.js";
import { CourseCard } from "../CourseCatalog/CourseCatalog.jsx";
import { CareerArt, ProjectArt } from "./CourseArt.jsx";
import "./CourseDetail.css";

/* =============================================================================
   COURSE DETAIL PAGE
   1  Hero              title, introduction, live-course label, enrol CTA
   2  Course navigation Overview · Curriculum · Projects · FAQs (sticky)
   3  About             description + what you will learn
   4  Highlights        practical learning, projects, certificate
   5  Curriculum        expandable modules
   6  Projects
   7  Inclusions        classes, resources, support, certificate
   8  Audience & outcomes
   9  Reviews           published reviews only
   10 FAQs
   11 Final enrol CTA
   Right column: the purchase card (preview, price, discount, enrolment
   form) with the Razorpay checkout and payment methods; sticky on desktop.

   Every value comes from the saved course. A section is hidden when the
   course has no data for it; nothing is invented (no sample ratings,
   counts or numbers). The checkout (terms → order → Razorpay → verify →
   receipt) is the existing flow, unchanged.
   ============================================================================= */

const DELIVERY = {
  online: { label: "Online course", short: "Online" },
  "in-person": { label: "Offline course · ProJenius centre", short: "Offline" },
  hybrid: { label: "Online & offline classes", short: "Online & offline" },
  "self-paced": { label: "Online course", short: "Online" },
};

const EXPERIENCE = {
  "beginner-friendly": "Beginner-friendly",
  "prior-experience": "Prior experience required",
  "all-levels": "All levels",
};

const LEVEL = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" };

const RICH_TEXT_TAGS = new Set([
  "P", "BR", "STRONG", "B", "EM", "I", "U", "UL", "OL", "LI",
  "H3", "H4", "BLOCKQUOTE", "CODE", "PRE", "A",
]);
const RICH_TEXT_DROP_TAGS = new Set([
  "SCRIPT", "STYLE", "IFRAME", "OBJECT", "EMBED", "SVG", "MATH",
  "FORM", "INPUT", "BUTTON", "VIDEO", "AUDIO", "TEMPLATE",
]);

/* Course descriptions can come from the publishing API. Parse them into React
   nodes from a small allow-list; never insert server-provided HTML directly. */
function renderSafeCourseHtml(html) {
  if (!html || typeof DOMParser === "undefined") return html || null;
  const document = new DOMParser().parseFromString(String(html), "text/html");
  let key = 0;

  const renderNode = (node) => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent;
    if (node.nodeType !== Node.ELEMENT_NODE) return null;

    const tag = node.tagName.toUpperCase();
    if (RICH_TEXT_DROP_TAGS.has(tag)) return null;
    const children = Array.from(node.childNodes, renderNode).filter((child) => child !== null);
    if (!RICH_TEXT_TAGS.has(tag)) return children;

    const props = { key: `course-rich-${key++}` };
    if (tag === "A") {
      const href = node.getAttribute("href");
      try {
        const url = new URL(href || "", window.location.origin);
        if (["https:", "http:", "mailto:"].includes(url.protocol)) {
          props.href = url.href;
          props.rel = "noopener noreferrer";
          props.target = "_blank";
        }
      } catch {
        // Render link text without an unsafe or malformed destination.
      }
    }
    return createElement(tag.toLowerCase(), props, ...children);
  };

  return Array.from(document.body.childNodes, renderNode).filter((child) => child !== null);
}

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const scrollToId = (event, id) => {
  const target = document.getElementById(id);
  if (!target) return;
  event?.preventDefault();
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
};

/* Included with every course (confirmed as common for all courses). */
const CAREER_SUPPORT = [
  { kind: "interview", title: "Mock interviews", text: "Practise technical and HR interviews and get feedback from our team." },
  { kind: "resume", title: "Resume review", text: "Build a clear resume around your skills and course projects." },
  { kind: "linkedin", title: "LinkedIn profile", text: "Set up a profile that shows your skills, projects and certificate." },
  { kind: "placement", title: "Placement guidance & tips", text: "Know which roles to aim for and how to prepare for them." },
  { kind: "activities", title: "Hands-on activities", text: "Practice tasks in every module that turn topics into skills." },
];

/* Picture for a project card, from its tag, tools and the course track. */
function projectVariant(project, course) {
  const rules = [
    ["cloud", /(cloud|aws|docker|deploy|vercel|kubernetes|devops)/],
    ["data", /(dashboard|chart|analytics|ai|ml|python|data|llm|pandas|pytorch|machine|rag)/],
    ["design", /(figma|ui|ux|design|prototype|research)/],
    ["device", /(iot|esp32|embedded|sensor|mqtt|arduino|pcb|hardware|robot|relay)/],
  ];
  const pick = (text) => rules.find(([, re]) => re.test(text.toLowerCase()))?.[0];
  /* The project's own tag and tools decide first; the course track is the fallback. */
  return pick([project.tag, project.title, ...(project.technologies || [])].join(" ")) || pick(course.category || "") || "web";
}

/* Sliding row with a progress bar and arrows (projects, career support).
   Moves on by one card every 3 s while on screen; pauses on hover or focus,
   stops once the visitor uses the arrows, loops to the start after the
   last card, and stays still for reduced motion. */
const AUTOPLAY_MS = 3000;

function AutoCarousel({ label, className = "", children }) {
  const trackRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [onScreen, setOnScreen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [stopped, setStopped] = useState(false);

  const onScroll = () => {
    const t = trackRef.current;
    if (!t) return;
    const max = t.scrollWidth - t.clientWidth;
    setProgress(max > 0 ? t.scrollLeft / max : 1);
  };
  const step = (dir) => {
    const t = trackRef.current;
    if (!t) return;
    const card = t.firstElementChild;
    const max = t.scrollWidth - t.clientWidth;
    if (dir > 0 && t.scrollLeft >= max - 4) t.scrollTo({ left: 0, behavior: "smooth" });
    else t.scrollBy({ left: dir * ((card?.offsetWidth || 280) + 16), behavior: "smooth" });
  };

  useEffect(() => {
    const t = trackRef.current;
    if (!t || !("IntersectionObserver" in window)) return undefined;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.4 });
    io.observe(t);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!onScreen || paused || stopped || reduce) return undefined;
    const timer = window.setInterval(() => step(1), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [onScreen, paused, stopped]);

  return (
    <div
      className={`pjcd-cc ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <ol ref={trackRef} className="pjcd-cc__track" onScroll={onScroll} aria-label={label}>
        {children}
      </ol>
      <div className="pjcd-cc__bar">
        <span className="pjcd-cc__progress" aria-hidden="true"><span style={{ width: `${Math.max(18, progress * 100)}%` }} /></span>
        <span className="pjcd-cc__arrows">
          <button type="button" onClick={() => { setStopped(true); step(-1); }} aria-label="Previous"><ChevronLeft size={20} /></button>
          <button type="button" onClick={() => { setStopped(true); step(1); }} aria-label="Next"><ChevronRight size={20} /></button>
        </span>
      </div>
    </div>
  );
}

/* How a student moves through any course. */
const JOURNEY = [
  { Icon: GraduationCap, title: "Enrol", text: "Register and confirm your batch with our team." },
  { Icon: Video, title: "Attend classes", text: "Learn online or at the ProJenius centre." },
  { Icon: Hammer, title: "Practise", text: "Hands-on activities in every module." },
  { Icon: Presentation, title: "Build your project", text: "Apply what you learnt and present it." },
  { Icon: Award, title: "Get certified", text: "Earn your certificate on completion." },
  { Icon: Briefcase, title: "Career support", text: "Placement tips, resume and LinkedIn help." },
];

/* Shown when a course has no projects saved yet: how project work runs. */
const PROJECT_STEPS = [
  { Icon: Lightbulb, title: "Pick a problem", text: "Choose a project idea that uses the course topics." },
  { Icon: ClipboardCheck, title: "Plan it", text: "Break it into features and decide the tools." },
  { Icon: Hammer, title: "Build it", text: "Work on it during the course with guidance." },
  { Icon: Presentation, title: "Present it", text: "Show it to the team and add it to your portfolio." },
];

/* Plain-English reason from a Razorpay failure. */
function failureReason(error) {
  const text = [error?.description, error?.reason && error.reason.replace(/_/g, " ")].filter(Boolean)[0];
  return text ? `${text.charAt(0).toUpperCase()}${text.slice(1)}${/[.!]$/.test(text) ? "" : "."}` : "The bank or payment app declined the payment.";
}

export default function CourseDetail({ course, related = [], onBack }) {
  /* ---- Checkout state (existing flow) ---- */
  const [student, setStudent] = useState({ name: "", email: "", phone: "", preferredDays: [], preferredTimeSlots: [], preferredMode: course.deliveryMode === "in-person" ? "offline" : "online" });
  const [terms, setTerms] = useState(null);
  const [accepted, setAccepted] = useState(false), [busy, setBusy] = useState(false), [checkoutOpen, setCheckoutOpen] = useState(false), [message, setMessage] = useState(""), [receiptUrl, setReceiptUrl] = useState(""), [receiptRequestBusy, setReceiptRequestBusy] = useState(false), [reference, setReference] = useState(""), [result, setResult] = useState(null);
  const idempotencyRef = useRef(null);

  /* ---- Page state ---- */
  const [openModules, setOpenModules] = useState([0]);
  const [openFaq, setOpenFaq] = useState(0);
  const [showAllFaqs, setShowAllFaqs] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [navStuck, setNavStuck] = useState(false);
  const navSentinelRef = useRef(null);

  useEffect(() => { let active = true; api("/terms").then(({ item }) => { if (active) setTerms(item); }).catch((error) => { if (active) setMessage(error.message); }); return () => { active = false; }; }, []);
  const update = (event) => {
    idempotencyRef.current = null;
    setStudent((value) => ({ ...value, [event.target.name]: event.target.value }));
  };
  const updatePreference = (field, value, checked) => {
    idempotencyRef.current = null;
    setStudent((current) => ({ ...current, [field]: checked ? [...new Set([...current[field], value])] : current[field].filter((item) => item !== value) }));
  };
  const buy = async (event) => {
    event.preventDefault(); setMessage(""); setResult(null); setBusy(true);
    try {
      if (!terms) throw new Error("The required registration terms could not be loaded. Please try again.");
      if (!accepted) throw new Error("Please accept the Terms & Conditions to continue.");
      const RazorpayCheckout = await loadRazorpayCheckout();
      const requestFingerprint = JSON.stringify([course._id, student.name, student.email, student.phone, student.preferredDays, student.preferredTimeSlots, student.preferredMode, terms.version]);
      if (idempotencyRef.current?.fingerprint !== requestFingerprint) {
        idempotencyRef.current = { fingerprint: requestFingerprint, key: crypto.randomUUID() };
      }
      const rawOrderData = await api(`/${encodeURIComponent(course._id)}/orders`, { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": idempotencyRef.current.key }, body: JSON.stringify({ student, termsAccepted: true, termsVersion: terms.version }) });
      const orderData = validateCheckoutOrder(rawOrderData);
      const checkout = new RazorpayCheckout({ key: orderData.keyId, order_id: orderData.order.id, amount: orderData.order.amount, currency: orderData.order.currency, name: orderData.checkout.name, description: orderData.checkout.description, prefill: orderData.checkout.prefill, handler: async (result) => {
        const base = { course: course.title, amount: orderData.order.amount, email: student.email, paymentId: result.razorpay_payment_id, reference: orderData.enrollment.reference };
        try {
          const verified = await api("/payments/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(result) });
          const savedReference = verified.reference || orderData.enrollment.reference;
          setReference(savedReference);
          if (verified.receiptUrl) setReceiptUrl(verified.receiptUrl);
          setResult(verified.status === "captured"
            ? { ...base, type: "success", reference: savedReference, receiptUrl: verified.receiptUrl, paidAt: new Date().toISOString() }
            : { ...base, type: "pending", reference: savedReference, reason: `The payment status is "${verified.status}". It usually updates within a few minutes.` });
        }
        catch (e) { setResult({ ...base, type: "pending", reason: e.message || "We could not confirm the payment yet." }); }
        finally { setCheckoutOpen(false); }
      }, modal: { ondismiss: () => { setCheckoutOpen(false); setResult((current) => current || { type: "closed", course: course.title, amount: orderData.order.amount, reference: orderData.enrollment.reference, reason: "You closed the payment window before paying. No money has been taken." }); } } });
      checkout.on("payment.failed", async (failure) => {
        setCheckoutOpen(false);
        const metadata = failure?.error?.metadata || {};
        const failed = { type: "failed", course: course.title, amount: orderData.order.amount, reference: orderData.enrollment.reference, paymentId: metadata.payment_id, reason: failureReason(failure?.error) };
        try {
          if (metadata.order_id && metadata.payment_id) await api("/payments/failure", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId: metadata.order_id, paymentId: metadata.payment_id }) });
          setResult(failed);
        } catch { setResult({ ...failed, type: "pending", reason: "We are still confirming this payment. If money was deducted, it will be confirmed or refunded automatically." }); }
      });
      setCheckoutOpen(true);
      checkout.open();
    } catch (e) { setCheckoutOpen(false); setMessage(e.message || "Online payments are temporarily unavailable. No payment has been taken. Please try again later."); }
    finally { setBusy(false); }
  };
  const requestReceiptLink = async () => {
    setReceiptRequestBusy(true);
    try { const result = await api("/receipt-link", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reference, email: student.email }) }); setMessage(result.message); }
    catch (error) { setMessage(error.message); }
    finally { setReceiptRequestBusy(false); }
  };

  /* ---- Derived course data (only what is saved) ---- */
  /* Accepts the saved shape (title, topics[{title}]) and plain strings */
  const curriculum = (course.curriculum || []).map((m) => ({
    ...m,
    title: m.title || m.module || "",
    topics: (m.topics || []).map((t) => (typeof t === "string" ? { title: t } : t)),
  }));
  /* Saved learning outcomes; otherwise one line per module from the curriculum */
  const outcomes = course.learningOutcomes?.length
    ? course.learningOutcomes
    : curriculum.filter((m) => m.title).map((m) => (m.topics.length ? `${m.title}: ${m.topics.map((t) => t.title).join(", ")}` : m.title));
  const hasCertificate = Boolean(course.certificate?.available);
  const projects = [...(course.projects || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
  const faqs = [...(course.faqs || [])].filter((f) => f.published !== false).sort((a, b) => (a.order || 0) - (b.order || 0));
  /* Published reviews only (the API already filters; this guards the offline list) */
  const reviews = [...(course.reviews || [])].filter((r) => r.published === true && r.testimonial).sort((a, b) => (a.order || 0) - (b.order || 0));
  const delivery = DELIVERY[course.deliveryMode];
  const activityCount = curriculum.reduce((n, m) => n + (m.practicalActivities?.length || 0), 0);
  const topicCount = curriculum.reduce((n, m) => n + (m.topics?.length || 0) + (m.lessons?.length || 0) + (m.practicalActivities?.length || 0), 0);
  const hasDiscount = course.listPriceMinor > course.priceMinor;
  const discount = hasDiscount ? Math.round((1 - course.priceMinor / course.listPriceMinor) * 100) : 0;
  const ratingAverage = reviews.length ? Math.round((reviews.reduce((n, r) => n + (r.rating || 0), 0) / reviews.length) * 10) / 10 : null;
  const ratingCount = reviews.length;
  const startDate = formatDate(course.startDate);
  const deadline = formatDate(course.registrationDeadline);
  const open = course.enrollmentOpen !== false;

  /* Six highlight boxes: course data where saved, otherwise the parts every course includes. */
  const highlights = [
    { Icon: Layers, title: "Real projects", text: projects.length ? `Build ${projects.length} ${projects.length === 1 ? "project" : "projects"} during the course.` : "Build your own project during the course." },
    { Icon: BookOpen, title: "Step-by-step curriculum", text: curriculum.length ? `${curriculum.length} ${curriculum.length === 1 ? "module" : "modules"} and ${topicCount} topics, from the basics upward.` : "Structured modules, from the basics upward." },
    { Icon: Video, title: delivery ? `${delivery.short} classes` : "Guided classes", text: course.deliveryMode === "in-person" ? "Classes at the ProJenius centre in Madurai." : course.deliveryMode === "online" || course.deliveryMode === "self-paced" ? "Online sessions with the ProJenius team." : "Sessions with the ProJenius team." },
    { Icon: Wrench, title: "Hands-on activities", text: activityCount ? `${activityCount} practical ${activityCount === 1 ? "activity" : "activities"}, plus practice in every module.` : "Practice tasks in every module." },
    hasCertificate
      ? { Icon: Award, title: "Certification", text: course.certificate.description || "A certificate is awarded on completion." }
      : { Icon: Headphones, title: "Team support", text: "Our team stays in touch from registration to completion." },
    { Icon: Briefcase, title: "Career support", text: "Placement tips, resume review and LinkedIn profile help." },
  ];

  const inclusions = [
    { Icon: Layers, title: "Portfolio projects", text: projects.length ? `${projects.length} ${projects.length === 1 ? "project" : "projects"} you build and keep for your portfolio.` : "A project you build and keep for your portfolio." },
    { Icon: Wrench, title: "Hands-on practice", text: activityCount ? `${activityCount} practical ${activityCount === 1 ? "activity" : "activities"} across the modules.` : "Practice tasks in every module." },
    hasCertificate && { Icon: Award, title: "Certificate", text: "Awarded on completion of the course." },
    { Icon: Briefcase, title: "Career guidance", text: "Placement tips, resume and LinkedIn profile help." },
    { Icon: MessageCircle, title: "Mock interviews", text: "Practice interviews with feedback before you apply." },
    { Icon: Headphones, title: "Team support", text: "Our team contacts you by phone after registration and stays in touch." },
    course.courseValidity && { Icon: CalendarDays, title: "Programme period", text: course.courseValidity },
  ].filter(Boolean).slice(0, 6);

  const facts = [
    course.duration && { Icon: Clock, label: "Duration", value: course.duration },
    curriculum.length > 0 && { Icon: Layers, label: "Modules", value: String(curriculum.length) },
    topicCount > 0 && { Icon: BookOpen, label: "Activities", value: String(topicCount) },
    delivery && { Icon: Monitor, label: "Format", value: delivery.short },
    course.language && { Icon: Globe, label: "Language", value: course.language },
    (EXPERIENCE[course.experienceLevel] || LEVEL[course.level]) && { Icon: Users, label: "Level", value: EXPERIENCE[course.experienceLevel] || LEVEL[course.level] },
  ].filter(Boolean);

  const sections = [
    ["overview", "Overview", true],
    ["curriculum", "Curriculum", curriculum.length > 0],
    ["projects", "Projects", true],
    ["certificate", "Certificate", hasCertificate],
    ["career", "Career support", true],
    ["reviews", "Reviews", reviews.length > 0],
    ["faqs", "FAQs", faqs.length > 0],
  ].filter(([, , visible]) => visible);
  const sectionKey = sections.map(([id]) => id).join("|");

  /* Highlight the nav item for the section in view */
  useEffect(() => {
    const ids = sectionKey.split("|");
    let frame = 0;
    const check = () => {
      frame = 0;
      let current = ids[0];
      ids.forEach((id) => {
        const el = document.getElementById(`course-${id}`);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.35) current = id;
      });
      setActiveSection(current);
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(check); };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [sectionKey]);

  /* Sections fade up as they enter, and reset when they leave (works scrolling up too) */
  const contentRef = useRef(null);
  useEffect(() => {
    const root = contentRef.current;
    if (!root || !("IntersectionObserver" in window)) return undefined;
    const items = Array.from(root.querySelectorAll(".pjcd-section"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.dataset.in = "true";
        else if (entry.boundingClientRect.top > 0) entry.target.dataset.in = "false";
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0 });
    items.forEach((item) => {
      if (item.getBoundingClientRect().top > window.innerHeight) item.dataset.in = "false";
      observer.observe(item);
    });
    return () => observer.disconnect();
  }, [sectionKey]);

  /* The site navbar hides on scroll down and returns on scroll up; the course
     nav sits right under it when it is shown (see .pjcd-nav in the CSS). */
  const rootRef = useRef(null);
  useEffect(() => {
    const measure = () => {
      const header = document.querySelector(".glass-header");
      if (header && rootRef.current) rootRef.current.style.setProperty("--pjcd-head-h", `${header.offsetHeight}px`);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  /* A card taller than the screen sticks by its bottom edge, so the
     checkout button is always reachable while scrolling. */
  const buyCardRef = useRef(null);
  useEffect(() => {
    const card = buyCardRef.current;
    if (!card || !rootRef.current) return undefined;
    const fit = () => rootRef.current?.style.setProperty("--pjcd-buy-fit", `${Math.round(window.innerHeight - card.offsetHeight - 16)}px`);
    fit();
    const ro = "ResizeObserver" in window ? new ResizeObserver(fit) : null;
    ro?.observe(card);
    window.addEventListener("resize", fit);
    return () => { ro?.disconnect(); window.removeEventListener("resize", fit); };
  }, []);

  /* Show the compact price/enrol button in the nav once the hero has passed */
  useEffect(() => {
    const el = navSentinelRef.current;
    if (!el) return undefined;
    let frame = 0;
    const check = () => { frame = 0; setNavStuck(el.getBoundingClientRect().top < 1); };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(check); };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const cover = course.coverImage?.url ? mediaUrl(course.coverImage.url) : "";
  const enrolLabel = open ? `Enrol now · ${inr(course.priceMinor)}` : "Registration closed";

  return (
    <div className="pjcd" ref={rootRef}>
      {/* ================= 1 HERO ================= */}
      <section className="pjcd-hero" aria-labelledby="course-title">
        <div className="pjds-container">
          <nav className="pjcd-crumbs" aria-label="Breadcrumb">
            <button type="button" className="pjcd-back" onClick={onBack}>
              <ArrowLeft size={16} aria-hidden="true" /> All courses
            </button>
            <span className="pjcd-crumbs__sep" aria-hidden="true">/</span>
            <span className="pjcd-crumbs__here" aria-current="page">{course.title}</span>
          </nav>
          <div className="pjcd-hero__grid">
            <div className="pjcd-hero__copy">
              <h1 id="course-title" className="pjcd-hero__title">{course.title}</h1>
              <p className="pjcd-hero__intro">{course.shortDescription}</p>
              {ratingAverage != null && ratingCount > 0 && (
                <p className="pjcd-hero__rating">
                  <Star size={16} aria-hidden="true" />
                  <strong>{ratingAverage}</strong> / 5 · {ratingCount} published {ratingCount === 1 ? "review" : "reviews"}
                </p>
              )}
              <div className="pjcd-hero__actions">
                <a className="pjcd-btn pjcd-btn--primary" href="#course-purchase" onClick={(e) => scrollToId(e, "course-purchase")} aria-disabled={!open}>
                  {enrolLabel} <ArrowRight size={18} aria-hidden="true" />
                </a>
                {curriculum.length > 0 && (
                  <a className="pjcd-btn pjcd-btn--ghost" href="#course-curriculum" onClick={(e) => scrollToId(e, "course-curriculum")}>
                    View curriculum
                  </a>
                )}
              </div>
              {(startDate || deadline) && (
                <p className="pjcd-hero__dates">
                  {startDate && <span><CalendarDays size={15} aria-hidden="true" /> Starts {startDate}</span>}
                  {deadline && <span>Register by {deadline}</span>}
                </p>
              )}
            </div>
            {cover && (
              <div className="pjcd-hero__media">
                <img src={cover} alt={course.coverImage.alt || course.title} onError={(e) => { e.currentTarget.parentElement.hidden = true; }} />
              </div>
            )}
          </div>

          {facts.length > 0 && (
            <dl className="pjcd-facts">
              {facts.map(({ Icon, label, value }) => (
                <div key={label} className="pjcd-fact">
                  <Icon size={18} aria-hidden="true" />
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>

      <div ref={navSentinelRef} aria-hidden="true" />

      {/* ================= 2 COURSE NAVIGATION ================= */}
      <nav className={`pjcd-nav${navStuck ? " is-stuck" : ""}`} aria-label="Course sections">
        <div className="pjds-container pjcd-nav__inner">
          <ul className="pjcd-nav__list">
            {sections.map(([id, label]) => (
              <li key={id}>
                <a
                  href={`#course-${id}`}
                  className={activeSection === id ? "is-active" : undefined}
                  aria-current={activeSection === id ? "location" : undefined}
                  onClick={(e) => { setActiveSection(id); scrollToId(e, `course-${id}`); }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <a className="pjcd-nav__cta" href="#course-purchase" onClick={(e) => scrollToId(e, "course-purchase")} tabIndex={navStuck ? 0 : -1} aria-hidden={!navStuck}>
            <span>{inr(course.priceMinor)}</span> Enrol now
          </a>
        </div>
      </nav>

      <div className="pjcd-body">
        <div className="pjds-container pjcd-layout">
          <div className="pjcd-content" ref={contentRef}>
            {/* ================= 3 ABOUT ================= */}
            <section id="course-overview" className="pjcd-section" aria-labelledby="course-overview-title">
              <header className="pjcd-head">
                <p className="pjcd-head__eyebrow">About the course</p>
                <h2 id="course-overview-title" className="pjcd-head__title">Course overview</h2>
              </header>
              {course.aboutContent
                ? <div className="pjcd-rich">{renderSafeCourseHtml(course.aboutContent)}</div>
                : <p className="pjcd-text">{course.description || course.shortDescription}</p>}
              {course.aboutContent && course.description && <p className="pjcd-text">{course.description}</p>}

              {outcomes.length > 0 && (
                <div className="pjcd-learn">
                  <h3 className="pjcd-subtitle">What you will learn</h3>
                  <ul className="pjcd-checks">
                    {outcomes.map((item, index) => (
                      <li key={`${index}-${item}`}><Check size={16} aria-hidden="true" />{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {/* ================= 4 HIGHLIGHTS ================= */}
            {(highlights.length > 0 || course.highlights?.length > 0) && (
              <section className="pjcd-section" aria-labelledby="course-highlights-title">
                <header className="pjcd-head">
                  <p className="pjcd-head__eyebrow">Course highlights</p>
                  <h2 id="course-highlights-title" className="pjcd-head__title">Learn by doing</h2>
                </header>
                {highlights.length > 0 && (
                  <ul className="pjcd-highlights">
                    {highlights.map(({ Icon, title, text }) => (
                      <li key={title} className="pjcd-highlight">
                        <span className="pjcd-highlight__icon" aria-hidden="true"><Icon size={20} /></span>
                        <h3>{title}</h3>
                        <p>{text}</p>
                      </li>
                    ))}
                  </ul>
                )}
                {course.highlights?.length > 0 && (
                  <ul className="pjcd-checks pjcd-checks--compact">
                    {course.highlights.map((item) => <li key={item}><Check size={16} aria-hidden="true" />{item}</li>)}
                  </ul>
                )}
              </section>
            )}

            {/* ================= 5 CURRICULUM ================= */}
            {curriculum.length > 0 && (
              <section id="course-curriculum" className="pjcd-section" aria-labelledby="course-curriculum-title">
                <header className="pjcd-head pjcd-head--row">
                  <div>
                    <p className="pjcd-head__eyebrow">Curriculum</p>
                    <h2 id="course-curriculum-title" className="pjcd-head__title">What the course covers</h2>
                  </div>
                  <div className="pjcd-curr__tools">
                    <p className="pjcd-head__meta">
                      {curriculum.length} {curriculum.length === 1 ? "module" : "modules"}
                      {topicCount > 0 && ` · ${topicCount} topics & activities`}
                    </p>
                    <button
                      type="button"
                      className="pjcd-curr__all"
                      onClick={() => setOpenModules(openModules.length === curriculum.length ? [] : curriculum.map((_, i) => i))}
                    >
                      {openModules.length === curriculum.length ? "Collapse all" : "Expand all"}
                    </button>
                  </div>
                </header>
                <ol className="pjcd-modules">
                  {curriculum.map((module, index) => {
                    const isOpen = openModules.includes(index);
                    const topics = module.topics || [];
                    const lessons = module.lessons || [];
                    const activities = module.practicalActivities || [];
                    const tiles = [
                      ...topics.map((t) => ({ ...t, kind: "Topic", Icon: BookOpen })),
                      ...lessons.map((l) => ({ ...l, kind: "Lesson", Icon: PlayCircle, description: l.summary })),
                      ...activities.map((a) => ({ ...a, kind: "Practical", Icon: Wrench })),
                    ];
                    const panelId = `course-module-${index}`;
                    const toggle = () => setOpenModules(isOpen ? openModules.filter((i) => i !== index) : [...openModules, index]);
                    return (
                      <li key={module._id || `${index}-${module.title}`} className={`pjcd-module${isOpen ? " is-open" : ""}`}>
                        <h3 className="pjcd-module__heading">
                          <button type="button" className="pjcd-module__toggle" aria-expanded={isOpen} aria-controls={panelId} onClick={toggle}>
                            <span className="pjcd-module__num">
                              <small>Module</small>
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="pjcd-module__main">
                              <span className="pjcd-module__title">{module.title}</span>
                              <span className="pjcd-module__pills">
                                {topics.length + lessons.length > 0 && <span><BookOpen size={13} aria-hidden="true" /> {topics.length + lessons.length} {topics.length + lessons.length === 1 ? "topic" : "topics"}</span>}
                                {activities.length > 0 && <span><Wrench size={13} aria-hidden="true" /> {activities.length} practical</span>}
                                {module.duration && <span><Clock size={13} aria-hidden="true" /> {module.duration}</span>}
                              </span>
                            </span>
                            <ChevronDown className="pjcd-module__chev" size={20} aria-hidden="true" />
                          </button>
                        </h3>
                        <div id={panelId} className="pjcd-module__panel" role="region" aria-label={module.title}>
                          <div className="pjcd-module__inner">
                            {module.description && <p className="pjcd-module__desc">{module.description}</p>}
                            {tiles.length > 0 && (
                              <ul className="pjcd-tiles">
                                {tiles.map(({ Icon: TileIcon, kind, title, description, duration }, i) => (
                                  <li key={`${kind}-${i}-${title}`} className={`pjcd-tile pjcd-tile--${kind.toLowerCase()}`}>
                                    <span className="pjcd-tile__icon" aria-hidden="true"><TileIcon size={16} /></span>
                                    <span className="pjcd-tile__body">
                                      <small>{kind} {index + 1}.{i + 1}{duration ? ` · ${duration}` : ""}</small>
                                      <strong>{title}</strong>
                                      {description && <em>{description}</em>}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </section>
            )}

            {/* ================= 6 PROJECTS ================= */}
            <section id="course-projects" className="pjcd-section" aria-labelledby="course-projects-title">
              <header className="pjcd-head">
                <p className="pjcd-head__eyebrow">Projects</p>
                <h2 id="course-projects-title" className="pjcd-head__title">{projects.length ? "What you will build" : "How your project works"}</h2>
              </header>
              {projects.length > 0 ? (
                <AutoCarousel label="Course projects" className="pjcd-cc--projects">
                  {projects.map((project, index) => (
                    <li key={`${index}-${project.title}`} className="pjcd-pcard">
                      <div className="pjcd-pcard__art">
                        <ProjectArt variant={projectVariant(project, course)} />
                        <span className="pjcd-pcard__tag">{project.tag || project.technologies?.[0] || course.category || `Project ${index + 1}`}</span>
                      </div>
                      <div className="pjcd-pcard__body">
                        <h3>{project.title}</h3>
                        {project.description && <p>{project.description}</p>}
                        {project.outcome && <p className="pjcd-pcard__outcome"><strong>Outcome:</strong> {project.outcome}</p>}
                        {project.technologies?.length > 0 && (
                          <ul className="pjcd-chips">{project.technologies.map((t) => <li key={t}>{t}</li>)}</ul>
                        )}
                      </div>
                    </li>
                  ))}
                </AutoCarousel>
              ) : (
                <>
                  <p className="pjcd-text">Every course ends with a project you build yourself, using what you learn in the modules.</p>
                  <ol className="pjcd-steps">
                    {PROJECT_STEPS.map(({ Icon: StepIcon, title, text }, i) => (
                      <li key={title} className="pjcd-step">
                        <span className="pjcd-step__num">{String(i + 1).padStart(2, "0")}</span>
                        <span className="pjcd-step__icon" aria-hidden="true"><StepIcon size={20} /></span>
                        <strong>{title}</strong>
                        <small>{text}</small>
                      </li>
                    ))}
                  </ol>
                </>
              )}
            </section>

            {/* ================= LEARNING JOURNEY (all courses) ================= */}
            <section className="pjcd-section" aria-labelledby="course-journey-title">
              <header className="pjcd-head">
                <p className="pjcd-head__eyebrow">Your learning journey</p>
                <h2 id="course-journey-title" className="pjcd-head__title">From day one to your first role</h2>
              </header>
              <ol className="pjcd-journey">
                {JOURNEY.map(({ Icon: StepIcon, title, text }, i) => (
                  <li key={title}>
                    <span className="pjcd-journey__dot" aria-hidden="true"><StepIcon size={18} /></span>
                    <span className="pjcd-journey__body">
                      <small>Step {i + 1}</small>
                      <strong>{title}</strong>
                      <em>{text}</em>
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            {/* ================= CERTIFICATE ================= */}
            {hasCertificate && (
              <section id="course-certificate" className="pjcd-section" aria-labelledby="course-certificate-title">
                <header className="pjcd-head">
                  <p className="pjcd-head__eyebrow">Certification</p>
                  <h2 id="course-certificate-title" className="pjcd-head__title">Earn your ProJenius certificate</h2>
                </header>
                <div className="pjcd-cert">
                  <div className="pjcd-cert__info">
                    <p className="pjcd-text">{course.certificate.description || "Complete the course to receive a ProJenius certificate."}</p>
                    <ul className="pjcd-cert__steps">
                      <li><span aria-hidden="true"><BookOpen size={18} /></span><span><strong>Complete every module</strong><small>Attend the classes and finish the topics.</small></span></li>
                      <li><span aria-hidden="true"><FileCheck2 size={18} /></span><span><strong>Finish your practical work</strong><small>Show what you built during the course.</small></span></li>
                      <li><span aria-hidden="true"><Share2 size={18} /></span><span><strong>Share it</strong><small>Add it to your resume and LinkedIn profile.</small></span></li>
                    </ul>
                  </div>
                  <figure className="pjcd-cert__preview">
                    <div className="pjcd-cert__paper" aria-hidden="true">
                      <p className="pjcd-cert__brand"><img src="/ProJenius_Logo.svg" alt="" width="26" height="26" /> ProJenius</p>
                      <p className="pjcd-cert__kind">Certificate of Completion</p>
                      <p className="pjcd-cert__small">This is to certify that</p>
                      <p className="pjcd-cert__name">Your Name</p>
                      <p className="pjcd-cert__small">has successfully completed</p>
                      <p className="pjcd-cert__course">{course.title}</p>
                      <span className="pjcd-cert__seal"><Award size={22} /></span>
                    </div>
                    <figcaption>Sample certificate preview</figcaption>
                  </figure>
                </div>
              </section>
            )}

            {/* ================= CAREER SUPPORT (all courses) ================= */}
            <section id="course-career" className="pjcd-section" aria-labelledby="course-career-title">
              <header className="pjcd-head">
                <p className="pjcd-head__eyebrow">Career support · every course</p>
                <h2 id="course-career-title" className="pjcd-head__title">Your career journey starts here</h2>
                <p className="pjcd-head__lead">Alongside the course, we help you get ready for your first role.</p>
              </header>
              <AutoCarousel label="Career support">
                {CAREER_SUPPORT.map(({ kind, title, text }, i) => (
                  <li key={kind} className={`pjcd-cc__card pjcd-cc__card--${i % 2 ? "b" : "a"}`}>
                    <strong>{title}</strong>
                    <small>{text}</small>
                    <CareerArt kind={kind} />
                  </li>
                ))}
              </AutoCarousel>
            </section>

            {/* ================= 7 INCLUSIONS ================= */}
            <section className="pjcd-section" aria-labelledby="course-includes-title">
              <header className="pjcd-head">
                <p className="pjcd-head__eyebrow">Course inclusions</p>
                <h2 id="course-includes-title" className="pjcd-head__title">This course includes</h2>
              </header>
              <ul className="pjcd-includes">
                {inclusions.map(({ Icon, title, text }) => (
                  <li key={title} className="pjcd-include">
                    <span className="pjcd-include__icon" aria-hidden="true"><Icon size={20} /></span>
                    <span>
                      <strong>{title}</strong>
                      <small>{text}</small>
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* ================= 9 REVIEWS ================= */}
            {reviews.length > 0 && (
              <section id="course-reviews" className="pjcd-section" aria-labelledby="course-reviews-title">
                <header className="pjcd-head pjcd-head--row">
                  <div>
                    <p className="pjcd-head__eyebrow">Student reviews</p>
                    <h2 id="course-reviews-title" className="pjcd-head__title">What students say</h2>
                  </div>
                  {ratingAverage != null && (
                    <p className="pjcd-head__meta"><Star size={16} aria-hidden="true" /> {ratingAverage} / 5 · {ratingCount} {ratingCount === 1 ? "review" : "reviews"}</p>
                  )}
                </header>
                <ul className="pjcd-reviews">
                  {reviews.map((review, index) => (
                    <li key={review._id || `${index}-${review.studentName}`} className="pjcd-review">
                      <p className="pjcd-review__stars" aria-label={`${review.rating} out of 5`}>
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star key={i} size={15} className={i < review.rating ? "is-on" : undefined} aria-hidden="true" />
                        ))}
                      </p>
                      <blockquote>{review.testimonial}</blockquote>
                      <p className="pjcd-review__by">
                        {review.photoUrl && <img src={review.photoUrl} alt="" loading="lazy" />}
                        <strong>{review.studentName}</strong>
                        {review.reviewDate && <time dateTime={new Date(review.reviewDate).toISOString()}>{formatDate(review.reviewDate)}</time>}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* ================= 10 FAQs ================= */}
            {faqs.length > 0 && (
              <section id="course-faqs" className="pjcd-section" aria-labelledby="course-faqs-title">
                <header className="pjcd-head">
                  <p className="pjcd-head__eyebrow">FAQs</p>
                  <h2 id="course-faqs-title" className="pjcd-head__title">Frequently asked questions</h2>
                </header>
                <ul className="pjcd-faqs">
                  {faqs.slice(0, showAllFaqs ? faqs.length : 6).map((faq, index) => {
                    const isOpen = openFaq === index;
                    const panelId = `course-faq-${index}`;
                    return (
                      <li key={faq._id || `${index}-${faq.question}`} className={`pjcd-faq${isOpen ? " is-open" : ""}`}>
                        <h3 className="pjcd-faq__heading">
                          <button type="button" className="pjcd-faq__toggle" aria-expanded={isOpen} aria-controls={panelId} onClick={() => setOpenFaq(isOpen ? -1 : index)}>
                            <span>{faq.question}</span>
                            <ChevronDown className="pjcd-module__chev" size={20} aria-hidden="true" />
                          </button>
                        </h3>
                        <div id={panelId} className="pjcd-module__panel" role="region" aria-label={faq.question}>
                          <div className="pjcd-module__inner"><p className="pjcd-faq__answer">{faq.answer}</p></div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                {faqs.length > 6 && (
                  <button type="button" className="pjcd-more" aria-expanded={showAllFaqs} onClick={() => setShowAllFaqs((v) => !v)}>
                    {showAllFaqs ? "Show fewer questions" : `View all ${faqs.length} questions`}
                  </button>
                )}
              </section>
            )}
          </div>

          {/* ================= PURCHASE CARD + RAZORPAY ================= */}
          <aside className="pjcd-buy" id="course-purchase" aria-labelledby="course-buy-title">
            <div className="pjcd-buy__card" ref={buyCardRef}>
              <div className="pjcd-buy__preview">
                {cover
                  ? <img src={cover} alt="" onError={(e) => { e.currentTarget.hidden = true; }} />
                  : (
                    <span className="pjcd-buy__mark" aria-hidden="true">
                      {course.category && <small>{course.category}</small>}
                      {course.title}
                    </span>
                  )}
                {delivery && <span className="pjcd-buy__mode">{delivery.short}</span>}
              </div>

              <div className="pjcd-buy__body">
                <div className="pjcd-buy__course">
                  <span>You are enrolling in</span>
                  <h2 id="course-buy-title">{course.title}</h2>
                  {(course.category || delivery || course.duration) && (
                    <small>{[course.category, delivery?.short, course.duration].filter(Boolean).join(" · ")}</small>
                  )}
                </div>
                <div className="pjcd-buy__price">
                  <strong>{inr(course.priceMinor)}</strong>
                  {hasDiscount && (
                    <>
                      <del>{inr(course.listPriceMinor)}</del>
                      <span className="pjcd-buy__off">{discount}% off</span>
                    </>
                  )}
                </div>
                {deadline && <p className="pjcd-buy__deadline"><Clock size={14} aria-hidden="true" /> Registration closes {deadline}</p>}

                <form className="pjcd-form" onSubmit={buy}>
                  <label className="pjcd-field"><span>Course</span><input name="course" value={course.title} disabled readOnly aria-readonly="true" /></label>
                  <label className="pjcd-field"><span>Full name</span><input required maxLength="120" name="name" value={student.name} onChange={update} autoComplete="name" /></label>
                  <label className="pjcd-field"><span>Email</span><input required type="email" maxLength="254" name="email" value={student.email} onChange={update} autoComplete="email" /></label>
                  <label className="pjcd-field"><span>Phone</span><input required type="tel" maxLength="30" name="phone" value={student.phone} onChange={update} autoComplete="tel" /></label>
                  <fieldset className="pjcd-mode">
                    <legend>How do you want to attend?</legend>
                    {[["online", "Online", "Live classes from home"], ["offline", "Offline", "At our Madurai centre"]].map(([value, label, hint]) => (
                      <label key={value} className={student.preferredMode === value ? "is-on" : undefined}>
                        <input type="radio" name="preferredMode" value={value} checked={student.preferredMode === value} onChange={update} />
                        <span><strong>{label}</strong><small>{hint}</small></span>
                      </label>
                    ))}
                  </fieldset>

                  {(course.batches?.length > 0 || course.deliveryMode === "online") && (
                    <details className="pjcd-prefs-wrap">
                    <summary>Preferred schedule <em>(optional)</em><ChevronDown size={16} aria-hidden="true" /></summary>
                    <fieldset className="pjcd-prefs">
                      <legend className="pjcd-sr">Preferred schedule (optional)</legend>
                      <div className="pjcd-prefs__row">
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                          <label key={day} className={student.preferredDays.includes(day) ? "is-on" : undefined}>
                            <input type="checkbox" checked={student.preferredDays.includes(day)} onChange={(e) => updatePreference("preferredDays", day, e.target.checked)} />
                            {day.slice(0, 3)}
                          </label>
                        ))}
                      </div>
                      <div className="pjcd-prefs__row">
                        {["Morning", "Afternoon", "Evening"].map((slot) => (
                          <label key={slot} className={student.preferredTimeSlots.includes(slot) ? "is-on" : undefined}>
                            <input type="checkbox" checked={student.preferredTimeSlots.includes(slot)} onChange={(e) => updatePreference("preferredTimeSlots", slot, e.target.checked)} />
                            {slot}
                          </label>
                        ))}
                      </div>
                      <small>Preferences are not a confirmed booking.</small>
                    </fieldset>
                    </details>
                  )}

                  <label className="pjcd-terms">
                    <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} required />
                    <span>I have read and agree to the <a href="/terms" target="_blank" rel="noreferrer">Terms &amp; Conditions</a>.</span>
                  </label>

                  <button type="submit" className="pjcd-pay" disabled={busy || checkoutOpen || !open || !terms}>
                    <Lock size={17} aria-hidden="true" />
                    {busy ? "Preparing secure checkout…" : checkoutOpen ? "Checkout is open…" : !open ? "Registration is closed" : `Pay ${inr(course.priceMinor)} securely`}
                  </button>
                </form>

                {message && <p className="pjcd-buy__message" role="status">{message}</p>}
                {receiptUrl && (
                  <p className="pjcd-buy__receipt">
                    <a href={mediaUrl(receiptUrl)}>Download your secure payment receipt</a>
                    <span>This link expires in seven days.</span>
                  </p>
                )}
                {reference && (
                  <button className="pjcd-buy__resend" type="button" disabled={receiptRequestBusy} onClick={requestReceiptLink}>
                    {receiptRequestBusy ? "Requesting secure link…" : "Email a new secure receipt link"}
                  </button>
                )}

                {/* Razorpay presentation */}
                <div className="pjcd-secure">
                  <p className="pjcd-secure__title"><ShieldCheck size={16} aria-hidden="true" /> Secure payment via Razorpay</p>
                  <ul className="pjcd-secure__methods" aria-label="Payment methods">
                    <li><Smartphone size={15} aria-hidden="true" /> UPI</li>
                    <li><CreditCard size={15} aria-hidden="true" /> Cards</li>
                    <li><Landmark size={15} aria-hidden="true" /> Net banking</li>
                    <li><Wallet size={15} aria-hidden="true" /> Wallets</li>
                  </ul>
                  <p className="pjcd-secure__note">Your seat is confirmed as soon as the payment succeeds. You get the receipt by email.</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
      {result && <PaymentResult result={result} onClose={() => { if (result.type === "success") { window.location.assign("/services/courses#course-catalog"); return; } setResult(null); }} onRetry={() => { setResult(null); document.getElementById("course-purchase")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} />}

      {/* ================= YOU MAY ALSO LIKE ================= */}
      {related.length > 0 && <RelatedCourses items={related} />}

      {/* ================= 11 FINAL ENROL CTA ================= */}
      <section className="pjcd-final" aria-labelledby="course-final-title">
        <div className="pjds-container">
          <div className="pjcd-final__card">
            <div>
              <p className="pjcd-head__eyebrow pjcd-head__eyebrow--on-dark">Ready to begin?</p>
              <h2 id="course-final-title" className="pjcd-final__title">Start {course.title}</h2>
              <p className="pjcd-final__text">
                {delivery ? `${delivery.label}` : "Course"}
                {course.duration ? ` · ${course.duration}` : ""}
                {startDate ? ` · Starts ${startDate}` : ""}
              </p>
            </div>
            <div className="pjcd-final__actions">
              <div className="pjcd-final__price">
                <strong>{inr(course.priceMinor)}</strong>
                {hasDiscount && <del>{inr(course.listPriceMinor)}</del>}
              </div>
              <a className="pjcd-btn pjcd-btn--primary" href="#course-purchase" onClick={(e) => scrollToId(e, "course-purchase")}>
                {open ? "Enrol now" : "Registration closed"} <ArrowRight size={18} aria-hidden="true" />
              </a>
              <a className="pjcd-btn pjcd-btn--ghost-dark" href={whatsappHref(`Hi ProJenius, I have a question about the ${course.title} course.`)} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={17} aria-hidden="true" /> Ask a question
                <span className="pjcd-sr"> on WhatsApp (opens in a new tab)</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

/* "You may also like" carousel: every other course (order chosen in ExploreOurCourses). */
function RelatedCourses({ items }) {
  const trackRef = useRef(null);
  const scroll = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild;
    track.scrollBy({ left: dir * ((card?.offsetWidth || 300) + 20), behavior: "smooth" });
  };
  return (
    <section className="pjcd-related" aria-labelledby="course-related-title">
      <div className="pjds-container">
        <header className="pjcd-related__head">
          <div>
            <p className="pjcd-head__eyebrow">Keep learning</p>
            <h2 id="course-related-title" className="pjcd-head__title">You may also like</h2>
          </div>
          <div className="pjcd-related__actions">
            <Link to="/services/courses" className="pjcd-related__all">View all courses <ArrowRight size={16} aria-hidden="true" /></Link>
            {items.length > 1 && (
              <>
                <button type="button" onClick={() => scroll(-1)} aria-label="Previous courses"><ChevronLeft size={20} /></button>
                <button type="button" onClick={() => scroll(1)} aria-label="Next courses"><ChevronRight size={20} /></button>
              </>
            )}
          </div>
        </header>
        <div ref={trackRef} className="pjcd-related__track">
          {items.map((item) => <CourseCard key={item._id} item={item} />)}
        </div>
      </div>
    </section>
  );
}

/* =============================================================================
   PAYMENT RESULT POPUP — success, failure, closed or still confirming.
   ============================================================================= */
const RESULT_COPY = {
  success: { title: "Payment successful", lead: "Thank you! Your seat is confirmed. Our team will call you with your batch details and the next steps." },
  failed: { title: "Payment failed", lead: "No money has been taken for this attempt. You can try again." },
  closed: { title: "Payment not completed", lead: "The payment window was closed." },
  pending: { title: "Payment being confirmed", lead: "Please do not pay again. We are checking this payment with the bank." },
};

function PaymentResult({ result, onClose, onRetry }) {
  const closeRef = useRef(null);
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  const copy = RESULT_COPY[result.type] || RESULT_COPY.pending;
  const ok = result.type === "success";
  const rows = [
    ["Course", result.course],
    result.amount && [ok ? "Amount paid" : "Amount", inr(result.amount)],
    ["Reference", result.reference],
    result.paymentId && ["Payment ID", result.paymentId],
    ok && result.email && ["Receipt sent to", result.email],
    ok && result.paidAt && ["Date", new Date(result.paidAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })],
  ].filter(Boolean);

  return (
    <div className="pjcd-result" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`pjcd-result__box pjcd-result__box--${result.type}`} role="dialog" aria-modal="true" aria-labelledby="pjcd-result-title" aria-describedby="pjcd-result-lead">
        <span className="pjcd-result__icon" aria-hidden="true">{ok ? <Check size={30} /> : result.type === "pending" ? <Clock size={28} /> : <span className="pjcd-result__x">!</span>}</span>
        <h2 id="pjcd-result-title">{copy.title}</h2>
        <p id="pjcd-result-lead" className="pjcd-result__lead">{copy.lead}</p>
        {result.reason && !ok && (
          <p className="pjcd-result__reason"><strong>Reason:</strong> {result.reason}</p>
        )}
        <dl className="pjcd-result__rows">
          {rows.map(([label, value]) => (
            <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
          ))}
        </dl>
        <div className="pjcd-result__actions">
          {ok && result.receiptUrl && <a className="pjcd-result__primary" href={mediaUrl(result.receiptUrl)}>Download receipt</a>}
          {(result.type === "failed" || result.type === "closed") && <button type="button" className="pjcd-result__primary" onClick={onRetry}>Try again</button>}
          <button type="button" ref={closeRef} className="pjcd-result__secondary" onClick={onClose}>{ok ? "Done · Back to courses" : "Close"}</button>
        </div>
        {ok && <p className="pjcd-result__help">The receipt is also in your email. Download it before you leave this page if you need it now.</p>}
        {!ok && (
          <p className="pjcd-result__help">
            Need help? Call <a href="tel:+918925450473">+91 89254 50473</a> or <a href={whatsappHref(`Hello ProJenius, I need help with my course payment. Reference: ${result.reference}`)} target="_blank" rel="noopener noreferrer">WhatsApp us</a> with your reference.
          </p>
        )}
      </div>
    </div>
  );
}
