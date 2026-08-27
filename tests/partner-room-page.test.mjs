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

test("renders the Partner Room page with the core commercial promise", async () => {
  const response = await fetch(`${baseUrl}/partner-room`);
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /Your Series A is decided in a room you will never be in\./);
  assert.match(html, /6 live sessions over Zoom/);
  assert.match(html, /5 rotating Partner seats/);
  assert.match(html, /\$2,500 founding price/);
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
  assert.match(html, /Culture register, v0\.1/);
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
  assert.match(html, /6 seats · \$2,500 · Response within 48 hours/);
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

});

test("keeps the launch copy within the approved content contract", async () => {
  const source = await readFile(path.join(process.cwd(), "app", "partner-room", "page.tsx"), "utf8");

  assert.match(source, /Founding Room/);
  assert.doesNotMatch(source, /founding cohort/i);
  assert.match(
    source,
    /Partner Room is designed for the moment when your company is investable enough to be judged, but your raise is still early enough for that judgment to change how you show up in partner meetings\./,
  );
  assert.equal(source.match(/no sales call/gi)?.length, 1);
  assert.match(source, /\$2,500 founding price/);
  assert.doesNotMatch(source, /Calendly|testimonial|checkout|type="file"/i);
});
