import { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Briefcase, CalendarClock, CheckCircle2, Clock, IndianRupee, MapPin, Users } from "lucide-react";

import Breadcrumbs from "../../Components/Common/Breadcrumbs/Breadcrumbs.jsx";
import useMetaDescription from "../../hooks/useMetaDescription.js";
import { applyHref, postedLabel, useOpening } from "../../Components/JoinOurTeam/careersApi.js";
import "../../Components/JoinOurTeam/OpenRoles/OpenRoles.css";
import "./JobOpeningPage.css";

/* =============================================================================
   JOB OPENING — /join-our-team/:slug
   One role's full description (like a careers site job page): key facts,
   what you will do, what we look for, benefits, and an Apply button that
   opens the application form with this role chosen. Adds schema.org
   JobPosting data so the role can appear in Google job search.
   Sections follow the site cadence: navy header, light body. The blocks
   inside the description are <div>s, not <section>s: the site cadence also
   colours sections inside an <article>.
   ============================================================================= */

const SITE_ORIGIN = (import.meta.env.VITE_SITE_URL || "https://pro-jenius-official-website-fronten.vercel.app").replace(/\/+$/, "");
const EMPLOYMENT_TYPE = { "Full-time": "FULL_TIME", "Part-time": "PART_TIME", Internship: "INTERN", Contract: "CONTRACTOR" };
const formatDate = (value) => (value ? new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "");

function useJobPostingData(item) {
  useEffect(() => {
    if (!item) return undefined;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "JobPosting",
      title: item.title,
      description: [`<p>${item.summary}</p>`, "<h3>What you will do</h3><ul>", ...item.responsibilities.map((point) => `<li>${point}</li>`), "</ul><h3>What we look for</h3><ul>", ...item.requirements.map((point) => `<li>${point}</li>`), "</ul>"].join(""),
      datePosted: item.postedAt,
      ...(item.closesOn ? { validThrough: item.closesOn } : {}),
      employmentType: EMPLOYMENT_TYPE[item.employmentType] || "OTHER",
      hiringOrganization: { "@type": "Organization", name: "ProJenius Innovation Technology Private Limited", sameAs: SITE_ORIGIN, logo: `${SITE_ORIGIN}/ProJenius_Logo.svg` },
      jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", streetAddress: "Plot No 3, Erikarai Street, Velmurugan Nagar, Namachivaya Nagar", addressLocality: "Madurai", addressRegion: "Tamil Nadu", postalCode: "625003", addressCountry: "IN" } },
      ...(item.workMode === "Remote" ? { jobLocationType: "TELECOMMUTE", applicantLocationRequirements: { "@type": "Country", name: "India" } } : {}),
      directApply: true,
      url: `${SITE_ORIGIN}/join-our-team/${item.slug}`,
    });
    document.head.appendChild(script);
    return () => script.remove();
  }, [item]);
}

function Points({ title, items }) {
  if (!items?.length) return null;
  return (
    <div className="pjc-job__block">
      <h2>{title}</h2>
      <ul>{items.map((point) => <li key={point}><CheckCircle2 size={18} aria-hidden="true" /> {point}</li>)}</ul>
    </div>
  );
}

export default function JobOpeningPage() {
  const { slug } = useParams();
  const { status, item } = useOpening(slug);
  const pageRef = useRef(null);
  useMetaDescription(item ? `${item.title} at ProJenius, Madurai: ${item.employmentType}, ${item.workMode}. ${item.summary}`.slice(0, 158) : "");
  useJobPostingData(item);

  useEffect(() => {
    if (item) document.title = `${item.title} · Careers | ProJenius Innovation Technology`;
  }, [item]);

  const crumbs = [{ label: "Home", to: "/" }, { label: "Join Our Team", to: "/join-our-team" }, { label: item?.title || "Role" }];

  return (
    <main ref={pageRef} className="pjc-job-page">
      <section className="pjc-job-head" aria-labelledby="pjc-job-title">
        <div className="pjds-container">
          <Breadcrumbs items={crumbs} />
          {status === "loading" && <div className="pjc-job-head__loading" aria-busy="true"><i /><i /></div>}
          {(status === "missing" || status === "error") && (
            <div className="pjc-job-head__gone">
              <h1 id="pjc-job-title">{status === "missing" ? "This role is no longer open" : "We could not load this role"}</h1>
              <p>{status === "missing" ? "It may have been filled or closed. See the roles open now, or send a general application." : "Please check your connection and refresh the page."}</p>
              <div className="pjc-job-head__actions">
                <Link className="pjc-btn pjc-btn--primary" to="/join-our-team#open-roles">See open roles <ArrowRight size={16} aria-hidden="true" /></Link>
                <Link className="pjc-btn pjc-btn--outline" to={applyHref("")}>General application</Link>
              </div>
            </div>
          )}
          {status === "ready" && item && (
            <div className="pjc-job-head__body">
              <p className="pjc-job-head__team">{item.department}</p>
              <h1 id="pjc-job-title">{item.title}</h1>
              <ul className="pjc-job-head__facts">
                <li><Briefcase size={16} aria-hidden="true" /> {item.employmentType}</li>
                <li><MapPin size={16} aria-hidden="true" /> {item.location} · {item.workMode}</li>
                <li><Clock size={16} aria-hidden="true" /> {item.experience}</li>
              </ul>
              <div className="pjc-job-head__actions">
                <Link className="pjc-btn pjc-btn--primary" to={applyHref(item.slug)}>Apply for this role <ArrowRight size={16} aria-hidden="true" /></Link>
                <Link className="pjc-btn pjc-btn--outline" to="/join-our-team#open-roles"><ArrowLeft size={16} aria-hidden="true" /> All open roles</Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {status === "ready" && item && (
        <section className="pjc-job" aria-label="Job description">
          <div className="pjds-container pjc-job__layout">
            <article className="pjc-job__panel">
              <div className="pjc-job__block">
                <h2>About the role</h2>
                <p>{item.summary}</p>
              </div>
              <Points title="What you will do" items={item.responsibilities} />
              <Points title="What we look for" items={item.requirements} />
              <Points title="Good to have" items={item.niceToHave} />
              <Points title="What you get" items={item.benefits} />
              {item.skills?.length > 0 && (
                <div className="pjc-job__block">
                  <h2>Skills</h2>
                  <ul className="pjc-job__tags">{item.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
                </div>
              )}
            </article>
            <aside className="pjc-job__panel pjc-job__summary" aria-label="Role summary">
              <h2>Role summary</h2>
              <dl>
                <div><dt><Briefcase size={16} aria-hidden="true" /> Job type</dt><dd>{item.employmentType}</dd></div>
                <div><dt><MapPin size={16} aria-hidden="true" /> Location</dt><dd>{item.location} ({item.workMode})</dd></div>
                <div><dt><Clock size={16} aria-hidden="true" /> Experience</dt><dd>{item.experience}</dd></div>
                <div><dt><IndianRupee size={16} aria-hidden="true" /> Salary</dt><dd>{item.salary || "Not disclosed"}</dd></div>
                <div><dt><Users size={16} aria-hidden="true" /> Openings</dt><dd>{item.positions}</dd></div>
                <div><dt><CalendarClock size={16} aria-hidden="true" /> Posted</dt><dd>{postedLabel(item.postedAt).replace(/^Posted /, "")}{item.closesOn ? ` · apply by ${formatDate(item.closesOn)}` : ""}</dd></div>
              </dl>
              <Link className="pjc-btn pjc-btn--primary pjc-job__apply" to={applyHref(item.slug)}>Apply now <ArrowRight size={16} aria-hidden="true" /></Link>
              <p className="pjc-job__note">It takes about 5 minutes. Keep your resume (PDF, DOC or DOCX, up to 5 MB) ready.</p>
            </aside>
          </div>
        </section>
      )}
    </main>
  );
}
