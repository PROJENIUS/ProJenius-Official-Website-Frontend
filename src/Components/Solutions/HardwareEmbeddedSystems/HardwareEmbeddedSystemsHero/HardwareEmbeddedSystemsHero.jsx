import Breadcrumbs from "../../../Common/Breadcrumbs/Breadcrumbs.jsx";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, Cloud, Cog, MonitorSmartphone, Thermometer, Wifi } from "lucide-react";

import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import { contactLink } from "../../Shared/serviceLinks.js";
import "./HardwareEmbeddedSystemsHero.css";

/* =============================================================================
   HARDWARE & EMBEDDED SYSTEMS HERO — "live device console".
   Left: the message and actions. Right: an illustrated device console:
     - a microcontroller wired to a sensor, a display, the cloud and a motor,
       with signals flowing along the wires (data in from the sensor, out to
       the others);
     - an "Online" status light and three small readouts;
     - a serial monitor that prints firmware log lines one by one.
   It is labelled as an illustration (no measured data or claims).
   Motion runs only while the hero is on screen; with reduced motion the
   console is shown at rest with its log filled in.
   Previous version (shared cinematic hero with an oscilloscope):
   backup-before-cleanup/HardwareHero-cinematic/
   ============================================================================= */

const TECH = ["ESP32", "STM32", "Arduino", "Sensors", "Wi-Fi / BLE"];

const NODES = [
  { id: "sensor", Icon: Thermometer, label: "Sensor", x: 14, y: 24 },
  { id: "display", Icon: MonitorSmartphone, label: "Display", x: 14, y: 76 },
  { id: "cloud", Icon: Cloud, label: "Cloud", x: 86, y: 24 },
  { id: "motor", Icon: Cog, label: "Motor", x: 86, y: 76 },
];

/* Wires in a 100 × 100 box (the diagram's own coordinates). The sensor wire
   runs into the chip; the others run out of it, so the flowing dashes show
   the direction of the data. */
const WIRES = [
  { id: "sensor", d: "M19 24 H30 L34 37 H38", dir: "in" },
  { id: "display", d: "M38 63 H34 L30 76 H19", dir: "out" },
  { id: "cloud", d: "M62 37 H66 L70 24 H81", dir: "out" },
  { id: "motor", d: "M62 63 H66 L70 76 H81", dir: "out" },
];

const LOG = [
  "boot: firmware v1.0 ready",
  "sensor: temperature 24.6 °C",
  "wifi: connected",
  "cloud: reading published",
  "display: values updated",
  "motor: speed set to 60 %",
  "sensor: temperature 24.8 °C",
  "cloud: reading published",
];

const VISIBLE_LINES = 4;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Prints the log one line at a time while the console is on screen. */
function useSerialLog() {
  const ref = useRef(null);
  const [count, setCount] = useState(() => (prefersReducedMotion() ? VISIBLE_LINES : 1));
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(([entry]) => setRunning(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return undefined;
    const timer = window.setInterval(() => setCount((n) => n + 1), 1500);
    return () => window.clearInterval(timer);
  }, [running]);

  const lines = [];
  const start = Math.max(0, count - VISIBLE_LINES);
  for (let i = start; i < count; i += 1) {
    lines.push({ key: i, text: LOG[i % LOG.length] });
  }
  return [ref, lines, running];
}

export default function HardwareEmbeddedSystemsHero() {
  const [consoleRef, lines, running] = useSerialLog();

  return (
    <section className="pjhw-hero2" aria-labelledby="hardware-hero-title">
      <div className="pjds-container pjhw-hero2__inner">
        {/* ---------- Message ---------- */}
        <div className="pjhw-hero2__copy">
          <Breadcrumbs className="pj-crumbs--hero" items={[{ label: "Home", to: "/" }, { label: "Solutions" }, { label: "Hardware & Embedded Systems" }]} />
          <p className="pjds-eyebrow pjds-eyebrow--on-dark pjhw-hero2__eyebrow">
            <span className="pjhw-hero2__dot" aria-hidden="true" />
            Hardware &amp; Embedded Systems
          </p>
          <h1 id="hardware-hero-title" className="pjhw-hero2__title">
            <span className="pjhw-hero2__title-fixed">Electronics &amp; Firmware</span>
            <span className="pjhw-hero2__title-typed">
              <TypedPhrase phrases={["Built for the Real World.", "That Just Works."]} tone="dark" />
            </span>
          </h1>
          <p className="pjhw-hero2__desc">
            Embedded systems, firmware, sensor integration and connected IoT devices, from the first circuit to a
            working, testable system.
          </p>

          <div className="pjhw-hero2__actions">
            <Link className="pjhw-hero2__btn pjhw-hero2__btn--primary" to={contactLink("development", "hardware-embedded-systems")}>
              Discuss Hardware Requirements <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a className="pjhw-hero2__btn pjhw-hero2__btn--ghost" href="#hardware-services">
              What We Engineer <ArrowDown size={18} aria-hidden="true" />
            </a>
          </div>

          <ul className="pjhw-hero2__tech" aria-label="Technologies we work with">
            {TECH.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>

        {/* ---------- Device console (illustration) ---------- */}
        <figure ref={consoleRef} className={`pjhw-hero2__console${running ? " is-running" : ""}`} aria-labelledby="hardware-hero-console-caption">
          <div className="pjhw-hero2__bar">
            <span className="pjhw-hero2__lights" aria-hidden="true"><i /><i /><i /></span>
            <span className="pjhw-hero2__device">projenius-device</span>
            <span className="pjhw-hero2__status"><span aria-hidden="true" />Online</span>
          </div>

          {/* Wiring diagram */}
          <div className="pjhw-hero2__diagram" aria-hidden="true">
            <svg className="pjhw-hero2__wires" viewBox="0 0 100 100" preserveAspectRatio="none">
              {WIRES.map((w) => <path key={`base-${w.id}`} className="pjhw-hero2__wire" d={w.d} vectorEffect="non-scaling-stroke" />)}
              {WIRES.map((w) => (
                <path key={`flow-${w.id}`} className={`pjhw-hero2__flow pjhw-hero2__flow--${w.dir}`} d={w.d} vectorEffect="non-scaling-stroke" />
              ))}
            </svg>

            <div className="pjhw-hero2__chip">
              <span className="pjhw-hero2__chip-name">MCU</span>
              <span className="pjhw-hero2__chip-sub">ESP32 · STM32</span>
            </div>

            {NODES.map(({ id, Icon, label, x, y }) => (
              <div key={id} className={`pjhw-hero2__node pjhw-hero2__node--${id}`} style={{ "--x": `${x}%`, "--y": `${y}%` }}>
                <span className="pjhw-hero2__node-icon"><Icon size={20} strokeWidth={2} /></span>
                <span className="pjhw-hero2__node-label">{label}</span>
              </div>
            ))}
          </div>

          {/* Readouts */}
          <div className="pjhw-hero2__readouts" aria-hidden="true">
            <div className="pjhw-hero2__readout">
              <span>Sensor</span>
              <b>24.6 °C</b>
              <svg className="pjhw-hero2__spark" viewBox="0 0 120 28" preserveAspectRatio="none">
                {/* Second half repeats the first, so sliding left by 120 loops seamlessly */}
                <polyline points="0,18 10,16 20,19 30,12 40,14 50,9 60,13 70,10 80,15 90,8 100,11 110,7 120,18 130,16 140,19 150,12 160,14 170,9 180,13 190,10 200,15 210,8 220,11 230,7 240,18" />
              </svg>
            </div>
            <div className="pjhw-hero2__readout">
              <span>Network</span>
              <b><Wifi size={14} strokeWidth={2.4} /> Connected</b>
            </div>
            <div className="pjhw-hero2__readout">
              <span>Firmware</span>
              <b>v1.0 · Running</b>
            </div>
          </div>

          {/* Serial monitor */}
          <div className="pjhw-hero2__serial" aria-hidden="true">
            <span className="pjhw-hero2__serial-title">Serial monitor</span>
            <ol className="pjhw-hero2__log">
              {lines.map((line) => (
                <li key={line.key}><span className="pjhw-hero2__prompt">&gt;</span> {line.text}</li>
              ))}
              <li className="pjhw-hero2__cursor-line"><span className="pjhw-hero2__prompt">&gt;</span> <span className="pjhw-hero2__cursor" /></li>
            </ol>
          </div>

          <figcaption id="hardware-hero-console-caption" className="pjhw-hero2__caption">
            Illustration: a connected device running its firmware.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
