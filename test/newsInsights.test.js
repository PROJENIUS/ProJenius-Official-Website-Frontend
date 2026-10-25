import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { normalizeApiBase, resolveApiUrl } from "../src/utils/apiUrl.js";

const readSource = (path) => readFile(new URL(path, import.meta.url), "utf8");
const newsContentPath = "../src/Components/NewsInsights/NewsInsightsContent/NewsInsightsContent.jsx";
const newsStylesPath = "../src/Components/NewsInsights/NewsInsightsContent/NewsInsightsContent.css";

test("public content navigation exposes News & Insights and keeps Blog routes only for compatibility", async () => {
  const [navbar, footer, app] = await Promise.all([
    readSource("../src/Components/Common/Navbar/Navbar.jsx"),
    readSource("../src/Components/Common/Footer/Footer.jsx"),
    readSource("../src/App.jsx"),
  ]);

  assert.match(navbar, /label: "News & Insights"/);
  assert.doesNotMatch(navbar, /label: "Blog"/);
  // The footer Company list links to Join Our Team; News & Insights stays in the navbar.
  assert.match(footer, /<Link to="\/join-our-team">Join Our Team<\/Link>/);
  assert.doesNotMatch(footer, /<li><a href="\/blog"/);
  assert.match(app, /path="\/blog\/:slug" element=\{<LegacyBlogArticle \/>\}/);
});

test("News & Insights page delegates to its feature component", async () => {
  const page = await readSource("../src/Pages/NewsInsights/NewsInsightsPage.jsx");
  const component = await readSource(newsContentPath);

  assert.match(page, /<NewsInsightsContent \/>/);
  assert.match(page, /Components\/NewsInsights\/NewsInsightsContent/);
  assert.match(component, /import "\.\/NewsInsightsContent\.css"/);
});

test("editorial listing supports search, categories, typed details and separate media", async () => {
  const page = await readSource(newsContentPath);

  assert.match(page, /apiUrl\("\/api\/news"\)\}\?\$\{query\}/);
  assert.match(page, /\/api\/news\/categories/);
  assert.match(page, /\/news-insights\/\$\{item\.contentType\}/);
  assert.match(page, /pj-publishing__gallery/);
  assert.match(page, /pj-publishing__videos/);
  assert.match(page, /youtube-nocookie\.com\/embed/);
  assert.match(page, /player\.vimeo\.com\/video/);
});

test("article images use persisted references and preserve the complete image", async () => {
  const [page, styles, backend, routes, service] = await Promise.all([
    readSource(newsContentPath),
    readSource(newsStylesPath),
    readSource("../../projenius-backend/src/modules/publishing/publishing.controller.js"),
    readSource("../../projenius-backend/src/modules/publishing/publishing.routes.js"),
    readSource("../../projenius-backend/src/modules/publishing/publishing.service.js"),
  ]);

  assert.match(page, /item\.thumbnailUrl \|\| item\.thumbnailFilename/);
  assert.match(page, /item\?\.thumbnailUrl \|\| item\?\.thumbnailFilename/);
  assert.match(page, /\/api\/news\/assets\/\$\{encodeURIComponent\(imageReference\)\}/);
  assert.match(page, /console\.error\("News & Insights image failed to load"/);
  assert.doesNotMatch(page, /currentTarget\.hidden = true/);
  assert.match(styles, /\.pj-publishing__grid\s*\{[^}]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(styles, /\.pj-publishing__card\s*\{[^}]*display:\s*flex;[^}]*height:\s*520px/);
  assert.match(styles, /\.pj-publishing__card-image-box\s*\{[^}]*aspect-ratio:\s*16\s*\/\s*10/);
  assert.match(styles, /\.pj-publishing__card-image\s*\{[^}]*object-fit:\s*contain;[^}]*object-position:\s*center/);
  assert.match(styles, /\.pj-publishing__card-summary[\s\S]*-webkit-line-clamp:\s*3/);
  assert.match(styles, /\.pj-publishing__hero\s*\{[^}]*max-height:\s*min\(70vh,\s*680px\);[^}]*object-fit:\s*contain;[^}]*object-position:\s*center/);
  assert.match(styles, /@media\s*\(max-width:\s*900px\)[\s\S]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(styles, /@media\s*\(max-width:\s*600px\)[\s\S]*grid-template-columns:\s*minmax\(0,\s*1fr\)/);
  assert.match(backend, /thumbnailFilename images\.filename images\.mediaId images\.alt/);
  assert.match(routes, /router\.get\("\/news\/assets\/:filename", publicAsset\)/);
  assert.match(routes, /router\.get\("\/media\/:mediaId", publicMedia\)/);
  assert.match(service, /visible\.thumbnailUrl = cover \? publicAssetUrl/);
  assert.match(service, /\/api\/media\/\$\{image\.mediaId\}/);
});

test("public API URL resolution removes duplicated API prefixes and production localhost", () => {
  const productionBase = normalizeApiBase("https://api.projenius.example/api/", false);

  assert.equal(productionBase, "https://api.projenius.example");
  assert.equal(
    resolveApiUrl("/api/news/assets/image.jpg", productionBase),
    "https://api.projenius.example/api/news/assets/image.jpg",
  );
  assert.equal(normalizeApiBase("http://localhost:5000", false), "");
  assert.equal(
    resolveApiUrl("/api/news/assets/image.jpg", "", "https://www.projenius.example"),
    "https://www.projenius.example/api/news/assets/image.jpg",
  );
  assert.equal(
    resolveApiUrl("https://cdn.projenius.example/image.jpg", productionBase),
    "https://cdn.projenius.example/image.jpg",
  );
  assert.equal(
    resolveApiUrl("http://localhost:5000/api/news/assets/legacy.jpg", productionBase),
    "https://api.projenius.example/api/news/assets/legacy.jpg",
  );
  assert.doesNotMatch(
    resolveApiUrl(
      "http://localhost:5000/api/news/assets/legacy.jpg",
      "",
      "https://www.projenius.example",
    ),
    /localhost/i,
  );
  assert.equal(normalizeApiBase("", true), "http://localhost:5000");
});

test("course cards and details preserve complete saved cover images", async () => {
  const [page, styles] = await Promise.all([
    readSource("../src/Components/Learning/Courses/ExploreOurCourses/ExploreOurCourses.jsx"),
    readSource("../src/Components/Learning/Courses/ExploreOurCourses/ExploreOurCourses.css"),
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
  assert.match(page, /aria-label=\{`View \$\{item\.title\}`\}/, "the compact course action retains an accessible course-specific name");
  assert.match(page, /item\.badgeLabel \|\| item\.badges\?\.\[0\]/, "course cards show the validated badge, with legacy badge fallback");
  assert.match(page, /aria-current=\{activeSection === id \? "location" : undefined\}/, "detail navigation reflects the active visible section");
  assert.match(styles, /grid-auto-rows: 1fr/);
  assert.match(styles, /min-height: 390px/);
  assert.match(page, /payment does not unlock recorded lessons/);
  assert.doesNotMatch(page, /<details className="course-terms-details">/);
  assert.ok(
    page.includes('href="/terms"') && page.includes("Terms &amp; Conditions"),
    "checkout links to the general Terms page",
  );
  assert.match(page, /termsAccepted: true, termsVersion: terms\.version/);
  assert.doesNotMatch(
    page,
    /2,310 reviews|12,480 already enrolled|4\.8 Ã¢Ëœâ€¦/i,
    "unsupported demonstration metrics are not presented as real course data",
  );
});

test("public course details retain structured content and checkout", async () => {
  const [page, termsPage, termsContent, styles] = await Promise.all([
    readSource("../src/Components/Learning/Courses/ExploreOurCourses/ExploreOurCourses.jsx"),
    readSource("../src/Pages/Legal/CourseTermsPage.jsx"),
    readSource("../src/Components/Legal/CourseTerms/CourseTermsContent.jsx"),
    readSource("../src/Components/Learning/Courses/ExploreOurCourses/ExploreOurCourses.css"),
  ]);
  const fields = [
    "aboutContent",
    "highlights",
    "prerequisiteDetails",
    "experienceLevel",
    "sessionLength",
    "practicalActivities",
    "reviews",
    "relatedCourses",
    "showAllFaqs",
  ];

  for (const field of fields) {
    assert.ok(page.includes(field), `${field} is rendered or consumed`);
  }
  assert.match(page, /dangerouslySetInnerHTML=\{\{ __html: course\.aboutContent \}\}/);
  assert.match(page, /Preferred schedule \(optional\)/);
  assert.match(page, /onSubmit=\{buy\}/);
  assert.doesNotMatch(page, /Course purchase terms|Refund Policy/);
  assert.match(termsPage, /<CourseTermsContent \/>/);
  assert.match(termsContent, /document\?\.sections\s*\.slice\(\)/);
  assert.match(styles, /course-detail-related-card img[^}]*object-fit:contain/);
  assert.match(styles, /course-preferences/);
});

test("website branding uses the public logo and route-aware titles", async () => {
  const [app, html, navbar, footer, about, news, courses, logo] = await Promise.all([
    readSource("../src/App.jsx"),
    readSource("../index.html"),
    readSource("../src/Components/Common/Navbar/Navbar.jsx"),
    readSource("../src/Components/Common/Footer/Footer.jsx"),
    readSource("../src/Components/About/AboutHero/AboutHero.jsx"),
    readSource(newsContentPath),
    readSource("../src/Components/Learning/Courses/ExploreOurCourses/ExploreOurCourses.jsx"),
    readFile(new URL("../public/ProJenius_Logo.svg", import.meta.url), "utf8"),
  ]);

  assert.match(html, /href="\/ProJenius_Logo\.svg"/);
  assert.match(html, /<title>ProJenius Innovation Technology/);
  assert.match(navbar, /src="\/ProJenius_Logo\.svg"/);
  assert.match(navbar, /ProJenius<\/span><span className="logo-jenius">Innovation Technology/);
  assert.match(footer, /src="\/ProJenius_Logo\.svg"/);
  assert.match(footer, /ProJenius Innovation Technology Private Limited/);
  assert.match(about, /import logo from ["']\.\.\/\.\.\/\.\.\/assets\/About\/AboutHero\/AboutHero_1\.png["']/);
  assert.match(about, /src=\{logo\}/);
  assert.doesNotMatch(navbar + footer, /from ["'][^"']*(?:NavbarHero_1|FooterHero_1)/);
  assert.match(app, /ROUTE_TITLES/);

  const routes = [
    "/about",
    "/contact",
    "/services/development",
    "/services/courses/terms",
    "/services/internship",
    "/services/career-guidance",
    "/workshop",
    "/startup",
    "/join-our-team",
    "/newsletter/confirm",
  ];
  for (const route of routes) {
    assert.ok(app.includes(`"${route}"`), `${route} has a page title`);
  }

  assert.match(news, /ProJenius Innovation Technology/);
  assert.match(courses, /ProJenius Innovation Technology/);
  assert.match(logo, /<svg[\s\S]+<path/);
});
