import { useEffect, useRef, useState } from "react";

import useOnScreen from "../../../hooks/useOnScreen.js";
import { prefersReducedMotion, scrollToHash } from "./heroUtils.js";
import "./HeroPanels.css";

/* =============================================================================
   HERO PANELS — the right-hand side of CinematicHero, one per page
   -----------------------------------------------------------------------------
   Each page gets a panel that matches what the page is about, so no two
   inner pages look the same. All motion pauses while the panel is off
   screen and is switched off for visitors who prefer reduced motion.

     HeroPhotoCards  three overlapping real photos           (About)
     HeroShowcase    framed photo + thumbnails, auto-advance  (Products)
     HeroScope       oscilloscope screen with live signals    (Hardware)
     HeroBlueprint   technical drawing that draws itself      (Rapid Prototyping)
     HeroCircuit     board with light pulses along the traces (PCB)
     HeroBuilder     "what does your idea need?" switches     (Startup)
     HeroTabs        tabs that switch on their own            (Workshop)
     HeroRadar       skill chart growing from before to after (Internship)
     HeroSteps       vertical step path that fills in turn    (Career Guidance)
     HeroPhone       phone with a scrolling learning path     (Courses)
     HeroChooser     "What brings you here?" choices          (Contact)
   HeroTerminal (Software) and HeroLinks (Join Our Team) live in CinematicHero.jsx.
   ============================================================================= */

/* Steps an index 0..count-1 every `ms` while the element is on screen. */
function useCycle(ref, count, ms, paused = false) {
  const isOnScreen = useOnScreen(ref);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!isOnScreen || paused || count < 2 || prefersReducedMotion()) return undefined;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % count), ms);
    return () => window.clearInterval(timer);
  }, [isOnScreen, paused, count, ms]);

  return [index, setIndex];
}

/* ---------- About: three overlapping photos ---------- */
export function HeroPhotoCards({ items }) {
  const cards = items.slice(0, 3);
  return (
    <div className="pj-panel-cards">
      {cards.map((item, i) => (
        <figure key={item.title} className={`pj-panel-cards__card pj-panel-cards__card--${i + 1}`}>
          <img src={item.image} alt={item.alt} decoding="async" />
          {i === cards.length - 1 && (
            <figcaption>
              <small>{item.label}</small>
              {item.title}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}

/* ---------- Products: framed photo with thumbnails ---------- */
export function HeroShowcase({ items, label }) {
  const ref = useRef(null);
  const [paused, setPaused] = useState(false);
  const [index, setIndex] = useCycle(ref, items.length, 4000, paused);
  const active = items[index];

  return (
    <div
      ref={ref}
      className="pj-panel-show"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <figure className="pj-panel-show__frame">
        {items.map((item, i) => (
          <img
            key={item.title}
            className={i === index ? "is-on" : undefined}
            src={item.image}
            alt={i === index ? item.alt : ""}
            aria-hidden={i === index ? undefined : "true"}
            decoding="async"
          />
        ))}
        <figcaption>
          <small>{active.label}</small>
          {active.title}
        </figcaption>
      </figure>
      {items.length > 1 && (
        <div className={`pj-panel-show__thumbs pj-panel-show__thumbs--${Math.min(items.length, 4)}`} role="group" aria-label={label}>
          {items.map((item, i) => (
            <button key={item.title} type="button" aria-pressed={i === index} aria-label={`Show ${item.title}`} onClick={() => setIndex(i)}>
              <img src={item.image} alt="" decoding="async" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Hardware: oscilloscope ---------- */
export function HeroScope({ readings }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const isOnScreen = useOnScreen(wrapRef);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let raf = 0;

    const draw = (t) => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= 10; x++) { ctx.beginPath(); ctx.moveTo((x / 10) * width, 0); ctx.lineTo((x / 10) * width, height); ctx.stroke(); }
      for (let y = 0; y <= 8; y++) { ctx.beginPath(); ctx.moveTo(0, (y / 8) * height); ctx.lineTo(width, (y / 8) * height); ctx.stroke(); }

      /* CH1: sine wave */
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = "#20c8f5";
      ctx.shadowColor = "#20c8f5";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 2) {
        const y = height * 0.32 + Math.sin(x / 28 - t * 0.002) * height * 0.17;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      /* CH2: square wave (PWM) */
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
      ctx.shadowColor = "rgba(255, 255, 255, 0.6)";
      ctx.shadowBlur = 6;
      ctx.beginPath();
      const period = 70;
      const offset = (t * 0.06) % period;
      for (let x = 0; x <= width; x += 1) {
        const y = ((x + offset) % period) / period < 0.5 ? height * 0.66 : height * 0.84;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(0);
    };

    resize();
    window.addEventListener("resize", resize);
    if (isOnScreen && !prefersReducedMotion()) {
      const loop = (t) => { draw(t); raf = window.requestAnimationFrame(loop); };
      raf = window.requestAnimationFrame(loop);
    }
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [isOnScreen]);

  return (
    <figure ref={wrapRef} className="pj-panel-scope">
      <div className="pj-panel-scope__bar" aria-hidden="true">
        <i /><i /><i />
        <span>CH1 · CH2 · RUN</span>
      </div>
      <div className="pj-panel-scope__screen">
        <canvas ref={canvasRef} aria-hidden="true" />
      </div>
      <dl className="pj-panel-scope__read">
        {readings.map((reading) => (
          <div key={reading.label}>
            <dt>{reading.label}</dt>
            <dd>{reading.value}</dd>
          </div>
        ))}
      </dl>
      <figcaption className="pjds-sr-only">Illustration: an oscilloscope showing a sensor signal and a PWM signal.</figcaption>
    </figure>
  );
}

/* ---------- Rapid Prototyping: blueprint that draws itself ---------- */
export function HeroBlueprint({ code = "PJ-001" }) {
  return (
    <figure className="pj-panel-blueprint">
      <svg viewBox="0 0 380 270" role="img" aria-label="Illustration: technical drawing of a device enclosure with its measurements">
        <rect className="pj-panel-blueprint__draw" x="70" y="40" width="200" height="140" rx="16" />
        <rect className="pj-panel-blueprint__draw" x="90" y="60" width="110" height="70" rx="6" />
        <circle className="pj-panel-blueprint__draw" cx="235" cy="80" r="14" />
        <circle className="pj-panel-blueprint__draw" cx="235" cy="120" r="8" />
        <path className="pj-panel-blueprint__draw" d="M90 150 H200 M90 162 H170" />
        <rect className="pj-panel-blueprint__draw" x="300" y="40" width="40" height="140" rx="8" />
        <path className="pj-panel-blueprint__draw" d="M310 70 H330 M310 150 H330" />
        <path className="pj-panel-blueprint__dim" d="M70 205 V215 M270 205 V215 M70 210 H270" />
        <path className="pj-panel-blueprint__dim" d="M45 40 H55 M45 180 H55 M50 40 V180" />
        <path className="pj-panel-blueprint__dim" d="M300 205 V215 M340 205 V215 M300 210 H340" />
        <text x="148" y="232">120 mm</text>
        <text x="4" y="114">85 mm</text>
        <text x="298" y="232">24 mm</text>
        <text x="96" y="54">DISPLAY</text>
        <text x="300" y="30">SIDE</text>
      </svg>
      <figcaption className="pj-panel-blueprint__block">
        <span>DWG {code}</span>
        <span>SCALE 1:2</span>
        <span>REV A</span>
      </figcaption>
    </figure>
  );
}

/* ---------- PCB: board with light pulses ---------- */
const TRACES = [
  "M170 150 H110 V70 H40",
  "M170 190 H40",
  "M170 230 H110 V310 H40",
  "M250 150 H310 V70 H380",
  "M250 190 H380",
  "M250 230 H310 V310 H380",
];
const NODE_AT = [[40, 70, 52], [40, 190, 172], [40, 310, 338], [380, 70, 52], [380, 190, 172], [380, 310, 338]];

export function HeroCircuit({ chip, nodes }) {
  return (
    <figure className="pj-panel-circuit">
      <svg viewBox="0 0 420 360" role="img" aria-label={`Illustration: a circuit board linking ${nodes.join(", ")}`}>
        {TRACES.map((d) => <path key={d} className="pj-panel-circuit__trace" d={d} />)}
        {TRACES.map((d, i) => <path key={`p${d}`} className={`pj-panel-circuit__pulse pj-panel-circuit__pulse--${i + 1}`} d={d} />)}
        <rect className="pj-panel-circuit__chip" x="170" y="130" width="80" height="120" rx="10" />
        {[146, 186, 226].map((y) => (
          <g key={y} className="pj-panel-circuit__pin">
            <rect x="164" y={y} width="6" height="8" />
            <rect x="250" y={y} width="6" height="8" />
          </g>
        ))}
        <text className="pj-panel-circuit__chip-text" x="210" y="186" textAnchor="middle">{chip[0]}</text>
        <text className="pj-panel-circuit__chip-text pj-panel-circuit__chip-text--cyan" x="210" y="206" textAnchor="middle">{chip[1]}</text>
        {nodes.slice(0, 6).map((label, i) => {
          const [x, y, ty] = NODE_AT[i];
          return (
            <g key={label}>
              <circle className="pj-panel-circuit__node" cx={x} cy={y} r="6" />
              <text className="pj-panel-circuit__node-text" x={x} y={ty} textAnchor="middle">{label}</text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}

/* ---------- Startup: "what does your idea need?" switches ---------- */
export function HeroBuilder({ title, hint, options }) {
  const [on, setOn] = useState(() => options.map((option) => Boolean(option.on)));
  const teams = options.filter((_, i) => on[i]).map((option) => option.team);

  return (
    <div className="pj-panel-builder">
      <p className="pj-panel-builder__title">{title}</p>
      <p className="pj-panel-builder__hint">{hint}</p>
      {options.map((option, i) => (
        <button
          key={option.label}
          type="button"
          className="pj-panel-builder__row"
          aria-pressed={on[i]}
          onClick={() => setOn((current) => current.map((value, n) => (n === i ? !value : value)))}
        >
          {option.label}
          <span className="pj-panel-builder__switch" aria-hidden="true" />
        </button>
      ))}
      <p className="pj-panel-builder__out" aria-live="polite">
        {teams.length
          ? <>Who works on it: <strong>{teams.join(" + ")}</strong></>
          : "Switch on at least one thing your idea needs."}
      </p>
    </div>
  );
}

/* ---------- Workshop: tabs that switch on their own ---------- */
export function HeroTabs({ label, tabs, idPrefix }) {
  const ref = useRef(null);
  const [chosen, setChosen] = useState(false);
  const [index, setIndex] = useCycle(ref, tabs.length, 3800, chosen);
  const tabRefs = useRef([]);
  const active = tabs[index];

  const choose = (i) => {
    setChosen(true);
    setIndex(i);
  };
  const onKeyDown = (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const next = (index + (event.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length;
    choose(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div ref={ref} className="pj-panel-tabs">
      <div className="pj-panel-tabs__list" role="tablist" aria-label={label}>
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            ref={(node) => { tabRefs.current[i] = node; }}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${i}`}
            aria-selected={i === index}
            aria-controls={`${idPrefix}-panel`}
            tabIndex={i === index ? 0 : -1}
            onClick={() => choose(i)}
            onKeyDown={onKeyDown}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div key={index} className="pj-panel-tabs__panel" role="tabpanel" id={`${idPrefix}-panel`} aria-labelledby={`${idPrefix}-tab-${index}`}>
        <p className="pj-panel-tabs__tag">{active.tag}</p>
        <p className="pj-panel-tabs__title">{active.title}</p>
        <p className="pj-panel-tabs__text">{active.text}</p>
      </div>
    </div>
  );
}

/* ---------- Internship: skill radar ---------- */
const RADAR_C = 150;
const RADAR_R = 112;

function radarPoint(i, count, value) {
  const angle = -Math.PI / 2 + (i / count) * Math.PI * 2;
  return [RADAR_C + Math.cos(angle) * RADAR_R * value, RADAR_C + Math.sin(angle) * RADAR_R * value];
}
const radarPoints = (values) =>
  values.map((v, i) => radarPoint(i, values.length, v).map((n) => n.toFixed(1)).join(",")).join(" ");

export function HeroRadar({ label, axes, before, after, beforeLabel, afterLabel }) {
  const ref = useRef(null);
  const shapeRef = useRef(null);
  const isOnScreen = useOnScreen(ref);

  /* The "after" shape grows from the "before" values, holds, then repeats. */
  useEffect(() => {
    const shape = shapeRef.current;
    if (prefersReducedMotion()) {
      shape.setAttribute("points", radarPoints(after));
      return undefined;
    }
    if (!isOnScreen) return undefined;
    let raf = 0;
    let start = 0;
    const loop = (t) => {
      if (!start) start = t;
      const cycle = ((t - start) % 6000) / 6000;
      const k = cycle < 0.45 ? 1 - (1 - cycle / 0.45) ** 3 : cycle < 0.9 ? 1 : 1 - (cycle - 0.9) / 0.1;
      shape.setAttribute("points", radarPoints(before.map((b, i) => b + (after[i] - b) * k)));
      raf = window.requestAnimationFrame(loop);
    };
    raf = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(raf);
  }, [isOnScreen, before, after]);

  return (
    <figure ref={ref} className="pj-panel-radar">
      <p className="pj-panel-radar__label">{label}</p>
      <svg viewBox="-46 -24 392 348" role="img" aria-label={`${label}: ${axes.join(", ")}`}>
        {[0.25, 0.5, 0.75, 1].map((r) => (
          <polygon key={r} className="pj-panel-radar__ring" points={radarPoints(axes.map(() => r))} />
        ))}
        {axes.map((axis, i) => {
          const [x, y] = radarPoint(i, axes.length, 1);
          const [lx, ly] = radarPoint(i, axes.length, 1.2);
          const anchor = Math.abs(lx - RADAR_C) < 5 ? "middle" : lx > RADAR_C ? "start" : "end";
          return (
            <g key={axis}>
              <line className="pj-panel-radar__axis" x1={RADAR_C} y1={RADAR_C} x2={x} y2={y} />
              <text className="pj-panel-radar__axis-label" x={lx} y={ly + 4} textAnchor={anchor}>{axis}</text>
            </g>
          );
        })}
        <polygon className="pj-panel-radar__before" points={radarPoints(before)} />
        <polygon ref={shapeRef} className="pj-panel-radar__after" points={radarPoints(before)} />
      </svg>
      <figcaption className="pj-panel-radar__key">
        <span><i className="pj-panel-radar__swatch pj-panel-radar__swatch--before" />{beforeLabel}</span>
        <span><i className="pj-panel-radar__swatch" />{afterLabel}</span>
      </figcaption>
    </figure>
  );
}

/* ---------- Career Guidance: step path ---------- */
export function HeroSteps({ label, steps }) {
  const ref = useRef(null);
  const [index] = useCycle(ref, steps.length, 1800);
  const reduced = prefersReducedMotion();

  return (
    <div ref={ref} className="pj-panel-steps">
      <p className="pj-panel-steps__label">{label}</p>
      <ol>
        {steps.map((step, i) => {
          const state = reduced || i < index ? " is-done" : i === index ? " is-on" : "";
          return (
            <li key={step.title} className={`pj-panel-steps__step${state}`}>
              <strong>{step.title}</strong>
              <span>{step.text}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ---------- Courses: phone with a learning path ---------- */
export function HeroPhone({ kicker, title, cards, note }) {
  return (
    <figure className="pj-panel-phone">
      <div className="pj-panel-phone__device">
        <div className="pj-panel-phone__screen">
          <div className="pj-panel-phone__scroll">
            <p className="pj-panel-phone__kicker">{kicker}</p>
            <p className="pj-panel-phone__title">{title}</p>
            {cards.map((card, i) => (
              <div key={card.title} className={`pj-panel-phone__card${i === 0 ? " is-active" : ""}`}>
                <strong>{card.title}</strong>
                <span>{card.meta}</span>
                {card.progress !== undefined && (
                  <svg className="pj-panel-phone__bar" viewBox="0 0 100 4" preserveAspectRatio="none" aria-hidden="true">
                    <rect className="pj-panel-phone__bar-track" width="100" height="4" rx="2" />
                    <rect className="pj-panel-phone__bar-fill" width={card.progress} height="4" rx="2" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <figcaption className="pj-panel-phone__note">{note}</figcaption>
    </figure>
  );
}

/* ---------- Contact: "What brings you here?" ---------- */
export function HeroChooser({ title, choices, target, eventName }) {
  const choose = (event, key) => {
    if (eventName) window.dispatchEvent(new CustomEvent(eventName, { detail: { type: key } }));
    scrollToHash(event, target);
  };

  return (
    <nav className="pj-panel-chooser" aria-label={title}>
      <p className="pj-panel-chooser__title">{title}</p>
      <ul>
        {choices.map((choice, i) => (
          <li key={choice.key}>
            <a href={target} onClick={(event) => choose(event, choice.key)}>
              <span className="pj-panel-chooser__num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <span className="pj-panel-chooser__text">
                <strong>{choice.title}</strong>
                <small>{choice.text}</small>
              </span>
              <svg className="pj-panel-chooser__arrow" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
