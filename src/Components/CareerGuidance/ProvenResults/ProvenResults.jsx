import React from "react";
import "./ProvenResults.css";

/* =========================================================
   SESSION 1: METRICS DATA
========================================================= */

const IMPACT_METRICS = [
  {
    id: "students",
    value: "500+",
    label: "STUDENTS MENTORED",
  },
  {
    id: "placement-time",
    value: "45 Days",
    label: "AVG TIME TO PLACEMENT",
  },
  {
    id: "partners",
    value: "30+",
    label: "HIRING PARTNERS",
  },
  {
    id: "satisfaction",
    value: "98%",
    label: "SATISFACTION RATE",
  },
];

/* =========================================================
   SESSION 2: COMPONENT
========================================================= */

const ProvenResults = () => {
  return (
    <section id="proven-results" className="prv-section">
      <div className="prv-container">
        {/* ===================================================
            SESSION 3: SECTION HEADER
        =================================================== */}
        <div className="prv-header">
          <span className="prv-badge">PROVEN RESULTS</span>
          <h2 className="prv-title">Real Impact on Careers</h2>
        </div>

        {/* ===================================================
            SESSION 4: STATS CARD CONTAINER
        =================================================== */}
        <div className="prv-card">
          <div className="prv-metrics-grid">
            {IMPACT_METRICS.map((metric) => (
              <div key={metric.id} className="prv-metric-item">
                <span className="prv-metric-value">{metric.value}</span>
                <span className="prv-metric-label">{metric.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProvenResults;
