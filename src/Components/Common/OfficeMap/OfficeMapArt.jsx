import "./OfficeMapArt.css";

/* Stylised map of the ProJenius office area (decorative). Used by the
   footer and the Contact page; wrap it in a link to MAPS_VIEW_HREF so a
   click opens the real Google Maps listing. Colours come from CSS
   variables on a parent (see OfficeMapArt.css). No third-party map is
   loaded, so it always shows instantly and sets no cookies. */
export default function OfficeMapArt() {
  return (
    <svg className="pj-officemap" viewBox="0 0 400 275" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <g className="pj-officemap__road" strokeWidth="2.5">
        <path d="M0 40H400M0 100H400M0 160H400M0 220H400" />
        <path d="M40 0V275M110 0V275M180 0V275M250 0V275M330 0V275" />
      </g>
      <g className="pj-officemap__road" strokeWidth="1.5">
        <path d="M0 70H400M0 130H400M0 190H400M0 250H400M75 0V275M145 0V275M215 0V275M290 0V275M365 0V275" />
      </g>
      <path className="pj-officemap__road pj-officemap__road--main" strokeWidth="7" d="M-10 245 L130 215 L420 262" />
      <path className="pj-officemap__road pj-officemap__road--main" strokeWidth="10" d="M318 -10 L296 120 L268 285" />
      <path className="pj-officemap__road-center" d="M318 -10 L296 120 L268 285" />
      <polygon className="pj-officemap__area" points="62,78 262,78 262,206 118,206 118,150 62,150" />
      <circle className="pj-officemap__pin-pulse" cx="196" cy="150" r="30" />
      <g transform="translate(196 150)">
        <path d="M0 0C-12-14-14-20-14-27a14 14 0 0 1 28 0C14-20 12-14 0 0z" className="pj-officemap__pin" />
        <circle cx="0" cy="-27" r="5.5" className="pj-officemap__pin-dot" />
      </g>
      <text className="pj-officemap__label" x="80" y="112" fontSize="17">Velmurugan Nagar</text>
      <text className="pj-officemap__sub" x="80" y="132" fontSize="14">Madurai</text>
    </svg>
  );
}
