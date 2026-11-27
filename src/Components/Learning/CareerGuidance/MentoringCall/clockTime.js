/* Time rules for the convenient-slot clock (same limits as the server). */

export const EARLIEST_HOUR = 8;   // 8:00 AM
export const LATEST_HOUR = 21;    // last start 9:45 PM
export const LEAD_MINUTES = 15;   // cannot book a call starting within 15 min
export const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5); // 00, 05 … 55

export const to24 = (h12, ap) => (ap === "AM" ? (h12 === 12 ? 0 : h12) : (h12 === 12 ? 12 : h12 + 12));
export const pad = (n) => String(n).padStart(2, "0");
export const clockLabel = (h24, m) => `${pad(((h24 + 11) % 12) + 1)}:${pad(m)} ${h24 < 12 ? "AM" : "PM"}`;

export function isTimeAllowed(date, h24, m, now = new Date()) {
  if (h24 < EARLIEST_HOUR || h24 > LATEST_HOUR) return false;
  const start = new Date(date);
  start.setHours(h24, m, 0, 0);
  return start.getTime() >= now.getTime() + LEAD_MINUTES * 60 * 1000;
}
export const hourAllowed = (date, h24, now) => MINUTES.some((m) => isTimeAllowed(date, h24, m, now));
