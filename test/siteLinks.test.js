import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { buildSiteLinks, buildSitemap, ROUTE_TITLES, SITE_PAGES, SITE_SECTIONS } from "../src/siteLinks.js";

const SRC = new URL("../src/", import.meta.url);
// Same rule the backend uses for admin button links.
const INTERNAL_LINK = /^(\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?\/?(?:\?[a-z0-9=&_-]*)?(?:#[a-z0-9-]+)?|#[a-z0-9-]+)$/i;

async function sourceFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const url = new URL(`${entry.name}${entry.isDirectory() ? "/" : ""}`, dir);
    return entry.isDirectory() ? sourceFiles(url) : /\.(jsx?|tsx?)$/.test(entry.name) ? [url] : [];
  }));
  return files.flat();
}

test("every fixed route in App.jsx is listed in siteLinks.js", async () => {
  const app = await readFile(new URL("App.jsx", SRC), "utf8");
  const routes = [...app.matchAll(/<Route path="([^"]+)"/g)].map((match) => match[1]);
  const fixed = routes.filter((path) => !path.includes(":") && path !== "*" && path !== "/blog");
  const listed = new Set(SITE_PAGES.map((page) => page.path));
  const missing = fixed.filter((path) => !listed.has(path));
  assert.deepEqual(missing, [], `Add these pages to src/siteLinks.js: ${missing.join(", ")}`);
  for (const page of SITE_PAGES) assert.ok(routes.includes(page.path), `${page.path} in siteLinks.js has no <Route>`);
});

test("every linkable section id exists on the website", async () => {
  const sources = (await Promise.all((await sourceFiles(SRC)).map((url) => readFile(url, "utf8")))).join("\n");
  for (const section of SITE_SECTIONS) {
    assert.ok(new RegExp(`id=["{\`']*${section.id}["}\`']|["']${section.id}["']`).test(sources), `#${section.id} (${section.label}) was not found in src`);
  }
});

test("site-links.json offers valid, unique website links", () => {
  const { links } = buildSiteLinks();
  assert.ok(links.length >= 20);
  for (const link of links) {
    assert.match(link.to, INTERNAL_LINK, link.to);
    assert.ok(link.label && link.label.length <= 60, link.to);
  }
  assert.equal(new Set(links.map((link) => link.to)).size, links.length);
  assert.ok(!links.some((link) => link.to === "/privacy-policy"), "legal pages are not offered as button links");
});

test("sitemap and titles come from the same list", () => {
  const sitemap = buildSitemap("https://example.test/");
  assert.match(sitemap, /<loc>https:\/\/example\.test\/about<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/example\.test\/incubate\/apply<\/loc>/);
  assert.doesNotMatch(sitemap, /newsletter/);
  assert.equal(ROUTE_TITLES["/about"], "About Us | ProJenius Innovation Technology");
  assert.equal(ROUTE_TITLES["/"], "Software, IoT & Embedded Company in Madurai | ProJenius");
});
