import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MessageCircle, Phone, Send } from "lucide-react";
import { whatsappHref } from "../../../utils/whatsapp.js";
import "./MobileStickyCta.css";

/* Phones only: a bottom bar to call, WhatsApp or send an enquiry. Hidden on
   pages that already have their own form or payment bar, and until the
   visitor scrolls past the hero. */
const HIDE_ON = [/^\/contact/, /^\/services\/courses\/.+/, /^\/incubate\/apply/, /^\/services\/career-guidance/, /^\/join-our-team/];

export default function MobileStickyCta() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);
  const hidden = HIDE_ON.some((re) => re.test(pathname));

  useEffect(() => {
    if (hidden) return undefined;
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hidden, pathname]);

  if (hidden) return null;
  return (
    <nav className={`pj-sticky-cta${visible ? " is-visible" : ""}`} aria-label="Quick contact" aria-hidden={!visible}>
      <a href="tel:+918925450473" tabIndex={visible ? 0 : -1}><Phone size={18} aria-hidden="true" /> Call</a>
      <a href={whatsappHref("Hello ProJenius, I would like to know more.")} target="_blank" rel="noopener noreferrer" tabIndex={visible ? 0 : -1}>
        <MessageCircle size={18} aria-hidden="true" /> WhatsApp<span className="pjds-sr-only"> (opens in a new tab)</span>
      </a>
      <Link to="/contact#pj-contact-help" className="is-primary" tabIndex={visible ? 0 : -1}><Send size={18} aria-hidden="true" /> Enquire</Link>
    </nav>
  );
}
