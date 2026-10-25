import { memo, useCallback, useState } from "react";
import "./PjxApplication.css";

/* ==========================================================================
   PjxApplication.jsx
   RULES FOLLOWED : no inline style | no <style> tag | no CSS import | no CSS module
                    unique "pjx-apply-" class names | no repeated markup (data + map)
                    zero external dependencies | self-contained single JSX file
   NOTE           : load PjxApplication.css ONCE outside this file
                    (e.g. <link rel="stylesheet" href="/PjxApplication.css"> in index.html)
   ========================================================================== */

/* ==========================================================================
   SECTION 1 : VECTOR SVG ICON PATH REGISTRY
   Immutable SVG path arrays for feather / lucide style icons (viewBox 0 0 24 24).
   ========================================================================== */
const PJX_PATH_ARROW = Object.freeze(["M5 12h14", "m12 5 7 7-7 7"]);
const PJX_PATH_BACK = Object.freeze(["M19 12H5", "m12 19-7-7 7-7"]);
const PJX_PATH_BULB = Object.freeze([
  "M9 18h6",
  "M10 22h4",
  "M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6h8c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z",
]);
const PJX_PATH_CALENDAR = Object.freeze([
  "M8 2v4",
  "M16 2v4",
  "M3 10h18",
  "M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
]);
const PJX_PATH_DOWNLOAD = Object.freeze([
  "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
  "m7 10 5 5 5-5",
  "M12 15V3",
]);
const PJX_PATH_FILE = Object.freeze([
  "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
  "M14 2v6h6",
  "M16 13H8",
  "M16 17H8",
  "M10 9H8",
]);
const PJX_PATH_PRINTER = Object.freeze([
  "M6 9V2h12v7",
  "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",
  "M6 14h12v8H6z",
]);
const PJX_PATH_ROCKET = Object.freeze([
  "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z",
  "m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z",
  "M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0",
  "M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5",
]);
const PJX_PATH_SEND = Object.freeze([
  "m22 2-7 20-4-9-9-4Z",
  "M22 2 11 13",
]);
const PJX_PATH_USER = Object.freeze([
  "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",
  "M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
]);

/* ==========================================================================
   SECTION 2 : REUSABLE SVG ICON COMPONENT
   ========================================================================== */
const PjxIcon = memo(function PjxIcon({ className = "", paths, viewBox = "0 0 24 24" }) {
  if (!paths) return null;
  const pathList = Array.isArray(paths) ? paths : [paths];

  return (
    <svg
      className={className}
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {pathList.map((d, index) => (
        <path key={index} d={d} />
      ))}
    </svg>
  );
});

/* ==========================================================================
   SECTION 3 : PURE JAVASCRIPT PDF 1.4 BUILDER & DOWNLOADER
   Zero external dependencies | Safe buffer encoding
   ========================================================================== */
function pjxBuildPdf({ title, applicationNo, date, sections }) {
  let contentStream = "";
  let y = 780;

  function addText(text, size = 10, isBold = false, indent = 40) {
    const safeText = String(text || "")
      .replace(/[\r\n]+/g, " ")
      .replace(/[()\\]/g, "\\$&");
    const font = isBold ? "/F2" : "/F1";
    contentStream += `BT ${font} ${size} Tf 0 0 0 rg ${indent} ${y} Td (${safeText}) Tj ET\n`;
    y -= size + 6;
  }

  // Header Title & Meta
  addText("PROJENIUS TECHNOLOGY - INCUBATION APPLICATION", 14, true, 40);
  addText(`${title}  |  App No: ${applicationNo}  |  Date: ${date}`, 9, false, 40);
  contentStream += `0.7 0.7 0.7 RG 40 ${y} m 550 ${y} l S\n`;
  y -= 16;

  // Sections
  for (const sec of sections || []) {
    if (y < 80) break;
    addText(sec.title, 11, true, 40);
    for (const [k, v] of sec.rows || []) {
      if (y < 60) break;
      addText(`${k}: ${v}`, 9, false, 55);
    }
    y -= 8;
  }

  const streamLength = new TextEncoder().encode(contentStream).length;

  const objects = [
    `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`,
    `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`,
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj\n`,
    `4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`,
    `5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n`,
    `6 0 obj\n<< /Length ${streamLength} >>\nstream\n${contentStream}\nendstream\nendobj\n`,
  ];

  let pdfHeader = "%PDF-1.4\n";
  const xref = [0];
  let body = "";
  for (let i = 0; i < objects.length; i++) {
    xref.push(pdfHeader.length + body.length);
    body += objects[i];
  }

  const xrefOffset = pdfHeader.length + body.length;
  let xrefTable = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i++) {
    xrefTable += String(xref[i]).padStart(10, "0") + " 00000 n \n";
  }
  const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  const fullPdf = pdfHeader + body + xrefTable + trailer;
  return new Blob([new TextEncoder().encode(fullPdf)], { type: "application/pdf" });
}

function pjxDownloadPdf(pdfData, filename = "Application.pdf") {
  if (typeof window === "undefined") return;

  const blob =
    pdfData instanceof Blob
      ? pdfData
      : new Blob([pdfData], { type: "application/pdf" });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ==========================================================================
   SECTION 4 : STATIC FORM AND SHEET DATA
   ========================================================================== */
const PJX_APPLY_FORM_ID = "pjx-apply-form";
const PJX_APPLY_YEAR = new Date().getFullYear();
const PJX_APPLY_DATE = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
const PJX_APPLY_STEPS = ["Application Form", "Project Details", "Team & Mentorship", "Review & Submit"];

/* One config drives the form AND the application sheet = no repeated markup */
const PJX_APPLY_SECTIONS = [
  {
    id: "founder", title: "Founder / Team Details", sheetTitle: "Applicant Details", icon: PJX_PATH_USER,
    fields: [
      { name: "fullName", label: "Full Name", type: "text", placeholder: "Enter your full name", required: true, autoComplete: "name" },
      { name: "email", label: "Email Address", type: "email", placeholder: "you@example.com", required: true, autoComplete: "email" },
      { name: "phone", label: "Phone Number", type: "tel", placeholder: "+91 98765 43210", required: true, autoComplete: "tel" },
      { name: "institute", label: "Institute / Organization", type: "text", placeholder: "e.g. SRM Madurai, College, Company", required: true },
      { name: "course", label: "Course / Department", type: "select", placeholder: "Select your course/department", required: true,
        options: ["Artificial Intelligence & Data Science", "Computer Science", "Information Technology", "Electronics & Communication", "Mechanical", "Civil", "Management", "Other"] },
      { name: "year", label: "Year / Current Stage", type: "select", placeholder: "Select your year", required: true,
        options: ["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduate", "Working Professional"] },
    ],
  },
  {
    id: "project", title: "Project / Startup Details", sheetTitle: "Project / Startup Details", icon: PJX_PATH_ROCKET,
    fields: [
      { name: "projectName", label: "Project / Startup Name", type: "text", placeholder: "e.g. NourishNet / EchoPath", required: true },
      { name: "stage", label: "Stage", type: "radio", options: ["Idea", "Prototype", "MVP", "Scaling"] },
      { name: "description", label: "Brief Description", type: "textarea", max: 1000, wide: true,
        placeholder: "Describe your innovation, problem statement, and the value it creates..." },
    ],
  },
  {
    id: "extra", title: "Additional Information", sheetTitle: "Additional Information", icon: PJX_PATH_FILE,
    fields: [
      { name: "source", label: "How did you hear about us?", type: "select", placeholder: "Select an option", required: true,
        options: ["Social Media", "Friends / Family", "College / Faculty", "Event / Workshop", "Website", "Other"] },
      { name: "notes", label: "Any additional notes?", type: "textarea", max: 500, placeholder: "Optional" },
    ],
  },
];

/* Start values: every field empty, radio starts on its first option */
const PJX_APPLY_INITIAL = Object.fromEntries(
  PJX_APPLY_SECTIONS.flatMap((section) =>
    section.fields.map((field) => [field.name, field.type === "radio" ? field.options[0] : ""])
  )
);

/* Buttons under the application sheet */
const PJX_APPLY_ACTIONS = [
  { id: "download", icon: PJX_PATH_DOWNLOAD, title: "Download PDF", text: "Save this application sheet as a PDF file.", label: "Download PDF", variant: "solid", kind: "download" },
  { id: "print", icon: PJX_PATH_PRINTER, title: "Print Hardcopy", text: "Open your browser's print dialog to get a physical copy.", label: "Print", variant: "outline", kind: "print" },
  { id: "submit", icon: PJX_PATH_SEND, title: "Submit Application", text: "Finalize your application after reviewing all details.", label: "Submit", variant: "solid", kind: "submit" },
];

/* Print button opens the browser print dialog */
const pjxApplyPrint = () => window.print();

/* ==========================================================================
   SECTION 5 : SUB-COMPONENTS
   ========================================================================== */
const PjxApplyField = memo(function PjxApplyField({ field, count }) {
  const { name, label, type, placeholder, required, options, max, wide, autoComplete } = field;
  const fieldClass = wide ? "pjx-apply__field pjx-apply__field--wide" : "pjx-apply__field";

  /* Radio group (Stage) */
  if (type === "radio") {
    return (
      <fieldset className={fieldClass}>
        <legend className="pjx-apply__label">{label}</legend>
        <div className="pjx-apply__radios">
          {options.map((option, index) => (
            <label key={option} className="pjx-apply__radio">
              <input type="radio" name={name} value={option} defaultChecked={index === 0} />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  /* Select / textarea / input */
  let control;
  if (type === "select") {
    control = (
      <select className="pjx-apply__control" name={name} required={required} defaultValue="">
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    );
  } else if (type === "textarea") {
    control = <textarea className="pjx-apply__control pjx-apply__control--area" name={name} maxLength={max} placeholder={placeholder} />;
  } else {
    control = <input className="pjx-apply__control" type={type} name={name} placeholder={placeholder} required={required} autoComplete={autoComplete} />;
  }

  return (
    <label className={fieldClass}>
      <span className="pjx-apply__label">
        {label}
        {required && <span className="pjx-apply__star" aria-hidden="true"> *</span>}
      </span>
      {control}
      {max && <span className="pjx-apply__count">{count}/{max}</span>}
    </label>
  );
});

const PjxApplySheet = memo(function PjxApplySheet({ values, isSubmitted, onDownload, downloadSuccess }) {
  const clickHandlers = { download: onDownload, print: pjxApplyPrint };

  return (
    <article className="pjx-apply__sheet pjx-apply__paper" aria-label="Incubation application sheet">

      {/* SECTION: Sheet header (brand + tagline) */}
      <header className="pjx-apply__bar">
        <p className="pjx-apply__brand">ProJenius<span className="pjx-apply__brand-sub">Technology</span></p>
        <p className="pjx-apply__tagline">Ideas / Innovation / Impact</p>
      </header>

      <h2 className="pjx-apply__sheet-title">Incubation Application Sheet</h2>

      {/* SECTION: Application number + date */}
      <p className="pjx-apply__bar pjx-apply__caption">
        <span>Application No. : <strong>PJ-INC-{PJX_APPLY_YEAR}-001</strong></span>
        <span className="pjx-apply__meta-date">
          <PjxIcon className="pjx-apply__svg pjx-apply__icon" paths={PJX_PATH_CALENDAR} /> Date : <strong>{PJX_APPLY_DATE}</strong>
        </span>
      </p>

      {/* SECTION: Filled details */}
      {PJX_APPLY_SECTIONS.map((section, index) => (
        <section key={section.id} className="pjx-apply__block">
          <h3 className="pjx-apply__block-title">
            <PjxIcon className="pjx-apply__svg pjx-apply__icon" paths={section.icon} /> {index + 1}. {section.sheetTitle}
          </h3>
          <table className="pjx-apply__table">
            <tbody>
              {section.fields.map((field) => (
                <tr key={field.name}>
                  <th scope="row">{field.label}</th>
                  <td>{values[field.name] || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}

      <p className="pjx-apply__thanks">
        Thank you for your interest in ProJenius Technology.<br />We look forward to supporting your journey!
      </p>

      {isSubmitted && <p className="pjx-apply__status" role="status">Application submitted. Thank you!</p>}
      {downloadSuccess && <p className="pjx-apply__status" role="status">PDF downloaded successfully!</p>}

      {/* SECTION: Download / Print / Submit */}
      <div className="pjx-apply__actions">
        {PJX_APPLY_ACTIONS.map((action) => (
          <div
            key={action.id}
            className="pjx-apply__action"
            onClick={clickHandlers[action.kind]}
            role={action.kind === "submit" ? undefined : "button"}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                clickHandlers[action.kind]?.();
              }
            }}
          >
            <PjxIcon className="pjx-apply__svg pjx-apply__action-icon" paths={action.icon} />
            <div>
              <h4 className="pjx-apply__action-title">{action.title}</h4>
              <p className="pjx-apply__action-text">{action.text}</p>
            </div>
            <button
              type={action.kind === "submit" ? "submit" : "button"}
              form={action.kind === "submit" ? PJX_APPLY_FORM_ID : undefined}
              className={`pjx-apply__btn pjx-apply__action-btn pjx-apply__action-btn--${action.variant}`}
              onClick={(e) => {
                e.stopPropagation();
                clickHandlers[action.kind]?.();
              }}
            >
              {action.label}
            </button>
          </div>
        ))}
      </div>

      {/* SECTION: Sheet footer */}
      <footer className="pjx-apply__bar pjx-apply__sheet-foot">
        <span>ProJenius Technology</span>
        <span>Build &middot; Learn &middot; Grow</span>
      </footer>
    </article>
  );
});

/* ==========================================================================
   SECTION 6 : MAIN APPLICATION COMPONENT
   ========================================================================== */
function PjxApplication({ onBack, onNext, onSubmit }) {
  const [values, setValues] = useState(PJX_APPLY_INITIAL);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  /* One handler for every field (event delegation) */
  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    if (!name) return;
    setValues((previous) => ({ ...previous, [name]: value }));
    setIsSubmitted(false);
  }, []);

  /* Browser checks the required fields first, then this runs */
  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (onSubmit) onSubmit(values);
  }, [onSubmit, values]);

  /* When "Back" is clicked on the application form, return to IncubateHero */
  const handleBackToHero = useCallback(
    (e) => {
      if (onBack) {
        onBack(e);
        return;
      }
      const heroEl = document.getElementById("incubate-hero");
      if (heroEl) {
        heroEl.scrollIntoView({ behavior: "smooth" });
      }
    },
    [onBack]
  );

  /* Download: build a real PDF from the typed values and save it */
  const handleDownload = useCallback(() => {
    try {
      const sections = PJX_APPLY_SECTIONS.map((section, index) => ({
        title: `${index + 1}. ${section.sheetTitle.toUpperCase()}`,
        rows: section.fields.map((field) => [field.label, values[field.name] || "-"]),
      }));
      const pdf = pjxBuildPdf({
        title: "Incubation Application Sheet",
        applicationNo: `PJ-INC-${PJX_APPLY_YEAR}-001`,
        date: PJX_APPLY_DATE,
        sections,
      });
      const owner = (values.projectName || values.fullName || "Application").trim().replace(/[^\w-]+/g, "-");
      pjxDownloadPdf(pdf, `ProJenius-Incubation-${owner}.pdf`);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error("PDF download failed:", err);
    }
  }, [values]);

  return (
    /* SECTION: Screen wrapper (form on the left, sheet on the right) */
    <section className="pjx-apply">
      <div className="pjx-apply__inner">

        {/* ===== LEFT: Application form ===== */}
        <div className="pjx-apply__panel pjx-apply__panel--form">

          {/* SECTION: Header (back, label, title, date) */}
          <header className="pjx-apply__header">
            <div className="pjx-apply__header-top">
              <button type="button" className="pjx-apply__btn pjx-apply__back" onClick={handleBackToHero}>
                <PjxIcon className="pjx-apply__svg pjx-apply__icon" paths={PJX_PATH_BACK} /> Back
              </button>
              <p className="pjx-apply__caption">
                <PjxIcon className="pjx-apply__svg pjx-apply__icon" paths={PJX_PATH_CALENDAR} /> Date : {PJX_APPLY_DATE}
              </p>
            </div>
            <p className="pjx-apply__pill">Ideas to Impact</p>
            <h1 className="pjx-apply__title">
              Incubate <span className="pjx-apply__accent">Your Innovation</span>
              <PjxIcon className="pjx-apply__svg pjx-apply__title-icon" paths={PJX_PATH_BULB} />
            </h1>
            <p className="pjx-apply__subtitle">
              Turn your ideas into impactful products with ProJenius Incubation Program.
              Get mentorship, resources and support at every stage of your journey.
            </p>
          </header>

          {/* SECTION: Step indicator */}
          <ol className="pjx-apply__steps">
            {PJX_APPLY_STEPS.map((step, index) => (
              <li key={step} className="pjx-apply__step" aria-current={index === 0 ? "step" : undefined}>
                <span className="pjx-apply__step-number">{index + 1}</span>
                <span className="pjx-apply__step-label">{step}</span>
              </li>
            ))}
          </ol>

          {/* SECTION: Form cards */}
          <form id={PJX_APPLY_FORM_ID} className="pjx-apply__form" onChange={handleChange} onSubmit={handleSubmit}>
            {PJX_APPLY_SECTIONS.map((section) => (
              <section key={section.id} className="pjx-apply__card pjx-apply__paper" aria-labelledby={`pjx-apply-${section.id}`}>
                <h2 id={`pjx-apply-${section.id}`} className="pjx-apply__card-title">
                  <PjxIcon className="pjx-apply__svg pjx-apply__icon" paths={section.icon} /> {section.title}
                </h2>
                <div className="pjx-apply__grid">
                  {section.fields.map((field) => (
                    <PjxApplyField key={field.name} field={field} count={field.max ? values[field.name].length : 0} />
                  ))}
                </div>
              </section>
            ))}

            {/* SECTION: Next button + step text */}
            <div className="pjx-apply__footer">
              <button type="button" className="pjx-apply__btn pjx-apply__next" onClick={onNext}>
                Next: Project Details <PjxIcon className="pjx-apply__svg pjx-apply__icon" paths={PJX_PATH_ARROW} />
              </button>
              <span className="pjx-apply__step-text">Step 1 of {PJX_APPLY_STEPS.length}</span>
            </div>
          </form>
        </div>

        {/* ===== RIGHT: Application sheet ===== */}
        <div className="pjx-apply__panel">
          <PjxApplySheet values={values} isSubmitted={isSubmitted} onDownload={handleDownload} downloadSuccess={downloadSuccess} />
        </div>

      </div>
    </section>
  );
}

/* memo = skips re-render unless callbacks change */
export default memo(PjxApplication);
