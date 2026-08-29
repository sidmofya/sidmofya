import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";

const port = 3217;
const baseUrl = `http://127.0.0.1:${port}`;
let server;

async function waitForServer() {
  const deadline = Date.now() + 60_000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseUrl, { redirect: "manual" });
      if (response.status > 0) return;
    } catch {
      // The development server is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error("Next.js development server did not start within 60 seconds.");
}

before(async () => {
  const nextBin = path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next");
  server = spawn(process.execPath, [nextBin, "dev", "-H", "127.0.0.1", "-p", String(port)], {
    cwd: process.cwd(),
    env: { ...process.env, SITE_VARIANT: "" },
    stdio: "ignore",
  });

  await waitForServer();
});

after(() => {
  server?.kill();
});

test("uses the parent MOTIF 54 tokens without the legacy palette or mobile floating CTA", async () => {
  const css = await readFile(path.join(process.cwd(), "app", "partner-room", "partner-room.module.css"), "utf8");

  assert.match(css, /var\(--color-bg\)/);
  assert.match(css, /var\(--color-ink\)/);
  assert.match(css, /var\(--color-copper\)/);
  assert.doesNotMatch(css, /--pr-(?:ink|ivory|copper|coral|bg)/);
  assert.doesNotMatch(css, /\.mobileSticky/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});

test("renders the approved Partner Room v3 commercial narrative", async () => {
  const response = await fetch(`${baseUrl}/partner-room`);
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /Five Rooms as an Investor\. One as the Founder\./);
  assert.match(html, /Then the founder goes silent\./);
  assert.match(html, /The room decides in front of them\./);
  assert.match(html, /Structured Disagreement/);
  assert.match(html, /Same Company\. Different Room\./);
  assert.match(html, /storytelling problem/i);
  assert.match(html, /evidence problem/i);
  assert.match(html, /underwriting problem/i);
  assert.match(html, /28 September/);
  assert.match(html, /15 October 2026/);
  assert.match(html, /\$5,000/);
  assert.match(html, /A working venture investor (?:also sits|in every room)/i);

  const headings = [
    "The Meeting Goes Well. The Answer Is Still No.",
    "Five Rooms as an Investor. One as the Founder.",
    "Built by someone who sat in them.",
    "Six Recurring Decision Architectures",
    "Same Company. Different Room.",
    "Before Your Series A Is Actually on the Line.",
    "Judgment you can carry into the raise.",
    "Who This Is For",
    "The Founding Room",
    "The room is the product.",
    "Request a Seat",
  ];
  let previous = -1;
  for (const heading of headings) {
    const next = html.indexOf(heading, previous + 1);
    assert.ok(next > previous, `${heading} should occur in narrative order`);
    previous = next;
  }

  const pageSource = await readFile(path.join(process.cwd(), "app", "partner-room", "page.tsx"), "utf8");
  const contentSource = await readFile(path.join(process.cwd(), "components", "partner-room", "content.ts"), "utf8");
  assert.doesNotMatch(`${pageSource}\n${contentSource}`, /\$2,500|institutional Seed|6 Decisions/);
});

test("places seat-request CTAs at the approved narrative locations without a footer CTA", async () => {
  const response = await fetch(`${baseUrl}/partner-room`);
  const html = await response.text();

  assert.equal(response.status, 200);
  for (const location of ["nav", "hero", "architectures", "founding-room"]) {
    assert.match(
      html,
      new RegExp(`href="\\#request-seat" data-cta-location="${location}"`),
      `${location} should provide a seat-request CTA`,
    );
  }

  const architecturesStart = html.indexOf('id="architectures"');
  const architecturesCta = html.indexOf('data-cta-location="architectures"', architecturesStart);
  const sameCompanyStart = html.indexOf('id="same-company"');
  assert.ok(architecturesCta > architecturesStart, "The architecture CTA should follow the architectures section.");
  assert.ok(architecturesCta < sameCompanyStart, "The architecture CTA should precede the same-company section.");
  assert.match(html, /<h2[^>]*id="request-seat-title"[^>]*tabindex="-1"/);
  assert.doesNotMatch(html, /data-cta-location="footer"/);
});

test("preserves the existing homepage through the main route group", async () => {
  const response = await fetch(baseUrl);
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /For people building across worlds\./);
  assert.match(html, />Sid Mofya</);
});

test("preserves every existing public route through the main route group", async () => {
  for (const route of [
    "/about",
    "/ai-music-rights",
    "/market-legibility",
    "/patterncognition",
    "/reinvention",
    "/room-to-results",
    "/sovereigngeometry",
    "/speaking",
    "/work-with-me",
  ]) {
    const response = await fetch(`${baseUrl}${route}`);
    const html = await response.text();
    assert.equal(response.status, 200, `${route} should render successfully`);
    assert.match(html, />Sid Mofya</, `${route} should retain the main-site navigation`);
  }
});

test("preserves the existing main-site chrome on the 404 page", async () => {
  const response = await fetch(`${baseUrl}/this-route-does-not-exist`);
  const html = await response.text();

  assert.equal(response.status, 404);
  assert.match(html, />Sid Mofya</);
  assert.match(html, /For capital-facing work, visit/);
  assert.match(html, /Not here\./);
});

test("renders the complete seat-request contract without a file upload", async () => {
  const response = await fetch(`${baseUrl}/partner-room`);
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /name="partner-room-seat-request"/);
  assert.match(html, /name="company-website"/);
  assert.match(html, /name="raise-timing"/);
  assert.match(html, /name="investor-targets"/);
  assert.match(html, /name="room-concern"/);
  assert.match(html, /name="deck-url"/);
  assert.match(html, /Request My Seat/i);
  assert.match(html, /<option value="Series A">Series A<\/option>/);
  assert.match(html, /<option value="Other">Other<\/option>/);
  assert.doesNotMatch(html, /<option value="Seed">/);
  assert.doesNotMatch(html, /Raising now/);
  assert.match(
    html,
    /If you join the room, it becomes the starting point for your founder-session pre-read\./,
  );
  assert.match(html, /6 seats · \$5,000 · Response within 48 hours/);
  assert.doesNotMatch(html, /type="file"/);
});

test("publishes Partner Room metadata and a renderable social image", async () => {
  const response = await fetch(`${baseUrl}/partner-room`);
  const html = await response.text();

  assert.match(html, /<title>Partner Room \| Rehearse the Room That Decides Your Series A<\/title>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/partnerroom\.sidmofya\.com\/?"/);
  assert.match(html, /property="og:title" content="Partner Room \| Rehearse the Room That Decides Your Series A"/);
  assert.match(html, /property="og:image:width" content="1200"/);
  assert.match(html, /property="og:image:height" content="630"/);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  assert.match(html, /name="twitter:image" content="[^"]+\/partner-room\/opengraph-image[^"]*"/);

  const imageMatch = html.match(/property="og:image" content="([^"]+)"/);
  assert.ok(imageMatch, "Open Graph image metadata should be present.");
  const imageUrl = new URL(imageMatch[1]);
  const imageResponse = await fetch(`${baseUrl}${imageUrl.pathname}${imageUrl.search}`);
  assert.equal(imageResponse.status, 200);
  assert.equal(imageResponse.headers.get("content-type"), "image/png");
});

test("serves a static Netlify detection form with the complete Partner Room schema", async () => {
  const response = await fetch(`${baseUrl}/__forms.html`);
  const html = await response.text();

  assert.equal(response.status, 200);
  const formNameIndex = html.indexOf('name="partner-room-seat-request"');
  const formStart = html.lastIndexOf("<form", formNameIndex);
  assert.notEqual(formStart, -1, "Partner Room detection form should be present");
  const formEnd = html.indexOf("</form>", formStart);
  const form = html.slice(formStart, formEnd);
  const fields = [...form.matchAll(/<(?:input|select|textarea)[^>]*\sname="([^"]+)"/g)]
    .map((match) => match[1])
    .sort();

  const liveResponse = await fetch(`${baseUrl}/partner-room`);
  const liveHtml = await liveResponse.text();
  const liveFormNameIndex = liveHtml.indexOf('name="partner-room-seat-request"');
  const liveFormStart = liveHtml.lastIndexOf("<form", liveFormNameIndex);
  const liveFormEnd = liveHtml.indexOf("</form>", liveFormStart);
  const liveFields = [...liveHtml.slice(liveFormStart, liveFormEnd).matchAll(/<(?:input|select|textarea)[^>]*\sname="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((field) => field !== "form-name")
    .sort();

  assert.deepEqual(fields, [
    "bot-field",
    "company",
    "company-website",
    "deck-url",
    "email",
    "investor-targets",
    "landing-page-url",
    "name",
    "raise-timing",
    "referral-url",
    "room-concern",
    "round",
    "subject",
    "submitted-at",
    "utm-campaign",
    "utm-content",
    "utm-medium",
    "utm-source",
    "utm-term",
  ].sort());
  assert.deepEqual(fields, liveFields);
  assert.doesNotMatch(form, /Seed|Raising now/);
});
