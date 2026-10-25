import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, FileText, MessageCircle, Phone } from "lucide-react";

import "./V2Contact.css";

/* =============================================================================
   HOME V2 — TALK TO THE TEAM. Three real ways to start (the same WhatsApp
   number and phone as the footer), on one dark sheet.
   ============================================================================= */

const OPTIONS = [
  {
    id: "whatsapp",
    Icon: MessageCircle,
    title: "WhatsApp us",
    text: "Send a message, a photo or a voice note.",
    href: "https://wa.me/918925450473",
    external: true,
  },
  {
    id: "call",
    Icon: Phone,
    title: "+91 89254 50473",
    text: "Call the team directly.",
    href: "tel:+918925450473",
  },
  {
    id: "form",
    Icon: FileText,
    title: "Start a project",
    text: "Tell us what you need in a short form.",
    to: "/contact",
  },
];

export default function V2Contact() {
  return (
    <section className="v2-section v2c" aria-labelledby="v2c-title">
      <div className="v2-wrap">
        <div className="v2c__sheet" data-reveal="up">
          <div className="v2c__copy">
            <p className="v2-label v2c__label"><b>05</b> / Start here</p>
            <h2 id="v2c-title" className="v2c__title">
              Have something to build? <span>Talk to the team that will build it.</span>
            </h2>
          </div>

          <ul className="v2c__options">
            {OPTIONS.map(({ id, Icon, title, text, href, to, external }) => {
              const content = (
                <>
                  <span className="v2c__icon" aria-hidden="true"><Icon size={22} strokeWidth={2} /></span>
                  <span className="v2c__text">
                    <strong>{title}</strong>
                    <span>{text}</span>
                  </span>
                  {external ? <ArrowUpRight size={18} strokeWidth={2.2} aria-hidden="true" /> : <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />}
                </>
              );
              return (
                <li key={id}>
                  {to ? (
                    <Link className="v2c__option" to={to}>{content}</Link>
                  ) : (
                    <a className="v2c__option" href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{content}</a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
