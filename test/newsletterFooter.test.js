import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("footer newsletter consent is associated with its submit form and reports validation", async () => {
  const source = await readFile(new URL("../src/Components/Common/Footer/Footer.jsx", import.meta.url), "utf8");
  assert.match(source, /<form id="footer-newsletter-form" onSubmit=\{handleNewsletter\}>/);
  assert.match(source, /form="footer-newsletter-form" name="consent" type="checkbox" required/);
  assert.match(source, /form\.elements\.namedItem\("consent"\)/);
  assert.match(source, /Please agree to receive email updates before subscribing\./);
  assert.match(source, /Enter a valid email address to subscribe\./);
  assert.match(source, /fetch\(resolveApiUrl\("\/api\/newsletter\/subscribe", apiBase, window\.location\.origin\)/);
  assert.match(source, /newsletterSubmitting\.current = false/);
  assert.match(source, /if \(newsletterSubmitting\.current\) return/);
  assert.match(source, /type="submit" disabled=\{newsletterState\.busy\}/);
  assert.match(source, /\["subscribed", "already_subscribed"\]/);
  assert.doesNotMatch(source, /confirmation_required|pending_confirmation|check your email to confirm/i);
  assert.match(source, /warning: \["queued", "failed"\]\.includes\(body\.emailStatus\)/);
  assert.match(source, /newsletterState\.warning \? " is-warning"/);
  const styles = await readFile(new URL("../src/Components/Common/Footer/Footer.css", import.meta.url), "utf8");
  assert.match(styles, /\.pjh-footer__news-msg\.is-warning/);
  assert.match(source, /form\.reset\(\)/);
  assert.match(source, /catch \(error\)/);
});
