/* =========================================================
   HOME V3 — DESIGN PREVIEW (/preview/home-v3)
   "Blueprint → Reality": a dark, cinematic homepage where
   the visitor scrolls through an idea being built, stage by
   stage. Not linked from the navigation and marked noindex;
   the live homepage is unchanged until this is approved.
========================================================= */

import { useEffect, useRef } from "react";

import B3Hero from "../../Components/HomeV3/B3Hero/B3Hero.jsx";
import B3Build from "../../Components/HomeV3/B3Build/B3Build.jsx";
import B3Reality from "../../Components/HomeV3/B3Reality/B3Reality.jsx";
import B3Work from "../../Components/HomeV3/B3Work/B3Work.jsx";
import B3Learn from "../../Components/HomeV3/B3Learn/B3Learn.jsx";
import B3Final from "../../Components/HomeV3/B3Final/B3Final.jsx";
import useScrollReveal from "../../hooks/useScrollReveal.js";
import "../../styles/pages/HomeV3Page.css";

/* Keep the preview out of search results. */
function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);
}

export default function HomeV3Page() {
  const pageRef = useRef(null);
  useNoIndex();
  useScrollReveal(pageRef);

  return (
    <main ref={pageRef} className="pjv3">
      <B3Hero />
      <B3Build />
      <B3Reality />
      <B3Work />
      <B3Learn />
      <B3Final />
    </main>
  );
}
