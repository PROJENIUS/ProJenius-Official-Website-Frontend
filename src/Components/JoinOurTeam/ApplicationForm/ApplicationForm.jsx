import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, FileUp, Loader2, Send } from "lucide-react";

import TypedPhrase from "../../Common/TypedPhrase/TypedPhrase.jsx";
import {
  EXPERIENCE_LEVELS,
  GENERAL_APPLICATION,
  OPENINGS,
  SKILL_AREAS,
  START_OPTIONS,
  WORK_MODES,
} from "../openings.js";
import "./ApplicationForm.css";
import SectionTitleLine from "../../Common/SectionTitleLine/SectionTitleLine.jsx";

/* =============================================================================
   JOIN OUR TEAM — APPLICATION FORM
   -----------------------------------------------------------------------------
   Sends a career application to the same backend endpoint as the Contact
   page (POST /api/contact/enquiries, enquiryType "career"), so it is stored
   as a job application and shows in the admin panel with the resume.

   The backend requires: name, email, phone, area, level, a motivation of
   20–300 words and a resume (PDF, DOC or DOCX, up to 5 MB). The checks here
   repeat those rules so mistakes show before sending; the backend still
   validates everything itself.

   The role is controlled by the page (role / onRoleChange) so "Apply for
   this role" on a role card can fill it in.
   ============================================================================= */

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const apiBaseUrl = (configuredApiBaseUrl || (import.meta.env.DEV ? "http://localhost:5000" : "")).replace(/\/+$/, "");
const ENDPOINT = apiBaseUrl ? `${apiBaseUrl}/api/contact/enquiries` : "";

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const RESUME_EXTENSIONS = ["pdf", "doc", "docx"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_WORDS = 20;
const MAX_WORDS = 300;

const ROLE_OPTIONS = [...OPENINGS.map((role) => role.title), GENERAL_APPLICATION];

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  city: "",
  organisation: "",
  area: "",
  level: "",
  workMode: "",
  startDate: "",
  portfolio: "",
  skills: "",
  motivation: "",
  consent: false,
};

const countWords = (text) => text.trim().split(/\s+/).filter(Boolean).length;

function isValidPhone(value) {
  const cleaned = value.replace(/[\s().-]/g, "");
  return /^(?:\+91|91|0)?[6-9]\d{9}$/.test(cleaned) || /^\+\d{7,15}$/.test(cleaned);
}

function validate(values, role, resume) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Please enter your full name.";
  if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = "Please enter a valid email address.";
  if (!isValidPhone(values.phone)) errors.phone = "Please enter a valid phone number.";
  if (!role) errors.role = "Please choose the role you are applying for.";
  if (!values.area) errors.area = "Please choose your main skill area.";
  if (!values.level) errors.level = "Please choose your experience level.";
  const words = countWords(values.motivation);
  if (words < MIN_WORDS || words > MAX_WORDS) {
    errors.motivation = `Please write between ${MIN_WORDS} and ${MAX_WORDS} words (now ${words}).`;
  }
  if (values.portfolio.trim() && !/^https?:\/\/\S+\.\S+/i.test(values.portfolio.trim())) {
    errors.portfolio = "Please enter a full link starting with https://";
  }
  if (!resume) {
    errors.resume = "Please upload your resume.";
  } else {
    const extension = resume.name.split(".").pop().toLowerCase();
    if (!RESUME_EXTENSIONS.includes(extension)) errors.resume = "Your resume must be a PDF, DOC or DOCX file.";
    else if (resume.size > MAX_FILE_BYTES) errors.resume = "Your resume must be 5 MB or smaller.";
  }
  if (!values.consent) errors.consent = "Please agree so we can review your application.";
  return errors;
}

function findReference(data) {
  const pending = [data];
  for (let i = 0; i < pending.length; i += 1) {
    const current = pending[i];
    if (!current || typeof current !== "object") continue;
    for (const [key, value] of Object.entries(current)) {
      if (/reference/i.test(key) && (typeof value === "string" || typeof value === "number")) return String(value);
      if (value && typeof value === "object") pending.push(value);
    }
  }
  return "";
}

function Field({ id, label, required, error, hint, children }) {
  return (
    <div className={`pjj-form__field${error ? " is-invalid" : ""}`}>
      <label htmlFor={`pjj-${id}`}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : <span className="pjj-form__optional"> (optional)</span>}
      </label>
      {children}
      {hint && !error && <p className="pjj-form__hint" id={`pjj-${id}-hint`}>{hint}</p>}
      {error && <p className="pjj-form__error" id={`pjj-${id}-error`} role="alert">{error}</p>}
    </div>
  );
}

export default function ApplicationForm({ role, onRoleChange }) {
  const [values, setValues] = useState(EMPTY);
  const [resume, setResume] = useState(null);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [reference, setReference] = useState("");
  const formRef = useRef(null);
  const fileRef = useRef(null);

  const update = (key) => (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setValues((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const describedBy = (key, hasHint) =>
    errors[key] ? `pjj-${key}-error` : hasHint ? `pjj-${key}-hint` : undefined;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status === "submitting") return;

    const nextErrors = validate(values, role, resume);
    setErrors(nextErrors);
    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      formRef.current?.querySelector(`#pjj-${firstInvalid}`)?.focus();
      return;
    }

    setStatus("submitting");
    setMessage("");
    try {
      if (!ENDPOINT) throw new Error("Online applications are not available right now. Please email or WhatsApp us your resume.");

      const payload = {
        enquiryType: "career",
        sourcePage: "join-our-team",
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        organisation: values.organisation.trim(),
        city: values.city.trim(),
        message: "",
        enquirySpecificFields: Object.fromEntries(
          Object.entries({
            role,
            area: values.area,
            level: values.level,
            workMode: values.workMode,
            startDate: values.startDate,
            portfolio: values.portfolio.trim(),
            skills: values.skills.trim(),
            motivation: values.motivation.trim(),
          }).filter(([, value]) => value)
        ),
        attachment: { field: "resume", name: resume.name, size: resume.size },
        timestamp: new Date().toISOString(),
      };

      const body = new FormData();
      body.append("payload", JSON.stringify(payload));
      body.append("attachment", resume, resume.name);

      const response = await fetch(ENDPOINT, { method: "POST", body });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(typeof data?.error === "string" ? data.error : "We could not send your application. Please check the form and try again.");
      }

      setReference(findReference(data));
      setStatus("success");
      setValues(EMPTY);
      setResume(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (error) {
      setMessage(
        error instanceof TypeError
          ? "We could not connect right now. Please try again in a moment."
          : error.message
      );
      setStatus("error");
    }
  };

  const words = countWords(values.motivation);

  return (
    <section id="apply" className="pjj-apply" aria-labelledby="pjj-apply-title">
      <div className="pjds-container pjj-apply__layout">
        <div className="pjj-apply__intro">
          <p className="pjds-eyebrow" data-reveal="up">Apply Now</p>
          <h2 id="pjj-apply-title" className="pjj-apply__title" data-reveal="up" data-reveal-delay="1">
            <span className="pjj-apply__title-static">Send Us Your</span>
            <TypedPhrase phrases={["Application", "Resume", "Best Work"]} />
          </h2>
          <SectionTitleLine />
          <p className="pjj-apply__text" data-reveal="up" data-reveal-delay="2">
            It takes a few minutes. Keep these ready:
          </p>
          <ul className="pjj-apply__checklist" data-reveal="up" data-reveal-delay="3">
            <li><CheckCircle2 size={18} aria-hidden="true" />Your resume as PDF, DOC or DOCX (up to 5 MB)</li>
            <li><CheckCircle2 size={18} aria-hidden="true" />A short note on why you want to join (20–300 words)</li>
            <li><CheckCircle2 size={18} aria-hidden="true" />A portfolio, GitHub or LinkedIn link, if you have one</li>
          </ul>
        </div>

        <div className="pjj-apply__card" data-reveal="up" data-reveal-delay="2">
          {status === "success" ? (
            <div className="pjj-apply__success" role="status">
              <span className="pjj-apply__success-icon" aria-hidden="true"><CheckCircle2 size={34} /></span>
              <h3>Application received</h3>
              <p>
                Thank you for applying to ProJenius. Our team will review your application and contact you by email or phone.
              </p>
              {reference && <p className="pjj-apply__ref">Reference number: <strong>{reference}</strong></p>}
              <button type="button" className="pjj-apply__again" onClick={() => setStatus("idle")}>
                Send another application
              </button>
            </div>
          ) : (
            <form ref={formRef} className="pjj-form" onSubmit={handleSubmit} noValidate>
              <fieldset className="pjj-form__group">
                <legend>About you</legend>
                <div className="pjj-form__grid">
                  <Field id="name" label="Full name" required error={errors.name}>
                    <input id="pjj-name" type="text" autoComplete="name" value={values.name} onChange={update("name")} aria-invalid={Boolean(errors.name)} aria-describedby={describedBy("name")} />
                  </Field>
                  <Field id="email" label="Email" required error={errors.email}>
                    <input id="pjj-email" type="email" autoComplete="email" value={values.email} onChange={update("email")} aria-invalid={Boolean(errors.email)} aria-describedby={describedBy("email")} />
                  </Field>
                  <Field id="phone" label="Phone / WhatsApp" required error={errors.phone}>
                    <input id="pjj-phone" type="tel" autoComplete="tel" value={values.phone} onChange={update("phone")} aria-invalid={Boolean(errors.phone)} aria-describedby={describedBy("phone")} />
                  </Field>
                  <Field id="city" label="Current city">
                    <input id="pjj-city" type="text" autoComplete="address-level2" value={values.city} onChange={update("city")} />
                  </Field>
                  <Field id="organisation" label="College / current company">
                    <input id="pjj-organisation" type="text" autoComplete="organization" value={values.organisation} onChange={update("organisation")} />
                  </Field>
                  <Field id="level" label="Experience" required error={errors.level}>
                    <select id="pjj-level" value={values.level} onChange={update("level")} aria-invalid={Boolean(errors.level)} aria-describedby={describedBy("level")}>
                      <option value="">Choose…</option>
                      {EXPERIENCE_LEVELS.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </Field>
                </div>
              </fieldset>

              <fieldset className="pjj-form__group">
                <legend>The role</legend>
                <div className="pjj-form__grid">
                  <Field id="role" label="Applying for" required error={errors.role}>
                    <select
                      id="pjj-role"
                      value={role}
                      onChange={(event) => {
                        onRoleChange(event.target.value);
                        if (errors.role) setErrors((current) => ({ ...current, role: undefined }));
                      }}
                      aria-invalid={Boolean(errors.role)}
                      aria-describedby={describedBy("role")}
                    >
                      <option value="">Choose…</option>
                      {ROLE_OPTIONS.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </Field>
                  <Field id="area" label="Main skill area" required error={errors.area}>
                    <select id="pjj-area" value={values.area} onChange={update("area")} aria-invalid={Boolean(errors.area)} aria-describedby={describedBy("area")}>
                      <option value="">Choose…</option>
                      {SKILL_AREAS.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </Field>
                  <Field id="workMode" label="Preferred work mode">
                    <select id="pjj-workMode" value={values.workMode} onChange={update("workMode")}>
                      <option value="">Choose…</option>
                      {WORK_MODES.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </Field>
                  <Field id="startDate" label="When can you start?">
                    <select id="pjj-startDate" value={values.startDate} onChange={update("startDate")}>
                      <option value="">Choose…</option>
                      {START_OPTIONS.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </Field>
                  <Field id="skills" label="Key skills" hint="For example: React, Node.js, Arduino, PCB design">
                    <input id="pjj-skills" type="text" value={values.skills} onChange={update("skills")} aria-describedby={describedBy("skills", true)} />
                  </Field>
                  <Field id="portfolio" label="Portfolio / GitHub / LinkedIn" error={errors.portfolio}>
                    <input id="pjj-portfolio" type="url" inputMode="url" placeholder="https://" value={values.portfolio} onChange={update("portfolio")} aria-invalid={Boolean(errors.portfolio)} aria-describedby={describedBy("portfolio")} />
                  </Field>
                </div>

                <Field id="motivation" label="Why do you want to join ProJenius?" required error={errors.motivation} hint={`${words} / ${MAX_WORDS} words (at least ${MIN_WORDS})`}>
                  <textarea id="pjj-motivation" rows={5} value={values.motivation} onChange={update("motivation")} aria-invalid={Boolean(errors.motivation)} aria-describedby={describedBy("motivation", true)} />
                </Field>
              </fieldset>

              <fieldset className="pjj-form__group">
                <legend>Resume</legend>
                <Field id="resume" label="Upload your resume" required error={errors.resume} hint="PDF, DOC or DOCX, up to 5 MB">
                  <label className={`pjj-form__file${resume ? " has-file" : ""}`} htmlFor="pjj-resume">
                    <FileUp size={22} aria-hidden="true" />
                    <span>{resume ? resume.name : "Choose a file"}</span>
                  </label>
                  <input
                    ref={fileRef}
                    id="pjj-resume"
                    className="pjj-form__file-input"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(event) => {
                      setResume(event.target.files?.[0] || null);
                      if (errors.resume) setErrors((current) => ({ ...current, resume: undefined }));
                    }}
                    aria-invalid={Boolean(errors.resume)}
                    aria-describedby={describedBy("resume", true)}
                  />
                </Field>
              </fieldset>

              <div className={`pjj-form__consent${errors.consent ? " is-invalid" : ""}`}>
                <label htmlFor="pjj-consent">
                  <input id="pjj-consent" type="checkbox" checked={values.consent} onChange={update("consent")} aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "pjj-consent-error" : undefined} />
                  <span>
                    I agree that ProJenius may use these details to review my application, as described in the{" "}
                    <Link to="/privacy-policy">Privacy Policy</Link>.
                  </span>
                </label>
                {errors.consent && <p className="pjj-form__error" id="pjj-consent-error" role="alert">{errors.consent}</p>}
              </div>

              {status === "error" && <p className="pjj-form__status" role="alert">{message}</p>}

              <button type="submit" className="pjj-form__submit" disabled={status === "submitting"}>
                {status === "submitting" ? (
                  <><Loader2 className="pjj-form__spin" size={18} aria-hidden="true" /> Sending…</>
                ) : (
                  <>Submit Application <Send size={18} aria-hidden="true" /></>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
