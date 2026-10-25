import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, FileText, MessageCircle, Phone } from "lucide-react";

import useSectionProgress from "../useSectionProgress.js";
import { WHO_WE_ARE_STATS } from "../../Home/WhoWeAre/whoWeAreConfig.js";
import "./B3Final.css";

/* =============================================================================
   HOME V3 — FINAL CALL
   The figures already published on the homepage (whoWeAreConfig.js) and the
   Google rating, then a giant outlined line that fills with light as it
   scrolls through the viewport, then the three real ways to start fade in
   beneath it.
   ============================================================================= */

const GOOGLE_PROFILE_URL = "https://www.google.com/maps/place/data=!4m2!3m1!1s0x3b00cfb5c8f13bb3:0xc245f4db34baf398";

const FIGURES = [
  { value: "4.8", label: "Google rating · 57 reviews", href: GOOGLE_PROFILE_URL },
  ...WHO_WE_ARE_STATS.map((stat) => ({ value: `${stat.value}${stat.suffix}`, label: stat.label })),
];

const OPTIONS = [
  { id: "whatsapp", Icon: MessageCircle, title: "WhatsApp us", text: "A message, a photo or a voice note.", href: "https://wa.me/918925450473", external: true },
  { id: "call", Icon: Phone, title: "+91 89254 50473", text: "Call the team directly.", href: "tel:+918925450473" },
  { id: "form", Icon: FileText, title: "Start a project", text: "Tell us what you need in a short form.", to: "/contact" },
];

export default function B3Final() {
  const lineRef = useRef(null);
  useSectionProgress(lineRef);

  return (
    <section className="b3f" aria-labelledby="b3f-title">
      <div className="b3-wrap">
        <dl className="b3f__figures" data-reveal="up">
          {FIGURES.map((figure) => (
            <div key={figure.label} className="b3f__figure">
              <dt>{figure.label}</dt>
              <dd>
                {figure.href ? (
                  <a href={figure.href} target="_blank" rel="noopener noreferrer">{figure.value}</a>
                ) : (
                  figure.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div ref={lineRef} className="b3f__line-track">
        <div className="b3f__line-pin">
          <h2 id="b3f-title" className="b3f__line">
            <span className="b3f__outline" aria-hidden="true">Let's build yours.</span>
            <span className="b3f__fill">Let's build yours.</span>
          </h2>

          <ul className="b3f__options">
            {OPTIONS.map(({ id, Icon, title, text, href, to, external }) => {
              const content = (
                <>
                  <span className="b3f__icon" aria-hidden="true"><Icon size={22} strokeWidth={2} /></span>
                  <span className="b3f__copy">
                    <strong>{title}</strong>
                    <span>{text}</span>
                  </span>
                  {external ? (
                    <ArrowUpRight className="b3f__arrow" size={20} strokeWidth={2.2} aria-hidden="true" />
                  ) : (
                    <ArrowRight className="b3f__arrow" size={20} strokeWidth={2.2} aria-hidden="true" />
                  )}
                </>
              );
              return (
                <li key={id}>
                  {to ? (
                    <Link className="b3f__option" to={to}>{content}</Link>
                  ) : (
                    <a className="b3f__option" href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{content}</a>
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
