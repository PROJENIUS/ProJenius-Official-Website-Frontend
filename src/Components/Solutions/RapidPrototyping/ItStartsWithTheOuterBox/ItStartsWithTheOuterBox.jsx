import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../../../Common/SectionTitleLine/SectionTitleLine.jsx";
import "./ItStartsWithTheOuterBox.css";

/* =============================================================================
   IT STARTS WITH THE OUTER BOX — why the enclosure comes first.
   Left: the message. Right: an annotated enclosure drawing; the callout
   lines draw themselves when it scrolls into view (both directions).
   Below: six things the enclosure decides, and how we make it
   (sketch → CAD → print → fit test), with "Innovate · Build · Deliver".
   ============================================================================= */

const POINTS = [
  { title: "Fit & size", text: "Room for the board, battery and wiring, with no wasted space." },
  { title: "Comfort", text: "Easy to hold, wear or mount, shaped around how it will really be used." },
  { title: "Access", text: "Cut-outs for USB, buttons, LEDs and sensors, placed exactly." },
  { title: "Strength & heat", text: "Snap-fits, screw bosses and vents so it survives drops and stays cool." },
  { title: "Look & finish", text: "Colours, textures and your branding, so it feels like a real product." },
  { title: "Ready to scale", text: "Printable today and designed so it can be moulded later." },
];

const MAKE = ["Sketch", "3D CAD model", "3D print", "Fit test & refine"];
const MOTTO = ["Innovate", "Build", "Deliver"];

export default function ItStartsWithTheOuterBox() {
  return (
    <section id="prototyping-enclosure" className="pjrpE" aria-labelledby="prototyping-enclosure-title">
      <div className="pjds-container">
        <div className="pjrpE__top">
          <div className="pjrpE__copy">
            <p className="pjds-eyebrow" data-reveal="up">It Starts With the Outer Box</p>
            <h2 id="prototyping-enclosure-title" className="pjds-title pjrpE__title" data-reveal="up" data-reveal-delay="1">
              The enclosure decides how your product <TypedPhrase phrases={["feels.", "fits.", "works."]} />
            </h2>
            <SectionTitleLine />
            <p className="pjds-lead pjrpE__lead" data-reveal="up" data-reveal-delay="2">
              It&apos;s the first thing people see and hold. It also sets the size of the board, where the buttons
              and ports go, how heat escapes and how the product survives a drop. So we design the box first, and
              everything inside follows it.
            </p>
          </div>

          {/* Annotated enclosure (illustration) */}
          <figure className="pjrpE__fig" data-reveal="up" data-reveal-delay="2" aria-label="Illustration: an enclosure with its button, parting line, USB-C cut-out, width and height marked">
            <svg className="pjrpE__svg" viewBox="0 0 520 390" aria-hidden="true">
              <ellipse className="pjrpE__shadow" cx="250" cy="312" rx="180" ry="26" />

              {/* Box */}
              <polygon className="pjrpE__face-l" points="100,130 250,200 250,290 100,220" />
              <polygon className="pjrpE__face-r" points="250,200 400,130 400,220 250,290" />
              <polygon className="pjrpE__face-t" points="250,60 400,130 250,200 100,130" />
              <polyline className="pjrpE__parting" points="100,168 250,238 400,168" />
              <polygon className="pjrpE__usb" points="305,214 345,195 345,207 305,226" />
              <ellipse className="pjrpE__button" cx="236" cy="132" rx="18" ry="9" />
              <circle className="pjrpE__led" cx="282" cy="98" r="4" />

              {/* Dimensions */}
              <g className="pjrpE__dim">
                <line x1="90" y1="238" x2="240" y2="308" />
                <text x="150" y="292">width</text>
                <line x1="420" y1="130" x2="420" y2="220" />
                <line x1="412" y1="130" x2="428" y2="130" />
                <line x1="412" y1="220" x2="428" y2="220" />
                <text x="432" y="180">height</text>
              </g>

              {/* Callouts: draw in when revealed */}
              <g className="pjrpE__callout" style={{ "--k": 0 }}>
                <path d="M236 122 L210 34" pathLength="1" />
                <circle cx="236" cy="128" r="4" />
                <text x="210" y="24">Button placed for the thumb</text>
              </g>
              <g className="pjrpE__callout" style={{ "--k": 1 }}>
                <path d="M170 201 L120 352" pathLength="1" />
                <circle cx="170" cy="201" r="4" />
                <text x="70" y="372">Snap-fit parting line</text>
              </g>
              <g className="pjrpE__callout" style={{ "--k": 2 }}>
                <path d="M330 210 L380 352" pathLength="1" />
                <circle cx="330" cy="210" r="4" />
                <text x="380" y="372">USB-C cut-out, exact to the port</text>
              </g>
            </svg>
          </figure>
        </div>

        <ol className="pjrpE__points">
          {POINTS.map(({ title, text }, index) => (
            <li key={title} className="pjrpE__point" data-reveal="up" data-reveal-delay={String((index % 3) + 1)}>
              <span className="pjrpE__num" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="pjrpE__point-title">{title}</h3>
                <p className="pjrpE__point-text">{text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="pjrpE__strip" data-reveal="up">
          <div className="pjrpE__make">
            <span className="pjrpE__strip-label">How we make it</span>
            <ol className="pjrpE__make-steps">
              {MAKE.map((step, index) => (
                <li key={step} style={{ "--k": index }}>{step}</li>
              ))}
            </ol>
          </div>
          <p className="pjrpE__materials">{MOTTO.join(" · ")}</p>
        </div>
      </div>
    </section>
  );
}
