/* =============================================================================
   PRODUCTS — SHARED DATA
   -----------------------------------------------------------------------------
   One list for the homepage showcase (OurProducts) and the Products page.

   Fields
     id           anchor id on the Products page (/products#id)
     category     short label above the name
     title        product name
     description  one or two sentences
     image / alt  a real photo of the product; null shows the animated
                  "product preview" placeholder until a photo is added.
                  ADDING A PHOTO: put the file in src/assets/Products/ named
                  after the product id (for example product-04.webp or
                  3d-printing-prototyping.jpg). It is picked up automatically
                  and replaces the image set here; no code change needed.
     link         main button: { label, href, external }
     showOnHome   true = also shown in the homepage showcase
     placeholder  true = temporary entry; replace its name, category,
                  description and image with the real product, then
                  remove this flag

   WhatsApp: every product gets a "Chat on WhatsApp" button that opens a chat
   (number in src/utils/whatsapp.js) with a message naming that product.
   ============================================================================= */

import groundnutMachineImage from "../../assets/Home/OurProducts/OurProducts_1.webp";
import iotKitImage from "../../assets/Home/OurProducts/OurProducts_2.webp";
import { whatsappHref } from "../../utils/whatsapp.js";

// Photos dropped into src/assets/Products/, keyed by file name without extension.
const PRODUCT_PHOTOS = Object.fromEntries(
  Object.entries(
    import.meta.glob("../../assets/Products/*.{webp,jpg,jpeg,png,avif}", { eager: true, import: "default" })
  ).map(([path, url]) => [path.split("/").pop().replace(/\.[^.]+$/, ""), url])
);

export function productWhatsAppHref(product) {
  return whatsappHref(`Hi ProJenius, I'm interested in the ${product.title}. Could you please share more details?`);
}

const PRODUCT_LIST = [
  {
    id: "groundnut-processing-machine",
    category: "Smarter Agriculture",
    title: "Groundnut-to-Peanut Processing, Sorting & Grading Machine",
    description:
      "A complete groundnut-to-peanut processing solution that breaks groundnut shells, separates dust, sorts peanuts by quality, grades them by size, measures weight, predicts oil potential, and supports export-quality testing.",
    image: groundnutMachineImage,
    alt: "Groundnut-to-peanut processing, sorting and grading machine",
    link: { label: "Visit Product Website", href: "https://gnut2pnut.projenius.in", external: true },
    showOnHome: true,
  },
  {
    id: "iot-learning-kit",
    category: "Connected Solutions",
    title: "ProJenius IoT Learning Kit",
    description:
      "Hands-on IoT learning kits that help students understand sensors, microcontrollers, connectivity, and automation through practical hardware and software projects.",
    image: iotKitImage,
    alt: "ProJenius IoT Learning Kit box",
    link: { label: "Ask About This Product", href: "/contact" },
    showOnHome: true,
  },
  {
    id: "3d-printing-prototyping",
    category: "3D Printing & Services",
    title: "ProJenius 3D Printing & Prototyping Services",
    description:
      "3D printing and rapid prototyping services for product concepts, custom components, functional parts, models, and development-ready prototypes.",
    image: null,
    alt: "",
    link: { label: "Ask About This Service", href: "/contact" },
    showOnHome: true,
  },
  {
    // PLACEHOLDER — replace with the real product.
    id: "product-04",
    category: "Product Category",
    title: "ProJenius Product 04",
    description:
      "Details of this product will be published here soon. Message us on WhatsApp to know more about it.",
    image: null,
    alt: "",
    link: { label: "Ask About This Product", href: "/contact" },
    showOnHome: false,
    placeholder: true,
  },
  {
    // PLACEHOLDER — replace with the real product.
    id: "product-05",
    category: "Product Category",
    title: "ProJenius Product 05",
    description:
      "Details of this product will be published here soon. Message us on WhatsApp to know more about it.",
    image: null,
    alt: "",
    link: { label: "Ask About This Product", href: "/contact" },
    showOnHome: false,
    placeholder: true,
  },
];

/* A photo in src/assets/Products/<id>.* takes priority over the image above. */
export const PRODUCTS = PRODUCT_LIST.map((product) =>
  PRODUCT_PHOTOS[product.id]
    ? { ...product, image: PRODUCT_PHOTOS[product.id], alt: product.alt || product.title }
    : product
);
