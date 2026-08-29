# Partner Room v3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `partnerroom.sidmofya.com` as the v3 editorial decision-room experience and qualified Series A seat-request flow.

**Architecture:** Keep the existing Next.js route, subdomain middleware, and Netlify Forms backend. Move approved copy into typed structured data, compose the page from server-rendered section components, and isolate optional scroll/analytics behavior in small client modules so the full page works without JavaScript.

**Tech Stack:** Next.js 15.5, React 19, TypeScript, CSS Modules, Netlify Forms, Plausible, Node test runner.

**Spec:** `docs/superpowers/specs/2026-08-28-partner-room-v3-design.md`

## Global Constraints

- The approved `Partner Room copy v3.pdf` attached to this task is the verbatim editorial source; do not rewrite its prose.
- Use only the existing MOTIF 54 tokens from `app/globals.css`; do not retain or create a separate Partner Room palette.
- Commercial facts are six founders, six rooms, three weeks, 90 minutes per session, one Founder seat, five Partner seats, one working venture investor per room, $5,000, 28 September-15 October 2026, Mondays and Thursdays at 10:00am ET.
- CTA links read `Request a Seat`; the form submit reads `Request My Seat`. Place them only in the header, hero, after architectures, Founding Room, and form.
- Keep Netlify Forms, first-touch attribution, URL-based optional materials, and `partnerroom.sidmofya.com` routing intact.
- Do not add an animation library, file upload, checkout, Calendly, portrait, investor logos, testimonial, mailing-list CTA, or secondary page.
- All content must remain server rendered, semantically ordered, keyboard accessible, WCAG AA, and intelligible with JavaScript or motion disabled.

---

### Task 1: Approved Copy Model and Server-Rendered Page

**Files:**
- Create: `components/partner-room/content.ts`
- Create: `components/partner-room/PartnerRoomSections.tsx`
- Create: `components/partner-room/DecisionArchitectures.tsx`
- Create: `components/partner-room/SameCompanyDifferentRoom.tsx`
- Modify: `app/partner-room/page.tsx`
- Modify: `tests/partner-room-page.test.mjs`

**Interfaces:**
- Produces: `architectures`, `companyEvidence`, `roomJudgments`, `risks`, `outcomes`, `foundingFacts`, `fitCopy`, and `partnerRoomCopy` from `content.ts`.
- Produces: `PartnerRoomSections`, `DecisionArchitectures`, and `SameCompanyDifferentRoom` server components consumed by `page.tsx`.
- Requires stable section IDs: `failure-mode`, `mechanism`, `architectures`, `same-company`, `company-risk`, `founding-room`, and `request-seat`.

- [ ] **Step 1: Replace the launch-copy assertions with the v3 contract**

Add assertions that require the new commercial facts, narrative order, exact mechanism, exact diagnosis, and forbidden legacy copy:

```js
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
assert.doesNotMatch(html, /\$2,500|institutional Seed|6 Decisions/);

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
  const next = html.indexOf(heading);
  assert.ok(next > previous, `${heading} should occur in narrative order`);
  previous = next;
}
```

- [ ] **Step 2: Run the page contract and verify it fails on legacy content**

Run: `node --test --test-concurrency=1 tests/partner-room-page.test.mjs`

Expected: FAIL because the current page still publishes `$2,500`, Seed positioning, and the old section sequence.

- [ ] **Step 3: Create the typed content source**

Define and export the exact shared shapes:

```ts
export type Architecture = {
  number: string;
  name: string;
  description: string;
  question: string;
};

export type RoomJudgment = {
  room: string;
  architecture: string;
  judgment: string;
  consequence: string;
};

export type NumberedItem = {
  number: string;
  title: string;
  body: readonly string[];
};
```

Transcribe the PDF copy verbatim into structured exports. In particular, the data values must include:

```ts
export const companyEvidence = [
  "$2.1M ARR.",
  "Strong founder-market fit.",
  "A rapidly expanding category.",
  "A technical advantage that appears genuinely difficult to reproduce.",
  "Weak retention evidence.",
  "An expensive go-to-market motion that has not yet been proven at scale.",
] as const;

export const risks = [
  { title: "A storytelling problem.", description: "The evidence exists, but the case is not legible." },
  { title: "An evidence problem.", description: "The claim matters, but the proof is not yet strong enough." },
  { title: "An underwriting problem.", description: "The uncertainty is real and the question is whether the right investor is willing and structurally able to own it." },
] as const;

export const foundingFacts = [
  "6 founders",
  "6 live Zoom sessions",
  "Mondays and Thursdays",
  "90 minutes per session · 10:00am ET",
  "1 real company per room",
  "1 Founder seat",
  "5 rotating Partner seats",
  "A working venture investor in every room",
  "$5,000 founding price",
] as const;
```

Use the PDF's six exact architecture descriptions/questions, three exact room judgments/consequences, four outcomes, fit prose, facilitator copy, curation/confidentiality/preparation copy, hero, failure mode, and mechanism prose. Preserve British spellings in the source (`organise`, `enrol`) and typographic punctuation.

- [ ] **Step 4: Build focused server components and a composition-only route**

Keep `app/partner-room/page.tsx` to header/main/footer composition. Render semantic `<section aria-labelledby>` elements from `PartnerRoomSections.tsx`; render the two complex comparisons in their dedicated components. Give every architecture and room judgment a stable data attribute for progressive enhancement:

```tsx
<article
  id={`architecture-${architecture.number}`}
  data-architecture={architecture.number}
  aria-labelledby={`architecture-${architecture.number}-title`}
>
  <span aria-hidden="true">{architecture.number}</span>
  <h3 id={`architecture-${architecture.number}-title`}>{architecture.name}</h3>
  <p>{architecture.description}</p>
  <p>{architecture.question}</p>
</article>
```

Keep the process sequence as an ordered list and make the decisive statements ordinary text, not images. Use a shared `SeatLink({ location })` that emits `data-cta-location` and points to `#request-seat`. Do not render a footer CTA.

- [ ] **Step 5: Run the page contract and full static route tests**

Run: `node --test --test-concurrency=1 tests/partner-room-page.test.mjs tests/partner-room-routing.test.mjs tests/partner-room-variant.test.mjs`

Expected: PASS; the Partner Room copy is updated while main-site pages and subdomain routing remain unchanged.

- [ ] **Step 6: Commit the content architecture**

```bash
git add app/partner-room/page.tsx components/partner-room/content.ts components/partner-room/PartnerRoomSections.tsx components/partner-room/DecisionArchitectures.tsx components/partner-room/SameCompanyDifferentRoom.tsx tests/partner-room-page.test.mjs
git commit -m "feat: rebuild Partner Room v3 narrative"
```

---

### Task 2: MOTIF 54 Editorial Visual System

**Files:**
- Modify: `app/partner-room/partner-room.module.css`
- Modify: `components/partner-room/PartnerRoomSections.tsx`
- Modify: `components/partner-room/DecisionArchitectures.tsx`
- Modify: `components/partner-room/SameCompanyDifferentRoom.tsx`
- Test: `tests/partner-room-page.test.mjs`

**Interfaces:**
- Consumes: section IDs and `data-architecture`/`data-room-judgment` attributes from Task 1.
- Produces: CSS classes and responsive layouts consumed by the server components and later client enhancement.

- [ ] **Step 1: Add a structural styling contract**

Assert the root shell uses the parent tokens and the source no longer defines the legacy palette or mobile floating CTA:

```js
const css = await readFile(path.join(process.cwd(), "app", "partner-room", "partner-room.module.css"), "utf8");
assert.match(css, /var\(--color-bg\)/);
assert.match(css, /var\(--color-ink\)/);
assert.match(css, /var\(--color-copper\)/);
assert.doesNotMatch(css, /--pr-(?:ink|ivory|copper|coral|bg)/);
assert.doesNotMatch(css, /\.mobileSticky/);
assert.match(css, /prefers-reduced-motion:\s*reduce/);
```

- [ ] **Step 2: Run the contract and verify the legacy palette fails**

Run: `node --test --test-concurrency=1 tests/partner-room-page.test.mjs`

Expected: FAIL on `--pr-*` declarations and `.mobileSticky`.

- [ ] **Step 3: Replace the CSS module with the approved spatial system**

Use aliases that only reference parent tokens:

```css
.shell {
  min-height: 100vh;
  overflow-x: clip;
  background: var(--color-bg);
  color: var(--color-ink-muted);
  font-family: var(--font-sans);
}

.chamber {
  background: var(--color-ink);
  color: var(--color-bg);
}

.readingColumn { max-width: 46rem; }
.composition { width: min(75rem, 100%); margin-inline: auto; }
.display { font-family: var(--font-serif); font-weight: 400; }
```

Implement: a near-full-viewport hero; 680-760px reading measure; 1100-1200px compositions; 1px institutional rules; flat square-corner CTAs; dark chamber sections for mechanism, same-company, and Founding Room; a numbered architecture rail; a two-column same-company comparison; stacked risk rows; numbered outcomes; and docket-aligned Founding Room facts. Keep accent usage to section selection, decisive rules, and CTA states.

At `max-width: 900px`, remove all sticky positioning, reduce the display scale, turn architecture and same-company layouts into vertical reading order, and preserve evidence directly before judgments. At `max-width: 640px`, use full-width form controls and at least 44px action targets. Add `@media (prefers-reduced-motion: reduce)` to disable transitions and smooth scrolling.

- [ ] **Step 4: Attach classes without changing semantic order**

Apply the CSS module to the server components. Keep sticky elements as visual siblings of the complete content; do not clone or aria-hide substantive copy. Add `scroll-margin-top` to section anchors and ensure focus outlines use copper or ink with AA contrast on the current surface.

- [ ] **Step 5: Run the structural contract, typecheck, and build**

Run: `node --test --test-concurrency=1 tests/partner-room-page.test.mjs && npm run typecheck && npm run build`

Expected: PASS with no overflow-causing build errors and no legacy Partner Room tokens.

- [ ] **Step 6: Commit the visual system**

```bash
git add app/partner-room/partner-room.module.css components/partner-room/PartnerRoomSections.tsx components/partner-room/DecisionArchitectures.tsx components/partner-room/SameCompanyDifferentRoom.tsx tests/partner-room-page.test.mjs
git commit -m "feat: apply Partner Room editorial room system"
```

---

### Task 3: Plausible and Progressive Scroll State

**Files:**
- Create: `lib/partner-room-analytics.mjs`
- Create: `tests/partner-room-analytics.test.mjs`
- Modify: `components/partner-room/PartnerRoomEnhancements.tsx`
- Modify: `app/partner-room/layout.tsx`
- Modify: `app/partner-room/partner-room.module.css`
- Modify: `package.json`

**Interfaces:**
- Produces: `createPartnerRoomAnalytics(emit)` returning `trackCta`, `trackApplicationStart`, `trackApplicationComplete`, `trackApplicationAbandon`, and `trackSectionDepth`.
- Consumes: browser events `partner-room:application-start` and `partner-room:application-complete` from the form; page abandonment is detected directly from `pagehide`.
- Consumes: `data-cta-location`, `data-architecture`, and milestone section IDs from Tasks 1-2.

- [ ] **Step 1: Write pure analytics guard tests**

Create tests using an event collector:

```js
const events = [];
const analytics = createPartnerRoomAnalytics((name, props) => events.push({ name, props }));

analytics.trackApplicationStart();
analytics.trackApplicationStart();
analytics.trackSectionDepth("mechanism");
analytics.trackSectionDepth("mechanism");
analytics.trackApplicationComplete();
analytics.trackApplicationAbandon();

assert.deepEqual(events, [
  { name: "partner_room_application_start", props: undefined },
  { name: "partner_room_section_depth", props: { section: "mechanism" } },
  { name: "partner_room_application_complete", props: undefined },
]);
```

Also assert that abandonment fires once only after a start and before completion, and that allowed milestones are exactly `mechanism`, `architectures`, `founding-room`, and `request-seat`.

- [ ] **Step 2: Run the analytics test and verify the missing module failure**

Run: `node --test tests/partner-room-analytics.test.mjs`

Expected: FAIL with module-not-found for `lib/partner-room-analytics.mjs`.

- [ ] **Step 3: Implement the provider-independent analytics state machine**

Use closure state and no browser globals in the pure module:

```js
export function createPartnerRoomAnalytics(emit) {
  let started = false;
  let completed = false;
  let abandoned = false;
  const depths = new Set();

  return {
    trackCta(location) { emit("partner_room_cta_click", { location }); },
    trackApplicationStart() {
      if (started) return;
      started = true;
      emit("partner_room_application_start");
    },
    trackApplicationComplete() {
      if (completed) return;
      completed = true;
      emit("partner_room_application_complete");
    },
    trackApplicationAbandon() {
      if (!started || completed || abandoned) return;
      abandoned = true;
      emit("partner_room_application_abandon");
    },
    trackSectionDepth(section) {
      if (depths.has(section)) return;
      depths.add(section);
      emit("partner_room_section_depth", { section });
    },
  };
}
```

Validate `section` against the fixed milestone set before emitting.

- [ ] **Step 4: Replace mobile sticky behavior with progressive observation**

In `PartnerRoomEnhancements`, create one analytics instance whose emitter calls `window.plausible?.(name, { props })`. Keep the accessible CTA focus/scroll handler. Add observers that:

- update `data-active-architecture` on the architecture container;
- track each milestone once at 25% intersection;
- apply a reveal class only after elements enter the viewport;
- skip reveal setup when reduced motion is requested;
- listen for the three form boundary events and call the corresponding analytics methods;
- call abandonment on `pagehide`, not by transmitting form contents.

Register and clean up every event listener and observer in `useEffect`. Do not render a floating CTA.

- [ ] **Step 5: Load Plausible only when configured**

In the Partner Room layout, read `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`. When present, load the configured script after hydration and initialize the standard queue; when absent, render no third-party script. Never send field values, company names, email addresses, URLs entered into the form, or free-text answers.

```tsx
{plausibleDomain && (
  <Script
    defer
    data-domain={plausibleDomain}
    src="https://plausible.io/js/script.js"
    strategy="afterInteractive"
  />
)}
```

- [ ] **Step 6: Add the analytics test to the project suite and run it**

Add `tests/partner-room-analytics.test.mjs` to the explicit `npm test` command.

Run: `npm test && npm run typecheck`

Expected: PASS; analytics tests make no network requests.

- [ ] **Step 7: Commit analytics and progressive behavior**

```bash
git add lib/partner-room-analytics.mjs tests/partner-room-analytics.test.mjs components/partner-room/PartnerRoomEnhancements.tsx app/partner-room/layout.tsx app/partner-room/partner-room.module.css package.json
git commit -m "feat: add Partner Room decision-state analytics"
```

---

### Task 4: Series A Seat Request Flow

**Files:**
- Modify: `lib/partner-room-form.mjs`
- Modify: `components/partner-room/RequestSeatForm.tsx`
- Modify: `public/__forms.html`
- Modify: `tests/partner-room-form.test.mjs`
- Modify: `tests/partner-room-page.test.mjs`

**Interfaces:**
- Preserves: `validateSeatRequest(values)`, `normalizeHttpUrl(value)`, `captureFirstTouchAttribution(input)`, and `buildSeatRequestPayload(values, attribution, submittedAt)`.
- Emits: `partner-room:application-start` on first field input and `partner-room:application-complete` after a successful POST.
- Keeps the Netlify form name `partner-room-seat-request` and exact live/static field parity.

- [ ] **Step 1: Update validation and rendered-form tests**

Change the valid round/timing fixture to `Series A` and `Within 3–6 months`. Add rejections for `Seed` and `Raising now`. Update page assertions:

```js
assert.match(html, /<option value="Series A">Series A<\/option>/);
assert.match(html, /<option value="Other">Other<\/option>/);
assert.doesNotMatch(html, /<option value="Seed">/);
assert.doesNotMatch(html, /Raising now/);
assert.match(html, /If you join the room, it becomes the starting point for your founder-session pre-read\./);
assert.match(html, /6 seats · \$5,000 · Response within 48 hours/);
```

- [ ] **Step 2: Run form tests and verify legacy options fail**

Run: `node --test --test-concurrency=1 tests/partner-room-form.test.mjs tests/partner-room-page.test.mjs`

Expected: FAIL because Seed, Raising now, and `$2,500` remain.

- [ ] **Step 3: Narrow the validation contract**

Set the exact option sets:

```js
const ROUND_OPTIONS = new Set(["Series A", "Other"]);
const RAISE_TIMING_OPTIONS = new Set([
  "Within 3 months",
  "Within 3–6 months",
  "More than 6 months away",
]);
```

Preserve URL normalization, required-field errors, attribution, subject, honeypot, and payload keys unchanged.

- [ ] **Step 4: Update the accessible form UI and analytics boundary**

Render the exact v3 labels/options. Expand the `room-concern-hint` to both approved sentences. On the first `input` event, dispatch `partner-room:application-start` once. After a successful response, dispatch `partner-room:application-complete` before rendering the focused success state. Keep double-submit prevention and preserve answers on network failure.

Use `Request My Seat`, `$5,000`, and the existing 48-hour response promise. Do not add a file input or direct payment.

- [ ] **Step 5: Synchronize the Netlify detection form**

Remove the Seed and Raising now options from `public/__forms.html`. Keep the complete sorted field set exactly equal to the live form, including attribution, subject, timestamp, and honeypot fields.

- [ ] **Step 6: Run form, page, and variant tests**

Run: `node --test --test-concurrency=1 tests/partner-room-form.test.mjs tests/partner-room-page.test.mjs tests/partner-room-variant.test.mjs`

Expected: PASS, including POST non-redirect behavior.

- [ ] **Step 7: Commit the Series A request flow**

```bash
git add lib/partner-room-form.mjs components/partner-room/RequestSeatForm.tsx public/__forms.html tests/partner-room-form.test.mjs tests/partner-room-page.test.mjs
git commit -m "feat: update Partner Room Series A request flow"
```

---

### Task 5: Metadata, Social Card, and Release Verification

**Files:**
- Modify: `app/partner-room/layout.tsx`
- Modify: `app/partner-room/opengraph-image.tsx`
- Modify: `tests/partner-room-page.test.mjs`
- Modify: `DEPLOY.md`

**Interfaces:**
- Publishes: canonical root metadata for `https://partnerroom.sidmofya.com` and a 1200x630 PNG social image.
- Documents: `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=partnerroom.sidmofya.com` for the Partner Room Netlify site only.

- [ ] **Step 1: Replace metadata assertions with the exact v3 contract**

```js
assert.match(html, /<title>Partner Room — See How Your Series A Gets Decided<\/title>/);
assert.match(html, /name="description" content="Partner Room puts six Series A founders inside the investment decision process: five rooms as an investor, one as the founder\."/);
assert.match(html, /property="og:title" content="Your Series A is decided in a room you will never be in\."/);
assert.match(html, /property="og:description" content="Five rooms as an investor\. One as the founder\."/);
```

Retain the existing canonical, 1200x630 dimensions, PNG response, and Twitter large-card assertions.

- [ ] **Step 2: Run metadata tests and verify the old title fails**

Run: `node --test --test-concurrency=1 tests/partner-room-page.test.mjs`

Expected: FAIL on the old “Rehearse the Room” title and description.

- [ ] **Step 3: Publish the exact metadata and restrained social card**

Set the title/description/Open Graph copy exactly as asserted. Rebuild the image with paper background, ink type, one copper rule, `MOTIF 54 / PARTNER ROOM`, the headline, and `Five rooms as an investor. One as the founder.` Use only `#f6f1e8`, `#1a1815`, `#5c5751`, `#e3d9c7`, and `#a45a2a` from the parent tokens.

- [ ] **Step 4: Update deployment documentation**

In the Partner Room Netlify instructions, add `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=partnerroom.sidmofya.com` beside `SITE_VARIANT=partner-room`. State that Plausible is optional in preview, that no form answers are sent to analytics, and that the existing real Netlify form submission/email verification remains required before launch.

- [ ] **Step 5: Run automated release checks**

Run, in order:

```bash
npm run lint
npm run typecheck
npm test
npm run build
git diff --check
```

Expected: every command exits 0. Confirm the production build emits the Partner Room page and social image without adding an animation package.

- [ ] **Step 6: Perform visual and accessibility QA**

Run the production build locally and inspect at 1440x900, 1024x768, 768x1024, and 390x844. Verify: full hero without crowding; readable 680-760px prose; active architecture rail without overlap; fixed evidence with three changing judgments; no sticky obstruction on mobile; full-width form controls; no horizontal overflow; visible keyboard focus; correct focus after CTA and success; and usable layouts at 200% zoom.

Repeat at 390x844 with reduced motion enabled and with JavaScript disabled. Confirm every architecture, judgment, risk, outcome, docket fact, and form label remains present and ordered. Run Lighthouse against the production server and address material regressions, targeting 90+ in Performance, Accessibility, Best Practices, and SEO.

- [ ] **Step 7: Commit release metadata and documentation**

```bash
git add app/partner-room/layout.tsx app/partner-room/opengraph-image.tsx tests/partner-room-page.test.mjs DEPLOY.md
git commit -m "feat: finalize Partner Room v3 launch surface"
```

- [ ] **Step 8: Verify the final commit state**

Run: `git status --short && git log -5 --oneline`

Expected: clean working tree and five focused Partner Room v3 implementation commits after the design/plan commits.
