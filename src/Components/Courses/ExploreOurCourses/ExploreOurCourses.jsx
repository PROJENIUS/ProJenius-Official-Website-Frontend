import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ExploreOurCourses.css";
import { loadRazorpayCheckout, validateCheckoutOrder } from "./razorpayCheckout.js";
import { normalizeApiBase, resolveApiUrl } from "../../../utils/apiUrl.js";

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const API = normalizeApiBase(configuredApiBaseUrl, import.meta.env.DEV);
const apiUrl = (path) => resolveApiUrl(path, API, window.location.origin);
const coursePageSize = () => window.matchMedia("(max-width: 640px)").matches ? 2 : window.matchMedia("(max-width: 1100px)").matches ? 4 : 8;
const inr = (minor = 0) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(minor / 100);
const api = async (path, options) => {
  if (!API) throw new Error("Course services are not configured.");
  const response = await fetch(apiUrl(`/api/courses${path}`), options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Course information is unavailable.");
  return data;
};

export default function ExploreOurCourses() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]), [course, setCourse] = useState(null);
  const [requestState, setRequestState] = useState({ key: "", status: "loading", error: "" }), [retry, setRetry] = useState(0);
  const [page, setPage] = useState(1), [pages, setPages] = useState(1), [pageSize, setPageSize] = useState(coursePageSize);
  const pageSizeRef = useRef(pageSize);
  const requestKey = slug ? `slug:${slug}:${retry}` : `page:${page}:${pageSize}:${retry}`;
  const loading = requestState.key !== requestKey || requestState.status === "loading";
  const error = requestState.key === requestKey && requestState.status === "error" ? requestState.error : "";
  useEffect(() => {
    const updateSize = () => { const next = coursePageSize(); if (pageSizeRef.current !== next) { pageSizeRef.current = next; setPageSize(next); setPage(1); } };
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  useEffect(() => {
    let active = true;
    const request = slug ? api(`/slug/${encodeURIComponent(slug)}`).then(({ item }) => ({ item })) : api(`/?page=${page}&limit=${pageSize}`);
    request.then((data) => {
      if (!active) return;
      if (slug) setCourse(data.item);
      else { setCourses(data.items || []); setPages(data.pagination?.pages || 1); }
      setRequestState({ key: requestKey, status: "loaded", error: "" });
    }).catch((e) => { if (active) setRequestState({ key: requestKey, status: "error", error: e.message }); });
    return () => { active = false; };
  }, [slug, page, pageSize, retry, requestKey]);
  useEffect(() => { document.title = slug && course ? `${course.title} | ProJenius Courses` : "Explore Courses | ProJenius"; }, [slug, course]);

  if (loading) return <div className="explore-page"><main className="wrap"><p role="status">Loading coursesâ€¦</p>{!slug && <div className="grid" aria-hidden="true">{Array.from({ length: 4 }, (_, index) => <div className="course-skeleton" key={index}><div /><span /><span /><span /></div>)}</div>}</main></div>;
  if (error) return <div className="explore-page"><main className="wrap"><p role="alert">{error}</p>{slug && <button type="button" onClick={() => navigate("/services/courses")}>Back to courses</button>}<button type="button" onClick={() => setRetry((value) => value + 1)}>Try again</button></main></div>;
  if (slug) return course ? <CourseDetails course={course} onBack={() => navigate("/services/courses")} /> : null;
  return <div className="explore-page"><main className="wrap">
    <header><p className="eyebrow">ProJenius Technology</p><h1>Explore Our <span>Courses</span></h1><p className="sub">Learn, build and create with practical technology.</p></header>
    {!courses.length ? <p>No courses are available right now. Please check back soon.</p> : <section className="grid" aria-label="Published courses">
      {courses.map((item, index) => <a className="card" href={`/services/courses/${encodeURIComponent(item.slug)}`} key={item._id} style={{ "--i": index }}>
        <div className="media">{item.coverImage?.url && <img src={resolveApiUrl(item.coverImage.url, API, window.location.origin)} alt={item.coverImage.alt || item.title} loading="lazy" onError={(event) => { if (import.meta.env.DEV) console.error("Course cover image failed to load", { url: event.currentTarget.currentSrc, courseId: item._id }); event.currentTarget.hidden = true; const fallback = event.currentTarget.nextElementSibling; if (fallback) fallback.hidden = false; }} />}<div className="course-placeholder" hidden={Boolean(item.coverImage?.url)} aria-hidden="true">PJ</div></div>
        <div className="body"><span className="cat">{item.category}</span><h2 className="title">{item.title}</h2><p className="desc">{item.shortDescription}</p><div className="stats"><span>{item.duration}</span><span>{item.deliveryMode === "in-person" ? "Offline" : item.deliveryMode}</span><span>{item.enrollmentOpen ? "Registration open" : "Registration closed"}</span></div><div className="foot"><span className="price">{inr(item.priceMinor)}</span><span className="go" aria-hidden="true">â†—</span></div></div>
      </a>)}
    </section>}
    {pages > 1 && <nav className="course-pagination" aria-label="Course pages">{page > 1 && <button onClick={() => setPage(1)}>View Less</button>}<span>Page {page} of {pages}</span>{page < pages && <button onClick={() => setPage((value) => value + 1)}>View More</button>}</nav>}
  </main></div>;
}

function CourseDetails({ course, onBack }) {
  const [student, setStudent] = useState({ name: "", email: "", phone: "" });
  const [terms, setTerms] = useState(null);
  const [accepted, setAccepted] = useState(false), [busy, setBusy] = useState(false), [checkoutOpen, setCheckoutOpen] = useState(false), [message, setMessage] = useState(""), [receiptUrl, setReceiptUrl] = useState(""), [receiptRequestBusy, setReceiptRequestBusy] = useState(false), [reference, setReference] = useState("");
  const idempotencyRef = useRef(null);
  useEffect(() => { let active = true; api("/terms").then(({ item }) => { if (active) setTerms(item); }).catch((error) => { if (active) setMessage(error.message); }); return () => { active = false; }; }, []);
  const update = (event) => {
    idempotencyRef.current = null;
    setStudent((value) => ({ ...value, [event.target.name]: event.target.value }));
  };
  const buy = async (event) => {
    event.preventDefault(); setMessage(""); setBusy(true);
    try {
      if (!terms) throw new Error("Purchase terms could not be loaded. Please try again.");
      if (!accepted) throw new Error("Please accept the purchase terms to continue.");
      const RazorpayCheckout = await loadRazorpayCheckout();
      const requestFingerprint = JSON.stringify([course._id, student.name, student.email, student.phone, terms.version]);
      if (idempotencyRef.current?.fingerprint !== requestFingerprint) {
        idempotencyRef.current = { fingerprint: requestFingerprint, key: crypto.randomUUID() };
      }
      const rawOrderData = await api(`/${encodeURIComponent(course._id)}/orders`, { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": idempotencyRef.current.key }, body: JSON.stringify({ student, termsAccepted: true, termsVersion: terms.version }) });
      const orderData = validateCheckoutOrder(rawOrderData);
      const checkout = new RazorpayCheckout({ key: orderData.keyId, order_id: orderData.order.id, amount: orderData.order.amount, currency: orderData.order.currency, name: orderData.checkout.name, description: orderData.checkout.description, prefill: orderData.checkout.prefill, handler: async (result) => {
        try { const verified = await api("/payments/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(result) }); const savedReference = verified.reference || orderData.enrollment.reference; setReference(savedReference); if (verified.receiptUrl) setReceiptUrl(verified.receiptUrl); setMessage(verified.status === "captured" ? `Payment successful. Your registration has been received and is awaiting admin approval. Our team will contact you by phone to coordinate the next steps. Reference: ${savedReference}.` : `Payment status: ${verified.status}. Reference: ${savedReference}.`); }
        catch (e) { setMessage(`${e.message} Keep your payment confirmation and contact support with reference ${orderData.enrollment.reference}.`); }
        finally { setCheckoutOpen(false); }
      }, modal: { ondismiss: () => { setCheckoutOpen(false); setMessage(`Checkout closed. No course access has been confirmed. Reference: ${orderData.enrollment.reference}.`); } } });
      checkout.on("payment.failed", async (failure) => {
        setCheckoutOpen(false);
        const metadata = failure?.error?.metadata || {};
        try {
          if (metadata.order_id && metadata.payment_id) await api("/payments/failure", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId: metadata.order_id, paymentId: metadata.payment_id }) });
          setMessage(`Payment was not completed. You can retry checkout. Reference: ${orderData.enrollment.reference}.`);
        } catch { setMessage(`Payment status is still being confirmed. Keep the provider message and contact support with reference ${orderData.enrollment.reference}.`); }
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
  const outcomes = course.learningOutcomes || [];
  const curriculum = course.curriculum || [];
  const projects = [...(course.projects || [])].sort((a, b) => a.order - b.order);
  const faqs = [...(course.faqs || [])].sort((a, b) => a.order - b.order);
  const lessonCount = curriculum.reduce((total, module) => total + (module.lessons?.length || 0), 0);
  const hasInstructor = Boolean(course.instructor?.name || course.instructor?.bio || course.instructor?.designation || course.instructor?.expertise?.length);
  const sections = [["about", "About", true], ["outcomes", "Outcomes", outcomes.length > 0], ["modules", "Modules", curriculum.length > 0], ["projects", "Projects", projects.length > 0], ["instructors", "Instructors", hasInstructor], ["faq", "FAQ", faqs.length > 0]].filter(([, , visible]) => visible);
  return <div className="explore-page course-detail-page"><main className="wrap course-detail-shell">
    <button type="button" className="course-back" onClick={onBack}>← All courses</button>
    {/* Course hero uses only saved course content and verified properties. */}
    <header className="course-detail-hero"><div className="course-detail-hero__copy"><p className="eyebrow">{course.category}</p><h1>{course.title}</h1><p className="sub">{course.shortDescription}</p><div className="course-detail-hero__meta"><span>{course.duration}</span>{course.level && <span>{course.level[0].toUpperCase() + course.level.slice(1)} level</span>}{course.language && <span>{course.language}</span>}{course.deliveryMode && <span>{course.deliveryMode === "in-person" ? "In person" : course.deliveryMode}</span>}{lessonCount > 0 && <span>{lessonCount} lessons</span>}</div>{course.instructor?.name && <p className="course-detail-hero__instructor">Instructor: <strong>{course.instructor.name}</strong></p>}<a className="course-detail-hero__cta" href="#course-purchase">{!course.enrollmentOpen ? "Registration closed" : "Enroll now · " + inr(course.priceMinor)}</a><small>{course.enrollmentOpen ? "Secure payment · Terms shown before checkout" : "Registration for this course is currently closed"}</small></div><div className="course-detail-hero__imagebox">{course.coverImage?.url ? <img src={resolveApiUrl(course.coverImage.url, API, window.location.origin)} alt={course.coverImage.alt || course.title} onError={(event) => { if (import.meta.env.DEV) console.error("Course detail cover image failed to load", { url: event.currentTarget.currentSrc, courseId: course._id }); event.currentTarget.hidden = true; }} /> : <div className="course-placeholder" aria-hidden="true">PJ</div>}</div></header>
    {/* Counts come from the saved curriculum; no sample ratings or enrollment totals. */}
    <div className="course-detail-facts">{[["Course length", course.duration], ["Modules", curriculum.length || null], ["Lessons", lessonCount || null], ["Level", course.level || null]].filter(([, value]) => value !== null && value !== "").map(([label, value]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
    <div className="course-detail-layout"><article className="course-detail-content">
      <nav className="course-detail-tabs" aria-label="Course details">{sections.map(([id, label]) => <a key={id} href={"#course-" + id}>{label}</a>)}</nav>
      <section id="course-about"><h2>About this course</h2><p>{course.description}</p>{course.audience && <><h3>Who this course is for</h3><p>{course.audience}</p></>}{course.prerequisites && <><h3>Requirements</h3><p>{course.prerequisites}</p></>}{course.certificate?.available && <aside className="course-detail-certificate"><strong>Certificate available</strong>{course.certificate.description && <p>{course.certificate.description}</p>}</aside>}</section>
      {!!outcomes.length && <section id="course-outcomes"><h2>Learning outcomes</h2><ul className="course-detail-checklist">{outcomes.map((item, index) => <li key={index + item}>{item}</li>)}</ul></section>}
      {(course.skills?.length || course.tools?.length) ? <section className="course-detail-chips-section"><h2>Skills and tools</h2>{course.skills?.length > 0 && <><h3>Skills you'll learn</h3><div className="course-detail-chips">{course.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></>}{course.tools?.length > 0 && <><h3>Tools you'll use</h3><div className="course-detail-chips">{course.tools.map((tool) => <span key={tool}>{tool}</span>)}</div></>}</section> : null}
      {!!curriculum.length && <section id="course-modules"><h2>Course modules{lessonCount > 0 && <small> · {curriculum.length} modules · {lessonCount} lessons</small>}</h2><div className="course-detail-module-list">{curriculum.map((module, index) => <details key={index + module.title}><summary>Module {index + 1}: {module.title}{module.duration && <span>{module.duration}</span>}</summary>{module.description && <p>{module.description}</p>}{module.lessons?.length > 0 && <ol>{module.lessons.map((lesson, lessonIndex) => <li key={lessonIndex + lesson.title}><strong>{lesson.title}</strong>{lesson.duration && <span> · {lesson.duration}</span>}{lesson.summary && <p>{lesson.summary}</p>}{lesson.resourceUrl && <a href={lesson.resourceUrl} target="_blank" rel="noreferrer">Open lesson resource</a>}</li>)}</ol>}</details>)}</div></section>}
      {!!projects.length && <section id="course-projects"><h2>Projects you'll build</h2><div className="course-detail-projects">{projects.map((project, index) => <article key={index + project.title}><h3>{project.title}</h3>{project.description && <p>{project.description}</p>}{project.technologies?.length > 0 && <div className="course-detail-chips">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div>}{project.outcome && <p>{project.outcome}</p>}</article>)}</div></section>}
      {hasInstructor && <section id="course-instructors"><h2>Instructor and support</h2><article className="course-detail-instructor"><h3>{course.instructor?.name || "Course instructor"}</h3>{course.instructor?.designation && <p>{course.instructor.designation}</p>}{course.instructor?.bio && <p>{course.instructor.bio}</p>}{course.instructor?.expertise?.length > 0 && <div className="course-detail-chips">{course.instructor.expertise.map((area) => <span key={area}>{area}</span>)}</div>}{course.instructor?.profileUrl && <a href={course.instructor.profileUrl} target="_blank" rel="noreferrer">Instructor profile</a>}</article></section>}
      {!!faqs.length && <section id="course-faq"><h2>Frequently asked questions</h2><div className="course-detail-module-list">{faqs.map((faq, index) => <details key={index + faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div></section>}
      <p className="course-detail-contact-note">After a successful purchase, our team will contact you by phone about next steps.</p>
    </article>
    {/* Keep the existing terms, order creation and payment verification flow. */}
    <aside className="course-detail-purchase" id="course-purchase"><div className="course-detail-purchase__image">{course.coverImage?.url ? <img src={resolveApiUrl(course.coverImage.url, API, window.location.origin)} alt={course.coverImage.alt || course.title} /> : <div className="course-placeholder" aria-hidden="true">PJ</div>}</div><div className="course-detail-purchase__price"><strong>{inr(course.priceMinor)}</strong>{course.listPriceMinor > course.priceMinor && <><del>{inr(course.listPriceMinor)}</del><span>{Math.round((1 - course.priceMinor / course.listPriceMinor) * 100)}% off</span></>}</div><form onSubmit={buy}>
      <label>Name<input required maxLength="120" name="name" value={student.name} onChange={update} autoComplete="name" /></label>
      <label>Email<input required type="email" maxLength="254" name="email" value={student.email} onChange={update} autoComplete="email" /></label>
      <label>Phone<input required type="tel" maxLength="30" name="phone" value={student.phone} onChange={update} autoComplete="tel" /></label>
      <details className="course-terms-details"><summary>Course purchase terms</summary>{terms ? <><p>{terms.policy}</p><p>Terms version: {terms.version}.</p></> : <p>Loading purchase terms…</p>}</details>
      <label className="course-terms"><input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} required /> I have read and agree to the <a href="/services/courses/terms" target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>Terms &amp; Conditions and Refund Policy</a>.</label>
      <button type="submit" disabled={busy || checkoutOpen || !course.enrollmentOpen || !terms}>{busy ? "Preparing secure checkout…" : checkoutOpen ? "Checkout is open…" : !course.enrollmentOpen ? "Registration is closed" : "Buy now"}</button>
    </form>{message && <p role="status">{message}</p>}{receiptUrl && <p><a className="course-receipt-download" href={resolveApiUrl(receiptUrl, API, window.location.origin)}>Download your secure payment receipt</a> <span>This link expires in seven days.</span></p>}{reference && <button className="course-receipt-request" type="button" disabled={receiptRequestBusy} onClick={requestReceiptLink}>{receiptRequestBusy ? "Requesting secure link…" : "Email a new secure receipt link"}</button>}<ul className="course-detail-purchase__benefits">{course.duration && <li>{course.duration}</li>}{lessonCount > 0 && <li>{lessonCount} lessons</li>}{course.certificate?.available && <li>Certificate available</li>}<li>Payment confirmation is followed by admin review</li></ul></aside></div>
  </main></div>;
}


