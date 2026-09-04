import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const port = 3217;
const baseUrl = `http://127.0.0.1:${port}`;
let server;
let generatedProjectFiles;

async function preserveGeneratedProjectFiles() {
  generatedProjectFiles = await Promise.all(
    ["next-env.d.ts", "tsconfig.json"].map(async (file) => [file, await readFile(path.join(process.cwd(), file), "utf8")]),
  );
}

async function restoreGeneratedProjectFiles() {
  await Promise.all(
    generatedProjectFiles?.map(([file, contents]) => writeFile(path.join(process.cwd(), file), contents)) ?? [],
  );
}

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
  await preserveGeneratedProjectFiles();
  const nextBin = path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next");
  server = spawn(process.execPath, [nextBin, "dev", "-H", "127.0.0.1", "-p", String(port)], {
    cwd: process.cwd(),
    env: { ...process.env, SITE_VARIANT: "", NEXT_TEST_DIST_DIR: ".next-partner-room-page-test" },
    stdio: "ignore",
  });

  await waitForServer();
});

after(async () => {
  server?.kill();
  await restoreGeneratedProjectFiles();
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
  const page = await readFile(path.join(process.cwd(), "app", "partner-room", "page.tsx"), "utf8");
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
  assert.match(mobileRules, /\.headerSecondary\s*\{[^}]*display:\s*none/);
  assert.match(page, /className=\{styles\.headerSecondary\}[^>]*href="#how-rooms-decide"/);
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
  const processDescriptionRule = narrowRules.match(/\.processStep\s*>\s*p\s*\{([^}]*)\}/)?.[1] ?? "";
  const roomCtaRule = mobileRules.match(/\.roomRequestCta\s*\{([^}]*)\}/)?.[1] ?? "";

  assert.match(architectureRule, /display:\s*block/);
  assert.doesNotMatch(architectureRule, /grid-template-columns/);
  assert.match(processDescriptionRule, /grid-column:\s*2/);
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

test("keeps request CTA forwarding, request-chamber surfaces, and motion opt-out explicit", async () => {
  const css = await readFile(path.join(process.cwd(), "app", "partner-room", "partner-room.module.css"), "utf8");
  const sections = await readFile(path.join(process.cwd(), "components", "partner-room", "PartnerRoomSections.tsx"), "utf8");
  const roomLinkEnd = sections.indexOf("function SectionLabel");
  const roomLink = sections.slice(sections.indexOf("export function RoomLink"), roomLinkEnd);
  const motionRules = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));

  assert.match(roomLink, /className=\{`\$\{styles\.primaryCta\} \$\{className\}`\}/);
  assert.match(sections, /<RoomLink sourceSection="room" className=\{styles\.roomRequestCta\}/);
  assert.match(css, /\.requestSection \.formField label\s*\{[^}]*color:\s*var\(--color-bg\)/);
  assert.match(css, /\.requestSection \.formField label span\s*\{[^}]*color:\s*var\(--color-copper-soft\)/);
  assert.match(css, /\.requestSection \.formField > p:not\(\.fieldError\)\s*\{[^}]*color:\s*var\(--color-bg\)/);
  assert.match(css, /\.requestSection \.fieldError\s*\{[^}]*color:\s*var\(--color-copper-soft\)/);
  assert.match(css, /\.requestSection \.formError,[\s\S]*?background:\s*var\(--color-bg-elev\)/);
  assert.match(motionRules, /scroll-behavior:\s*auto\s*!important/);
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
  for (const source of ["architectures", "framework-secondary"]) {
    assert.match(
      html,
      new RegExp(`href="/decision-architecture-framework" data-framework-trigger(?:="true")? data-framework-source="${source}"`),
      `${source} should offer the direct framework route before JavaScript loads`,
    );
  }
});

test("renders the accessible framework dialog and the internal inline capture route", async () => {
  const homeResponse = await fetch(`${baseUrl}/partner-room`);
  const homeHtml = await homeResponse.text();
  const routeResponse = await fetch(`${baseUrl}/partner-room/decision-architecture-framework`);
  const routeHtml = await routeResponse.text();

  assert.equal(homeResponse.status, 200);
  assert.match(homeHtml, /data-framework-source="architectures"/);
  assert.match(homeHtml, /data-framework-source="framework-secondary"/);
  assert.match(homeHtml, /<dialog[^>]*aria-labelledby="framework-dialog-title"/);
  assert.match(homeHtml, /id="framework-dialog-title"[^>]*>Download the Decision Architecture Framework</);

  assert.equal(routeResponse.status, 200);
  assert.match(
    routeHtml,
    /<link rel="canonical" href="https:\/\/partnerroom\.sidmofya\.com\/decision-architecture-framework"\/?/,
  );
  assert.match(routeHtml, /<main[^>]*id="partner-room-main"/);
  assert.match(routeHtml, /href="\/">Back to Partner Room</);
  assert.match(routeHtml, /Six Ways Venture Firms Make the Same Decision Differently/);
  assert.match(routeHtml, /<form[^>]*name="partner-room-decision-architecture"/);
  assert.match(routeHtml, /Send me the framework/);
});

test("keeps each Netlify capture schema limited to its intended fields", async () => {
  const forms = await readFile(path.join(process.cwd(), "public", "__forms.html"), "utf8");
  const schema = (name) => forms.match(new RegExp(`<form[^>]*name="${name}"[\\s\\S]*?<\\/form>`))?.[0] ?? "";
  const requestSchema = schema("partner-room-seat-request");
  const frameworkSchema = schema("partner-room-decision-architecture");
  const controlNames = (markup) => [...markup.matchAll(/<(?:input|select|textarea)\b[^>]*\bname="([^"]+)"/g)].map((match) => match[1]);

  const routeResponse = await fetch(`${baseUrl}/partner-room/decision-architecture-framework`);
  const routeHtml = await routeResponse.text();
  const liveSchema = routeHtml.match(/<form[^>]*name="partner-room-decision-architecture"[\s\S]*?<\/form>/)?.[0] ?? "";

  assert.ok(requestSchema, "the room request schema should remain independently detectable");
  assert.ok(frameworkSchema, "the framework schema should be independently detectable");
  assert.equal(routeResponse.status, 200);
  assert.deepEqual(controlNames(frameworkSchema), [
    "form-name",
    "source",
    "tag",
    "utm-source",
    "utm-medium",
    "utm-campaign",
    "utm-content",
    "utm-term",
    "referral-url",
    "landing-page-url",
    "submitted-at",
    "subject",
    "bot-field",
    "first-name",
    "email",
    "role",
  ]);
  assert.deepEqual(controlNames(liveSchema), controlNames(frameworkSchema));
  assert.doesNotMatch(liveSchema, /noValidate/);
  assert.doesNotMatch(frameworkSchema, /\b(?:phone|revenue|funding|stage|availability|deck)\b/i);
});

test("renders the Request a Room form without retired seat-application details", async () => {
  const response = await fetch(`${baseUrl}/partner-room`);
  const html = await response.text();

  assert.equal(response.status, 200);
  const requestMarkup = html.slice(html.indexOf('id="request-room"'));

  for (const label of [
    "Name",
    "Email",
    "Company name",
    "Company website",
    "What round are you preparing for?",
    "When do you expect to raise?",
    "How much capital do you expect to raise?",
    "Which investors or types of investors are you likely to approach?",
    "What do you think the investment room may struggle to believe about your company?",
    "Deck or investor materials URL",
    "This is the most important question in the request. It becomes the starting point for the investor pre-read.",
    "Request a Room",
  ]) {
    assert.match(requestMarkup, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.match(requestMarkup, /<option value="Series A">Series A<\/option>/);
  assert.match(requestMarkup, /<option value="Series A extension">Series A extension<\/option>/);
  assert.match(requestMarkup, /<option value="Other">Other<\/option>/);
  assert.match(requestMarkup, /<option value="Now \/ already preparing">Now \/ already preparing<\/option>/);
  assert.match(requestMarkup, /<option value="Within 3 months">Within 3 months<\/option>/);
  assert.match(requestMarkup, /<option value="3 to 6 months">3 to 6 months<\/option>/);
  assert.match(requestMarkup, /<option value="6\+ months">6\+ months<\/option>/);
  assert.match(requestMarkup, /<option value="Not sure yet">Not sure yet<\/option>/);

  for (const forbidden of [
    /type="file"/i,
    /Request My Seat/i,
    /6 seats/i,
    /\$5,000/i,
    /response within 48 hours/i,
    /calendar/i,
    /urgency/i,
  ]) {
    assert.doesNotMatch(requestMarkup, forbidden);
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

test("renders the approved footer destinations without another request CTA", async () => {
  const response = await fetch(`${baseUrl}/partner-room`);
  const html = await response.text();
  const footer = html.match(/<footer[\s\S]*?<\/footer>/)?.[0] ?? "";

  assert.equal(response.status, 200);
  assert.match(footer, /href="https:\/\/motif54\.com"[^>]*>MOTIF 54</);
  assert.match(footer, /href="\/decision-architecture-framework"[^>]*>Decision Architecture Framework</);
  assert.match(footer, /href="https:\/\/motif54\.com\/privacy"[^>]*>Privacy</);
  assert.match(footer, /href="https:\/\/motif54\.com\/terms"[^>]*>Terms</);
  assert.doesNotMatch(footer, /href="\#request-room"|data-request-source|Request a Room/);
});
