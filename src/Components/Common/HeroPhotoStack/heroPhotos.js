/* =============================================================================
   HERO PHOTOS — reads src/assets/Heroes/<page>/
   -----------------------------------------------------------------------------
   heroPhotos(page, defaults) returns { backdrop, cards } for one page:
     backdrop  the file named backdrop.* in the folder, else defaults.backdrop
     cards     every other image in the folder (file-name order), else
               defaults.cards. The file name becomes the caption:
                 1-groundnut-machine.webp                     -> title "Groundnut machine"
                 1-smarter-agriculture__groundnut-machine.webp -> category "Smarter agriculture"
   Each folder's README.md explains this for whoever uploads the photos.
   ============================================================================= */

const FILES = import.meta.glob("../../../assets/Heroes/*/*.{webp,jpg,jpeg,png,avif}", {
  eager: true,
  import: "default",
});

const toWords = (text) => {
  const words = text.replace(/[-_]+/g, " ").trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
};

/* Group files by page folder once: { about: [{ name, image }], ... } */
const BY_PAGE = Object.entries(FILES)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .reduce((pages, [path, image]) => {
    const [folder, file] = path.split("/").slice(-2);
    const name = file.replace(/\.[^.]+$/, "");
    (pages[folder] ||= []).push({ name, image });
    return pages;
  }, {});

export function heroPhotos(page, defaults = {}) {
  const files = BY_PAGE[page] || [];
  const backdropFile = files.find((file) => file.name.toLowerCase() === "backdrop");
  const cards = files
    .filter((file) => file !== backdropFile)
    .map(({ name, image }) => {
      const clean = name.replace(/^\d+[-_ ]*/, "");
      const [category, title] = clean.includes("__") ? clean.split("__") : ["", clean];
      return { image, title: toWords(title), category: category ? toWords(category) : "", alt: toWords(title) };
    });

  return {
    backdrop: backdropFile ? backdropFile.image : defaults.backdrop || null,
    cards: cards.length ? cards : defaults.cards || [],
  };
}
