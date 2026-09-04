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
  assert.match(css, /\.decisionStates\s*\{/);
  assert.match(css, /\.roomDiagram\s*\{/);
  assert.match(css, /@media\s*\(max-width:\s*900px\)/);
  assert.match(css, /@media\s*\(max-width:\s*640px\)/);
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

test("stacks decision-room layouts and preserves accessible request controls on small screens", async () => {
  const css = await readFile(path.join(process.cwd(), "app", "partner-room", "partner-room.module.css"), "utf8");
  const sections = await readFile(path.join(process.cwd(), "components", "partner-room", "PartnerRoomSections.tsx"), "utf8");
  const narrowStart = css.indexOf("@media (max-width: 900px)");
  const narrowEnd = css.indexOf("@media", narrowStart + 1);
  const narrowRules = css.slice(narrowStart, narrowEnd);
  const mobileStart = css.indexOf("@media (max-width: 640px)");
  const mobileEnd = css.indexOf("@media", mobileStart + 1);
  const mobileRules = css.slice(mobileStart, mobileEnd);
  const motionStart = css.indexOf("@media (prefers-reduced-motion: reduce)");
  const motionRules = css.slice(motionStart);
  const architectureRule = narrowRules.match(/\.architecture\s*\{([^}]*)\}/)?.[1] ?? "";
  const roomCtaRule = mobileRules.match(/\.roomRequestCta\s*\{([^}]*)\}/)?.[1] ?? "";

  assert.match(architectureRule, /display:\s*block/);
  assert.doesNotMatch(architectureRule, /grid-template-columns/);
  assert.match(sections, /className=\{styles\.roomRequestCta\}/);
  assert.match(roomCtaRule, /width:\s*100%/);
  assert.match(roomCtaRule, /min-height:\s*2\.75rem/);
  assert.match(css, /\.requestSection \.formField label\s*\{[^}]*color:\s*var\(--color-bg\)/);
  assert.match(css, /\.requestSection \.formField > p:not\(\.fieldError\)\s*\{[^}]*color:\s*var\(--color-bg\)/);
  assert.match(css, /\.requestSection \.fieldError\s*\{[^}]*color:\s*var\(--color-copper-soft\)/);
  assert.match(css, /\.requestSection \.formActions p\s*\{[^}]*color:\s*var\(--color-bg\)/);
  assert.match(css, /\.requestSection \.formField input,[\s\S]*?background:\s*var\(--color-bg-elev\)/);
  assert.match(motionRules, /animation:\s*none\s*!important/);
  assert.match(motionRules, /transition:\s*none\s*!important/);
});

test("renders the complete v4 decision-room narrative in its public order", async () => {
  const response = await fetch(`${baseUrl}/partner-room`);
  const html = await response.text();

  assert.equal(response.status, 200);
  const required = [
    "One company · Five venture investors · One live decision room",
    "Five Investors. Your Company. The Room Decides.",
    "The company is real.",
    "Advice is easy. Judgment is harder.",
    "Built by someone who sat in them.",
    "The Room Is Real. The Framework Makes It Legible.",
    "Six Ways Venture Firms Make the Same Decision Differently",
    "Same Company. Different Room.",
    "Before Your Series A Is Actually on the Line.",
    "Judgment You Can Carry Into the Raise.",
    "One Company. Five Investors. One Decision Room.",
    "The Room Is the Product.",
  ];
  for (const text of required) {
    assert.match(html, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  for (const forbidden of [
    /Request a Seat/i,
    /Request My Seat/i,
    /six founders/i,
    /6 seats/i,
    /\$5,000/i,
    /response within 48 hours/i,
    /rotating Partner seats/i,
    /live simulation/i,
    /founding price/i,
    /investor map/i,
    /all participants sign a mutual NDA/i,
  ]) {
    assert.doesNotMatch(html, forbidden);
  }

  const headings = [
    "The Meeting Goes Well. The Answer Is Still No.",
    "Five Investors. Your Company. The Room Decides.",
    "Advice is easy. Judgment is harder.",
    "Built by someone who sat in them.",
    "The Room Is Real. The Framework Makes It Legible.",
    "Six Ways Venture Firms Make the Same Decision Differently",
    "Same Company. Different Room.",
    "Before Your Series A Is Actually on the Line.",
    "Judgment You Can Carry Into the Raise.",
    "Who This Is For",
    "One Company. Five Investors. One Decision Room.",
    "The Room Is the Product.",
    "Not ready for a room yet?",
    "Request a Room",
  ];
  let previous = -1;
  for (const heading of headings) {
    const next = html.indexOf(heading, previous + 1);
    assert.ok(next > previous, `${heading} should occur in narrative order`);
    previous = next;
  }

  assert.equal((html.match(/data-deliverable=/g) ?? []).length, 3);
  assert.equal((html.match(/data-decision-state=/g) ?? []).length, 3);
  assert.equal((html.match(/data-architecture=/g) ?? []).length, 6);
  assert.equal((html.match(/data-process-stage=/g) ?? []).length, 6);
  assert.equal((html.match(/data-room-judgment=/g) ?? []).length, 3);
  assert.equal((html.match(/data-failure-type=/g) ?? []).length, 3);
  assert.equal((html.match(/data-room-attribute=/g) ?? []).length, 8);
});
test("renders room-request and framework links as server-rendered progressive-enhancement hooks", async () => {
  const response = await fetch(`${baseUrl}/partner-room`);
  const html = await response.text();

  assert.equal(response.status, 200);
  for (const source of ["nav", "hero", "room"]) {
    assert.match(
      html,
      new RegExp(`href="\\#request-room" data-request-source="${source}"`),
      `${source} should provide a room-request link`,
    );
  }
  for (const source of ["framework-primary", "framework-secondary"]) {
    assert.match(
      html,
      new RegExp(`href="/decision-architecture-framework" data-framework-trigger(?:="true")? data-framework-source="${source}"`),
      `${source} should offer the direct framework route before JavaScript loads`,
    );
  }
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

test("publishes Partner Room metadata and a renderable social image", async () => {
  const response = await fetch(`${baseUrl}/partner-room`);
  const html = await response.text();

  assert.match(html, /<title>Partner Room \| See How Your Series A Gets Decided<\/title>/);
  assert.match(html, /name="description" content="Five venture investors evaluate your company while you listen to the deliberation founders normally never hear\. A live Series A decision room facilitated by Sid Mofya\."/);
  assert.match(html, /<link rel="canonical" href="https:\/\/partnerroom\.sidmofya\.com\/?"/);
  assert.match(html, /property="og:title" content="Your Series A is decided in a room you will never be in\."/);
  assert.match(html, /property="og:description" content="Partner Room puts your company in front of five venture investors and lets you hear the deliberation that normally happens after the founder leaves\."/);
  assert.match(html, /property="og:image:alt" content="PARTNER ROOM — Your Series A is decided in a room you will never be in\."/);
  assert.doesNotMatch(html, /six Series A founders|five rooms as an investor|one as the founder/i);
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
