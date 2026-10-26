/* =============================================================================
   PREFER TO REACH US DIRECTLY?
   -----------------------------------------------------------------------------
   Shows the official ProJenius contact channels: phone, email, WhatsApp and
   office. Every card is one link, so a single click does the right thing:

     Phone     -> opens the dialler        (tel:)
     Email     -> opens the mail app       (mailto:)
     WhatsApp  -> opens a WhatsApp chat    (https://wa.me/<number>)
     Office    -> opens Google Maps search (company name + city)

   Purely presentational: no state, no effects. All values and links are built
   ONCE at module level, so the component never recalculates anything on render.
   No inline styles: all styling comes from PreferToReachUsDirectly.css.
   ============================================================================= */


import TypedPhrase from "../../Common/TypedPhrase/TypedPhrase.jsx";

/* ===========================================================================
   CONFIG — official contact details (single place to edit)
   =========================================================================== */
const COMPANY_NAME = "ProJenius Innovation Technology Private Limited";
const CONTACT_EMAIL = "teamprojenius@gmail.com";
const CONTACT_PHONE = "+91 89254 50473";
const CONTACT_WHATSAPP = "+91 89254 50473"; // any format, digits are extracted
const CONTACT_CITY = "Madurai, Tamil Nadu";

const EMAIL_SUBJECT = "Enquiry from the ProJenius website";
const WHATSAPP_MESSAGE = "Hello ProJenius, I would like to know more.";


/* ===========================================================================
   SAFETY — small helpers that only ever produce a link from valid input.
   If a value is missing or malformed, the card falls back to a neutral,
   non-clickable placeholder instead of a broken or unsafe link.
   =========================================================================== */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const keepDigits = (text) => String(text || "").replace(/\D/g, "");
const keepDialChars = (text) => String(text || "").replace(/[^\d+]/g, "");

const buildMailHref = (email) =>
  EMAIL_PATTERN.test(email) ? `mailto:${email}?subject=${encodeURIComponent(EMAIL_SUBJECT)}` : "";

const buildPhoneHref = (phone) => (keepDigits(phone).length >= 10 ? `tel:${keepDialChars(phone)}` : "");

const buildWhatsappHref = (number) => {
  const digits = keepDigits(number);
  return digits.length >= 10 ? `https://wa.me/${digits}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}` : "";
};

const buildMapHref = (name, city) =>
  name && city
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, ${city}`)}`
    : "";


/* ===========================================================================
   CONFIG — the four channel cards, in display order
   ---------------------------------------------------------------------------
   external: true opens in a new tab (WhatsApp and Maps). Mail and phone hand
   over to the device's own app, so they stay in the same tab.
   =========================================================================== */
const CHANNELS = [
  {
    key: "phone",
    icon: "phone",
    label: "Phone",
    sub: "Official ProJenius business phone",
    value: CONTACT_PHONE,
    href: buildPhoneHref(CONTACT_PHONE),
    action: "Call",
  },
  {
    key: "email",
    icon: "mail",
    label: "Email",
    sub: "Official ProJenius email",
    value: CONTACT_EMAIL,
    href: buildMailHref(CONTACT_EMAIL),
    action: "Email",
  },
  {
    key: "whatsapp",
    icon: "whatsapp",
    label: "WhatsApp",
    sub: "Chat with the ProJenius team",
    value: CONTACT_WHATSAPP,
    href: buildWhatsappHref(CONTACT_WHATSAPP),
    action: "Chat on WhatsApp with",
    external: true,
  },
  {
    key: "office",
    icon: "pin",
    label: "Office",
    sub: "ProJenius office location",
    value: CONTACT_CITY,
    href: buildMapHref(COMPANY_NAME, CONTACT_CITY),
    action: "View on Google Maps:",
    external: true,
  },
];

const PLACEHOLDER_TEXT = "Will appear here once the official details are added.";
const EXTERNAL_LINK_PROPS = { target: "_blank", rel: "noopener noreferrer" };


/* ===========================================================================
   ICONS — small inline SVG set used only by this component
   =========================================================================== */
const DIRECT_ICON_PATHS = {
  mail: <path d="M3 5h18v14H3zM3 7l9 6 9-6" />,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  whatsapp: <path d="M3 21l1.6-4.7A9 9 0 1 1 8 19.5zM9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.6-2-1-.8.8a4 4 0 0 1-1.9-1.9l.8-.8-1-2z" />,
  pin: <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />,
};

function DirectIcon({ name }) {
  return (
    <svg
      className="pj-contact-direct__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {DIRECT_ICON_PATHS[name]}
    </svg>
  );
}


/* ===========================================================================
   CARD — one channel. Clickable link when the details are valid, otherwise a
   quiet dashed placeholder. Written once and reused for all four channels.
   =========================================================================== */
function ChannelCard({ channel, index }) {
  const isLive = Boolean(channel.value && channel.href);

  const content = (
    <>
      <span className="pj-contact-direct__item-icon">
        <DirectIcon name={channel.icon} />
      </span>
      <h3 className="pj-contact-direct__item-title">{channel.label}</h3>
      <span className="pj-contact-direct__item-sub">{channel.sub}</span>
      <span className="pj-contact-direct__item-value">{isLive ? channel.value : PLACEHOLDER_TEXT}</span>
    </>
  );

  if (!isLive) {
    return <div className={`pj-contact-direct__item pj-contact-direct__item--${channel.key} pj-contact-direct__item--empty`} data-reveal="up" data-reveal-delay={String(index + 1)}>{content}</div>;
  }

  return (
    <a
      className={`pj-contact-direct__item pj-contact-direct__item--${channel.key}`}
      data-reveal="up"
      data-reveal-delay={String(index + 1)}
      href={channel.href}
      aria-label={`${channel.action} ${channel.value}${channel.external ? " (opens in a new tab)" : ""}`}
      {...(channel.external ? EXTERNAL_LINK_PROPS : {})}
    >
      {content}
    </a>
  );
}


/* =============================================================================
   MAIN COMPONENT
   ============================================================================= */
const PreferToReachUsDirectly = () => (
  <section className="pj-contact-direct" id="pj-contact-direct" aria-labelledby="pj-contact-direct-title">
    <div className="pj-contact-direct__content">
      {/* =====================================================================
          HEADER
          ===================================================================== */}
      <header className="pj-contact-direct__header">
        <p className="pjds-eyebrow" data-reveal="up">Reach Us Directly</p>
        <h2 className="pj-contact-direct__title" id="pj-contact-direct-title" data-reveal="up" data-reveal-delay="1">
          <span className="pj-contact-direct__title-static">Prefer to Reach Us</span>
          <TypedPhrase phrases={["Directly?", "by Phone?", "on WhatsApp?", "by Email?"]} />
        </h2>
        <p className="pj-contact-direct__description" data-reveal="up" data-reveal-delay="2">
          Use the official ProJenius channels below.
        </p>
      </header>

      {/* =====================================================================
          CHANNEL CARDS
          ===================================================================== */}
      <div className="pj-contact-direct__grid">
        {CHANNELS.map((channel, index) => (
          <ChannelCard channel={channel} index={index} key={channel.key} />
        ))}
      </div>
    </div>
  </section>
);

export default PreferToReachUsDirectly;
