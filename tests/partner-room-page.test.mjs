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

test("keeps desktop company evidence fixed with narrow and short viewport resets", async () => {
  const css = await readFile(path.join(process.cwd(), "app", "partner-room", "partner-room.module.css"), "utf8");
  const evidenceRule = css.match(/\.companyEvidenceColumn\s*\{([^}]*)\}/)?.[1] ?? "";
  const narrowStart = css.indexOf("@media (max-width: 900px)");
  const narrowEnd = css.indexOf("@media", narrowStart + 1);
  const narrowRules = css.slice(narrowStart, narrowEnd);
  const shortStart = css.indexOf("@media (min-width: 901px) and (max-height: 700px)");
  const shortEnd = css.indexOf("@media", shortStart + 1);
  const shortRules = css.slice(shortStart, shortEnd);

  assert.match(evidenceRule, /position:\s*sticky/);
  assert.match(evidenceRule, /top:\s*6\.5rem/);
  assert.match(evidenceRule, /align-self:\s*start/);
  assert.match(evidenceRule, /height:\s*max-content/);
  assert.match(narrowRules, /\.companyEvidenceColumn\s*\{[^}]*position:\s*static/);
  assert.match(narrowRules, /\.companyEvidenceColumn\s*\{[^}]*height:\s*auto/);
  assert.match(shortRules, /\.companyEvidenceColumn\s*\{[^}]*position:\s*static/);
  assert.match(shortRules, /\.companyEvidenceColumn\s*\{[^}]*height:\s*auto/);
});

test("keeps the sticky site header and seat CTA visible across responsive rules", async () => {
  const css = await readFile(path.join(process.cwd(), "app", "partner-room", "partner-room.module.css"), "utf8");
  const headerRule = css.match(/\.siteHeader\s*\{([^}]*)\}/)?.[1] ?? "";
  const responsiveStart = css.indexOf("@media (max-width: 900px)");
  const responsiveEnd = css.indexOf("@media (prefers-reduced-motion: reduce)");
  const responsiveRules = css.slice(responsiveStart, responsiveEnd);
  const mobileStart = css.indexOf("@media (max-width: 640px)");
  const mobileEnd = css.indexOf("@media", mobileStart + 1);
  const mobileRules = css.slice(mobileStart, mobileEnd);

  assert.match(headerRule, /position:\s*sticky/);
  assert.match(headerRule, /top:\s*0/);
  assert.doesNotMatch(responsiveRules, /\.siteHeader\s*\{[^}]*position:\s*static/);
  assert.doesNotMatch(responsiveRules, /\.headerInner \.primaryCta\s*\{[^}]*display:\s*none/);
  assert.match(mobileRules, /\.headerInner\s*\{[^}]*gap:\s*0\.5rem/);
  assert.match(mobileRules, /\.headerInner \.primaryCta\s*\{[^}]*white-space:\s*nowrap/);
  assert.match(mobileRules, /\.brand\s*\{[^}]*white-space:\s*nowrap/);
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

test("routes every form submit attempt through the form CTA analytics boundary once", async () => {
  const formSource = await readFile(path.join(process.cwd(), "components", "partner-room", "RequestSeatForm.tsx"), "utf8");
  const enhancementSource = await readFile(path.join(process.cwd(), "components", "partner-room", "PartnerRoomEnhancements.tsx"), "utf8");
  const handlerStart = formSource.indexOf("async function handleSubmit");
  const handlerEnd = formSource.indexOf("\n  if (status === \"success\")", handlerStart);
  const handlerSource = formSource.slice(handlerStart, handlerEnd);
  const preventDefaultIndex = handlerSource.indexOf("event.preventDefault()");
  const boundaryIndex = handlerSource.indexOf('window.dispatchEvent(new Event("partner-room:form-submit"))');
  const duplicateGuardIndex = handlerSource.indexOf("if (submittingRef.current) return");

  assert.ok(preventDefaultIndex >= 0, "The submit handler should own every mouse and keyboard submit attempt.");
  assert.ok(boundaryIndex > preventDefaultIndex, "The submit handler should emit its analytics boundary after preventing navigation.");
  assert.ok(duplicateGuardIndex > boundaryIndex, "Every submit attempt should emit before the in-flight submission guard returns.");
  assert.match(
    enhancementSource,
    /function handleFormSubmit\(\)\s*\{\s*analytics\.trackFormSubmitCta\(\);\s*\}/,
  );
  assert.match(
    enhancementSource,
    /window\.addEventListener\("partner-room:form-submit", handleFormSubmit\)/,
  );
  assert.match(enhancementSource, /target\.closest<HTMLAnchorElement>\("a\[data-cta-location\]"\)/);
  assert.equal(
    enhancementSource.match(/analytics\.trackFormSubmitCta\(\)/g)?.length,
    1,
    "The submit boundary should reach the analytics adapter exactly once.",
  );
});

test("renders the redesigned homepage through the main route group", async () => {
  const response = await fetch(baseUrl);
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /Capital\. Infrastructure\. Story\./);
  assert.match(html, />Sid Mofya</);

  // The three doors are the primary object on the page.
  assert.match(html, /MOTIF 54/);
  assert.match(html, /23° SOUTH/);
  assert.match(html, /KWAZURI/);
  assert.match(html, /Build · Publish · Imagine/);

  // The retired commercial positioning must not linger anywhere on the page.
  assert.doesNotMatch(html, /For people building across worlds/);
  assert.doesNotMatch(html, /Work With Me/);
  assert.doesNotMatch(html, /Choose the threshold you are facing/);
  assert.doesNotMatch(html, /54 Worlds/);
});

test("serves every public route through the main route group", async () => {
  for (const route of [
    "/23-south",
    "/about",
    "/contact",
    "/kwazuri",
    "/patterncognition",
    "/privacy",
    "/speaking",
  ]) {
    const response = await fetch(`${baseUrl}${route}`);
    const html = await response.text();
    assert.equal(response.status, 200, `${route} should render successfully`);
    assert.match(html, />Sid Mofya</, `${route} should retain the main-site navigation`);
  }
});

test("permanently redirects the retired services architecture", async () => {
  const redirects = {
    "/market-legibility": "/23-south",
    "/room-to-results": "https://motif54.com/",
    "/work-with-me": "/contact",
    "/briefings": "/speaking",
    "/sovereigngeometry": "/23-south",
    "/reinvention": "/contact",
    "/ai-music-rights": "/contact",
  };

  for (const [route, destination] of Object.entries(redirects)) {
    const response = await fetch(`${baseUrl}${route}`, { redirect: "manual" });
    assert.equal(response.status, 308, `${route} should redirect permanently`);
    assert.equal(
      response.headers.get("location"),
      destination,
      `${route} should redirect to ${destination}`,
    );
  }
});

test("declares every live form field for Netlify form detection", async () => {
  const declared = await readFile(
    path.join(process.cwd(), "public", "__forms.html"),
    "utf8",
  );

  for (const formName of [
    "work-request",
    "kwazuri-interest",
    "speaking-inquiry",
    "contact",
    "partner-room-seat-request",
  ]) {
    assert.match(
      declared,
      new RegExp(`name="${formName}"`),
      `${formName} must be declared or Netlify drops its submissions`,
    );
  }

  // KwaZuri permission stays scoped to KwaZuri.
  assert.match(declared, /name="tag" value="kwazuri_interest"/);
});

test("presents Selected Works as a collapsed accordion in the required order", async () => {
  const response = await fetch(`${baseUrl}/23-south`);
  const html = await response.text();

  assert.equal(response.status, 200);

  // Real Economik sits immediately before FutureCraft.
  const order = [
    "The Wealth of Resource Nations",
    "Sovereign Geometry",
    "Canon Before Capital",
    "Real Economik",
    "FutureCraft",
  ].map((title) => {
    const index = html.indexOf(title);
    assert.ok(index >= 0, `${title} should render`);
    return index;
  });

  for (let i = 1; i < order.length; i += 1) {
    assert.ok(order[i] > order[i - 1], "Selected Works should render in the required order");
  }

  // Every entry is collapsed on load, and each trigger is wired to its panel.
  assert.equal(
    (html.match(/aria-expanded="false"/g) ?? []).length >= 5,
    true,
    "all five accordion triggers should start collapsed",
  );
  assert.doesNotMatch(html, /aria-expanded="true"/);

  for (const slug of [
    "the-wealth-of-resource-nations",
    "sovereign-geometry",
    "canon-before-capital",
    "real-economik",
    "futurecraft",
  ]) {
    assert.match(html, new RegExp(`id="${slug}-trigger"`), `${slug} needs a trigger id`);
    assert.match(html, new RegExp(`aria-controls="${slug}-panel"`), `${slug} needs aria-controls`);
    assert.match(html, new RegExp(`id="${slug}-panel"`), `${slug} needs a panel id`);
  }

  // The in-page navigation anchors resolve to real sections.
  for (const id of ["premise", "sovereign-tea", "selected-works"]) {
    assert.match(html, new RegExp(`href="#${id}"`), `nav should link to #${id}`);
    assert.match(html, new RegExp(`id="${id}"`), `#${id} section should exist`);
  }
});

test("preserves the existing main-site chrome on the 404 page", async () => {
  const response = await fetch(`${baseUrl}/this-route-does-not-exist`);
  const html = await response.text();

  assert.equal(response.status, 404);
  assert.match(html, />Sid Mofya</);
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

  assert.match(html, /<title>Partner Room — See How Your Series A Gets Decided<\/title>/);
  assert.match(html, /name="description" content="Partner Room puts six Series A founders inside the investment decision process: five rooms as an investor, one as the founder\."/);
  assert.match(html, /<link rel="canonical" href="https:\/\/partnerroom\.sidmofya\.com\/?"/);
  assert.match(html, /property="og:title" content="Your Series A is decided in a room you will never be in\."/);
  assert.match(html, /property="og:description" content="Five rooms as an investor\. One as the founder\."/);
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
