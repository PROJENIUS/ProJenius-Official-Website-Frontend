import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";

import useOnScreen from "../../../hooks/useOnScreen.js";
import "./CinematicHero.css";

/* =============================================================================
   CINEMATIC HERO — the shared hero for every page except Home
   -----------------------------------------------------------------------------
   Full-width real photo under a navy fade (it zooms in slowly once), the
   homepage heading style (cyan line label, Manrope title, the accent line
   in solid cyan), a lead line, the homepage button pair, a right-hand
   panel and the scrolling service band (white and cyan words).

   Props
     id           heading id (aria-labelledby)
     eyebrow      label above the title
     title        first line of the headline
     accent       second line, shown in cyan
     description  lead paragraph
     primary      { label, to }  main action ("/route", "#id", "https://…", "tel:")
     secondary    { label, to }  optional second action
     photo        background photo (a real ProJenius photo)
     aside        right-hand panel: <HeroLinks /> or <HeroTerminal />
     band         words for the scrolling service band
     className    page modifier class

   Right-hand panels (exported below)
     HeroLinks     "On this page" links: items [{ label, to }]
     HeroTerminal  a code window that types out lines, then starts again:
                   file, label, lines [{ kind: "cmd"|"info"|"ok"|"done", text }]
   ============================================================================= */

const isExternal = (to) => /^(https?:|tel:|mailto:)/.test(to);

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Scroll to an in-page section, leaving room for the fixed navbar, and keep
   React Router's history state when updating the hash. */
function scrollToHash(event, hash) {
  const target = document.getElementById(hash.slice(1));
  if (!target) return;
  event.preventDefault();
  const offset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--pjds-nav-offset")) || 96;
  window.scrollTo({
    top: target.getBoundingClientRect().top + window.scrollY - offset - 16,
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
  window.history.replaceState(window.history.state, "", hash);
}

function SmartLink({ to, className, children }) {
  if (isExternal(to)) {
    const newTab = to.startsWith("http");
    return (
      <a className={className} href={to} {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
        {newTab && <span className="pjds-sr-only"> (opens in a new tab)</span>}
      </a>
    );
  }
  if (to.startsWith("#")) {
    return <a className={className} href={to} onClick={(event) => scrollToHash(event, to)}>{children}</a>;
  }
  return <Link className={className} to={to}>{children}</Link>;
}

function Action({ action, variant }) {
  const Icon = action.to.startsWith("#") ? ArrowDown : isExternal(action.to) ? ArrowUpRight : ArrowRight;
  const className = `pjds-btn pjds-btn--${variant}${variant === "primary" ? " pjds-btn--on-dark" : ""} pj-cine__btn`;
  return (
    <SmartLink to={action.to} className={className}>
      {action.label}
      <Icon size={18} strokeWidth={2.2} aria-hidden="true" />
    </SmartLink>
  );
}

/* ---------- Right-hand panel: "On this page" links ---------- */
export function HeroLinks({ label = "On this page", items }) {
  return (
    <nav className="pj-cine__links" aria-label={label}>
      <p className="pj-cine__links-label" aria-hidden="true">{label}</p>
      <ol>
        {items.map((item) => (
          <li key={item.to}>
            <SmartLink to={item.to} className="pj-cine__link">
              {item.label}
              <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
            </SmartLink>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ---------- Right-hand panel: typing terminal ---------- */
const PREFIX = { cmd: "$ ", info: "  ", ok: "✓ ", done: "→ " };

export function HeroTerminal({ file = "build.sh", label, lines }) {
  const ref = useRef(null);
  const isOnScreen = useOnScreen(ref);
  const full = lines.map((line) => PREFIX[line.kind] + line.text);
  const [pos, setPos] = useState(() =>
    prefersReducedMotion() ? { line: lines.length - 1, ch: Infinity } : { line: 0, ch: 0 }
  );

  /* One timer per step: type the command slowly, the output faster, pause
     between lines and at the end, then start again. Paused off screen. */
  useEffect(() => {
    if (!isOnScreen || prefersReducedMotion()) return undefined;
    const text = PREFIX[lines[pos.line].kind] + lines[pos.line].text;
    const isCommand = pos.line === 0;
    let next;
    let delay;
    if (pos.ch < text.length) {
      next = { line: pos.line, ch: pos.ch + (isCommand ? 1 : 3) };
      delay = isCommand ? 45 : 22;
    } else if (pos.line < lines.length - 1) {
      next = { line: pos.line + 1, ch: 0 };
      delay = 380;
    } else {
      next = { line: 0, ch: 0 };
      delay = 2600;
    }
    const timer = window.setTimeout(() => setPos(next), delay);
    return () => window.clearTimeout(timer);
  }, [isOnScreen, pos, lines]);

  return (
    <figure ref={ref} className="pj-cine__term">
      <div className="pj-cine__term-bar" aria-hidden="true">
        <i /><i /><i />
        <span>{file}</span>
      </div>
      <div className="pj-cine__term-body" aria-hidden="true">
        {/* The full text reserves the height, so nothing below moves while typing. */}
        <pre className="pj-cine__term-ghost">{full.join("\n")}</pre>
        <pre className="pj-cine__term-live">
          {lines.slice(0, pos.line + 1).map((line, i) => (
            <span key={i} className={`is-${line.kind}`}>
              {i < pos.line ? `${full[i]}\n` : full[i].slice(0, pos.ch)}
            </span>
          ))}
          <span className="pj-cine__term-cursor" />
        </pre>
      </div>
      <figcaption className="pjds-sr-only">{label}: {lines.map((line) => line.text).join(". ")}</figcaption>
    </figure>
  );
}

/* ---------- The hero ---------- */
export default function CinematicHero({
  id,
  eyebrow,
  title,
  accent,
  description,
  primary,
  secondary,
  photo,
  aside,
  band = [],
  className = "",
}) {
  return (
    <section className={`pj-cine${className ? ` ${className}` : ""}`} aria-labelledby={id}>
      <div className="pj-cine__media" aria-hidden="true">
        {photo && <img src={photo} alt="" decoding="async" fetchPriority="high" />}
      </div>
      <span className="pj-cine__shade" aria-hidden="true" />

      <div className="pjds-container pj-cine__layout">
        <div className="pj-cine__copy">
          <p className="pj-cine__eyebrow">{eyebrow}</p>
          <h1 id={id} className="pj-cine__title">
            {title}{" "}
            <span className="pj-cine__accent">{accent}</span>
          </h1>
          <p className="pj-cine__lead">{description}</p>
          <div className="pj-cine__actions">
            <Action action={primary} variant="primary" />
            {secondary && <Action action={secondary} variant="ghost" />}
          </div>
        </div>

        {aside && <div className="pj-cine__aside">{aside}</div>}
      </div>

      {band.length > 0 && (
        <div className="pj-cine__band" aria-hidden="true">
          <div className="pj-cine__track">
            {/* Two identical copies loop seamlessly; every second word is cyan. */}
            {[...band, ...band].map((item, i) => (
              <span key={`${item}-${i}`} className={(i % band.length) % 2 ? "is-cyan" : undefined}>{item}</span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
