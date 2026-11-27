import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./LegalSidebar.css";

const legalLinks = [
  { to: "/terms", label: "Terms & Conditions" },
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/cookie-policy", label: "Cookie Policy" },
];

export default function LegalSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <aside className="pj-legal-sidebar" aria-label="Legal pages">
      <h2 className="pj-legal-sidebar__heading">Terms &amp; Policies</h2>
      <button
        className="pj-legal-sidebar__toggle"
        type="button"
        aria-expanded={mobileOpen}
        aria-controls="pj-legal-navigation"
        onClick={() => setMobileOpen((open) => !open)}
      >
        <span>Choose a legal page</span>
        <span aria-hidden="true">{mobileOpen ? "−" : "+"}</span>
      </button>
      <nav
        id="pj-legal-navigation"
        className={`pj-legal-sidebar__navigation${mobileOpen ? " is-open" : ""}`}
        aria-label="Terms and privacy navigation"
      >
        {legalLinks.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) => (
              `pj-legal-sidebar__link${isActive ? " is-active" : ""}`
            )}
            onClick={() => setMobileOpen(false)}
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
