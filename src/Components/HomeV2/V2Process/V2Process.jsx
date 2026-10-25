import "./V2Process.css";

/* =============================================================================
   HOME V2 — HOW A PROJECT RUNS. Four steps on a numbered rail; the last
   (handover) is the dark card. No timings are shown until they are confirmed.
   ============================================================================= */

const STEPS = [
  { code: "INTAKE", title: "Share the requirement", text: "WhatsApp, a call or the form. A sketch, a document or a paragraph is enough to start." },
  { code: "SCOPE", title: "We scope it", text: "We understand the goal, choose the right approach and agree on what will be built." },
  { code: "BUILD", title: "We build and test", text: "Design, development and testing, with updates along the way instead of a black box." },
  { code: "HANDOVER", title: "It's yours, and it works", text: "Delivered, explained and supported, with a clear view of what can come next." },
];

export default function V2Process() {
  return (
    <section className="v2-section v2s" aria-labelledby="v2s-title">
      <div className="v2-wrap">
        <p className="v2-label" data-reveal="up"><b>04</b> / How it works</p>
        <h2 id="v2s-title" className="v2-h2" data-reveal="up" data-reveal-delay="1">
          Share it rough. <span className="v2-soft">We shape it, build it and hand it over.</span>
        </h2>

        <ol className="v2s__steps">
          {STEPS.map((step, index) => (
            <li key={step.code} className={`v2s__step${index === STEPS.length - 1 ? " v2s__step--last" : ""}`} data-reveal="up" data-reveal-delay={String(index + 1)}>
              <span className="v2s__num" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <div className="v2s__card">
                <p className="v2s__code">Step · {String(index + 1).padStart(2, "0")}</p>
                <h3 className="v2s__title">{step.title}</h3>
                <p className="v2s__text">{step.text}</p>
                <p className="v2s__foot">{step.code}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
