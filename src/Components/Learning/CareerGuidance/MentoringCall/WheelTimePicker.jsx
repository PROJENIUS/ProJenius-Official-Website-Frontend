import { useEffect, useMemo, useRef, useState } from "react";
import { MINUTES, hourAllowed, isTimeAllowed, pad, to24 } from "./clockTime.js";

/* =========================================================
   WHEEL TIME PICKER — like a phone alarm.
   Three scrolling wheels: hour · minute · AM/PM. The time in
   the centre band is the chosen time. Past times (and anything
   starting within 15 minutes) are greyed out, and the wheel
   settles on the nearest allowed time.
========================================================= */

const ITEM_H = 44;          // px per row
const VISIBLE = 5;          // rows shown (centre row is the selection)
const HOURS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

function Wheel({ items, value, onChange, label, loop = false }) {
  const ref = useRef(null);
  const settleTimer = useRef(null);
  const [offset, setOffset] = useState(0);
  const index = Math.max(0, items.findIndex((item) => item.value === value));

  // Keep the wheel on the current value when it changes from outside.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const target = index * ITEM_H;
    if (Math.abs(el.scrollTop - target) > 2) el.scrollTo({ top: target, behavior: "smooth" });
  }, [index]);

  const settle = () => {
    const el = ref.current;
    if (!el) return;
    let i = Math.round(el.scrollTop / ITEM_H);
    i = Math.max(0, Math.min(items.length - 1, i));
    if (items[i].disabled) {
      // Move to the nearest allowed row.
      let best = -1;
      for (let d = 1; d < items.length && best < 0; d += 1) {
        if (items[i + d] && !items[i + d].disabled) best = i + d;
        else if (items[i - d] && !items[i - d].disabled) best = i - d;
      }
      if (best < 0) return;
      i = best;
    }
    el.scrollTo({ top: i * ITEM_H, behavior: "smooth" });
    if (items[i].value !== value) onChange(items[i].value);
  };

  const onScroll = () => {
    setOffset(ref.current.scrollTop);
    clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(settle, 110);
  };
  useEffect(() => () => clearTimeout(settleTimer.current), []);

  const step = (dir) => {
    for (let i = index + dir; i >= 0 && i < items.length; i += dir) {
      if (!items[i].disabled) { onChange(items[i].value); return; }
    }
    if (loop) {
      const ordered = dir > 0 ? items : [...items].reverse();
      const first = ordered.find((item) => !item.disabled);
      if (first) onChange(first.value);
    }
  };

  return (
    <div
      className="wtp-wheel"
      role="spinbutton"
      tabIndex={0}
      aria-label={label}
      aria-valuetext={items[index]?.label}
      onKeyDown={(e) => {
        if (e.key === "ArrowDown") { e.preventDefault(); step(1); }
        if (e.key === "ArrowUp") { e.preventDefault(); step(-1); }
      }}
    >
      <div ref={ref} className="wtp-scroll" onScroll={onScroll} style={{ height: ITEM_H * VISIBLE }}>
        <div style={{ height: ITEM_H * Math.floor(VISIBLE / 2) }} aria-hidden="true" />
        {items.map((item, i) => {
          const distance = Math.abs(i * ITEM_H - offset) / ITEM_H;
          const fade = Math.max(0.18, 1 - distance * 0.3);
          const tilt = Math.min(60, distance * 22) * (i * ITEM_H < offset ? 1 : -1);
          return (
            <button
              key={item.value}
              type="button"
              tabIndex={-1}
              disabled={item.disabled}
              className={`wtp-item${i === index ? " is-on" : ""}`}
              style={{ height: ITEM_H, opacity: item.disabled ? Math.min(fade, 0.28) : fade, transform: `rotateX(${tilt}deg)` }}
              onClick={() => { if (!item.disabled) onChange(item.value); }}
            >
              {item.label}
            </button>
          );
        })}
        <div style={{ height: ITEM_H * Math.floor(VISIBLE / 2) }} aria-hidden="true" />
      </div>
    </div>
  );
}

function firstAllowed(date, now) {
  for (let h = 0; h < 24; h += 1) for (const m of MINUTES) if (isTimeAllowed(date, h, m, now)) return { h24: h, m };
  return null;
}

function untilText(date, h24, m, now) {
  const start = new Date(date);
  start.setHours(h24, m, 0, 0);
  const mins = Math.round((start - now) / 60000);
  if (mins < 60) return `Your call starts in ${mins} min`;
  const days = Math.floor(mins / 1440), hours = Math.floor((mins % 1440) / 60), rest = mins % 60;
  return `Your call starts in ${days ? `${days} d ` : ""}${hours ? `${hours} h ` : ""}${rest ? `${rest} min` : ""}`.trim();
}

export default function WheelTimePicker({ date, value, now, onChange }) {
  const fallback = useMemo(() => firstAllowed(date, now), [date, now]);
  const current = value && isTimeAllowed(date, value.h24, value.m, now) ? value : fallback;

  // The wheel always shows a real time, so select it straight away.
  useEffect(() => {
    if (current && (!value || value.h24 !== current.h24 || value.m !== current.m)) onChange(current.h24, current.m);
  }, [current, value, onChange]);

  if (!current) {
    return <p className="ctp-closed" role="status">No more times are available today. Please choose another date.</p>;
  }

  const period = current.h24 < 12 ? "AM" : "PM";
  const h12 = ((current.h24 + 11) % 12) + 1;

  const choose = (h24, m) => {
    if (isTimeAllowed(date, h24, m, now)) { onChange(h24, m); return; }
    const m2 = MINUTES.find((x) => isTimeAllowed(date, h24, x, now));
    if (m2 !== undefined) onChange(h24, m2);
  };

  const hourItems = HOURS.map((h) => ({ value: h, label: pad(h), disabled: !hourAllowed(date, to24(h, period), now) }));
  const minuteItems = MINUTES.map((m) => ({ value: m, label: pad(m), disabled: !isTimeAllowed(date, current.h24, m, now) }));
  const amOpen = [8, 9, 10, 11].some((h) => hourAllowed(date, h, now));
  const pmOpen = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21].some((h) => hourAllowed(date, h, now));
  const periodItems = [{ value: "AM", label: "AM", disabled: !amOpen }, { value: "PM", label: "PM", disabled: !pmOpen }];

  const switchPeriod = (p) => {
    if (p === period) return;
    let next = to24(h12, p);
    if (!hourAllowed(date, next, now)) {
      const hours = p === "AM" ? [8, 9, 10, 11] : [12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
      next = hours.find((h) => hourAllowed(date, h, now));
    }
    if (next !== undefined) choose(next, current.m);
  };

  return (
    <div className="wtp">
      <p className="wtp-until" aria-live="polite">{untilText(date, current.h24, current.m, now)}</p>
      <div className="wtp-wheels">
        <span className="wtp-band" aria-hidden="true" />
        <Wheel label="Hour" items={hourItems} value={h12} onChange={(h) => choose(to24(h, period), current.m)} />
        <span className="wtp-colon" aria-hidden="true">:</span>
        <Wheel label="Minutes" items={minuteItems} value={current.m} onChange={(m) => choose(current.h24, m)} />
        <Wheel label="AM or PM" items={periodItems} value={period} onChange={switchPeriod} />
      </div>
      <p className="ctp-hint">Scroll or tap to choose. Available 8:00 AM – 9:45 PM; greyed-out times have passed.</p>
    </div>
  );
}
