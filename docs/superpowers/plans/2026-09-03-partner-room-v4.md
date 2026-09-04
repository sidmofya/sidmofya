# Partner Room v4 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the cohort-based Partner Room with a one-company, five-investor decision room, including the exact public narrative, two accessible Netlify capture flows, a substantive downloadable field guide, exact analytics, and dedicated-domain routing.

**Architecture:** Integrate the completed v3 branch as the tested technical baseline, then retain its server-rendered section composition, CSS Module visual system, Netlify Forms infrastructure, analytics adapter, and subdomain middleware. Keep all substantive content in a typed module; isolate request-form logic, framework-form logic, modal behavior, download behavior, analytics, and routing behind focused interfaces so each can be tested without a browser or network.

**Tech Stack:** Next.js 15.5, React 19, TypeScript, CSS Modules, Netlify Forms, Plausible, Node test runner, Python 3, ReportLab, pypdf, pdfplumber, and Poppler.

**Spec:** `docs/superpowers/specs/2026-09-03-partner-room-v4-design.md`

**Copy contract:** `docs/superpowers/specs/2026-09-03-partner-room-v4-copy.md`

## Global Constraints

- The v4 design and public copy contract supersede every cohort-era assumption in the v3 branch.
- The public product is one company, five working venture investors, and one live 90-minute room.
- The founder presents and answers questions, then stops participating while the investors deliberate.
- Visible conversion copy is limited to `Request a Room`, `Download the Decision Architecture Framework`, `Send me the framework`, and `Download the framework`.
- Publish no fixed price, date, seat count, schedule, cohort, rotating seat, founder-as-investor, investor map, introduction promise, universal NDA promise, or response-time promise.
- Preserve Fraunces, Inter, existing MOTIF 54 tokens, section numbering, editorial whitespace, and restrained light/dark contrast.
- Keep Netlify Forms, first-touch attribution, URL-encoded POSTs, honeypots, and the existing `partner-room-seat-request` backend form name.
- Add no form, animation, analytics, PDF, or UI dependency unless an existing required runtime library is missing.
- Do not send names, emails, companies, URLs, or free-text answers to analytics.
- Preserve all existing main-site routes and content.
- Do not deploy without separate authorization.

## Spec Coverage Map

| Approved requirement | Implementation task |
|---|---|
| Global navigation, Hero, `01 The failure mode`, `02 The mechanism`, Central callout, Decision discipline, `03 Who runs the room`, `04 How rooms decide` | Task 2 |
| Primary framework capture, six architectures, `05 The distinction`, `06 Your company`, `07 What you leave with`, `08 Timing and fit`, `09 The room`, `10 Curation and confidentiality`, Secondary framework CTA, `11 The request`, Footer | Tasks 2, 4, 6, and 8 |
| Responsive editorial system, process, decision states, comparison, architecture cards, room diagram, focus, and reduced motion | Tasks 3 and 9 |
| Decision Architecture PDF content, public asset, rendering, and verification | Task 5 |
| Framework capture modal, direct route, Netlify capture, source/tag, success, and download | Task 6 |
| Exact five-event analytics contract and non-PII boundary | Task 7 |
| Dedicated-domain URLs, SEO metadata, social image, and legal/footer destinations | Task 8 |
| Forbidden-language audit, CTA audit, build, accessibility, responsive QA, and release documentation | Task 9 |
| Internal investor invitation, referral loop, network table, and flywheel | Deliberately excluded from public implementation by the approved design |

---

### Task 1: Integrate and Verify the v3 Technical Baseline

**Files:**
- Merge source: `feat/partner-room-v3` at `052ed18`
- Preserve: `docs/superpowers/specs/2026-09-03-partner-room-v4-design.md`
- Preserve: `docs/superpowers/specs/2026-09-03-partner-room-v4-copy.md`
- Preserve: `docs/superpowers/plans/2026-09-03-partner-room-v4.md`

**Interfaces:**
- Produces the v3 modular Partner Room components, analytics adapter, tests, and routing as the starting point for Tasks 2-8.
- Does not change public v3 behavior yet.

- [ ] **Step 1: Create the execution worktree**

Use the `using-git-worktrees` skill to create an isolated `feat/partner-room-v4` worktree from the commit containing this plan. Do not reuse `.worktrees/partner-room-v3`, which is the baseline source.

- [ ] **Step 2: Integrate the baseline branch**

Run:

```bash
git merge --no-ff feat/partner-room-v3 -m "chore: integrate Partner Room v3 baseline"
```

Expected: the merge completes without conflicts because v4 documentation is additive to the v3 branch.

- [ ] **Step 3: Verify the inherited baseline**

Run:

```bash
npm test
npm run typecheck
```

Expected: both commands exit 0 before v4 tests are introduced.

- [ ] **Step 4: Record the baseline state**

Run:

```bash
git status --short
git log -3 --oneline
```

Expected: the working tree is clean and the merge commit is at `HEAD`.

---

### Task 2: Exact v4 Content Model and Server-Rendered Narrative

**Files:**
- Modify: `components/partner-room/content.ts`
- Modify: `components/partner-room/PartnerRoomSections.tsx`
- Modify: `components/partner-room/DecisionArchitectures.tsx`
- Modify: `components/partner-room/SameCompanyDifferentRoom.tsx`
- Create: `components/partner-room/RoomMechanism.tsx`
- Create: `components/partner-room/RoomDiagram.tsx`
- Modify: `app/partner-room/page.tsx`
- Modify: `tests/partner-room-page.test.mjs`

**Interfaces:**
- Produces `partnerRoomCopy`, `architectures`, `decisionStates`, `companyEvidence`, `roomJudgments`, `companyQuestions`, `failureTypes`, `deliverables`, and `roomAttributes` from `content.ts`.
- Produces `RoomLink({ sourceSection, children? })` pointing to `#request-room` with `data-request-source`.
- Produces stable public IDs: `failure-mode`, `mechanism`, `decision-discipline`, `who-runs-room`, `how-rooms-decide`, `decision-architecture-framework`, `same-company`, `your-company`, `deliverables`, `fit`, `room`, `curation`, `framework-secondary`, and `request-room`.
- Consumes the exact wording in the copy contract; no substantive public copy remains inline in JSX.

- [ ] **Step 1: Replace v3 page assertions with the v4 narrative contract**

Add these representative assertions to `tests/partner-room-page.test.mjs` and retain the main-site route checks:

```js
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
for (const text of required) assert.match(html, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

for (const forbidden of [
  /Request a Seat/i,
  /six founders/i,
  /rotating Partner seats/i,
  /live simulation/i,
  /founding price/i,
  /investor map/i,
  /all participants sign a mutual NDA/i,
]) assert.doesNotMatch(html, forbidden);
```

Also assert the section headings occur in the order defined in the copy contract and that only three deliverables, three decision states, six architectures, six process stages, three comparison rooms, three failure types, and eight room attributes are rendered through stable `data-*` attributes.

- [ ] **Step 2: Run the page test and verify the v3 contract fails**

Run:

```bash
node --test --test-concurrency=1 tests/partner-room-page.test.mjs
```

Expected: FAIL because v3 still publishes founder investor-seats, cohort facts, `Request a Seat`, and the earlier section structure.

- [ ] **Step 3: Replace the typed content model**

Define exact shared shapes in `components/partner-room/content.ts`:

```ts
export type NumberedItem = {
  number: string;
  title: string;
  body: readonly string[];
};

export type Architecture = {
  number: string;
  name: string;
  description: string;
  question: string;
};

export type DecisionState = {
  state: "ADVANCE" | "NOT YET" | "PASS";
  description: string;
};

export type RoomJudgment = {
  room: "ROOM A" | "ROOM B" | "ROOM C";
  architecture: string;
  judgment: string;
  interpretation?: string;
};
```

Transcribe every public string from `docs/superpowers/specs/2026-09-03-partner-room-v4-copy.md` into exports. Preserve curly apostrophes and British `organise`. Do not import copy from the old v3 exports.

- [ ] **Step 4: Build the mechanism and room diagram server components**

In `RoomMechanism.tsx`, render the six stages as an ordered list:

```tsx
<ol className={styles.process} aria-label="Partner Room decision process">
  {mechanismStages.map((stage) => (
    <li key={stage.number} data-process-stage={stage.number}>
      <span aria-hidden="true">{stage.number}</span>
      <h3>{stage.title}</h3>
      <p>{stage.description}</p>
    </li>
  ))}
</ol>
```

In `RoomDiagram.tsx`, render one founder group, one five-investor group containing five decorative nodes, and one Sid group. The three textual labels and activity descriptions remain ordinary readable text. Give the decorative nodes `aria-hidden="true"`.

- [ ] **Step 5: Recompose all v4 sections**

Update `PartnerRoomSections.tsx`, `DecisionArchitectures.tsx`, `SameCompanyDifferentRoom.tsx`, and `page.tsx` so the route follows the exact content-contract order. Use semantic `<section aria-labelledby>`, `<article>`, `<ol>`, `<ul>`, and `<blockquote>` elements. Render the central reality statement as its own visual interruption and render the decision states with `data-decision-state`, not color-only labels.

Create the framework CTA blocks as server-rendered containers with links to `/decision-architecture-framework` carrying `data-framework-trigger` and `data-framework-source`. Task 6 progressively enhances those links into dialog triggers while preserving direct-route behavior without JavaScript.

- [ ] **Step 6: Run the content contract**

Run:

```bash
node --test --test-concurrency=1 tests/partner-room-page.test.mjs
npm run typecheck
```

Expected: PASS. The page contains the complete v4 narrative and no forbidden cohort-era strings.

- [ ] **Step 7: Commit the narrative**

```bash
git add app/partner-room/page.tsx components/partner-room/content.ts components/partner-room/PartnerRoomSections.tsx components/partner-room/DecisionArchitectures.tsx components/partner-room/SameCompanyDifferentRoom.tsx components/partner-room/RoomMechanism.tsx components/partner-room/RoomDiagram.tsx tests/partner-room-page.test.mjs
git commit -m "feat: rebuild Partner Room around one decision room"
```

---

### Task 3: Editorial Layout, Decision Components, and Responsive Room Diagram

**Files:**
- Modify: `app/partner-room/partner-room.module.css`
- Modify: `components/partner-room/PartnerRoomSections.tsx`
- Modify: `components/partner-room/RoomMechanism.tsx`
- Modify: `components/partner-room/RoomDiagram.tsx`
- Modify: `components/partner-room/DecisionArchitectures.tsx`
- Modify: `components/partner-room/SameCompanyDifferentRoom.tsx`
- Modify: `tests/partner-room-page.test.mjs`

**Interfaces:**
- Consumes the stable IDs and `data-*` attributes from Task 2.
- Produces CSS classes for `realityCallout`, `decisionStates`, `process`, `architectureList`, `frameworkBlock`, `companyRoomGrid`, `questionField`, `failureTypes`, `deliverableList`, `roomDocket`, and `roomDiagram`.
- Maintains existing global token references and reduced-motion behavior.

- [ ] **Step 1: Add the structural CSS contract**

Read the CSS module in the page test and assert:

```js
assert.match(css, /var\(--color-bg\)/);
assert.match(css, /var\(--color-ink\)/);
assert.match(css, /var\(--color-copper\)/);
assert.match(css, /\.decisionStates\s*\{/);
assert.match(css, /\.roomDiagram\s*\{/);
assert.match(css, /@media\s*\(max-width:\s*900px\)/);
assert.match(css, /@media\s*\(max-width:\s*640px\)/);
assert.match(css, /prefers-reduced-motion:\s*reduce/);
assert.doesNotMatch(css, /\.mobileSticky/);
assert.doesNotMatch(css, /--pr-(?:ink|ivory|copper|coral|bg)/);
```

- [ ] **Step 2: Run the structural test and verify it fails**

Run:

```bash
node --test --test-concurrency=1 tests/partner-room-page.test.mjs
```

Expected: FAIL because v3 lacks the new decision-state and room-diagram classes.

- [ ] **Step 3: Implement the complete desktop layout**

Preserve the v3 `composition`, `sectionGrid`, display typography, rules, buttons, and form controls. Add:

- Six equal mechanism columns on wide screens.
- A full-width dark reality callout with large four-line typography.
- Three flat decision-state columns with label, description, and non-color dividers.
- Two-column architecture cards with numbered rails and no rounded card treatment.
- A restrained framework divider block below the architectures.
- Sticky company evidence beside the three room judgments only at wide and sufficiently tall viewports.
- A large diagnostic question sequence, three failure-type rows, three deliverable rows, and eight docket rows.
- A CSS room diagram with five investor dots around a restrained table line, with founder and Sid offset from the deliberating group.
- A dark final request section with controls using an accessible light surface.

- [ ] **Step 4: Implement mobile and accessibility rules**

At `max-width: 900px`, remove sticky positioning and stack architectures, decision states, room judgments, and process stages. At `max-width: 640px`, make form actions and CTAs full width, keep targets at least 44 pixels tall, turn the room diagram into three labelled vertical groups, and ensure no element requires horizontal scrolling.

Extend the reduced-motion rule to remove scroll behavior, animations, and transitions. Give every interactive element a visible `:focus-visible` outline that contrasts with its current surface.

- [ ] **Step 5: Verify structure, types, and production compilation**

Run:

```bash
node --test --test-concurrency=1 tests/partner-room-page.test.mjs
npm run typecheck
npm run build
```

Expected: every command exits 0.

- [ ] **Step 6: Commit the visual system**

```bash
git add app/partner-room/partner-room.module.css components/partner-room/PartnerRoomSections.tsx components/partner-room/RoomMechanism.tsx components/partner-room/RoomDiagram.tsx components/partner-room/DecisionArchitectures.tsx components/partner-room/SameCompanyDifferentRoom.tsx tests/partner-room-page.test.mjs
git commit -m "feat: apply Partner Room decision-room visual system"
```

---

### Task 4: Request a Room Form Contract

**Files:**
- Modify: `lib/partner-room-form.mjs`
- Create: `components/partner-room/RequestRoomForm.tsx`
- Delete: `components/partner-room/RequestSeatForm.tsx`
- Modify: `public/__forms.html`
- Modify: `tests/partner-room-form.test.mjs`
- Modify: `tests/partner-room-page.test.mjs`

**Interfaces:**
- Retains `PARTNER_ROOM_FORM_NAME = "partner-room-seat-request"`.
- Retains `normalizeHttpUrl`, `captureFirstTouchAttribution`, and `ATTRIBUTION_STORAGE_KEY`.
- Produces `validateRoomRequest(values)` and `buildRoomRequestPayload(values, attribution, submittedAt)`.
- Dispatches `partner-room:request-submitted` only after a successful Netlify response.

- [ ] **Step 1: Write the failing validation and payload tests**

Replace the valid fixture with:

```js
const validValues = {
  name: "Amina Founder",
  email: "amina@example.com",
  company: "Signal Works",
  "company-website": "signalworks.example",
  round: "Series A extension",
  "raise-timing": "3 to 6 months",
  "raise-amount": "$8M",
  "investor-targets": "Institutional venture funds focused on climate software.",
  "room-concern": "Whether our retention evidence is strong enough.",
  "deck-url": "docsend.com/view/example",
};
```

Assert the only round options are `Series A`, `Series A extension`, and `Other`; the only timing options are the five supplied values; `raise-amount` is optional; and the built payload contains `raise-amount` while retaining attribution, timestamp, subject, and honeypot fields.

Add rendered-form assertions that no file input, price, calendar date, seat count, urgency timer, or promised response window appears.

- [ ] **Step 2: Run form tests and verify they fail**

Run:

```bash
node --test --test-concurrency=1 tests/partner-room-form.test.mjs tests/partner-room-page.test.mjs
```

Expected: FAIL because v3 uses the old options, function names, labels, and success copy.

- [ ] **Step 3: Update form validation and payload construction**

Use exact option sets:

```js
const ROUND_OPTIONS = new Set(["Series A", "Series A extension", "Other"]);
const RAISE_TIMING_OPTIONS = new Set([
  "Now / already preparing",
  "Within 3 months",
  "3 to 6 months",
  "6+ months",
  "Not sure yet",
]);
```

Keep `raise-amount` trimmed but optional. Set the notification subject to `Partner Room request — ${values.company}`.

- [ ] **Step 4: Update the accessible client form**

Move the component to `components/partner-room/RequestRoomForm.tsx`, rename the export to `RequestRoomForm`, delete the old file, and update all imports. Render the exact labels, options, supporting copy, submit label, and success state from the copy contract. Keep duplicate-submit protection, first-invalid-control focus, answer preservation on network failure, success focus, and URL normalization.

After a successful response, dispatch:

```ts
window.dispatchEvent(new CustomEvent("partner-room:request-submitted"));
```

- [ ] **Step 5: Synchronize the Netlify detection form**

In `public/__forms.html`, retain `partner-room-seat-request`, replace the old select options, and add `<input type="text" name="raise-amount" />`. Keep every live payload key represented in the static form.

- [ ] **Step 6: Verify form behavior and schema parity**

Run:

```bash
node --test --test-concurrency=1 tests/partner-room-form.test.mjs tests/partner-room-page.test.mjs tests/partner-room-variant.test.mjs
npm run typecheck
```

Expected: PASS, including form POST passthrough on the Partner Room site variant.

- [ ] **Step 7: Commit the request flow**

```bash
git add lib/partner-room-form.mjs components/partner-room/RequestRoomForm.tsx components/partner-room/RequestSeatForm.tsx public/__forms.html tests/partner-room-form.test.mjs tests/partner-room-page.test.mjs
git commit -m "feat: replace seat application with room request"
```

---

### Task 5: Decision Architecture Field Guide PDF

**Files:**
- Create: `docs/partner-room/how-venture-rooms-decide.md`
- Create: `scripts/generate_partner_room_framework.py`
- Create: `scripts/verify_partner_room_framework.py`
- Create: `output/pdf/how-venture-rooms-decide.pdf`
- Create: `public/downloads/how-venture-rooms-decide.pdf`
- Create: `tests/partner-room-pdf.test.mjs`
- Modify: `.gitignore`
- Modify: `package.json`

**Interfaces:**
- Produces the canonical website asset `/downloads/how-venture-rooms-decide.pdf`.
- Produces an identical archival output at `output/pdf/how-venture-rooms-decide.pdf`.
- Produces `npm run build:framework` and `npm run verify:framework` scripts.
- Uses `tmp/pdfs/` only for rendered QA images.

- [ ] **Step 1: Read the PDF workflow and load the bundled runtime**

Read the available PDF skill completely. Load the workspace dependency paths. Confirm `reportlab`, `pypdf`, `pdfplumber`, `pdftoppm`, and `pdfinfo` are available before authoring.

- [ ] **Step 2: Write the field-guide manuscript**

Create `docs/partner-room/how-venture-rooms-decide.md` with:

1. Title, subtitle, author, and Partner Room / MOTIF 54 imprint.
2. A two-page orientation explaining authority, conviction, disagreement, evidence, and the dispositive question.
3. One section for each architecture in the copy contract.
4. Within every architecture, the exact subheadings `What it is`, `How authority is distributed`, `How conviction forms`, `How disagreement is resolved`, `The dispositive question`, `What founders commonly misunderstand`, `Evidence that performs well`, `What can kill the investment`, and `Example`.
5. A `Same Company. Different Room.` section using the exact company facts and Room A/B/C judgments from the copy contract.
6. A final page with the four-line Partner Room statement and `partnerroom.sidmofya.com`.

Write each architecture for an informed founder/investor audience. Keep examples concise, label inference as interpretation, and do not turn any section into Partner Room sales copy.

- [ ] **Step 3: Write the failing PDF contract test**

Create `tests/partner-room-pdf.test.mjs` to assert the public and archival PDFs exist, exceed 50 KB, have identical SHA-256 hashes, and pass the Python verifier:

```js
const outputs = [
  "output/pdf/how-venture-rooms-decide.pdf",
  "public/downloads/how-venture-rooms-decide.pdf",
];
const pythonPath = process.env.PYTHON_PATH ?? "python";
for (const output of outputs) assert.ok((await stat(output)).size > 50_000);
assert.equal(await sha256(outputs[0]), await sha256(outputs[1]));
await execFileAsync(pythonPath, ["scripts/verify_partner_room_framework.py", outputs[0]]);
```

- [ ] **Step 4: Run the PDF test and verify the missing-asset failure**

Run:

```bash
node --test tests/partner-room-pdf.test.mjs
```

Expected: FAIL because the generator and PDF outputs do not exist.

- [ ] **Step 5: Implement the PDF generator and verifier**

Use ReportLab Platypus with a page template, running folio, paper background, ink text, copper rules, serif display styles, sans-serif body styles, widows/orphans controls, and `KeepTogether` for short labelled blocks. Parse the manuscript deterministically and write the archival PDF, then copy its exact bytes to the public path.

Add these package scripts before the first generator run:

```json
"build:framework": "python scripts/generate_partner_room_framework.py",
"verify:framework": "python scripts/verify_partner_room_framework.py output/pdf/how-venture-rooms-decide.pdf"
```

The verifier must reopen the PDF with pypdf and pdfplumber, require at least ten pages, require non-empty metadata title and author, and assert extracted text contains all six architecture names, all nine recurring subheadings, `Same Company. Different Room.`, `Your Series A is decided in a room you will never be in.`, and `partnerroom.sidmofya.com`.

- [ ] **Step 6: Mark the PDF operation and generate the first artifact**

Immediately before the first generator run, execute exactly once:

```bash
node container_tools/mark_artifact_operation_started.mjs --operation-kind create --expected-output-count 1 --output-format pdf
```

Then run:

```bash
npm run build:framework
npm run verify:framework
node --test tests/partner-room-pdf.test.mjs
```

Expected: every command exits 0.

- [ ] **Step 7: Render and inspect every PDF page**

Create `tmp/pdfs`, then run the bundled Poppler binaries:

```bash
pdftoppm -png output/pdf/how-venture-rooms-decide.pdf tmp/pdfs/how-venture-rooms-decide
pdfinfo output/pdf/how-venture-rooms-decide.pdf
```

Inspect every rendered PNG for clipping, overlap, black squares, broken rules, stranded headings, inconsistent spacing, and illegible small text. Patch the generator or manuscript, regenerate, rerender, and reinspect until no visual defects remain. Remove `tmp/pdfs` after the final inspection.

- [ ] **Step 8: Ignore only PDF QA intermediates**

Add only `tmp/pdfs/` to `.gitignore`. Keep both final PDFs tracked.

- [ ] **Step 9: Commit the field guide**

```bash
git add .gitignore package.json docs/partner-room/how-venture-rooms-decide.md scripts/generate_partner_room_framework.py scripts/verify_partner_room_framework.py output/pdf/how-venture-rooms-decide.pdf public/downloads/how-venture-rooms-decide.pdf tests/partner-room-pdf.test.mjs
git commit -m "feat: publish Decision Architecture field guide"
```

---

### Task 6: Framework Lead Capture, Accessible Dialog, and Direct Route

**Files:**
- Create: `lib/partner-room-framework-form.mjs`
- Create: `components/partner-room/FrameworkCapture.tsx`
- Create: `components/partner-room/FrameworkDialog.tsx`
- Create: `app/partner-room/decision-architecture-framework/page.tsx`
- Modify: `components/partner-room/PartnerRoomSections.tsx`
- Modify: `components/partner-room/PartnerRoomEnhancements.tsx`
- Modify: `public/__forms.html`
- Create: `tests/partner-room-framework-form.test.mjs`
- Modify: `tests/partner-room-page.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces `FRAMEWORK_FORM_NAME = "partner-room-decision-architecture"`.
- Produces `validateFrameworkLead(values)` and `buildFrameworkLeadPayload(values, attribution, submittedAt)`.
- `FrameworkCapture` accepts `{ presentation: "dialog" | "inline"; sourceSection: string }`.
- Dispatches `partner-room:framework-lead-submitted` with `{ role }` after a successful Netlify response.
- Dispatches `partner-room:framework-download-completed` only after a successful same-origin PDF response and download initiation.

- [ ] **Step 1: Write failing framework validation and payload tests**

Assert:

```js
assert.deepEqual(validateFrameworkLead({ "first-name": "", email: "", role: "" }).errors, {
  "first-name": "Please enter your first name.",
  email: "Please enter your email address.",
});

assert.deepEqual(validateFrameworkLead({
  "first-name": "Amina",
  email: "amina@example.com",
  role: "Investor",
}).errors, {});
```

Also reject unknown role values, allow blank role, and assert the payload contains the stable source/tag, first-touch attribution, timestamp, subject, and honeypot.

- [ ] **Step 2: Run the framework tests and verify module-not-found failure**

Run:

```bash
node --test tests/partner-room-framework-form.test.mjs
```

Expected: FAIL because `lib/partner-room-framework-form.mjs` does not exist.

- [ ] **Step 3: Implement pure validation and payload functions**

Use:

```js
export const FRAMEWORK_FORM_NAME = "partner-room-decision-architecture";
export const FRAMEWORK_SOURCE = "partner-room-decision-architecture";
const ROLE_OPTIONS = new Set(["", "Founder", "Investor", "Other"]);
```

Normalize trimmed strings, validate a conventional email shape, and return `{ values, errors }`. Include `source`, `tag`, attribution, `submitted-at`, `subject: "Partner Room Decision Architecture download"`, and `bot-field` in the payload.

- [ ] **Step 4: Build the shared capture form**

Implement `FrameworkCapture` using the same storage-safe first-touch attribution as the room request. Keep form values on network failure, focus the first invalid control, block duplicate submissions, and move focus to the success state.

After success, render the `Download the framework` button. When that button is activated, fetch `/downloads/how-venture-rooms-decide.pdf`. Only when `response.ok` is true, create an object URL, click a temporary `<a download="how-venture-rooms-decide.pdf">`, revoke the URL, and dispatch the completion event. Present `We couldn’t start the download. Please try again.` in a `role="alert"` region on failure.

- [ ] **Step 5: Build the dialog controller**

Use a native `<dialog>` in `FrameworkDialog.tsx`. A document click listener finds `[data-framework-trigger]`, prevents the link navigation, records the trigger, calls `showModal()`, and passes the trigger's `data-framework-source` to the capture form. The close button and `cancel` event close the dialog; `close` restores focus to the trigger. Add a backdrop click handler that closes only when the click lands on the dialog element itself.

- [ ] **Step 6: Add the direct framework route**

Create `app/partner-room/decision-architecture-framework/page.tsx` with a compact branded header, the exact primary framework introduction, `<FrameworkCapture presentation="inline" sourceSection="framework-route" />`, and a link back to `/`. Export route metadata with title `Decision Architecture Framework | Partner Room` and the field-guide description from the copy contract.

- [ ] **Step 7: Add the static Netlify form and page assertions**

Add the exact framework form schema to `public/__forms.html`. Update the page test to assert both Netlify form schemas independently, the presence of two framework triggers on the homepage, the dialog's accessible name, and the direct route's inline form. Assert the framework form contains only first name, email, optional role, source/tag, attribution, timestamp, subject, and honeypot fields; it must not request phone, revenue, funding amount, stage, availability, or a deck.

- [ ] **Step 8: Verify framework behavior**

Run:

```bash
node --test --test-concurrency=1 tests/partner-room-framework-form.test.mjs tests/partner-room-page.test.mjs tests/partner-room-pdf.test.mjs
npm run typecheck
```

Expected: PASS.

- [ ] **Step 9: Commit the capture flow**

```bash
git add lib/partner-room-framework-form.mjs components/partner-room/FrameworkCapture.tsx components/partner-room/FrameworkDialog.tsx components/partner-room/PartnerRoomSections.tsx components/partner-room/PartnerRoomEnhancements.tsx app/partner-room/decision-architecture-framework/page.tsx public/__forms.html tests/partner-room-framework-form.test.mjs tests/partner-room-page.test.mjs package.json
git commit -m "feat: add framework capture and gated download"
```

---

### Task 7: Exact Partner Room Analytics

**Files:**
- Modify: `lib/partner-room-analytics.mjs`
- Modify: `tests/partner-room-analytics.test.mjs`
- Modify: `components/partner-room/PartnerRoomEnhancements.tsx`
- Modify: `components/partner-room/PartnerRoomSections.tsx`
- Modify: `components/partner-room/FrameworkCapture.tsx`
- Modify: `components/partner-room/RequestRoomForm.tsx`

**Interfaces:**
- Produces `createPartnerRoomAnalytics(emit)` with `trackRequestClick`, `trackRequestSubmitted`, `trackFrameworkClick`, `trackFrameworkLead`, and `trackFrameworkDownload`.
- Request click properties use `{ source_section }`.
- Framework click properties use `{ source_section }`.
- Framework lead properties are absent for blank role or `{ role: "founder" | "investor" | "other" }`.

- [ ] **Step 1: Replace v3 analytics tests with the exact event contract**

Use an event collector and assert:

```js
analytics.trackRequestClick("hero");
analytics.trackRequestSubmitted();
analytics.trackFrameworkClick("architectures");
analytics.trackFrameworkLead("Investor");
analytics.trackFrameworkDownload();

assert.deepEqual(events, [
  { name: "partner_room_request_clicked", props: { source_section: "hero" } },
  { name: "partner_room_request_submitted", props: undefined },
  { name: "framework_download_clicked", props: { source_section: "architectures" } },
  { name: "framework_lead_submitted", props: { role: "investor" } },
  { name: "framework_download_completed", props: undefined },
]);
```

Assert submission, lead, and download completion emit once; click events emit once per actual click; unknown roles produce no role property; and no old `partner_room_application_*`, `partner_room_cta_click`, or section-depth events remain.

- [ ] **Step 2: Run analytics tests and verify the v3 mismatch**

Run:

```bash
node --test tests/partner-room-analytics.test.mjs
```

Expected: FAIL because the v3 adapter exports the old application and depth events.

- [ ] **Step 3: Implement the provider-independent event guards**

Return the five methods named in Interfaces. Normalize sources to a fixed set defined by the rendered CTA locations and normalize role values to lowercase. Store only boolean completion guards; never pass form fields to `emit`.

- [ ] **Step 4: Wire page and form events**

In `PartnerRoomEnhancements`, retain reduced-motion-aware request scrolling and Plausible emission. Listen for clicks on `[data-request-source]` and `[data-framework-trigger]`, and for the three custom success/download events. Use `window.plausible?.(name, props ? { props } : undefined)`.

The request and framework forms dispatch only boundary events and optional role. They never import the analytics provider or pass other values.

- [ ] **Step 5: Verify analytics and forms together**

Run:

```bash
node --test --test-concurrency=1 tests/partner-room-analytics.test.mjs tests/partner-room-form.test.mjs tests/partner-room-framework-form.test.mjs tests/partner-room-page.test.mjs
npm run typecheck
```

Expected: PASS with no network calls from the test suite.

- [ ] **Step 6: Commit analytics**

```bash
git add lib/partner-room-analytics.mjs tests/partner-room-analytics.test.mjs components/partner-room/PartnerRoomEnhancements.tsx components/partner-room/PartnerRoomSections.tsx components/partner-room/FrameworkCapture.tsx components/partner-room/RequestRoomForm.tsx
git commit -m "feat: track Partner Room intent and framework conversion"
```

---

### Task 8: Framework Routing, Metadata, Social Card, and Footer

**Files:**
- Modify: `lib/partner-room-routing.mjs`
- Modify: `middleware.ts`
- Modify: `tests/partner-room-routing.test.mjs`
- Modify: `tests/partner-room-variant.test.mjs`
- Modify: `app/partner-room/layout.tsx`
- Modify: `app/partner-room/opengraph-image.tsx`
- Modify: `app/partner-room/page.tsx`
- Modify: `tests/partner-room-page.test.mjs`

**Interfaces:**
- Dedicated Partner Room paths: `/`, `/decision-architecture-framework`, `/downloads/how-venture-rooms-decide.pdf`, and `/partner-room/opengraph-image`.
- Internal framework route: `/partner-room/decision-architecture-framework`.
- Keeps non-GET/HEAD POST passthrough and query preservation.

- [ ] **Step 1: Write failing routing and metadata tests**

Add routing expectations:

```js
assert.deepEqual(resolvePartnerRoomRoute({
  hostname: "partnerroom.sidmofya.com",
  pathname: "/decision-architecture-framework",
  method: "GET",
}), { type: "rewrite", pathname: "/partner-room/decision-architecture-framework" });

assert.deepEqual(resolvePartnerRoomRoute({
  hostname: "partnerroom.sidmofya.com",
  pathname: "/downloads/how-venture-rooms-decide.pdf",
  method: "GET",
}), { type: "next" });
```

Update metadata assertions to the exact title, meta description, Open Graph title, and Open Graph description in the copy contract. Assert the footer contains all four links and no footer request CTA.

- [ ] **Step 2: Run route and page tests and verify failure**

Run:

```bash
node --test --test-concurrency=1 tests/partner-room-routing.test.mjs tests/partner-room-variant.test.mjs tests/partner-room-page.test.mjs
```

Expected: FAIL because v3 redirects the framework and PDF paths and publishes old metadata.

- [ ] **Step 3: Extend dedicated-domain routing**

In `resolvePartnerRoomRoute`, allow the exact PDF path, rewrite the public framework path to its internal page, allow the internal route only while fulfilling that rewrite, and continue redirecting unrelated paths to `/`. Preserve search parameters through `buildPartnerRoomUrl`.

Keep static files narrowly allowlisted; do not allow all `/downloads/*` paths.

- [ ] **Step 4: Publish exact metadata and social card**

Set:

```ts
const title = "Partner Room | See How Your Series A Gets Decided";
const description = "Five venture investors evaluate your company while you listen to the deliberation founders normally never hear. A live Series A decision room facilitated by Sid Mofya.";
const socialTitle = "Your Series A is decided in a room you will never be in.";
const socialDescription = "Partner Room puts your company in front of five venture investors and lets you hear the deliberation that normally happens after the founder leaves.";
```

Keep the canonical root. Rebuild the 1200 by 630 image using the v3 paper/ink/copper tokens, `MOTIF 54 / PARTNER ROOM`, and the approved two text elements only.

- [ ] **Step 5: Finish the footer**

Render `MOTIF 54`, `Decision Architecture Framework`, `Privacy`, and `Terms`. Use `/decision-architecture-framework` for the internal framework link and the three exact MOTIF 54 URLs from the design.

- [ ] **Step 6: Verify routes, metadata, image, and legal destinations**

Run:

```bash
node --test --test-concurrency=1 tests/partner-room-routing.test.mjs tests/partner-room-variant.test.mjs tests/partner-room-page.test.mjs tests/partner-room-pdf.test.mjs
npm run typecheck
```

Start the local server and verify the social image returns `image/png`, the framework route returns 200 on the dedicated variant, and the PDF returns `application/pdf` without redirecting.

Use an HTTP HEAD request or browser inspection to confirm `https://motif54.com`, `https://motif54.com/privacy`, and `https://motif54.com/terms` do not return an error. If either legal URL is unavailable, stop the release and request the correct destination; do not fabricate legal text.

- [ ] **Step 7: Commit routing and metadata**

```bash
git add lib/partner-room-routing.mjs middleware.ts tests/partner-room-routing.test.mjs tests/partner-room-variant.test.mjs app/partner-room/layout.tsx app/partner-room/opengraph-image.tsx app/partner-room/page.tsx tests/partner-room-page.test.mjs
git commit -m "feat: publish Partner Room framework routes and metadata"
```

---

### Task 9: Content QA, Deployment Documentation, and Release Verification

**Files:**
- Modify: `package.json`
- Modify: `DEPLOY.md`
- Modify: Partner Room files only when verification exposes a concrete defect

**Interfaces:**
- `npm test` runs routing, request form, framework form, analytics, PDF, page, and variant tests explicitly.
- Deployment documentation describes both Netlify form schemas, Plausible, the framework asset, and deployed smoke tests.

- [ ] **Step 1: Add every Partner Room test to the project suite**

Set the `test` script to run:

```json
"test": "node --test --test-concurrency=1 tests/partner-room-routing.test.mjs tests/partner-room-form.test.mjs tests/partner-room-framework-form.test.mjs tests/partner-room-analytics.test.mjs tests/partner-room-pdf.test.mjs tests/partner-room-page.test.mjs tests/partner-room-variant.test.mjs"
```

- [ ] **Step 2: Update deployment documentation**

Document:

- `SITE_VARIANT=partner-room` and optional `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=partnerroom.sidmofya.com`.
- Netlify detection and notification setup for `partner-room-seat-request` and `partner-room-decision-architecture`.
- The fact that framework email delivery is not claimed without a transactional email provider.
- The canonical framework route and public PDF path.
- A real deployed submission test for each form after publishing.
- Verification that the captured framework lead contains source/tag `partner-room-decision-architecture`.
- The five analytics event names and their non-PII properties.

- [ ] **Step 3: Run the forbidden-language source scan**

Run:

```bash
rg -n -i -g '!node_modules/**' -g '!.next/**' "Request a Seat|six founders|6 founders|rotating Partner|founder seat|partner seat|cohort|founding price|\$2,500|\$5,000|live simulation|play venture|assigned role|investor map|introductions are mapped|all participants sign|response within 48 hours|Mondays and Thursdays|September|October 2026" app components lib public
```

Expected: no public source match. Fetch the rendered homepage and framework route and run the same forbidden-language scan against their HTML. Separately inspect test matches and permit forbidden expressions only inside explicit negative assertions.

- [ ] **Step 4: Run the CTA vocabulary scan**

Inspect rendered HTML and assert every conversion button/link text belongs to the approved CTA vocabulary. Ordinary footer/navigation links are not conversion CTAs.

- [ ] **Step 5: Run complete automated verification**

Run in order:

```bash
npm run lint
npm run typecheck
npm test
npm run verify:framework
npm run build
git diff --check
```

Expected: every command exits 0. If Next.js infers the wrong workspace root and reports an `EPERM` readlink error above the repository, set `outputFileTracingRoot` in `next.config.ts` to the repository directory using `path.resolve(process.cwd())`, then rerun the full build.

- [ ] **Step 6: Perform responsive and accessibility QA**

Run the production server and inspect `/`, `/decision-architecture-framework`, and the framework dialog at 1440×900, 1024×768, 768×1024, and 390×844. Verify:

- Hero line breaks remain decisive without clipping.
- Six-stage process, decision states, architectures, Room A/B/C, failure types, deliverables, and room diagram stack without horizontal overflow.
- Request and framework forms retain readable labels and errors.
- Dialog opens from both triggers, traps keyboard focus, closes on Escape and close button, and restores focus.
- The success download handles both successful and failed PDF requests.
- Request CTA focus/scroll works from header, hero, and Room section.
- Focus is visible on every action.
- The page remains legible at 200 percent zoom.
- Reduced motion removes smooth scrolling and reveals.
- With JavaScript disabled, substantive page content and the direct framework route remain usable.

- [ ] **Step 7: Re-render final PDF and verify the social asset**

Render every final PDF page again and inspect it after all website changes. Fetch the generated social image and confirm the response is PNG with width 1200 and height 630.

- [ ] **Step 8: Request final code review**

Use the requesting-code-review skill with the v4 plan, base commit, and current `HEAD`. Fix every Critical or Important finding, rerun the affected tests, and rerun Step 5 after the review fixes.

- [ ] **Step 9: Commit release documentation and verification fixes**

```bash
git add package.json DEPLOY.md
git add app components lib public scripts tests next.config.ts
git commit -m "chore: finalize Partner Room v4 release"
```

If no source fix was required, stage only `package.json` and `DEPLOY.md`.

- [ ] **Step 10: Verify the final branch state**

Run:

```bash
git status --short
git log --oneline --decorate -10
```

Expected: the working tree is clean and the task commits are present above the integrated v3 baseline.
