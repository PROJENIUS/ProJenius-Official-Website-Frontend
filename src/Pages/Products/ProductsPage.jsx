/* =========================================================
   PRODUCTS PAGE
   Everything ProJenius has built to sell or use.
   Journey: hero → index and one chapter per product (each
   with its main action and a WhatsApp chat about that
   product) → closing card (the same card as Home and About).
   Product data lives in Components/Products/productsData.js
   (shared with the homepage showcase).
========================================================= */

import { useRef } from "react";
import { Cpu, Lightbulb, PackageCheck } from "lucide-react";

import CinematicHero from "../../Components/Common/CinematicHero/CinematicHero.jsx";
import ContactSection from "../../Components/About/ContactSection/ContactSection.jsx";
import ProductsCatalogue from "../../Components/Products/ProductsCatalogue/ProductsCatalogue.jsx";
import { PRODUCTS } from "../../Components/Products/productsData.js";
import { heroPhotos } from "../../Components/Common/HeroPhotoStack/heroPhotos.js";
import useMetaDescription from "../../hooks/useMetaDescription.js";
import useScrollReveal from "../../hooks/useScrollReveal.js";
import { whatsappHref } from "../../utils/whatsapp.js";
import "../../styles/pages/SolutionsPages.css";

const CLOSING_FEATURES = [
  { title: "Idea to Plan", text: "We shape what it must do", Icon: Lightbulb },
  { title: "Prototype & Build", text: "Hardware and software together", Icon: Cpu },
  { title: "Ready to Use", text: "Built for real-world work", Icon: PackageCheck },
];

/* Hero photo: src/assets/Heroes/products/backdrop.* (see its README); the
   first product photo is used until one is added there. */
const HERO = heroPhotos("products", { backdrop: PRODUCTS.find((product) => product.image)?.image });

const DESCRIPTION =
  "Products by ProJenius Innovation Technology, including the groundnut-to-peanut processing machine, the IoT Learning Kit and 3D printing and prototyping services.";

export default function ProductsPage() {
  const pageRef = useRef(null);
  useMetaDescription(DESCRIPTION);
  useScrollReveal(pageRef);

  return (
    <main ref={pageRef} className="pjsv-page pj-products-page">
      <CinematicHero
        id="products-title"
        eyebrow="Products & Innovations"
        title="Products Engineered"
        accent="for Real-World Problems"
        description="Discover innovative products and engineering solutions developed by ProJenius to address practical challenges across industries."
        primary={{ label: "Explore Products", to: "#product-list" }}
        secondary={{ label: "Talk to Our Team", to: "/contact" }}
        photo={HERO.backdrop}
        facts={PRODUCTS.filter((product) => product.image).slice(0, 2).map((product) => ({
          label: product.category,
          title: product.title,
          to: "#product-list",
        }))}
        band={["Smarter Agriculture", "Connected Solutions", "IoT Learning Kit", "3D Printing", "Prototyping", "Product Development"]}
      />

      <ProductsCatalogue />

      <ContactSection
        id="products-cta-title"
        title="Have a Product Idea of Your Own?"
        description="Tell us what it needs to do. We will help you plan it, prototype it and build it into a product people can use."
        features={CLOSING_FEATURES}
        primary={{
          label: "Discuss Your Product",
          href: whatsappHref("Hi ProJenius, I have a product idea and would like to discuss building it with your team."),
        }}
        secondary={{ label: "Talk to Our Team", href: "tel:+918925450473" }}
      />
    </main>
  );
}
