/* =========================================================
   PRODUCTS PAGE
   Showcases what ProJenius has built, then helps visitors build
   their own product and links to the pages that do the work.
   Backgrounds alternate:
     hero (navy) → our products (light) → how we build a product
     (navy, each step links to its solution page) → projects we have
     built (light) → got a product idea? (navy) → FAQ (light) →
     short closing card (last, white).
   Product data: Components/Products/productsData.js (shared with the
   homepage showcase).
========================================================= */

import { useRef } from "react";

import ProductsHero from "../../Components/Products/ProductsHero/ProductsHero.jsx";
import ProductsCatalogue from "../../Components/Products/ProductsCatalogue/ProductsCatalogue.jsx";
import ServiceProcess from "../../Components/Solutions/Shared/ServiceProcess/ServiceProcess.jsx";
import ProjectShowcase from "../../Components/Common/ProjectShowcase/ProjectShowcase.jsx";
import ProductIdea from "../../Components/Products/ProductIdea/ProductIdea.jsx";
import ServiceFaq from "../../Components/Common/ServiceFaq/ServiceFaq.jsx";
import ProductsClosing from "../../Components/Products/ProductsClosing/ProductsClosing.jsx";
import { SERVICE_ROUTES } from "../../Components/Solutions/Shared/serviceLinks.js";
import useMetaDescription from "../../hooks/useMetaDescription.js";
import useScrollReveal from "../../hooks/useScrollReveal.js";
import "../../styles/pages/SolutionsPages.css";

const DESCRIPTION =
  "Products by ProJenius Innovation Technology, including the groundnut-to-peanut processing machine and the IoT Learning Kit, and how we build products from an idea.";

/* How a ProJenius product is built; each step links to the page that does it. */
const BUILD_STEPS = [
  { title: "Idea", text: "We shape what the product must do and who it is for.", to: SERVICE_ROUTES.startup, linkLabel: "Startup & Innovation" },
  { title: "Software", text: "Apps, dashboards and the logic that runs the product.", to: SERVICE_ROUTES.software, linkLabel: "Software Development" },
  { title: "PCB", text: "The circuit board designed, fabricated and tested.", to: SERVICE_ROUTES.pcb, linkLabel: "PCB Design & Fabrication" },
  { title: "Hardware", text: "Embedded firmware, sensors and devices working together.", to: SERVICE_ROUTES.hardware, linkLabel: "Hardware & Embedded" },
  { title: "Prototype", text: "Enclosure, electronics and software built into one working unit.", to: SERVICE_ROUTES.prototyping, linkLabel: "Rapid Prototyping" },
  { title: "Product", text: "A tested product, ready for real-world use." },
];

const FAQ_ITEMS = [
  {
    q: "Can ProJenius build a product from my idea?",
    a: "Yes. We take an idea through planning, software, PCB, hardware and prototyping to a working product. You can start with just the idea.",
  },
  {
    q: "I only have a rough idea. Is that enough?",
    a: "Yes. A rough idea is enough to start. We help you shape what the product must do before anything is built.",
  },
  {
    q: "Do you build both hardware and software?",
    a: "Yes. Our team works on software, PCB design, embedded hardware and the enclosure together, so the parts fit and work as one product.",
  },
  {
    q: "How long does it take to get a working prototype?",
    a: "It depends on the product. A complete prototype typically takes around 45 days once the requirement is clear. We share the timeline before we start.",
  },
  {
    q: "Can I buy or use the products shown on this page?",
    a: "Use the button on each product, or message us on WhatsApp. The groundnut processing machine has its own website with full details.",
  },
  {
    q: "Can students build their own product with ProJenius?",
    a: "Yes. Students and makers can build their own product with our lab, tools and team through Incubate at ProJenius on the Startup page.",
  },
  {
    q: "How do I start?",
    a: "Tap Discuss Your Product or message us on WhatsApp with your idea. Our team will get back to you to plan the next step.",
  },
];

export default function ProductsPage() {
  const pageRef = useRef(null);
  useMetaDescription(DESCRIPTION);
  useScrollReveal(pageRef);

  return (
    <main ref={pageRef} className="pjsv-page pj-products-page">
      <ProductsHero />
      <ProductsCatalogue />
      <ServiceProcess
        id="product-build"
        eyebrow="How We Build a Product"
        title="From Idea to"
        typed={["Working Product.", "Real-World Use."]}
        intro="Every ProJenius product goes through the same path. Each step is a service you can also use for your own product."
        steps={BUILD_STEPS}
        tone="dark"
      />
      <ProjectShowcase
        service="all"
        id="product-projects"
        eyebrow="Our Work"
        title="Projects We Have"
        typed={["Built.", "Delivered."]}
        lead="Beyond our own products, these are projects we have built for clients and partners."
      />
      <ProductIdea />
      <ServiceFaq
        id="products-faq"
        items={FAQ_ITEMS}
        askTo="/contact?type=development&from=products"
        secondary={{ label: "Build Your Product", to: "#product-idea" }}
        lead="Can't find your answer? Ask us directly. A rough idea is enough to start."
      />
      <ProductsClosing />
    </main>
  );
}
