import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { normalizeApiBase, resolveApiUrl } from "../src/utils/apiUrl.js";

const readSource = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("public content navigation exposes News & Insights and keeps Blog routes only for compatibility", async () => {
  const [navbar, footer, app] = await Promise.all([
    readSource("../src/Components/Common/Navbar/Navbar.jsx"),
    readSource("../src/Components/Common/Footer/Footer.jsx"),
    readSource("../src/App.jsx"),
  ]);
  assert.match(navbar, /label: "News & Insights"/);
  assert.doesNotMatch(navbar, /label: "Blog"/);
  assert.match(footer, /News &amp; Insights/);
  assert.doesNotMatch(footer, /<li><a href="\/blog"/);
  assert.match(app, /path="\/blog\/:slug" element=\{<LegacyBlogArticle \/>\}/);
});

test("public editorial page uses mixed listing, category/search filters, typed details and separate media galleries", async () => {
  const page = await readSource("../src/Pages/NewsInsights.jsx");
  assert.match(page, /apiUrl\("\/api\/news"\)\}\?\$\{query\}/);
  assert.match(page, /\/api\/news\/categories/);
  assert.match(page, /\/news-insights\/\$\{item\.contentType\}/);
  assert.match(page, /pj-publishing__gallery/);
  assert.match(page, /pj-publishing__videos/);
  assert.match(page, /youtube-nocookie\.com\/embed/);
  assert.match(page, /player\.vimeo\.com\/video/);
});

test("public News & Insights cards and details render persisted cover references with visible load diagnostics", async () => {
  const [page, styles, backend, routes, service] = await Promise.all([
    readSource("../src/Pages/NewsInsights.jsx"),
    readSource("../src/Pages/NewsInsights.css"),
    readSource("../../projenius-backend/src/modules/publishing/publishing.controller.js"),
    readSource("../../projenius-backend/src/modules/publishing/publishing.routes.js"),
    readSource("../../projenius-backend/src/modules/publishing/publishing.service.js"),
  ]);
  assert.match(page, /item\.thumbnailUrl \|\| item\.thumbnailFilename/);
  assert.match(page, /data\.item\.thumbnailUrl \|\| data\.item\.thumbnailFilename/);
  assert.match(page, /\/api\/news\/assets\/\$\{encodeURIComponent\(reference\)\}/);
  assert.match(page, /console\.error\("News & Insights image failed to load"/);
  assert.doesNotMatch(page, /currentTarget\.hidden = true/);
  assert.match(styles, /pj-publishing__grid\{display:grid;grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
  assert.match(styles, /\.pj-publishing__card\{display:flex;flex-direction:column;min-width:0;height:520px\}/);
  assert.match(styles, /pj-publishing__card-image-box\{flex:0 0 auto;width:100%;aspect-ratio:16\/10/);
  assert.match(styles, /pj-publishing__card-image\{display:block;width:100%;height:100%;object-fit:contain;object-position:center\}/);
  assert.match(styles, /pj-publishing__card-summary[\s\S]*-webkit-line-clamp:3/);
  assert.match(styles, /pj-publishing__hero\{display:block;width:100%;height:auto;max-height:min\(70vh,680px\);object-fit:contain;object-position:center\}/);
  assert.match(styles, /@media\(max-width:900px\)[\s\S]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(styles, /@media\(max-width:600px\)[\s\S]*grid-template-columns:minmax\(0,1fr\)/);
  assert.match(backend, /thumbnailFilename images\.filename images\.mediaId images\.alt/);
  assert.match(routes, /router\.get\("\/news\/assets\/:filename", publicAsset\)/);
  assert.match(routes, /router\.get\("\/media\/:mediaId", publicMedia\)/);
  assert.match(service, /visible\.thumbnailUrl = cover \? publicAssetUrl/);
  assert.match(service, /\/api\/media\/\$\{image\.mediaId\}/);
});

test("public API URL resolution removes duplicated API prefixes and never uses localhost in production", () => {
  const productionBase = normalizeApiBase("https://api.projenius.example/api/", false);
  assert.equal(productionBase, "https://api.projenius.example");
  assert.equal(resolveApiUrl("/api/news/assets/image.jpg", productionBase), "https://api.projenius.example/api/news/assets/image.jpg");
  assert.equal(normalizeApiBase("http://localhost:5000", false), "");
  assert.equal(resolveApiUrl("/api/news/assets/image.jpg", "", "https://www.projenius.example"), "https://www.projenius.example/api/news/assets/image.jpg");
  assert.equal(resolveApiUrl("https://cdn.projenius.example/image.jpg", productionBase), "https://cdn.projenius.example/image.jpg");
  assert.equal(resolveApiUrl("http://localhost:5000/api/news/assets/legacy.jpg", productionBase), "https://api.projenius.example/api/news/assets/legacy.jpg");
  assert.doesNotMatch(resolveApiUrl("http://localhost:5000/api/news/assets/legacy.jpg", "", "https://www.projenius.example"), /localhost/i);
  assert.equal(normalizeApiBase("", true), "http://localhost:5000");
});

test("course cards and details preserve the complete saved cover image", async () => {
  const [page, styles] = await Promise.all([
    readSource("../src/Components/Courses/ExploreOurCourses/ExploreOurCourses.jsx"),
    readSource("../src/Components/Courses/ExploreOurCourses/ExploreOurCourses.css"),
  ]);
  assert.match(page, /resolveApiUrl\(item\.coverImage\.url, API, window\.location\.origin\)/);
  assert.match(page, /resolveApiUrl\(course\.coverImage\.url, API, window\.location\.origin\)/);
  assert.match(styles, /\.explore-page \.media img \{ display:block; width:100%; height:100%; object-fit:contain; object-position:center;/);
  assert.match(styles, /\.course-detail-hero__imagebox img \{ display:block; width:100%; height:100%; min-height:280px; max-height:390px; object-fit:contain; object-position:center;/);
  assert.match(page, /course-detail-hero/);
  assert.match(page, /course-detail-tabs/);
  assert.match(page, /course-detail-purchase/);
  assert.match(page, /course\.curriculum/);
  assert.match(page, /course\.projects/);
  assert.match(page, /course\.faqs/);
  assert.match(page, /onSubmit=\{buy\}/, "the existing course purchase form remains connected");
  assert.doesNotMatch(page, /2,310 reviews|12,480 already enrolled|4\.8 ★/i, "unsupported demonstration metrics are not presented as real course data");
});
