import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./ExploreOurCourses.css";
import { loadRazorpayCheckout, validateCheckoutOrder } from "./razorpayCheckout.js";
import { normalizeApiBase, resolveApiUrl } from "../../../utils/apiUrl.js";

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const API = normalizeApiBase(configuredApiBaseUrl, import.meta.env.DEV);
const apiUrl = (path) => resolveApiUrl(path, API, window.location.origin);
const coursePageSize = () => { if (window.matchMedia("(max-width: 640px)").matches) return 2; if (window.matchMedia("(max-width: 1100px)").matches) return 4; return 8; };
const inr = (minor = 0) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(minor / 100);
const contentItemCount = (curriculum = []) => curriculum.reduce((total, module) => total + (module.topics?.length || 0) + (module.lessons?.length || 0) + (module.practicalActivities?.length || 0), 0);
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
  useEffect(() => { document.title = slug && course ? `${course.title} | ProJenius Innovation Technology` : "Explore Courses | ProJenius Innovation Technology"; }, [slug, course]);

  if (loading) return <div className="explore-page"><main className="wrap"><p role="status">Loading coursesâ€¦</p>{!slug && <div className="grid" aria-hidden="true">{Array.from({ length: 4 }, (_, index) => <div className="course-skeleton" key={index}><div /><span /><span /><span /></div>)}</div>}</main></div>;
  if (error) return <div className="explore-page"><main className="wrap"><p role="alert">{error}</p>{slug && <button type="button" onClick={() => navigate("/services/courses")}>Back to courses</button>}<button type="button" onClick={() => setRetry((value) => value + 1)}>Try again</button></main></div>;
  if (slug) return course ? <CourseDetails key={course._id} course={course} onBack={() => navigate("/services/courses")} /> : null;
  return <div className="explore-page"><main className="wrap">
    <header><p className="eyebrow">ProJenius Technology</p><h1>Explore Our <span>Courses</span></h1><p className="sub">Learn, build and create with practical technology.</p></header>
    {!courses.length ? <p>No courses are available right now. Please check back soon.</p> : <section className="grid" aria-label="Published courses">
      {courses.map((item, index) => <article className="card" key={item._id} style={{ "--i": index }}>
        <div className="media">{item.coverImage?.url && <img src={resolveApiUrl(item.coverImage.url, API, window.location.origin)} alt={item.coverImage.alt || item.title} loading="lazy" onError={(event) => { if (import.meta.env.DEV) console.error("Course cover image failed to load", { url: event.currentTarget.currentSrc, courseId: item._id }); event.currentTarget.hidden = true; }} />}{(item.badgeLabel || item.badges?.[0]) && <span className="course-card-badge">{item.badgeLabel || item.badges[0]}</span>}{item.premiumEligible === true && <span className="course-premium-badge">Premium eligible</span>}{item.rating != null && item.reviewCount > 0 && <span className="course-card-rating" aria-label={`${item.rating} out of 5 from ${item.reviewCount} reviews`}>★ {item.rating}</span>}</div>
        <div className="body"><span className="cat">{item.category}</span><h2 className="title">{item.title}</h2><p className="desc">{item.shortDescription}</p><div className="stats"><span>{item.duration}</span>{item.curriculum?.length > 0 && <span>{item.curriculum.length} modules</span>}{contentItemCount(item.curriculum) > 0 && <span>{contentItemCount(item.curriculum)} lessons &amp; activities</span>}</div><div className="foot"><span className="price">{inr(item.priceMinor)}</span>{item.listPriceMinor > item.priceMinor && <><del>{inr(item.listPriceMinor)}</del><span className="course-discount">{Math.round((1-item.priceMinor/item.listPriceMinor)*100)}% off</span></>}<Link className="go" aria-label={`View ${item.title}`} to={`/services/courses/${encodeURIComponent(item.slug)}`}><span aria-hidden="true">↗</span></Link></div></div>
      </article>)}
    </section>}
    {pages > 1 && <nav className="course-pagination" aria-label="Course pages">{page > 1 && <button onClick={() => setPage(1)}>View Less</button>}<span>Page {page} of {pages}</span>{page < pages && <button onClick={() => setPage((value) => value + 1)}>View More</button>}</nav>}
  </main></div>;
}

function CourseDetails({ course, onBack }) {
  const [student, setStudent] = useState({ name: "", email: "", phone: "", preferredDays: [], preferredTimeSlots: [] });
  const [terms, setTerms] = useState(null);
  const [accepted, setAccepted] = useState(false), [busy, setBusy] = useState(false), [checkoutOpen, setCheckoutOpen] = useState(false), [message, setMessage] = useState(""), [receiptUrl, setReceiptUrl] = useState(""), [receiptRequestBusy, setReceiptRequestBusy] = useState(false), [reference, setReference] = useState("");
  const [showAllFaqs, setShowAllFaqs] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const idempotencyRef = useRef(null);
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
    event.preventDefault(); setMessage(""); setBusy(true);
    try {
      if (!terms) throw new Error("The required registration terms could not be loaded. Please try again.");
      if (!accepted) throw new Error("Please accept the Terms & Conditions to continue.");
      const RazorpayCheckout = await loadRazorpayCheckout();
      const requestFingerprint = JSON.stringify([course._id, student.name, student.email, student.phone, student.preferredDays, student.preferredTimeSlots, terms.version]);
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
  const topicCount = curriculum.reduce((total, module) => total + (module.topics?.length || 0) + (module.practicalActivities?.length || 0) + (module.lessons?.length || 0), 0);
  const hasInstructor = Boolean(course.instructor?.name || course.instructor?.bio || course.instructor?.designation || course.instructor?.expertise?.length);
  const reviews = course.reviews || [];
  const relatedCourses = course.relatedCourses || [];
  const hasPrerequisites = course.noPrerequisites || Object.values(course.prerequisiteDetails || {}).some(Boolean) || course.prerequisites;
  const sections = [["about", "About", true], ["outcomes", "Outcomes", outcomes.length > 0], ["prerequisites", "Prerequisites", Boolean(hasPrerequisites || course.experienceLevel)], ["delivery", "Delivery", Boolean(course.deliveryMode || course.duration || course.sessionLength)], ["skills", "Skills & tools", Boolean(course.skills?.length || course.tools?.length)], ["modules", "Modules", curriculum.length > 0], ["projects", "Projects", projects.length > 0], ["instructors", "Instructors", hasInstructor], ["reviews", "Reviews", reviews.length > 0], ["related", "Related courses", relatedCourses.length > 0], ["faq", "FAQ", faqs.length > 0]].filter(([, , visible]) => visible);
  useEffect(() => {
    const targets = sections.map(([id]) => document.getElementById(`course-${id}`)).filter(Boolean);
    if (!targets.length || !("IntersectionObserver" in window)) return undefined;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((first, second) => first.boundingClientRect.top - second.boundingClientRect.top)[0];
      if (visible) setActiveSection(visible.target.id.replace("course-", ""));
    }, { rootMargin: "-100px 0px -65% 0px", threshold: 0 });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [sections.map(([id]) => id).join("|")]);
  return <div className="explore-page course-detail-page"><main className="wrap course-detail-shell">
    <button type="button" className="course-back" onClick={onBack}>← All courses</button>
    {/* Course hero uses only saved course content and verified properties. */}
    <header className="course-detail-hero"><div className="course-detail-hero__copy"><p className="eyebrow">{course.category}</p><h1>{course.title}</h1><p className="sub">{course.shortDescription}</p>{(course.badgeLabel || course.badges?.[0]) && <div className="course-detail-badges"><span>{course.badgeLabel || course.badges[0]}</span></div>}{course.rating != null && course.reviewCount > 0 && <p className="course-detail-rating" aria-label={`${course.rating} out of 5 from ${course.reviewCount} published reviews`}>★ {course.rating} · {course.reviewCount} published reviews</p>}{hasInstructor && <p className="course-detail-hero__instructor">Instructor: <strong>{course.instructor.name || "ProJenius course team"}</strong>{course.instructor.designation ? ` · ${course.instructor.designation}` : ""}</p>}<div className="course-detail-hero__meta"><span>{course.duration}</span>{course.experienceLevel && <span>{course.experienceLevel === "prior-experience" ? "Prior experience required" : course.experienceLevel === "beginner-friendly" ? "Beginner-friendly" : "All levels"}</span>}{course.language && <span>{course.language}</span>}{course.deliveryMode && <span>{course.deliveryMode === "in-person" ? "In-person" : course.deliveryMode}</span>}{topicCount > 0 && <span>{topicCount} topics &amp; activities</span>}</div><a className="course-detail-hero__cta" href="#course-purchase">{!course.enrollmentOpen ? "Registration closed" : "Enroll now · " + inr(course.priceMinor)}</a><small>{course.enrollmentOpen ? "Secure payment · Terms shown before checkout" : "Registration for this course is currently closed"}</small></div><div className="course-detail-hero__imagebox">{course.coverImage?.url && <img src={resolveApiUrl(course.coverImage.url, API, window.location.origin)} alt={course.coverImage.alt || course.title} onError={(event) => { if (import.meta.env.DEV) console.error("Course detail cover image failed to load", { url: event.currentTarget.currentSrc, courseId: course._id }); event.currentTarget.hidden = true; }} />}</div></header>
    {/* Counts come from the saved curriculum; no sample ratings or enrollment totals. */}
    <div className="course-detail-facts">{[["Course length", course.duration], ["Modules", curriculum.length || null], ["Topics & activities", topicCount || null], ["Experience", course.experienceLevel === "prior-experience" ? "Prior experience" : course.experienceLevel === "beginner-friendly" ? "Beginner-friendly" : course.experienceLevel === "all-levels" ? "All levels" : null]].filter(([, value]) => value !== null && value !== "").map(([label, value]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
    <div className="course-detail-layout"><article className="course-detail-content">
      <nav className="course-detail-tabs" aria-label="Course details">{sections.map(([id, label]) => <a key={id} href={"#course-" + id} className={activeSection === id ? "is-active" : undefined} aria-current={activeSection === id ? "location" : undefined} onClick={() => setActiveSection(id)}>{label}</a>)}</nav>
      <section id="course-about"><h2>About this course</h2>{course.aboutContent ? <div className="course-detail-rich-content" dangerouslySetInnerHTML={{ __html: course.aboutContent }} /> : <p>{course.description}</p>}{course.highlights?.length > 0 && <><h3>Course highlights</h3><ul className="course-detail-checklist">{course.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul></>}{course.audience && <><h3>Who this course is for</h3><p>{course.audience}</p></>}{course.certificate?.available && <aside className="course-detail-certificate"><strong>Certificate available</strong>{course.certificate.description && <p>{course.certificate.description}</p>}</aside>}</section>
      {!!outcomes.length && <section id="course-outcomes"><h2>What you'll learn</h2><ul className="course-detail-checklist">{outcomes.map((item, index) => <li key={index + item}>{item}</li>)}</ul></section>}
      {(hasPrerequisites || course.experienceLevel) && <section id="course-prerequisites"><h2>Prerequisites and level</h2>{course.experienceLevel && <p><strong>Experience level:</strong> {course.experienceLevel === "prior-experience" ? "Prior experience required" : course.experienceLevel === "beginner-friendly" ? "Beginner-friendly" : "All levels"}</p>}{course.noPrerequisites ? <p>No prior experience or prerequisites are required.</p> : <div className="course-detail-prerequisites">{Object.entries(course.prerequisiteDetails || {}).filter(([, value]) => value).map(([key, value]) => <p key={key}><strong>{{ priorKnowledge: "Prior knowledge", eligibility: "Eligibility", equipment: "Equipment" }[key] || key}:</strong> {value}</p>)}{course.prerequisites && <p>{course.prerequisites}</p>}</div>}</section>}
      {(course.deliveryMode || course.sessionLength || course.sessionCount || course.courseValidity) && <section id="course-delivery"><h2>Course delivery</h2><div className="course-detail-delivery">{course.deliveryMode && <p><strong>Format:</strong> {course.deliveryMode === "in-person" ? "In-person" : course.deliveryMode === "hybrid" ? "Live online and in-person" : "Live online"}</p>}{course.duration && <p><strong>Course length:</strong> {course.duration}</p>}{course.sessionLength && <p><strong>Session length:</strong> {course.sessionLength}</p>}{course.sessionCount && <p><strong>Number of sessions:</strong> {course.sessionCount}</p>}{course.courseValidity && <p><strong>Programme period:</strong> {course.courseValidity}</p>}</div><p className="course-detail-live-note">Course sessions are delivered live by the ProJenius team. Online session details are coordinated after registration review; payment does not unlock recorded lessons.</p></section>}
      {(course.skills?.length || course.tools?.length) ? <section id="course-skills" className="course-detail-chips-section"><h2>Skills and tools</h2>{course.skills?.length > 0 && <><h3>Skills you'll learn</h3><div className="course-detail-chips">{course.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></>}{course.tools?.length > 0 && <><h3>Tools you'll use</h3><div className="course-detail-chips">{course.tools.map((tool) => <span key={tool}>{tool}</span>)}</div></>}</section> : null}
      {!!curriculum.length && <section id="course-modules"><h2>Course content <small> / {curriculum.length} modules / {topicCount} topics and activities</small></h2><div className="course-detail-module-list">{curriculum.map((module, index) => <details key={module._id || `${index}-${module.title}`} open={index === 0}><summary>Module {index + 1}: {module.title}{module.duration && <span>{module.duration}</span>}</summary>{module.description && <p>{module.description}</p>}{(module.topics?.length > 0 || module.lessons?.length > 0) && <div className="course-detail-module-items"><h3>Topics</h3><ol>{[...(module.topics || []), ...(module.lessons || [])].map((topic, topicIndex) => <li key={topic._id || `${topicIndex}-${topic.title}`}><strong>{topic.title}</strong>{topic.duration && <span> - {topic.duration}</span>}{(topic.description || topic.summary) && <p>{topic.description || topic.summary}</p>}</li>)}</ol></div>}{module.practicalActivities?.length > 0 && <div className="course-detail-module-items"><h3>Practical activities</h3><ul>{module.practicalActivities.map((activity, activityIndex) => <li key={activity._id || `${activityIndex}-${activity.title}`}><strong>{activity.title}</strong>{activity.description && <p>{activity.description}</p>}</li>)}</ul></div>}</details>)}</div></section>}
      {!!projects.length && <section id="course-projects"><h2>Projects you'll build</h2><div className="course-detail-projects">{projects.map((project, index) => <article key={index + project.title}><h3>{project.title}</h3>{project.description && <p>{project.description}</p>}{project.technologies?.length > 0 && <div className="course-detail-chips">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div>}{project.outcome && <p>{project.outcome}</p>}</article>)}</div></section>}
      {hasInstructor && <section id="course-instructors"><h2>Instructor and support</h2><article className="course-detail-instructor"><h3>{course.instructor?.name || "Course instructor"}</h3>{course.instructor?.designation && <p>{course.instructor.designation}</p>}{course.instructor?.bio && <p>{course.instructor.bio}</p>}{course.instructor?.expertise?.length > 0 && <div className="course-detail-chips">{course.instructor.expertise.map((area) => <span key={area}>{area}</span>)}</div>}{course.instructor?.profileUrl && <a href={course.instructor.profileUrl} target="_blank" rel="noreferrer">Instructor profile</a>}</article></section>}
      {!!reviews.length && <section id="course-reviews"><h2>Reviews and testimonials</h2>{course.rating != null && course.reviewCount > 0 && <p className="course-detail-rating-summary">Rating {course.rating} / 5 from {course.reviewCount} published reviews</p>}<div className="course-detail-reviews">{reviews.map((review, index) => <article key={review._id || `${index}-${review.studentName}`} className="course-detail-review">{review.photoUrl && <img src={review.photoUrl} alt="" loading="lazy" />}<div><p className="course-detail-review-rating" aria-label={`${review.rating} out of 5`}>{review.rating} / 5</p><blockquote>{review.testimonial}</blockquote><p className="course-detail-review-byline"><strong>{review.studentName}</strong>{review.reviewDate && <time dateTime={new Date(review.reviewDate).toISOString()}>{new Date(review.reviewDate).toLocaleDateString()}</time>}</p></div></article>)}</div></section>}
      {!!relatedCourses.length && <section id="course-related"><h2>Related courses</h2><div className="course-detail-related">{relatedCourses.map((related) => <a key={related._id} href={`/services/courses/${encodeURIComponent(related.slug)}`} className="course-detail-related-card"><div>{related.coverImage?.url && <img src={resolveApiUrl(related.coverImage.url, API, window.location.origin)} alt={related.coverImage.alt || related.title} loading="lazy" />}</div><span>{related.category}</span><h3>{related.title}</h3><p>{related.shortDescription}</p><strong>{inr(related.priceMinor)}</strong></a>)}</div></section>}
      {!!faqs.length && <section id="course-faq"><h2>Frequently asked questions</h2><div className="course-detail-module-list">{faqs.slice(0, showAllFaqs ? faqs.length : 6).map((faq, index) => <details key={faq._id || `${index}-${faq.question}`} open={index === 0}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div>{faqs.length > 6 && <button type="button" className="course-faq-toggle" aria-expanded={showAllFaqs} onClick={() => setShowAllFaqs((value) => !value)}>{showAllFaqs ? "Show fewer questions" : `View all ${faqs.length} questions`}</button>}</section>}
      <p className="course-detail-contact-note">After a successful purchase, our team will contact you by phone about next steps.</p>
    </article>
    {/* Keep the existing terms, order creation and payment verification flow. */}
    <aside className="course-detail-purchase" id="course-purchase"><div className="course-detail-purchase__image">{course.coverImage?.url ? <img src={resolveApiUrl(course.coverImage.url, API, window.location.origin)} alt={course.coverImage.alt || course.title} /> : <div className="course-placeholder" aria-hidden="true">PJ</div>}</div>{course.premiumEligible === true && <p className="course-premium-detail">Premium eligible</p>}<div className="course-detail-purchase__price"><strong>{inr(course.priceMinor)}</strong>{course.listPriceMinor > course.priceMinor && <><del>{inr(course.listPriceMinor)}</del><span>{Math.round((1 - course.priceMinor / course.listPriceMinor) * 100)}% off</span></>}</div><form onSubmit={buy}>
      <label>Name<input required maxLength="120" name="name" value={student.name} onChange={update} autoComplete="name" /></label>
      <label>Email<input required type="email" maxLength="254" name="email" value={student.email} onChange={update} autoComplete="email" /></label>
      <label>Phone<input required type="tel" maxLength="30" name="phone" value={student.phone} onChange={update} autoComplete="tel" /></label>
      {(course.batches?.length > 0 || course.deliveryMode === "online") && <fieldset className="course-preferences"><legend>Preferred schedule (optional)</legend><span>These preferences are not a confirmed booking.</span><div><strong>Days</strong>{["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => <label key={day}><input type="checkbox" checked={student.preferredDays.includes(day)} onChange={(event) => updatePreference("preferredDays", day, event.target.checked)} />{day.slice(0,3)}</label>)}</div><div><strong>Time</strong>{["Morning", "Afternoon", "Evening"].map((slot) => <label key={slot}><input type="checkbox" checked={student.preferredTimeSlots.includes(slot)} onChange={(event) => updatePreference("preferredTimeSlots", slot, event.target.checked)} />{slot}</label>)}</div></fieldset>}
      <label className="course-terms"><input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} required /> I have read and agree to the <a href="/terms" target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>Terms &amp; Conditions</a>.</label>
      <button type="submit" disabled={busy || checkoutOpen || !course.enrollmentOpen || !terms}>{busy ? "Preparing secure checkout…" : checkoutOpen ? "Checkout is open…" : !course.enrollmentOpen ? "Registration is closed" : "Buy now"}</button>
    </form>{message && <p role="status">{message}</p>}{receiptUrl && <p><a className="course-receipt-download" href={resolveApiUrl(receiptUrl, API, window.location.origin)}>Download your secure payment receipt</a> <span>This link expires in seven days.</span></p>}{reference && <button className="course-receipt-request" type="button" disabled={receiptRequestBusy} onClick={requestReceiptLink}>{receiptRequestBusy ? "Requesting secure link…" : "Email a new secure receipt link"}</button>}<ul className="course-detail-purchase__benefits">{course.duration && <li>{course.duration}</li>}{lessonCount > 0 && <li>{lessonCount} lessons</li>}{course.certificate?.available && <li>Certificate available</li>}<li>Payment confirmation is followed by admin review</li></ul></aside></div>
  </main></div>;
}


