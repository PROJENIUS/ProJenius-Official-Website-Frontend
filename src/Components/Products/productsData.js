/* =============================================================================
   PRODUCTS — SHARED DATA
   -----------------------------------------------------------------------------
   One list for the homepage showcase (OurProducts) and the Products page.
   Five product slots: two real products and three slots to fill in later.

   Fields
     id           anchor id on the Products page (/products#id)
     category     short label above the name
     title        product name
     problem      one line: the real-world problem the product solves
     description  one or two sentences on what it does
     features     3–4 short feature points (shown as ticks)
     tags         short chips (industry, technology)
     image / alt  a real photo of the product; null shows the animated
                  "product preview" placeholder until a photo is added.
                  ADDING A PHOTO: put the file in src/assets/Products/ named
                  after the product id (for example product-03.webp). It is
                  picked up automatically; no code change needed.
     link         main button: { label, href, external }
     showOnHome   true = also shown in the homepage showcase
     placeholder  true = slot not filled yet; replace its name, category,
                  text, features and image with the real product, then
                  remove this flag (and set showOnHome if wanted)

   WhatsApp: every product gets a "Chat on WhatsApp" button that opens a chat
   (number in src/utils/whatsapp.js) with a message naming that product.
   ============================================================================= */

import groundnutMachineImage from "../../assets/Home/ProductsAndInnovations/OurProducts_1.webp";
import iotKitImage from "../../assets/Home/ProductsAndInnovations/OurProducts_2.webp";
import { whatsappHref } from "../../utils/whatsapp.js";

/* IoT Learning Kit has its own page. Put its address here when it is ready
   (for example "/products/iot-learning-kit" or "https://iotkit.projenius.in"). */
const IOT_KIT_PAGE = "";

// Photos dropped into src/assets/Products/, keyed by file name without extension.
const PRODUCT_PHOTOS = Object.fromEntries(
  Object.entries(
    import.meta.glob("../../assets/Products/*.{webp,jpg,jpeg,png,avif}", { eager: true, import: "default" })
  ).map(([path, url]) => [path.split("/").pop().replace(/\.[^.]+$/, ""), url])
);

export function productWhatsAppHref(product) {
  return whatsappHref(`Hi ProJenius, I'm interested in the ${product.title}. Could you please share more details?`);
}

const placeholder = (n) => ({
  // PLACEHOLDER — replace with the real product.
  id: `product-0${n}`,
  category: "Coming Soon",
  title: `ProJenius Product 0${n}`,
  problem: "A new ProJenius product is on its way.",
  description: "Details of this product will be published here soon. Message us on WhatsApp to know more about it.",
  features: [],
  tags: [],
  image: null,
  alt: "",
  link: { label: "Ask About This Product", href: "/contact" },
  showOnHome: false,
  placeholder: true,
});

const PRODUCT_LIST = [
  {
    id: "groundnut-processing-machine",
    category: "Smarter Agriculture",
    title: "Groundnut-to-Peanut Processing, Sorting & Grading Machine",
    problem: "Processing groundnuts by hand is slow, uneven and hard to grade for export.",
    description:
      "A complete groundnut-to-peanut processing solution that breaks groundnut shells, separates dust, sorts peanuts by quality, grades them by size, measures weight, predicts oil potential, and supports export-quality testing.",
    features: [
      "Breaks shells and separates dust",
      "Sorts peanuts by quality",
      "Grades by size and measures weight",
      "Predicts oil potential for export testing",
    ],
    tags: ["Agriculture", "Machine", "Automation"],
    image: groundnutMachineImage,
    alt: "Groundnut-to-peanut processing, sorting and grading machine",
    link: { label: "Visit Product Website", href: "https://gnut2pnut.projenius.in", external: true },
    showOnHome: true,
  },
  {
    id: "iot-learning-kit",
    category: "Connected Solutions",
    title: "ProJenius IoT Learning Kit",
    problem: "Students learn IoT from slides, without real hardware in their hands.",
    description:
      "Hands-on IoT learning kits that help students understand sensors, microcontrollers, connectivity, and automation through practical hardware and software projects.",
    features: [
      "Real sensors and microcontrollers",
      "Connectivity and automation projects",
      "Hardware and software together",
      "Built for hands-on learning",
    ],
    tags: ["Education", "IoT", "Hardware"],
    image: iotKitImage,
    alt: "ProJenius IoT Learning Kit box",
    link: IOT_KIT_PAGE
      ? { label: "View IoT Kit Page", href: IOT_KIT_PAGE, external: /^https?:/.test(IOT_KIT_PAGE) }
      : { label: "Ask About This Kit", href: "/contact" },
    showOnHome: true,
  },
  placeholder(3),
  placeholder(4),
  placeholder(5),
];

/* A photo in src/assets/Products/<id>.* takes priority over the image above. */
export const PRODUCTS = PRODUCT_LIST.map((product) =>
  PRODUCT_PHOTOS[product.id]
    ? { ...product, image: PRODUCT_PHOTOS[product.id], alt: product.alt || product.title }
    : product
);
