import { useEffect, useRef, useState } from "react";

import TypedPhrase from "../../Common/TypedPhrase/TypedPhrase.jsx";

/* =============================================================================

   WHAT CAN WE HELP YOU WITH?

   -----------------------------------------------------------------------------

   Core enquiry hub of the Contact page: a 7-option selector (plus a "not sure"

   helper) followed by a form whose fields change based on the option chosen.

   It also reads ?type= and &from= from the URL so a matching contact URL lands

   with the right option already selected.

   Everything lives in ONE component file (config, icons, validation, field

   renderer) as plain local constants and functions. No inline styles: all

   styling comes from WhatCanWeHelpYouWith.css.

   ============================================================================= */

/* ===========================================================================

   CONFIG — backend endpoint

   ---------------------------------------------------------------------------

   Receives multipart/form-data: a "payload" JSON field plus an optional

   "attachment" file.

   =========================================================================== */

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const apiBaseUrl = (configuredApiBaseUrl || (import.meta.env.DEV ? "http://localhost:5000" : ""))
  .replace(/\/+$/, "");
const CONTACT_FORM_ENDPOINT = apiBaseUrl
  ? `${apiBaseUrl}/api/contact/enquiries`
  : "";

const MAX_FILE_SIZE_MB = 5;

/* ===========================================================================

   CONFIG — selection broadcast

   ---------------------------------------------------------------------------

   Whenever the chosen enquiry type changes, this section announces it with a

   browser event so other sections on the Contact page (e.g. "What Happens

   Next?") can react. The name must match the one in WhatHappensNext.jsx.

   =========================================================================== */

const ENQUIRY_CHANGE_EVENT = "pj-contact-enquiry-change";

/* Sent by the Contact hero's topic tiles ({ detail: { type } }) to select a type here. */
const ENQUIRY_REQUEST_EVENT = "pj-contact-enquiry-request";

/* ===========================================================================

   CONFIG — shared option lists and field definitions (written once, reused)

   =========================================================================== */

const TECH_AREAS = [

  "AI / ML",

  "IoT",

  "Robotics",

  "Embedded Systems",

  "Software Development",

  "UI/UX",

  "PCB / Electronics",

  "Other",

];

const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced", "Not Sure"];

const DOC_FILE = { accept: ".pdf,.doc,.docx", ext: ["pdf", "doc", "docx"], fmt: "PDF, DOC or DOCX" };

const ATTACH_FILE = {

  accept: ".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg",

  ext: ["pdf", "doc", "docx", "ppt", "pptx", "png", "jpg", "jpeg"],

  fmt: "PDF, DOC, DOCX, PPT, PPTX, PNG or JPG",

};

const FIELD_NAME = { id: "name", label: "Full name", type: "text", required: true, autoComplete: "name" };

const FIELD_EMAIL = { id: "email", label: "Email address", type: "email", required: true, autoComplete: "email" };

const FIELD_PHONE = {

  id: "phone",

  label: "Phone / WhatsApp number",

  type: "tel",

  required: true,

  placeholder: "e.g. 98765 43210",

};

const organisationField = (label, required = false) => ({ id: "organisation", label, type: "text", required });

const messageField = (label) => ({

  id: "message",

  label,

  type: "textarea",

  required: true,

  span: "full",

  minWords: 10,

  maxWords: 500,

  placeholder: "Please share a few details (10–500 words).",

});

/* The "Other" textbox: it only exists while "Other" is selected in its trigger

   field. Deselect Other (or pick another option in a dropdown) and it closes. */

const conditionalOtherField = (id, label, triggerId) => ({

  id,

  label,

  type: "text",

  required: true,

  span: "full",

  showWhen: { field: triggerId, includes: "Other" },

  minWords: 2,

  maxWords: 100,

  placeholder: "Please specify (2–100 words)",

});

const attachmentField = (label, fileConfig) => ({ id: "attachment", label, type: "file", span: "full", ...fileConfig });

const detailsSection = (...fields) => ({ title: "Your details", fields });

/* ===========================================================================

   CONFIG — the 7 enquiry types: label, icon, copy, and the fields shown once

   that type is selected. Single source of truth the component reads from.

   =========================================================================== */

const ENQUIRY_TYPES = {

  startup: {

    icon: "startup",

    label: "Startup & Innovation",

    description: "Have an idea, product, prototype, R&D or IP requirement?",

    heading: "Let\u2019s Talk About Your Idea.",

    support: "Tell us where you are in your idea or startup journey.",

    panelText:

      "Whether it\u2019s a rough idea or a working prototype, we\u2019ll help you work out what to build, test or protect next.",

    tips: [

      "Where you are today \u2014 idea, prototype or a running product",

      "The problem you\u2019re solving and who it\u2019s for",

      "The kind of support you\u2019re hoping for",

    ],

    note: "Please share only the information you are comfortable discussing at this stage.",

    privacyExtra: "Please avoid sharing confidential or patent-sensitive information in the initial enquiry.",

    sourceDefault: "startup-support",

    sections: [

      detailsSection(FIELD_NAME, FIELD_EMAIL, FIELD_PHONE, organisationField("Organisation / college")),

      {

        title: "About your idea",

        fields: [

          {

            id: "stage",

            label: "Current stage",

            type: "select",

            required: true,

            span: "full",

            options: ["Just an Idea", "Problem Identified", "Research / Validation", "Prototype", "MVP", "Existing Product", "Not Sure"],

          },

          {

            id: "support",

            label: "What kind of support are you looking for?",

            type: "multi",

            required: true,

            span: "full",

            options: ["Idea Validation", "Research & Development", "Prototype Development", "MVP Development", "Software / AI", "Patent / IP Support", "Other"],

          },

          conditionalOtherField("supportOther", "Please specify the kind of support you need", "support"),

          messageField("Tell us about your idea or requirement."),

          attachmentField("Attachment / document (optional)", ATTACH_FILE),

        ],

      },

    ],

  },

  development: {

    icon: "development",

    label: "Development",

    description: "Need software, AI, automation, hardware, a PCB or a prototype built?",

    heading: "Let\u2019s Discuss Your Requirement.",

    support: "Tell us what you\u2019re looking to build, improve or automate.",

    panelText:

      "From a first version to improving something that already exists \u2014 describe the outcome you want and we\u2019ll take it from there.",

    tips: ["What the product or system should do", "Who will use it", "Any timeline or constraints you already know"],

    sourceDefault: "development",

    sections: [

      detailsSection(FIELD_NAME, FIELD_EMAIL, FIELD_PHONE, organisationField("Organisation / company")),

      {

        title: "Your requirement",

        fields: [

          {

            id: "build",

            label: "What are you looking to build?",

            type: "multi",

            required: true,

            span: "full",

            options: ["Website / Web Application", "Mobile Application", "SaaS / Digital Platform", "AI / Machine Learning", "Automation", "UI / UX", "Hardware / Embedded Systems", "PCB Design & Fabrication", "Rapid Prototyping / 3D Printing", "Other"],

          },

          conditionalOtherField("buildOther", "Please specify what you want to build", "build"),

          {

            id: "product",

            label: "Is this a new product or an existing product?",

            type: "radio",

            required: true,

            span: "full",

            options: ["New Product", "Existing Product", "Not Sure"],

          },

          messageField("Tell us about your requirement."),

          {

            id: "timeline",

            label: "Expected timeline (optional)",

            type: "select",

            options: ["Within a month", "1\u20133 months", "3\u20136 months", "6+ months", "Flexible / Not sure"],

          },

          {

            id: "budget",

            label: "Budget range",

            type: "select",

            required: true,

            options: ["Under ₹15,000", "₹15,000–₹50,000", "₹50,000–₹2 lakh", "₹2–₹5 lakh", "₹5 lakh and above", "Prefer to discuss"],

          },

        ],

      },

    ],

  },

  workshop: {

    icon: "workshop",

    label: "Workshop",

    description: "Want to conduct a practical technology workshop for your institution?",

    heading: "Let\u2019s Plan Your Workshop.",

    support: "Tell us what your students or institution would like to explore.",

    panelText: "Hands-on sessions shaped around your students, your department and the time you have.",

    tips: ["The topic students want to explore", "Who the audience is and roughly how many", "Preferred format, dates and duration"],

    sourceDefault: "workshop",

    sections: [

      detailsSection(FIELD_NAME, organisationField("Institution / college", true), FIELD_EMAIL, FIELD_PHONE),

      {

        title: "Workshop plan",

        fields: [

          {

            id: "topic",

            label: "Workshop topic / technology",

            type: "multi",

            required: true,

            span: "full",

            options: ["AI / ML", "IoT", "Robotics", "Embedded Systems", "PCB / Electronics", "Software Development", "Innovation / Startup", "Other"],

          },

          conditionalOtherField("topicOther", "Please specify the workshop topic", "topic"),

          {

            id: "format",

            label: "Preferred workshop format",

            type: "radio",

            required: true,

            span: "full",

            options: ["One-Day Workshop", "Hands-On Bootcamp", "Department Workshop", "Institution / Club Workshop", "Not Sure"],

          },

          { id: "date", label: "Preferred date", type: "date" },

          { id: "participants", label: "Expected participants (optional)", type: "number", placeholder: "e.g. 60" },

          messageField("Tell us about your workshop requirement."),

        ],

      },

    ],

  },

  course: {

    icon: "course",

    label: "Courses & Learning",

    description: "Looking to learn a technology or build practical skills?",

    heading: "Let\u2019s Find the Right Learning Path.",

    support: "Tell us what you want to learn and where you are starting from.",

    panelText: "No prior experience needed \u2014 tell us where you are and we\u2019ll point you to a sensible starting point.",

    tips: [

      "The technology or skill you want to learn",

      "Your current level, even if it\u2019s \u201Cjust starting\u201D",

      "Online or offline, whichever suits you",

    ],

    sourceDefault: "courses",

    sections: [

      detailsSection(FIELD_NAME, FIELD_EMAIL, FIELD_PHONE, organisationField("College / organisation")),

      {

        title: "What you want to learn",

        fields: [

          { id: "area", label: "Interested area", type: "select", required: true, span: "full", options: TECH_AREAS },

          conditionalOtherField("areaOther", "Please specify your interested area", "area"),

          { id: "level", label: "Current skill level", type: "radio", required: true, span: "full", options: SKILL_LEVELS },

          { id: "mode", label: "Preferred learning mode", type: "radio", required: true, span: "full", options: ["Online", "Offline", "Not Sure"] },

          messageField("What are you looking to learn?"),

        ],

      },

    ],

  },

  internship: {

    icon: "internship",

    label: "Internship",

    description: "Interested in gaining practical industry or project experience?",

    heading: "Let\u2019s Talk About Your Internship.",

    support: "Tell us about your academic background and area of interest.",

    panelText: "Practical project experience for students \u2014 share your background and what you\u2019d like to work on.",

    tips: ["Your college, department and current year", "The area you\u2019d like to work in", "Your resume, if you have one handy"],

    sourceDefault: "internship",

    sections: [

      detailsSection(

        FIELD_NAME,

        FIELD_EMAIL,

        FIELD_PHONE,

        organisationField("College / institution", true),

        { id: "department", label: "Department", type: "text", required: true },

        {

          id: "year",

          label: "Current year",

          type: "select",

          required: true,

          options: ["1st year", "2nd year", "3rd year", "4th year", "Final-year / Graduated"],

        }

      ),

      {

        title: "About your interest",

        fields: [

          { id: "area", label: "Area of interest", type: "select", required: true, options: TECH_AREAS },

          { id: "skills", label: "Current skills", type: "text", placeholder: "e.g. Python, Arduino, React" },

          conditionalOtherField("areaOther", "Please specify your interested area", "area"),

          {

            id: "preference",

            label: "Internship preference",

            type: "radio",

            span: "full",

            options: ["Project-based", "Technical Internship", "Research / R&D", "Not Sure"],

          },

          messageField("Tell us about your interest and what you\u2019d like to work on."),

          attachmentField("Resume (optional)", DOC_FILE),

        ],

      },

    ],

  },

  career: {

    icon: "career",

    label: "Join Our Team",

    description: "Interested in working, interning or collaborating with ProJenius?",

    heading: "Build the Future With ProJenius.",

    support: "Tell us about your skills, interests and how you would like to contribute.",

    panelText:

      "We welcome motivated people who want to build practical solutions, learn by doing and contribute to meaningful projects.",

    tips: [

      "What you\u2019re studying or doing right now",

      "What you\u2019re curious about or aiming for",

      "Any deadlines \u2014 placements, admissions, exams",

    ],

    sourceDefault: "join-our-team",

    sections: [

      detailsSection(FIELD_NAME, FIELD_EMAIL, FIELD_PHONE, organisationField("College / organisation")),

      {

        title: "Your application",

        fields: [

          { id: "area", label: "Area of interest", type: "select", required: true, options: TECH_AREAS },

          { id: "level", label: "Experience level", type: "select", required: true, options: SKILL_LEVELS },

          conditionalOtherField("areaOther", "Please specify your interested area", "area"),

          {

            id: "roleInterest",

            label: "Area you would like to contribute to",

            type: "multi",

            span: "full",

            options: ["Software / AI", "IoT / Robotics", "Research & Development", "Design / UI/UX", "Business / Partnerships", "Internship", "Other"],

          },

          conditionalOtherField("roleInterestOther", "Please specify where you would like to contribute", "roleInterest"),

          {

            id: "motivation",

            label: "Why would you like to join ProJenius?",

            type: "textarea",

            required: true,

            span: "full",

            minWords: 20,

            maxWords: 300,

            placeholder: "Tell us about your motivation (20–300 words).",

          },

          { ...attachmentField("Resume (required)", DOC_FILE), required: true },

        ],

      },

    ],

  },

  general: {

    icon: "general",

    label: "Partnership / General",

    description: "Interested in collaboration, institutional partnerships or something else?",

    heading: "Let\u2019s Start a Conversation.",

    support: "Tell us what you would like to discuss with ProJenius.",

    panelText:

      "Partnerships, collaborations or a question that doesn\u2019t fit elsewhere \u2014 start here and we\u2019ll route it to the right team.",

    tips: ["Who you are and the organisation you represent", "What you\u2019d like to explore together"],

    sourceDefault: "general",

    sections: [

      detailsSection(FIELD_NAME, FIELD_EMAIL, FIELD_PHONE, organisationField("Organisation")),

      {

        title: "Your enquiry",

        fields: [

          {

            id: "enquiry",

            label: "Enquiry type",

            type: "select",

            required: true,

            span: "full",

            options: ["Institutional Collaboration", "Industry Partnership", "Academic Collaboration", "Startup Collaboration", "General Enquiry", "Other"],

          },

          conditionalOtherField("enquiryOther", "Please specify your enquiry type", "enquiry"),

          messageField("Tell us what you would like to discuss."),

          attachmentField("Attachment (optional)", ATTACH_FILE),

        ],

      },

    ],

  },

};

const ENQUIRY_ORDER = ["startup", "development", "workshop", "course", "internship", "career", "general"];

/* Extra URL values that map onto a type, e.g. /contact?type=courses */

const TYPE_ALIASES = {

  courses: "course",

  learning: "course",

  "startup-support": "startup",

  "career-guidance": "career",

  "join-our-team": "career",

  partnership: "general",

  workshops: "workshop",

};

/* ===========================================================================

   ICONS — small inline SVG set used only by this component

   =========================================================================== */

const HELP_ICON_PATHS = {

  startup: <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.4 1.1 2.2h5c0-.8.4-1.6 1.1-2.2A6 6 0 0 0 12 3z" />,

  development: <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />,

  workshop: <path d="M3 4h18v11H3zM7 8.5h5M7 11.5h8M12 15v3M8 21l4-3 4 3" />,

  course: <path d="M2 5h6a4 4 0 0 1 4 4v11a3 3 0 0 0-3-3H2zM22 5h-6a4 4 0 0 0-4 4v11a3 3 0 0 1 3-3h7z" />,

  internship: <path d="M2 7h20v14H2zM16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M2 13h20" />,

  career: <path d="M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19zM16.2 7.8l-2.1 6.3-6.3 2.1 2.1-6.3z" />,

  general: <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,

  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,

  down: <path d="M12 5v14M6 13l6 6 6-6" />,

};

function HelpIcon({ name }) {

  return (

    <svg

      className="pj-contact-help__icon"

      viewBox="0 0 24 24"

      fill="none"

      stroke="currentColor"

      strokeWidth="1.8"

      strokeLinecap="round"

      strokeLinejoin="round"

      aria-hidden="true"

      focusable="false"

    >

      {HELP_ICON_PATHS[name]}

    </svg>

  );

}

/* ===========================================================================

   VALIDATION — plain functions, local to this file

   =========================================================================== */

function isFieldEmpty(value) {

  return Array.isArray(value) ? value.length === 0 : !String(value || "").trim();

}

function countWords(value) {

  return String(value || "").trim().split(/\s+/).filter(Boolean).length;

}

/* A field with showWhen only appears (and is only validated) when its trigger

   field currently has the matching value selected. */

function isFieldVisible(field, formValues) {

  if (!field.showWhen) return true;

  const triggerValue = formValues[field.showWhen.field];

  return Array.isArray(triggerValue)

    ? triggerValue.includes(field.showWhen.includes)

    : triggerValue === field.showWhen.includes;

}

function validateField(field, value, file) {
  if (field.type === "file") {
    if (!file) return field.required ? `${field.label.replace(" (required)", "")} is required.` : "";

    const extension = (file.name.split(".").pop() || "").toLowerCase();
    if (!field.ext.includes(extension)) return `Please upload a ${field.fmt} file.`;
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `That file is larger than ${MAX_FILE_SIZE_MB} MB.`;
    }
    return "";
  }

  if (isFieldEmpty(value)) {
    if (!field.required) return "";
    return field.type === "select" ? "Choose an option." : `${field.label.replace(" (optional)", "")} is required.`;
  }

  const stringValue = String(value).trim();
  if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(stringValue)) {
    return "Enter a valid email address.";
  }

  if (field.type === "tel") {
    const cleanedPhone = stringValue.replace(/[\s().-]/g, "");
    const isIndianNumber = /^(?:\+91|91|0)?[6-9]\d{9}$/.test(cleanedPhone);
    const isInternationalNumber = /^\+\d{7,15}$/.test(cleanedPhone);
    if (!isIndianNumber && !isInternationalNumber) return "Enter a valid phone number.";
  }

  if (field.minWords || field.maxWords) {
    const words = countWords(stringValue);
    if (field.minWords && words < field.minWords) {
      return `Please write at least ${field.minWords} words (you have ${words}).`;
    }
    if (field.maxWords && words > field.maxWords) {
      return `Please keep it within ${field.maxWords} words (you have ${words}).`;
    }
  }

  if (field.minLength && stringValue.length < field.minLength) {
    return `Please enter at least ${field.minLength} characters.`;
  }
  return "";
}
/* ===========================================================================

   PAYLOAD — turns the current form state into the object sent to the backend

   =========================================================================== */

const CORE_FIELD_IDS = ["name", "email", "phone", "organisation", "city", "message"];

function buildSubmissionPayload({ enquiryType, sourcePage, allFields, formValues, formFiles }) {

  const payload = {

    enquiryType,

    sourcePage,

    name: "",

    email: "",

    phone: "",

    organisation: "",

    city: "",

    message: "",

    enquirySpecificFields: {},

    attachment: null,

    timestamp: new Date().toISOString(),

  };

  allFields.forEach((field) => {

    if (field.type === "file") {

      const file = formFiles[field.id];

      if (file) payload.attachment = { field: field.id, name: file.name, size: file.size };

      return;

    }

    const raw = formValues[field.id];

    const value = field.type === "multi" ? (Array.isArray(raw) ? raw : []) : String(raw || "").trim();

    const hasValue = Array.isArray(value) ? value.length > 0 : Boolean(value);

    if (CORE_FIELD_IDS.includes(field.id)) payload[field.id] = value;

    else if (hasValue) payload.enquirySpecificFields[field.id] = value;

  });

  return payload;

}

/* ===========================================================================

   CONTACT RESPONSE HELPERS

   =========================================================================== */

function findReferenceId(responseData) {

  const pending = [responseData];

  for (let index = 0; index < pending.length; index += 1) {

    const current = pending[index];

    if (!current || typeof current !== "object") continue;

    for (const [key, value] of Object.entries(current)) {

      if (/(?:reference|^ref(?:$|[_-]?(?:id|no|number|code)$))/i.test(key)) {

        if ((typeof value === "string" || typeof value === "number") && String(value).trim()) {

          return String(value).trim();

        }

      }

      if (value && typeof value === "object") pending.push(value);

    }

  }

  return "";

}

/* ===========================================================================

   FIELD RENDERER — one function that draws whichever field type is passed in.

   Shared pieces (required mark, error line) are written once and reused.

   =========================================================================== */

function renderFieldError(error, errorId) {

  if (!error) return null;

  return (

    <p className="pj-contact-help__field-error" id={errorId} role="alert">

      {error}

    </p>

  );

}

function renderFormField({ field, value, fileValue, error, onChange, onFileChange }) {

  const fieldId = `pj-contact-field-${field.id}`;

  const errorId = `${fieldId}-error`;

  const describedBy = error ? errorId : undefined;

  const invalid = error ? "true" : undefined;

  const label = (

    <>

      {field.label}

      {field.required && (

        <span className="pj-contact-help__required" aria-hidden="true">

          {" *"}

        </span>

      )}

    </>

  );

  /* ---- radio / multi-select (shared "chip" control) ---- */

  if (field.type === "radio" || field.type === "multi") {

    const isMulti = field.type === "multi";

    const selectedValues = isMulti ? (Array.isArray(value) ? value : []) : value ? [value] : [];

    // Multi-select chips toggle independently; "Other" does not clear peers.

    const toggleOption = (option) => {

      if (!isMulti) {

        onChange(option);

        return;

      }

      onChange(

        selectedValues.includes(option)

          ? selectedValues.filter((item) => item !== option)

          : [...selectedValues, option]

      );

    };

    return (

      <fieldset className="pj-contact-help__fieldset" aria-required={field.required ? "true" : undefined} aria-invalid={invalid} aria-describedby={describedBy}>

        <legend className="pj-contact-help__label">{label}</legend>

        <div className="pj-contact-help__chip-group">

          {field.options.map((option) => (

            <label className="pj-contact-help__chip" key={option}>

              <input

                className="pj-contact-help__chip-input"

                type={isMulti ? "checkbox" : "radio"}

                name={field.id}

                value={option}

                checked={selectedValues.includes(option)}

                onChange={() => toggleOption(option)}

              />

              <span className="pj-contact-help__chip-box">{option}</span>

            </label>

          ))}

        </div>

        {renderFieldError(error, errorId)}

      </fieldset>

    );

  }

  /* ---- file upload ---- */

  if (field.type === "file") {

    return (

      <div className="pj-contact-help__upload">

        <span className="pj-contact-help__label" id={`${fieldId}-label`}>

          {field.label}

        </span>

        <div className="pj-contact-help__upload-row">

          <input

            key={fileValue ? `${fieldId}-${fileValue.name}-${fileValue.size}` : `${fieldId}-empty`}

            className="pj-contact-help__upload-input"

            type="file"

            id={fieldId}

            accept={field.accept}

            aria-labelledby={`${fieldId}-label`}

            aria-describedby={describedBy}

            aria-invalid={invalid}

            onChange={(event) => onFileChange(event.target.files ? event.target.files[0] : null)}

          />

          <label className="pj-contact-help__upload-button" htmlFor={fieldId}>

            Choose File

          </label>

          <span className="pj-contact-help__upload-hint">

            {field.fmt} · up to {MAX_FILE_SIZE_MB} MB

          </span>

        </div>

        {fileValue && (

          <div className="pj-contact-help__upload-chip">

            <span className="pj-contact-help__upload-name">{fileValue.name}</span>

            <button

              type="button"

              className="pj-contact-help__upload-remove"

              onClick={() => onFileChange(null)}

              aria-label={`Remove ${fileValue.name}`}

            >

              Remove

            </button>

          </div>

        )}

        {renderFieldError(error, errorId)}

        <p className="pj-contact-help__upload-privacy">
          Files you upload will be used by ProJenius to review your enquiry or application and respond to you. Please upload only files relevant to your submission.
        </p>

      </div>

    );

  }

  /* ---- select / textarea / plain inputs (share label + error markup) ---- */

  let control;

  if (field.type === "select") {

    control = (

      <select

        className="pj-contact-help__input pj-contact-help__input--select"

        id={fieldId}

        value={value || ""}

        required={field.required}

        aria-invalid={invalid}

        aria-describedby={describedBy}

        onChange={(event) => onChange(event.target.value)}

      >

        <option value="">{field.placeholder || "Select…"}</option>

        {field.options.map((option) => (

          <option value={option} key={option}>

            {option}

          </option>

        ))}

      </select>

    );

  } else if (field.type === "textarea") {

    control = (

      <textarea

        className="pj-contact-help__input pj-contact-help__input--textarea"

        id={fieldId}

        rows={4}

        value={value || ""}

        required={field.required}

        placeholder={field.placeholder}

        aria-invalid={invalid}

        aria-describedby={describedBy}

        onChange={(event) => onChange(event.target.value)}

      />

    );

  } else {

    control = (

      <input

        className="pj-contact-help__input"

        type={field.type}

        id={fieldId}

        value={value || ""}

        required={field.required}

        placeholder={field.placeholder}

        autoComplete={field.autoComplete}

        /* The "Other" box opens on a click, so put the cursor straight in it. */

        autoFocus={Boolean(field.showWhen)}

        aria-invalid={invalid}

        aria-describedby={describedBy}

        onChange={(event) => onChange(event.target.value)}

      />

    );

  }

  const showWordCount = Boolean(field.minWords || field.maxWords);

  const wordTotal = showWordCount ? countWords(value) : 0;

  const overLimit = showWordCount && field.maxWords && wordTotal > field.maxWords;

  return (

    <div>

      <label className="pj-contact-help__label" htmlFor={fieldId}>

        {label}

      </label>

      {control}

      {showWordCount && (

        <p className={`pj-contact-help__word-count${overLimit ? " pj-contact-help__word-count--over" : ""}`}>

          {wordTotal}

          {field.maxWords ? ` / ${field.maxWords}` : ""} words

          {field.minWords ? ` (min ${field.minWords})` : ""}

        </p>

      )}

      {renderFieldError(error, errorId)}

    </div>

  );

}

/* =============================================================================

   MAIN COMPONENT

   ============================================================================= */

const WhatCanWeHelpYouWith = () => {

  /* ---- state: kept to what the form genuinely needs ---- */

  const [selectedType, setSelectedType] = useState(null);

  const [sourcePage, setSourcePage] = useState("contact");

  const [arrivedFromLink, setArrivedFromLink] = useState(false);

  const [formValues, setFormValues] = useState({});

  const [formFiles, setFormFiles] = useState({});

  const [formErrors, setFormErrors] = useState({});

  const [submitStatus, setSubmitStatus] = useState("idle"); // idle | submitting | success | error

  const [submissionReference, setSubmissionReference] = useState("");

  const [submissionError, setSubmissionError] = useState("");

  const submissionInProgress = useRef(false);

  const cardGridRef = useRef(null);

  const formAreaRef = useRef(null);

  const focusedLinkedEnquiryRef = useRef(false);

  /* Read ?type= and &from= once on mount so a matching contact URL can

     preselect the relevant enquiry type when those parameters are present. */

  useEffect(() => {

    const params = new URLSearchParams(window.location.search);

    const rawType = (params.get("type") || "").toLowerCase().trim();

    const resolvedType = TYPE_ALIASES[rawType] || rawType;

    if (Object.prototype.hasOwnProperty.call(ENQUIRY_TYPES, resolvedType)) {

      setSelectedType(resolvedType);

      setArrivedFromLink(true);

      setSourcePage(params.get("from") || ENQUIRY_TYPES[resolvedType].sourceDefault);

    }

  }, []);

  /* Tell the rest of the page which enquiry type is selected (null = none). */

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent(ENQUIRY_CHANGE_EVENT, {
        detail: { type: selectedType },
      })
    );
  }, [selectedType]);

  const activeType = selectedType ? ENQUIRY_TYPES[selectedType] : null;

  /* A CTA link can preselect an enquiry type and take the visitor straight to
     the first field. Keep this behavior exclusive to linked arrivals. */
  useEffect(() => {

    if (!arrivedFromLink || !activeType || focusedLinkedEnquiryRef.current) return;

    focusedLinkedEnquiryRef.current = true;

    const frame = requestAnimationFrame(() => {

      const firstControl = formAreaRef.current?.querySelector(
        'input:not([type="hidden"]):not([disabled]), textarea:not([disabled]), select:not([disabled])'
      );

      if (!firstControl) return;

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      firstControl.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "center",
      });
      firstControl.focus({ preventScroll: true });

    });

    return () => cancelAnimationFrame(frame);

  }, [arrivedFromLink, activeType]);

  /* ---- handlers ---- */

  const handleSelectType = (key) => {

    if (key !== selectedType) {

      // Different type = different fields, so start with a clean form.

      setFormValues({});

      setFormFiles({});

    }

    setSelectedType(key);

    setFormErrors({});

    setSubmitStatus("idle");

  };

  /* The hero's topic tiles select a type through ENQUIRY_REQUEST_EVENT. The
     ref always holds the latest handler, so the listener is added only once. */
  const selectTypeRef = useRef(handleSelectType);

  useEffect(() => {
    selectTypeRef.current = handleSelectType;
  });

  useEffect(() => {
    const handleRequest = (event) => {
      const key = event.detail && event.detail.type;
      if (Object.prototype.hasOwnProperty.call(ENQUIRY_TYPES, key)) selectTypeRef.current(key);
    };
    window.addEventListener(ENQUIRY_REQUEST_EVENT, handleRequest);
    return () => window.removeEventListener(ENQUIRY_REQUEST_EVENT, handleRequest);
  }, []);

  const handleChangeType = () => {

    setSelectedType(null);

    setFormValues({});

    setFormFiles({});

    setFormErrors({});

    setSubmitStatus("idle");

  };

  const handleFieldChange = (fieldId, value) => {

    // When "Other" gets deselected, its textbox closes: forget what was typed

    // in it (and any error) so it can't be required or submitted.

    const nextValues = { ...formValues, [fieldId]: value };

    const hiddenIds = activeType

      ? activeType.sections

          .flatMap((section) => section.fields)

          .filter((field) => field.showWhen && field.showWhen.field === fieldId && !isFieldVisible(field, nextValues))

          .map((field) => field.id)

      : [];

    setFormValues((previous) => {

      const next = { ...previous, [fieldId]: value };

      hiddenIds.forEach((id) => delete next[id]);

      return next;

    });

    setFormErrors((previous) => {

      const next = { ...previous };

      if (next[fieldId]) next[fieldId] = "";

      hiddenIds.forEach((id) => delete next[id]);

      return next;

    });

  };

  const handleFileChange = (fieldId, file, fieldDefinition) => {

    if (!file) {

      setFormFiles((previous) => {

        const next = { ...previous };

        delete next[fieldId];

        return next;

      });

      setFormErrors((previous) => ({ ...previous, [fieldId]: "" }));

      return;

    }

    const problem = validateField(fieldDefinition, null, file);

    if (problem) {

      setFormErrors((previous) => ({ ...previous, [fieldId]: problem }));

      return;

    }

    setFormErrors((previous) => ({ ...previous, [fieldId]: "" }));

    setFormFiles((previous) => ({ ...previous, [fieldId]: file }));

  };

  /* -------------------------------------------------------------------------

     CONTACT FORM SUBMISSION

     ------------------------------------------------------------------------- */

  const handleSubmit = async (event) => {

    event.preventDefault();

    // Prevent accidental duplicate submissions while one is already in flight.

    if (submissionInProgress.current || submitStatus === "submitting") return;

    const allFields = activeType.sections

      .flatMap((section) => section.fields)

      .filter((field) => isFieldVisible(field, formValues));

    const nextErrors = {};

    allFields.forEach((field) => {

      const message = validateField(field, formValues[field.id], formFiles[field.id]);

      if (message) nextErrors[field.id] = message;

    });

    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const firstInvalidField = allFields.find((field) => nextErrors[field.id]);
      const fieldId = `pj-contact-field-${firstInvalidField.id}`;

      requestAnimationFrame(() => {
        const control = document.getElementById(fieldId)
          || document.querySelector(`input[name="${firstInvalidField.id}"]`);
        const fieldBox = control?.closest(".pj-contact-help__field--invalid");
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        fieldBox?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" });
        control?.focus({ preventScroll: true });
      });

      return;
    }

    submissionInProgress.current = true;
    setSubmitStatus("submitting");

    try {

      if (!CONTACT_FORM_ENDPOINT) {

        throw new Error("The enquiry service is not configured yet. Please try again later.");

      }

      const payload = buildSubmissionPayload({

        enquiryType: selectedType,

        sourcePage,

        allFields,

        formValues,

        formFiles,

      });

      const body = new FormData();

      body.append("payload", JSON.stringify(payload));

      const fileField = allFields.find((field) => field.type === "file" && formFiles[field.id]);

      if (fileField) body.append("attachment", formFiles[fileField.id], formFiles[fileField.id].name);

      // Frontend validation above is a usability aid only — the backend must

      // independently validate and sanitise everything it receives here.

      const response = await fetch(CONTACT_FORM_ENDPOINT, { method: "POST", body });

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          typeof responseData?.error === "string"
            ? responseData.error
            : "We could not submit your application. Please check the form and try again."
        );
      }

      setSubmissionReference(findReferenceId(responseData));
      setSubmissionError("");
      setSubmitStatus("success");

    } catch (error) {

      setSubmissionError(
        error instanceof Error && error.message !== "SUBMISSION_FAILED"
          ? error.message
          : "We could not submit your application. Please check the form and try again."
      );

      setSubmitStatus("error");

    } finally {

      submissionInProgress.current = false;

    }

  };

  const handleDismissFailure = () => {

    setSubmitStatus("idle");

    setSubmissionError("");

  };

  const handleDismissSuccess = () => {

    setSubmitStatus("idle");

    setSelectedType(null);

    setFormValues({});

    setFormFiles({});

    setFormErrors({});

    setSubmissionReference("");

    requestAnimationFrame(() => {

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      cardGridRef.current?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });

    });

  };

  return (

    <section

      className="pj-contact-help"

      id="pj-contact-help"

      data-enquiry-type={selectedType || ""}

      aria-labelledby="pj-contact-help-title"

    >

      <div className="pj-contact-help__content">
        {submitStatus === "submitting" && (<div
          className="pj-contact-help__loading-overlay"
          role="status"
          aria-live="polite"
          aria-label="Submitting your enquiry"
        >
          <div className="pj-contact-help__loading-card">
            <div className="pj-contact-help__loading-circles" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <h3 className="pj-contact-help__loading-title">Submitting Your Enquiry</h3>
            <p className="pj-contact-help__loading-text">
              Please wait while we securely save your details.
            </p>
          </div>
        </div>
        )}

        {/* ===== HEADER ===== */}

        <header className="pj-contact-help__header">

          <p className="pjds-eyebrow" data-reveal="up">Start an Enquiry</p>

          <h2 className="pj-contact-help__title" id="pj-contact-help-title" data-reveal="up" data-reveal-delay="1">

            <span className="pj-contact-help__title-static">What Can We</span>

            <TypedPhrase phrases={["Help You With?", "Build for You?", "Plan Together?"]} />

          </h2>

          <p className="pj-contact-help__description" id="pj-contact-help-choose" data-reveal="up" data-reveal-delay="2">
            Choose what you would like to discuss with ProJenius.
          </p>

        </header>

        {/* ===== ENQUIRY TYPE SELECTOR ===== */}

        <div ref={cardGridRef} className="pj-contact-help__grid" role="radiogroup" aria-labelledby="pj-contact-help-choose">

          {ENQUIRY_ORDER.map((key) => {

            const type = ENQUIRY_TYPES[key];

            return (

              <label className="pj-contact-help__card" key={key}>

                <input

                  className="pj-contact-help__card-input"

                  type="radio"

                  name="pj-contact-enquiry-type"

                  value={key}

                  checked={selectedType === key}

                  onChange={() => handleSelectType(key)}

                />

                <span className="pj-contact-help__card-box">

                  <span className="pj-contact-help__card-icon">

                    <HelpIcon name={type.icon} />

                  </span>

                  <span className="pj-contact-help__card-title">{type.label}</span>

                  <span className="pj-contact-help__card-desc">{type.description}</span>

                  <span className="pj-contact-help__card-check" aria-hidden="true">

                    <HelpIcon name="check" />

                  </span>

                </span>

              </label>

            );

          })}

          <div className="pj-contact-help__assist">

            <div>

              <h3 className="pj-contact-help__assist-title">Not sure which option fits?</h3>

              <p className="pj-contact-help__assist-text">

                That’s okay. Choose General Enquiry and tell us what you’re looking for. We’ll help direct you to the

                right ProJenius team or pathway.

              </p>

            </div>

            <button type="button" className="pj-contact-help__assist-button" onClick={() => handleSelectType("general")}>

              General Enquiry

            </button>

          </div>

        </div>

        {/* ===== EMPTY STATE (hidden after success) ===== */}

        {submitStatus !== "success" && (

          <div

            className={`pj-contact-help__empty-state${activeType ? " pj-contact-help__empty-state--active" : ""}`}

            role="status"

          >

            <span className="pj-contact-help__empty-icon" aria-hidden="true">

              <HelpIcon name="down" />

            </span>

            <p className="pj-contact-help__empty-text">

              {activeType

                ? `Questions for ${activeType.label} appear below.`

                : "Pick an option above and the right questions will appear here."}

            </p>

          </div>

        )}

        {/* ===== DYNAMIC FORM AREA ===== */}

        {activeType && submitStatus !== "success" && (

          <div className="pj-contact-help__form-area" ref={formAreaRef}>

            {/* context / helper panel */}

            <aside className="pj-contact-help__panel" aria-label="About this enquiry type">

              <span className="pj-contact-help__panel-icon">

                <HelpIcon name={activeType.icon} />

              </span>

              <h3 className="pj-contact-help__panel-title">{activeType.label}</h3>

              <p className="pj-contact-help__panel-text">{activeType.panelText}</p>

              <ul className="pj-contact-help__panel-list">

                {activeType.tips.map((tip) => (

                  <li className="pj-contact-help__panel-item" key={tip}>

                    <HelpIcon name="check" />

                    <span>{tip}</span>

                  </li>

                ))}

              </ul>

            </aside>

            {/* the actual form */}

            <div className="pj-contact-help__card-form">

              <div className="pj-contact-help__context">

                <span className="pj-contact-help__context-icon">

                  <HelpIcon name={activeType.icon} />

                </span>

                <span className="pj-contact-help__context-text">

                  <span className="pj-contact-help__context-label">

                    {arrivedFromLink ? "Your enquiry" : "You\u2019re contacting us about"}

                  </span>

                  <span className="pj-contact-help__context-value">{activeType.label}</span>

                </span>

                <button type="button" className="pj-contact-help__context-change" onClick={handleChangeType}>

                  Change enquiry type

                </button>

              </div>

              <h3 className="pj-contact-help__form-heading">{activeType.heading}</h3>

              <p className="pj-contact-help__form-support">{activeType.support}</p>

              {activeType.note && <p className="pj-contact-help__form-note">{activeType.note}</p>}

              <form className="pj-contact-help__form" onSubmit={handleSubmit} noValidate>

                {activeType.sections.map((section) => (

                  <div className="pj-contact-help__section" key={section.title}>

                    <h4 className="pj-contact-help__section-title">{section.title}</h4>

                    <div className="pj-contact-help__fields">

                      {section.fields

                        .filter((field) => isFieldVisible(field, formValues))

                        .map((field) => (

                          <div

                            className={[

                              "pj-contact-help__field",

                              field.span === "full" ? "pj-contact-help__field--full" : "",

                              field.showWhen ? "pj-contact-help__field--conditional" : "",

                              formErrors[field.id] ? "pj-contact-help__field--invalid" : "",

                            ]

                              .filter(Boolean)

                              .join(" ")}

                            key={field.id}

                          >

                            {renderFormField({

                              field,

                              value: formValues[field.id],

                              fileValue: formFiles[field.id],

                              error: formErrors[field.id],

                              onChange: (value) => handleFieldChange(field.id, value),

                              onFileChange: (file) => handleFileChange(field.id, file, field),

                            })}

                          </div>

                        ))}

                    </div>

                  </div>

                ))}

                <div className="pj-contact-help__submit-row">

                  <p className="pj-contact-help__privacy">

                    Your information will be used only to respond to your enquiry.

                    {activeType.privacyExtra ? ` ${activeType.privacyExtra}` : ""}

                  </p>

                  <button type="submit" className="pj-contact-help__submit-button" disabled={submitStatus === "submitting"}>

                    {submitStatus === "submitting" ? "Sending\u2026" : "Send Enquiry"}

                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

        {/* -----------------------------------------------------------------
            CONTACT SUBMISSION RESULT POPUPS
            ----------------------------------------------------------------- */}
        {(submitStatus === "success" || submitStatus === "error") && (
          <div className={`pj-contact-help__result-overlay pj-contact-help__result-overlay--${submitStatus}`}>
            <div className={`pj-contact-help__result-card${submitStatus === "error" ? " pj-contact-help__result-card--error" : ""}`} role="dialog" aria-modal="true" aria-labelledby="pj-contact-help-result-title">
              {submitStatus === "success" ? (
                <>
                  <span className="pj-contact-help__success-icon" aria-hidden="true"><HelpIcon name="check" /></span>
                  <h3 className="pj-contact-help__success-title" id="pj-contact-help-result-title">Enquiry submitted</h3>
                  <p className="pj-contact-help__success-text">Your enquiry has been submitted successfully. Our team will contact you soon.</p>
                  {submissionReference && (
                    <p className="pj-contact-help__reference">Reference ID: <strong>{submissionReference}</strong></p>
                  )}
                  <div className="pj-contact-help__success-actions">
                    <button type="button" className="pj-contact-help__success-primary" onClick={handleDismissSuccess} autoFocus>Close</button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="pj-contact-help__error-title" id="pj-contact-help-result-title">We couldn’t submit your enquiry. Your details are still here—please try again.</h3>
                  {submissionError && (
                    <p className="pj-contact-help__error-message" role="alert">{submissionError}</p>
                  )}
                  <div className="pj-contact-help__success-actions">
                    <button type="button" className="pj-contact-help__success-secondary" onClick={handleDismissFailure} autoFocus>Close and try again</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

      </div>

    </section>

  );

};

export default WhatCanWeHelpYouWith;
