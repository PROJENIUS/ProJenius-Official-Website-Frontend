import {
  ArrowRight,
  Briefcase,
  CalendarCheck,
  CheckCircle2,
  FileText,
  Headphones,
  MessageSquare,
  MinusCircle,
  Target,
  XCircle,
} from "lucide-react";

import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import "./NotJustAnother.css";

/* =========================================================
   WHY PROJENIUS — comparison of learning on your own, online
   courses and ProJenius 1:1 mentorship. A real <table> (read
   correctly by screen readers); on phones each row becomes a
   card. Ends with the booking action instead of a score.
========================================================= */

const COLUMNS = [
  { key: "self", label: "Self-study", note: "Free videos & blogs" },
  { key: "course", label: "Online courses", note: "Recorded programs" },
  { key: "projenius", label: "ProJenius Mentorship", note: "1:1 with a mentor" },
];

const ROWS = [
  { title: "Personalized to your background", Icon: Target, self: "no", course: "no", projenius: "yes" },
  { title: "Live human feedback", Icon: MessageSquare, self: "no", course: "no", projenius: "yes" },
  { title: "Accountability & deadlines", Icon: CalendarCheck, self: "partial", course: "no", projenius: "yes" },
  { title: "Resume reviewed by a real person", Icon: FileText, self: "no", course: "no", projenius: "yes" },
  { title: "Direct placement support", Icon: Briefcase, self: "no", course: "no", projenius: "yes" },
  { title: "Access to a mentor for questions", Icon: Headphones, self: "no", course: "partial", projenius: "yes" },
];

const STATUS = {
  yes: { Icon: CheckCircle2, label: "Included" },
  partial: { Icon: MinusCircle, label: "Partly" },
  no: { Icon: XCircle, label: "Not included" },
};

function Status({ value }) {
  const { Icon, label } = STATUS[value];
  return (
    <span className={`njac-status njac-status--${value}`}>
      <Icon size={18} strokeWidth={2.2} aria-hidden="true" />
      {label}
    </span>
  );
}

export default function NotJustAnother() {
  return (
    <section id="not-just-another" className="njac-section" aria-labelledby="njac-title">
      <div className="njac-container">
        <header className="njac-header">
          <p className="pjds-eyebrow pjds-eyebrow--on-dark" data-reveal="up">Why ProJenius</p>
          <h2 id="njac-title" className="njac-title" data-reveal="up" data-reveal-delay="1">
            <span className="njac-title-static">Not Just Another</span>
            <TypedPhrase tone="dark" phrases={["Online Course", "Video Playlist", "Generic Program"]} />
          </h2>
          <p className="njac-intro" data-reveal="up" data-reveal-delay="2">
            Content alone rarely gets you hired. Mentorship adds the feedback, accountability and direction
            that turn your effort into a job offer.
          </p>
        </header>

        <div className="njac-card" data-reveal="up" data-reveal-delay="3">
          <table className="njac-table">
            <caption className="pjds-sr-only">
              What self-study, online courses and ProJenius mentorship include
            </caption>
            <thead>
              <tr>
                <th scope="col" className="njac-th-feature">What you get</th>
                {COLUMNS.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className={column.key === "projenius" ? "njac-th-pro" : undefined}
                  >
                    {column.key === "projenius" && <span className="njac-recommended">Recommended</span>}
                    <span className="njac-th-label">{column.label}</span>
                    <span className="njac-th-note">{column.note}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map(({ title, Icon, ...values }) => (
                <tr key={title}>
                  <th scope="row" className="njac-feature">
                    <span className="njac-feature-icon" aria-hidden="true"><Icon size={18} /></span>
                    {title}
                  </th>
                  {COLUMNS.map((column) => (
                    <td
                      key={column.key}
                      data-label={column.label}
                      className={column.key === "projenius" ? "njac-td-pro" : undefined}
                    >
                      <Status value={values[column.key]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="njac-footer">
            <p>
              <strong>Start with one 1:1 call.</strong> 30 minutes with a mentor, ₹99, fully refundable if
              you are not satisfied.
            </p>
            <a href="#book-call" className="njac-cta">
              Book a mentoring call <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
