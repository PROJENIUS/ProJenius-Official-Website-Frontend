import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, Clock, MapPin, Search, X } from "lucide-react";

import TypedPhrase from "../../Common/TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../../Common/SectionTitleLine/SectionTitleLine.jsx";
import { applyHref, postedLabel, roleHref, useOpenings } from "../careersApi.js";
import "./OpenRoles.css";

/* =============================================================================
   JOIN OUR TEAM — OPEN ROLES (navy section)
   A searchable job list like a company careers page: search by keyword,
   filter by team, job type and work mode, then open a role's own page or
   apply. Roles come from Admin → Job Openings. Every state has a clear
   message: loading, no roles, no match for the filters, or a connection
   problem (with a general application still possible).
   ============================================================================= */

const unique = (items, key) => [...new Set(items.map((item) => item[key]).filter(Boolean))].sort();

export default function OpenRoles() {
  const { status, items } = useOpenings();
  const [query, setQuery] = useState("");
  const [team, setTeam] = useState("");
  const [type, setType] = useState("");
  const [mode, setMode] = useState("");

  const teams = useMemo(() => unique(items, "department"), [items]);
  const types = useMemo(() => unique(items, "employmentType"), [items]);
  const modes = useMemo(() => unique(items, "workMode"), [items]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) =>
      (!team || item.department === team)
      && (!type || item.employmentType === type)
      && (!mode || item.workMode === mode)
      && (!needle || [item.title, item.summary, item.department, item.location, ...(item.skills || [])].join(" ").toLowerCase().includes(needle)));
  }, [items, query, team, type, mode]);
  const filtering = Boolean(query || team || type || mode);
  const clear = () => { setQuery(""); setTeam(""); setType(""); setMode(""); };

  return (
    <section id="open-roles" className="pjc-roles" aria-labelledby="pjc-roles-title">
      <div className="pjds-container">
        <header className="pjc-roles__head">
          <p className="pjds-eyebrow pjds-eyebrow--on-dark" data-reveal="up">Open Roles</p>
          <h2 id="pjc-roles-title" className="pjc-roles__title" data-reveal="up" data-reveal-delay="1">
            Find Your Place <TypedPhrase tone="dark" phrases={["in Our Team", "in Real Projects", "at ProJenius"]} />
          </h2>
          <SectionTitleLine />
          <p className="pjc-roles__lead" data-reveal="up" data-reveal-delay="2">
            Search the roles open right now. Each role has its own page with the full job description.
          </p>
        </header>

        {status === "ready" && items.length > 0 && (
          <form className="pjc-roles__filters" role="search" onSubmit={(event) => event.preventDefault()} aria-label="Search open roles">
            <label className="pjc-roles__search">
              <Search size={18} aria-hidden="true" />
              <span className="pjds-sr-only">Search roles</span>
              <input type="search" placeholder="Search by role, skill or team" value={query} maxLength={60} onChange={(event) => setQuery(event.target.value)} />
            </label>
            <label><span className="pjds-sr-only">Team</span><select value={team} onChange={(event) => setTeam(event.target.value)}><option value="">All teams</option>{teams.map((value) => <option key={value}>{value}</option>)}</select></label>
            <label><span className="pjds-sr-only">Job type</span><select value={type} onChange={(event) => setType(event.target.value)}><option value="">All job types</option>{types.map((value) => <option key={value}>{value}</option>)}</select></label>
            <label><span className="pjds-sr-only">Work mode</span><select value={mode} onChange={(event) => setMode(event.target.value)}><option value="">On-site, hybrid or remote</option>{modes.map((value) => <option key={value}>{value}</option>)}</select></label>
          </form>
        )}

        <div className="pjc-roles__results" aria-live="polite">
          {status === "loading" && (
            <ul className="pjc-roles__list" aria-label="Loading roles">
              {[0, 1, 2].map((index) => <li key={index} className="pjc-role pjc-role--skeleton" aria-hidden="true"><i /><i /><i /></li>)}
            </ul>
          )}

          {status === "ready" && items.length > 0 && (
            <>
              <p className="pjc-roles__count">{filtered.length} of {items.length} open role{items.length === 1 ? "" : "s"}{filtering && <button type="button" onClick={clear}><X size={14} aria-hidden="true" /> Clear filters</button>}</p>
              {filtered.length ? (
                <ul className="pjc-roles__list">
                  {filtered.map((item) => (
                    <li key={item.slug} className="pjc-role">
                      <div className="pjc-role__main">
                        <p className="pjc-role__team">{item.department}</p>
                        <h3 className="pjc-role__title"><Link to={roleHref(item.slug)}>{item.title}</Link></h3>
                        <ul className="pjc-role__facts" aria-label="Role details">
                          <li><Briefcase size={15} aria-hidden="true" /> {item.employmentType}</li>
                          <li><MapPin size={15} aria-hidden="true" /> {item.location} · {item.workMode}</li>
                          <li><Clock size={15} aria-hidden="true" /> {item.experience}</li>
                        </ul>
                        <p className="pjc-role__summary">{item.summary}</p>
                      </div>
                      <div className="pjc-role__side">
                        <span className="pjc-role__posted">{postedLabel(item.postedAt)}</span>
                        <Link className="pjc-btn pjc-btn--primary" to={applyHref(item.slug)}>Apply <ArrowRight size={16} aria-hidden="true" /></Link>
                        <Link className="pjc-btn pjc-btn--ghost" to={roleHref(item.slug)}>View details</Link>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="pjc-roles__empty" role="status">
                  <h3>No roles match your search</h3>
                  <p>Try another word or clear the filters. You can always send a general application.</p>
                  <div className="pjc-roles__empty-actions">
                    <button type="button" className="pjc-btn pjc-btn--ghost" onClick={clear}>Clear filters</button>
                    <Link className="pjc-btn pjc-btn--primary" to={applyHref("")}>General application</Link>
                  </div>
                </div>
              )}
            </>
          )}

          {(status === "error" || (status === "ready" && items.length === 0)) && (
            <div className="pjc-roles__empty" role="status">
              <h3>{status === "error" ? "We could not load the open roles" : "No open roles right now"}</h3>
              <p>{status === "error" ? "Please refresh the page in a moment. You can still send us your resume." : "We are not hiring for a specific role at the moment, but we always like to hear from people who build. Send a general application and we will contact you when a role fits."}</p>
              <div className="pjc-roles__empty-actions">
                <Link className="pjc-btn pjc-btn--primary" to={applyHref("")}>Send a general application <ArrowRight size={16} aria-hidden="true" /></Link>
                <Link className="pjc-btn pjc-btn--ghost" to="/services/internship">Looking for an internship?</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
