import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";

import { countWords, isValidEmail, isValidPhone, submitEnquiry } from "../../../utils/enquiry.js";
import "./StartupIdeaForm.css";
import TypedPhrase from "../../Common/TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../../Common/SectionTitleLine/SectionTitleLine.jsx";

/* =============================================================================
   SUBMIT YOUR IDEA — sends a "startup" enquiry to the ProJenius enquiry API
   (POST /api/contact/enquiries). The success message appears only after the
   API confirms the submission. Nothing is kept in browser storage.

   Required by the API for this type: name, email, phone, stage, at least one
   support area and a 10–500 word message.
   ============================================================================= */

const STAGES = ["Just an Idea", "Problem Identified", "Research / Validation", "Prototype", "MVP", "Existing Product", "Not Sure"];
const SUPPORT = [
  "Idea Validation",
  "Research & Development",
  "Software / AI",
  "Hardware / Electronics",
  "PCB Design",
  "Prototype Development",
  "MVP Development",
  "Patent / IP Support",
];

const MIN_WORDS = 10;
const MAX_WORDS = 400; // leaves room for the optional team and notes within the API's 500

const EMPTY = { name: "", email: "", phone: "", organisation: "", ideaTitle: "", stage: "", support: [], description: "", team: "", notes: "", acknowledge: false };

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Please enter your name.";
  if (!isValidEmail(values.email)) errors.email = "Please enter a valid email address.";
  if (!isValidPhone(values.phone)) errors.phone = "Please enter a valid mobile number (Indian, or +country code).";
  if (!values.ideaTitle.trim()) errors.ideaTitle = "Please give your idea a short title.";
  if (!values.stage) errors.stage = "Please choose the current stage.";
  if (!values.support.length) errors.support = "Please choose at least one kind of support.";
  const words = countWords(values.description);
  if (words < MIN_WORDS) errors.description = `Please describe the problem and your idea in at least ${MIN_WORDS} words.`;
  else if (words > MAX_WORDS) errors.description = `Please keep this under ${MAX_WORDS} words.`;
  if (countWords(values.team) + countWords(values.notes) > 90) errors.notes = "Please keep the team and notes short (about 90 words together).";
  if (!values.acknowledge) errors.acknowledge = "Please confirm you have read this.";
  return errors;
}

function buildMessage(values) {
  const parts = [`Idea: ${values.ideaTitle.trim()}`, values.description.trim()];
  if (values.team.trim()) parts.push(`Team: ${values.team.trim()}`);
  if (values.notes.trim()) parts.push(`Notes: ${values.notes.trim()}`);
  return parts.join("\n\n");
}

export default function StartupIdeaForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent
  const [submitError, setSubmitError] = useState("");
  const [referenceId, setReferenceId] = useState("");

  const update = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const toggleSupport = (option) => {
    update("support", values.support.includes(option)
      ? values.support.filter((item) => item !== option)
      : [...values.support, option]);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (status === "sending") return;
    const found = validate(values);
    setErrors(found);
    const firstInvalid = Object.keys(found).find((key) => found[key]);
    if (firstInvalid) {
      const field = document.getElementById(`idea-${firstInvalid}`);
      field?.closest("details")?.setAttribute("open", "");
      field?.focus();
      return;
    }

    setStatus("sending");
    setSubmitError("");
    try {
      const { referenceId: reference } = await submitEnquiry({
        enquiryType: "startup",
        sourcePage: "startup-innovation",
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        organisation: values.organisation.trim(),
        message: buildMessage(values),
        enquirySpecificFields: {
          stage: values.stage,
          support: values.support,
          ideaTitle: values.ideaTitle.trim(),
        },
      });
      setReferenceId(reference);
      setStatus("sent");
    } catch (error) {
      setSubmitError(error.message);
      setStatus("idle");
    }
  };

  const describedBy = (field, hint) => [hint, errors[field] ? `idea-${field}-error` : null].filter(Boolean).join(" ") || undefined;
  const fieldError = (field) => errors[field] && (
    <span id={`idea-${field}-error`} className="pjsi-form__error">{errors[field]}</span>
  );
  const words = countWords(values.description);

  return (
    <section id="submit-idea" className="pjsi-form" aria-labelledby="submit-idea-title">
      <div className="pjds-container pjsi-form__layout">
        <header className="pjsi-form__intro">
          <p className="pjds-eyebrow" data-reveal="up">Submit Your Idea</p>
          <h2 id="submit-idea-title" className="pjds-title" data-reveal="up" data-reveal-delay="1">
            Tell Us What You Want <TypedPhrase phrases={["to Build", "to Create", "to Solve"]} />
          </h2>
          <SectionTitleLine />
          <p className="pjds-lead" data-reveal="up" data-reveal-delay="2">
            A rough idea is enough to start. Share the problem and where you are today, and we will get back
            to you to arrange an initial conversation.
          </p>
          <ul className="pjsi-form__notes" data-reveal="up" data-reveal-delay="3">
            <li>
              <ShieldCheck size={18} strokeWidth={2.1} aria-hidden="true" />
              Please avoid sharing confidential or patent-sensitive details in this first submission.
            </li>
            <li>
              <CheckCircle2 size={18} strokeWidth={2.1} aria-hidden="true" />
              Every submission is reviewed. Support is decided case by case after the review and discussion.
            </li>
          </ul>
          <p className="pjsi-form__alt" data-reveal="up" data-reveal-delay="3">
            Prefer a quick question first?{" "}
            <Link to="/contact?type=startup&from=startup-innovation">Use the contact form</Link>.
          </p>
        </header>

        <div className="pjsi-form__card" data-reveal="up" data-reveal-delay="2">
          {status === "sent" ? (
            <div className="pjsi-form__done" role="status">
              <CheckCircle2 size={44} strokeWidth={1.8} aria-hidden="true" />
              <h3>Idea received</h3>
              <p>
                Thank you. Our team will review your idea and get back to you to arrange an initial
                conversation.
              </p>
              {referenceId && <p className="pjsi-form__ref">Reference: <strong>{referenceId}</strong></p>}
            </div>
          ) : (
            <form className="pjsi-form__form" onSubmit={onSubmit} noValidate>
              <fieldset className="pjsi-form__group">
                <legend>About you</legend>
                <div className="pjsi-form__grid">
                  <div className="pjsi-form__field">
                    <label htmlFor="idea-name">Name <span aria-hidden="true">*</span></label>
                    <input id="idea-name" type="text" autoComplete="name" value={values.name} onChange={(e) => update("name", e.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={describedBy("name")} />
                    {fieldError("name")}
                  </div>
                  <div className="pjsi-form__field">
                    <label htmlFor="idea-email">Email <span aria-hidden="true">*</span></label>
                    <input id="idea-email" type="email" autoComplete="email" value={values.email} onChange={(e) => update("email", e.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={describedBy("email")} />
                    {fieldError("email")}
                  </div>
                  <div className="pjsi-form__field">
                    <label htmlFor="idea-phone">Phone / WhatsApp <span aria-hidden="true">*</span></label>
                    <input id="idea-phone" type="tel" autoComplete="tel" value={values.phone} onChange={(e) => update("phone", e.target.value)} aria-invalid={Boolean(errors.phone)} aria-describedby={describedBy("phone")} />
                    {fieldError("phone")}
                  </div>
                  <div className="pjsi-form__field">
                    <label htmlFor="idea-organisation">College / organisation <span className="pjsi-form__optional">(optional)</span></label>
                    <input id="idea-organisation" type="text" autoComplete="organization" value={values.organisation} onChange={(e) => update("organisation", e.target.value)} />
                  </div>
                </div>
              </fieldset>

              <fieldset className="pjsi-form__group">
                <legend>About your idea</legend>
                <div className="pjsi-form__grid">
                  <div className="pjsi-form__field">
                    <label htmlFor="idea-ideaTitle">Idea or project title <span aria-hidden="true">*</span></label>
                    <input id="idea-ideaTitle" type="text" value={values.ideaTitle} onChange={(e) => update("ideaTitle", e.target.value)} aria-invalid={Boolean(errors.ideaTitle)} aria-describedby={describedBy("ideaTitle")} />
                    {fieldError("ideaTitle")}
                  </div>
                  <div className="pjsi-form__field">
                    <label htmlFor="idea-stage">Current stage <span aria-hidden="true">*</span></label>
                    <select id="idea-stage" value={values.stage} onChange={(e) => update("stage", e.target.value)} aria-invalid={Boolean(errors.stage)} aria-describedby={describedBy("stage")}>
                      <option value="">Choose a stage</option>
                      {STAGES.map((stage) => <option key={stage} value={stage}>{stage}</option>)}
                    </select>
                    {fieldError("stage")}
                  </div>
                </div>

                <div className="pjsi-form__field">
                  <span className="pjsi-form__label" id="idea-support-label">Support you are looking for <span aria-hidden="true">*</span></span>
                  <div
                    id="idea-support"
                    className="pjsi-form__choices"
                    role="group"
                    aria-labelledby="idea-support-label"
                    aria-describedby={describedBy("support")}
                    tabIndex={-1}
                  >
                    {SUPPORT.map((option) => (
                      <label key={option} className={`pjsi-form__choice${values.support.includes(option) ? " is-checked" : ""}`}>
                        <input type="checkbox" checked={values.support.includes(option)} onChange={() => toggleSupport(option)} />
                        {option}
                      </label>
                    ))}
                  </div>
                  {fieldError("support")}
                </div>

                <div className="pjsi-form__field">
                  <label htmlFor="idea-description">The problem and your idea <span aria-hidden="true">*</span></label>
                  <textarea
                    id="idea-description"
                    rows={6}
                    value={values.description}
                    onChange={(e) => update("description", e.target.value)}
                    aria-invalid={Boolean(errors.description)}
                    aria-describedby={describedBy("description", "idea-description-hint")}
                  />
                  <span id="idea-description-hint" className="pjsi-form__hint">
                    What problem does it solve, for whom, and how? {words} / {MAX_WORDS} words (at least {MIN_WORDS}).
                  </span>
                  {fieldError("description")}
                </div>

                <details className="pjsi-form__more">
                  <summary>Add more details (optional)</summary>
                  <div className="pjsi-form__field">
                    <label htmlFor="idea-team">Team</label>
                    <input id="idea-team" type="text" placeholder="e.g. 3 students, final-year ECE" value={values.team} onChange={(e) => update("team", e.target.value)} />
                  </div>
                  <div className="pjsi-form__field">
                    <label htmlFor="idea-notes">Anything else we should know</label>
                    <textarea id="idea-notes" rows={3} value={values.notes} onChange={(e) => update("notes", e.target.value)} aria-invalid={Boolean(errors.notes)} aria-describedby={describedBy("notes")} />
                    {fieldError("notes")}
                  </div>
                </details>
              </fieldset>

              <div className="pjsi-form__field">
                <label className="pjsi-form__check" htmlFor="idea-acknowledge">
                  <input
                    id="idea-acknowledge"
                    type="checkbox"
                    checked={values.acknowledge}
                    onChange={(e) => update("acknowledge", e.target.checked)}
                    aria-invalid={Boolean(errors.acknowledge)}
                    aria-describedby={describedBy("acknowledge")}
                  />
                  <span>
                    I understand that submitting an idea does not guarantee incubation, funding or resources, and that
                    any support is decided after review.
                  </span>
                </label>
                {fieldError("acknowledge")}
              </div>

              {submitError && <p className="pjsi-form__submit-error" role="alert">{submitError}</p>}

              <button type="submit" className="pjds-btn pjds-btn--dark pjsi-form__submit" disabled={status === "sending"}>
                {status === "sending" ? (
                  <>
                    <Loader2 size={18} className="pjsi-form__spin" aria-hidden="true" /> Sending…
                  </>
                ) : (
                  <>
                    Submit Your Idea <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
