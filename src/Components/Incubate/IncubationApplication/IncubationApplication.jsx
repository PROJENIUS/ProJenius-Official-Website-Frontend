import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Loader2, MessageCircle } from "lucide-react";

import TypedPhrase from "../../Common/TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../../Common/SectionTitleLine/SectionTitleLine.jsx";
import { countWords, isValidEmail, isValidPhone, submitEnquiry } from "../../../utils/enquiry.js";
import { whatsappHref } from "../../../utils/whatsapp.js";
import { PRICING, QUESTION_GROUPS, QUESTIONS } from "../incubateData.js";
import "./IncubationApplication.css";

/* =============================================================================
   INCUBATION APPLICATION — the questions come from incubateData.js.
   Sent as a "startup" enquiry (POST /api/contact/enquiries) with
   sourcePage "incubate-apply". The API needs: name, email, phone, stage,
   at least one support item and a 10–500 word message, so:
     stage   ← the "stage" question
     support ← the "needs" question
     message ← the long text answers
   The success message appears only after the API confirms.
   ============================================================================= */

const MESSAGE_FIELDS = [
  ["startupName", "Startup / project"],
  ["problem", "Problem"],
  ["solution", "Solution"],
  ["users", "Target users"],
  ["teamSkills", "Team roles and skills"],
];
const CORE_FIELDS = new Set(["name", "email", "phone", "city", "organisation", "needs", ...MESSAGE_FIELDS.map(([id]) => id)]);
const MIN_WORDS = 10;
const MAX_WORDS = 480;

const EMPTY = Object.fromEntries(QUESTIONS.map((q) => [q.id, q.type === "checkbox" ? [] : ""]));

const buildMessage = (values) =>
  MESSAGE_FIELDS.filter(([id]) => String(values[id] || "").trim())
    .map(([id, label]) => `${label}: ${values[id].trim()}`)
    .join("\n\n");

function validate(values, agreed) {
  const errors = {};
  QUESTIONS.forEach((q) => {
    const value = values[q.id];
    const empty = Array.isArray(value) ? value.length === 0 : !String(value).trim();
    if (q.required && empty) errors[q.id] = q.type === "checkbox" ? "Please choose at least one." : "Please answer this question.";
  });
  if (!errors.email && !isValidEmail(values.email)) errors.email = "Please enter a valid email address.";
  if (!errors.phone && !isValidPhone(values.phone)) errors.phone = "Please enter a valid mobile number (Indian, or +country code).";
  const words = countWords(`${values.problem} ${values.solution}`);
  if (!errors.problem && !errors.solution && words < MIN_WORDS) {
    errors.solution = `Please describe the problem and your solution in at least ${MIN_WORDS} words together.`;
  }
  if (countWords(buildMessage(values)) > MAX_WORDS) errors.solution = "Please keep your answers shorter (about 450 words in total).";
  if (!agreed) errors.agree = "Please confirm you have read this.";
  return errors;
}

export default function IncubationApplication() {
  const [values, setValues] = useState(EMPTY);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent
  const [submitError, setSubmitError] = useState("");
  const [referenceId, setReferenceId] = useState("");

  const update = (id, value) => {
    setValues((current) => ({ ...current, [id]: value }));
    if (errors[id]) setErrors((current) => ({ ...current, [id]: undefined }));
  };

  const toggle = (id, option) => {
    const list = values[id];
    update(id, list.includes(option) ? list.filter((item) => item !== option) : [...list, option]);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (status === "sending") return;
    const found = validate(values, agreed);
    setErrors(found);
    const first = Object.keys(found).find((key) => found[key]);
    if (first) {
      document.getElementById(`inc-${first}`)?.focus();
      return;
    }

    const specific = Object.fromEntries(
      QUESTIONS.filter((q) => !CORE_FIELDS.has(q.id) && String(values[q.id]).trim()).map((q) => [q.id, values[q.id]]),
    );

    setStatus("sending");
    setSubmitError("");
    try {
      const { referenceId: reference } = await submitEnquiry({
        enquiryType: "startup",
        sourcePage: "incubate-apply",
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        organisation: values.organisation.trim(),
        city: values.city.trim(),
        message: buildMessage(values),
        enquirySpecificFields: {
          ...specific,
          support: values.needs,
          startupName: values.startupName.trim(),
          application: "Incubation",
        },
      });
      setReferenceId(reference);
      setStatus("sent");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setSubmitError(error.message);
      setStatus("idle");
    }
  };

  const errorFor = (id) => errors[id] && (
    <span id={`inc-${id}-error`} className="pjinc-apply__error">{errors[id]}</span>
  );

  const renderField = (q) => {
    const fieldId = `inc-${q.id}`;
    const describedBy = [q.hint ? `${fieldId}-hint` : null, errors[q.id] ? `${fieldId}-error` : null].filter(Boolean).join(" ") || undefined;
    const label = (
      <>
        {q.label}
        {q.required ? <span className="pjinc-apply__req" aria-hidden="true"> *</span> : <span className="pjinc-apply__opt"> (optional)</span>}
      </>
    );

    if (q.type === "radio" || q.type === "checkbox") {
      return (
        <fieldset key={q.id} className="pjinc-apply__field pjinc-apply__field--full" aria-describedby={describedBy}>
          <legend className="pjinc-apply__label">{label}</legend>
          {q.hint && <span id={`${fieldId}-hint`} className="pjinc-apply__hint">{q.hint}</span>}
          <div className="pjinc-apply__choices">
            {q.options.map((option, i) => {
              const checked = q.type === "checkbox" ? values[q.id].includes(option) : values[q.id] === option;
              return (
                <label key={option} className={`pjinc-apply__choice${checked ? " is-checked" : ""}`}>
                  <input
                    id={i === 0 ? fieldId : undefined}
                    type={q.type}
                    name={q.id}
                    value={option}
                    checked={checked}
                    required={q.required && q.type === "radio"}
                    onChange={() => (q.type === "checkbox" ? toggle(q.id, option) : update(q.id, option))}
                  />
                  <span>{option}</span>
                </label>
              );
            })}
          </div>
          {errorFor(q.id)}
        </fieldset>
      );
    }

    const common = {
      id: fieldId,
      name: q.id,
      value: values[q.id],
      required: q.required,
      "aria-invalid": errors[q.id] ? "true" : undefined,
      "aria-describedby": describedBy,
      onChange: (e) => update(q.id, e.target.value),
    };

    return (
      <div key={q.id} className={`pjinc-apply__field${q.type === "textarea" ? " pjinc-apply__field--full" : ""}`}>
        <label className="pjinc-apply__label" htmlFor={fieldId}>{label}</label>
        {q.hint && <span id={`${fieldId}-hint`} className="pjinc-apply__hint">{q.hint}</span>}
        {q.type === "textarea" ? (
          <textarea {...common} rows={q.rows || 3} />
        ) : q.type === "select" ? (
          <select {...common}>
            <option value="">Choose one</option>
            {q.options.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        ) : (
          <input {...common} type={q.type} autoComplete={q.autoComplete} />
        )}
        {errorFor(q.id)}
      </div>
    );
  };

  return (
    <section id="incubate-apply" className="pjinc-apply" aria-labelledby="incubate-apply-title">
      <div className="pjds-container pjinc-apply__wrap">
        <header className="pjinc-apply__head">
          <p className="pjds-eyebrow" data-reveal="up">Incubation Application</p>
          <h1 id="incubate-apply-title" className="pjds-title pjinc-apply__title" data-reveal="up" data-reveal-delay="1">
            Tell Us About <TypedPhrase phrases={["Your Startup", "Your Idea", "Your Team"]} />
          </h1>
          <SectionTitleLine />
          <p className="pjds-lead pjinc-apply__lead">
            {QUESTIONS.length} short questions. The team reads every application and contacts you to discuss your
            seat, the services you need and the incubation rules.
          </p>
        </header>

        {status !== "sent" && (
          <div className="pjinc-apply__fees" role="note" aria-label="Incubation fees">
            <p className="pjinc-apply__fees-title">How incubation is charged</p>
            <ol className="pjinc-apply__fees-list">
              {PRICING.steps.map(({ label, value, text }) => (
                <li key={label} className="pjinc-apply__fee">
                  <span className="pjinc-apply__fee-head">
                    <span className="pjinc-apply__fee-label">{label}</span>
                    <span className="pjinc-apply__fee-value">{value}</span>
                  </span>
                  <span className="pjinc-apply__fee-text">{text}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {status === "sent" ? (
          <div className="pjinc-apply__done" role="status">
            <CheckCircle2 size={40} aria-hidden="true" />
            <h3>Application received</h3>
            <p>
              Thank you. The ProJenius team will review it and contact you.
              {referenceId && <> Your reference: <strong>{referenceId}</strong>.</>}
            </p>
            <Link className="pjds-btn pjds-btn--primary" to="/startup#startup-incubate">
              Back to Incubate at ProJenius <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <form className="pjinc-apply__form" onSubmit={onSubmit} noValidate>
            {QUESTION_GROUPS.map((group, index) => (
              <fieldset key={group.title} className="pjinc-apply__group">
                <legend className="pjinc-apply__group-title">
                  <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  {group.title}
                </legend>
                <div className="pjinc-apply__grid">{group.questions.map(renderField)}</div>
              </fieldset>
            ))}

            <div className="pjinc-apply__agree">
              <label className="pjinc-apply__agree-label">
                <input
                  id="inc-agree"
                  type="checkbox"
                  checked={agreed}
                  aria-describedby={errors.agree ? "inc-agree-error" : undefined}
                  onChange={(e) => {
                    setAgreed(e.target.checked);
                    if (errors.agree) setErrors((c) => ({ ...c, agree: undefined }));
                  }}
                />
                <span>
                  I understand that applying is free and does not guarantee a seat. If my application is accepted,
                  a one-time registration fee of {PRICING.registration} is paid when I join, and my seat and the
                  services I need are charged separately, as agreed after the review.
                </span>
              </label>
              {errorFor("agree")}
            </div>

            {submitError && <p className="pjinc-apply__submit-error" role="alert">{submitError}</p>}

            <div className="pjinc-apply__actions">
              <button type="submit" className="pjinc-apply__submit" disabled={status === "sending"}>
                {status === "sending" ? (
                  <><Loader2 size={18} className="pjinc-apply__spin" aria-hidden="true" /> Sending…</>
                ) : (
                  <>Submit Application <ArrowRight size={18} aria-hidden="true" /></>
                )}
              </button>
              <a
                className="pjinc-apply__wa"
                href={whatsappHref("Hi ProJenius, I have a question about incubating at ProJenius.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={18} aria-hidden="true" /> Ask on WhatsApp
                <span className="pjds-sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
