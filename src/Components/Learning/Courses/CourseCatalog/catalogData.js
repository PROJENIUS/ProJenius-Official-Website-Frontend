/* Catalogue constants shared by CourseCatalog and ExploreOurCourses. */

export const PAGE_SIZE = 8;

export const PRICE_RANGES = [
  { id: "", label: "Any price" },
  { id: "under-10k", label: "Under ₹10,000", test: (p) => p < 1000000 },
  { id: "10k-15k", label: "₹10,000 – ₹15,000", test: (p) => p >= 1000000 && p <= 1500000 },
  { id: "above-15k", label: "Above ₹15,000", test: (p) => p > 1500000 },
];

export const SORTS = [
  { id: "", label: "Recommended" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "discount", label: "Biggest discount" },
];

export const LEVEL_LABEL = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" };
/* One word per mode so it fits the card box. Hybrid = online and offline classes. */
export const DELIVERY_SHORT = { online: "Online", "in-person": "Offline", hybrid: "Hybrid", "self-paced": "Self-paced" };
export const DELIVERY_HINT = { online: "Live online classes", "in-person": "Classes at the ProJenius centre", hybrid: "Online and offline classes", "self-paced": "Learn at your own pace" };

export const contentItemCount = (curriculum = []) =>
  curriculum.reduce((total, m) => total + (m.topics?.length || 0) + (m.lessons?.length || 0) + (m.practicalActivities?.length || 0), 0);

export const courseLevel = (item) => LEVEL_LABEL[item.level] || "";

