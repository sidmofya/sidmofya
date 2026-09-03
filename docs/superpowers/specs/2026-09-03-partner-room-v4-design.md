# Partner Room v4 Design

## Summary

Replace the cohort-based Partner Room offer with a single-company decision room for founders preparing for an institutional Series A.

The product is one company, five working venture investors, and one live 90-minute decision room. The founder presents and answers questions, then stops participating while the investors deliberate the actual company in front of them. Sid Mofya convenes, facilitates, and synthesizes the room. The investors reach individual Partner Room judgments, but no financing commitment is requested or implied.

The public experience has two actions:

- `Request a Room` is the visually primary, high-intent action.
- `Download the Decision Architecture Framework` is the lower-intent intellectual-property capture action.

This design supersedes every cohort-era assumption in the v3 design and implementation: six founders, multiple sessions, founder investor-seats, assigned investor roles, fixed dates, fixed price, seat counts, rotating participation, investor maps, universal NDA language, and `Request a Seat` copy.

## Baseline and Delivery Strategy

Use `feat/partner-room-v3` as the implementation baseline because it is a clean, direct descendant of `main` and already contains the refined editorial visual system, modular server-rendered sections, Plausible adapter, accessible form behavior, and hardened Partner Room routing. Integrate that branch before applying v4 changes, preserving this approved design document above the baseline commits.

Preserve the existing Next.js 15 App Router application, React 19, TypeScript, CSS Modules, MOTIF 54 font loading, Netlify deployment, Netlify Forms, Partner Room subdomain middleware, and provider-independent analytics pattern. Do not add a new UI framework, animation library, form service, CMS, CRM, database, or heavyweight dependency.

The implementation remains isolated to the Partner Room surface and shared infrastructure it already owns. Existing `sidmofya.com` pages must remain unchanged.

## Product Boundaries

Partner Room promises real independent investor judgment before the consequential raise. It does not promise capital, introductions, investor targeting, matchmaking, a valuation, financing success, a financing offer, a prediction of another firm's decision, or investor consensus.

The public site must not describe the room as coaching, a simulation, role-play, a panel, a demo day, an advisory council, a cohort, a course, or a recurring founder program. Participating investors remain themselves; the six architectures describe decision systems rather than assigned personas.

Sections of the supplied brief marked internal are operating context, not public content. The investor invitation, referral loop, network data model, flywheel, and offline operating metrics will not be rendered on the website or added as a public CRM feature.

## Experience and Visual System

Retain the implemented MOTIF 54 editorial identity:

- Fraunces for decisive display statements and Inter for reading text, metadata, labels, and controls.
- Warm paper, ink, muted ink, rule, copper, and copper-soft tokens from the existing global theme.
- Light editorial sections interrupted by restrained dark decision-room moments.
- Section numbering, generous whitespace, narrow reading measures, flat controls, hairline rules, and typographic hierarchy.
- No photography, investor headshots, logos, gradients, feature-card styling, carousels, ornamental AI imagery, or accelerator/event aesthetics.

Dark chamber treatment will be reserved for the mechanism/reality sequence, the same-company comparison, and the final request section. The page should feel institutional and slightly uncomfortable without becoming theatrical.

All diagrams use HTML and CSS so their content remains semantic, responsive, and readable without JavaScript. The mechanism diagram uses six numbered stages. The room diagram uses five investor nodes as one deliberating group, with the founder and Sid visually distinct; Sid is never depicted as a sixth investor.

## Information Architecture

The public page follows the supplied narrative and numbering exactly:

1. Hero
2. `01 The failure mode`
3. `02 The mechanism`, including the six-stage process
4. Central reality callout
5. Decision discipline with `ADVANCE`, `NOT YET`, and `PASS`
6. `03 Who runs the room`
7. `04 How rooms decide`
8. Six Decision Architecture cards
9. Primary framework capture block
10. `05 The distinction` with three rooms
11. `06 Your company`, including prominent diagnostic questions and three failure types
12. `07 What you leave with`, limited to three deliverables
13. `08 Timing and fit`
14. `09 The room`, including eight attributes and the room diagram
15. `10 Curation and confidentiality`
16. Restrained secondary framework CTA
17. `11 The request`
18. Footer

The exact supplied website copy is authoritative. Layout may divide long paragraphs into readable blocks without paraphrasing their meaning. No dates, prices, seat counts, urgency, response-time promises, or additional public CTAs will appear.

Substantive copy and structured data will live in a typed Partner Room content module. The page route will remain a composition layer. Focused server components will render the mechanism, decision states, architectures, same-company comparison, failure types, deliverables, room attributes, and footer. Client components will be limited to the two forms, framework dialog, accessible focus/scroll behavior, and analytics.

## Header, Navigation, and CTA Hierarchy

The sticky header contains `MOTIF 54 / PARTNER ROOM`, a restrained `How Rooms Decide` anchor on desktop, and the primary `Request a Room` action. Hide the secondary anchor on narrow screens while retaining the brand and primary CTA without introducing a floating bottom bar.

Every Request CTA points to `#request-room`, moves focus to the request heading, respects reduced-motion preferences, and emits `partner_room_request_clicked` with `source_section`.

Framework CTAs appear only after the architecture sequence and once immediately before the request section. They open the same capture dialog and emit `framework_download_clicked` with `source_section`. The framework action remains visually subordinate to Request a Room.

## Decision Architecture Framework Capture

The capture experience is a modal dialog on the homepage and a reusable inline form on the direct `/decision-architecture-framework` route.

The form fields are:

- First name, required.
- Email, required.
- Role (`Founder`, `Investor`, or `Other`), optional.

Submission uses a new Netlify form contract with a stable source/tag value of `partner-room-decision-architecture`, plus the existing first-touch UTM, referrer, landing URL, timestamp, subject, and honeypot fields. The live and static Netlify detection forms must stay in exact schema parity.

The dialog uses a labelled native dialog or equivalent accessible modal pattern. Opening moves focus inside. Tab remains contained. Escape and the close button dismiss it. Closing restores focus to the triggering CTA. Background scrolling is disabled while open. Submission and validation remain usable within a small mobile viewport.

On successful submission, replace the fields with a concise success state and `Download the framework`. The repository has no outbound transactional email or CRM integration, so v4 will not claim automatic email delivery. Netlify Forms captures the contact and can notify the configured operator. The direct download is exposed immediately after capture.

The download control requests the same-origin PDF and emits `framework_download_completed` only after the asset responds successfully and the browser download is initiated. Failure leaves the success state visible and presents a retryable accessible error.

## Framework Route and PDF Asset

Create a canonical direct route at `/decision-architecture-framework` for visitors who arrive from a shared link. It reuses the framework introduction and capture component rather than duplicating form logic. Homepage CTAs still open the modal without navigation.

Publish the final PDF at `/downloads/how-venture-rooms-decide.pdf`. Routing must allow the direct framework page and PDF while continuing to keep unrelated main-site routes off the Partner Room deployment. The website must never render a public download link before the file exists.

The PDF title is `HOW VENTURE ROOMS DECIDE`, with subtitle `Six recurring architectures of investment judgment`, by Sid Mofya, Partner Room / MOTIF 54.

The document will be an editorial field guide rather than a brochure. It includes:

- A concise orientation to why decision architecture changes investment judgment.
- One substantive section for each of the six architectures.
- For each architecture: definition, authority distribution, conviction formation, disagreement resolution, dispositive question, founder misunderstanding, evidence that performs well, what can kill the investment, and a concise example.
- `Same Company. Different Room.` showing one company under three architectures.
- A restrained final page containing the four-line Partner Room promise and `partnerroom.sidmofya.com`.

Use the website's paper, ink, copper, rule, Fraunces-like display, and Inter-like text treatment with strong page hierarchy, running folios, and forwardable professional quality. Generate the PDF programmatically, render every page to PNG, inspect the pages, and validate text extraction and PDF metadata before publishing it into `public/downloads`.

## Request a Room Form

Reuse the existing Netlify seat-request infrastructure while changing the visible product language to Request a Room. Retain the backend form name `partner-room-seat-request` so deployed Netlify notifications and stored submissions do not require migration.

The visible fields and options match the brief exactly:

- Name, email, company name, and company website: required.
- Round: required; `Series A`, `Series A extension`, or `Other`.
- Raise timing: required; `Now / already preparing`, `Within 3 months`, `3 to 6 months`, `6+ months`, or `Not sure yet`.
- Expected raise amount: optional short field.
- Likely investors or investor types: required long text.
- What the investment room may struggle to believe: required long text with the supplied supporting copy.
- Deck or investor-materials URL: optional URL with the supplied DocSend placeholder.

Client validation provides persistent labels, associated messages, URL normalization, and focus on the first invalid field. Submission blocks duplicates. Network errors retain every answer and offer a retry. Success moves focus to the exact supplied confirmation state. A successful response emits `partner_room_request_submitted`.

## Analytics

Use the provider-independent adapter from the v3 baseline and Plausible only when `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is configured. The experience must remain fully functional when analytics is blocked or absent.

Track exactly:

- `partner_room_request_clicked` with `source_section`.
- `partner_room_request_submitted` after a successful request response.
- `framework_download_clicked` with `source_section`.
- `framework_lead_submitted` after successful capture, with optional non-PII `role`.
- `framework_download_completed` after the PDF is available and browser download begins.

Do not transmit names, email addresses, company names, entered URLs, free-text answers, or other form contents to analytics. Guard repeated clicks/submissions where the user action should only be counted once.

## Metadata, Social Card, and Footer

Publish the exact supplied SEO title, meta description, Open Graph title, and Open Graph description. Keep the canonical domain `https://partnerroom.sidmofya.com` and a 1200 by 630 generated typographic PNG using the existing brand tokens. The image contains only `PARTNER ROOM` and `Your Series A is decided in a room you will never be in.` with restrained MOTIF 54 branding; it includes no dates, price, logos, or participant names.

The footer contains `MOTIF 54 / PARTNER ROOM`, `Decision rooms for consequential capital.`, and compact links for MOTIF 54, the Decision Architecture Framework, Privacy, and Terms. Use `https://motif54.com`, `https://motif54.com/privacy`, and `https://motif54.com/terms` as the external MOTIF 54 destinations and validate them before release. A failed legal-link check blocks release rather than causing invented legal copy or a knowingly broken link to ship.

## Accessibility and Responsive Behavior

Maintain semantic landmarks and one clear heading hierarchy. All forms have programmatic labels, required-state text, accessible validation messages, and visible focus. The decision states and diagrams include text labels so color is never the only carrier of meaning.

At tablet and mobile widths:

- Architecture cards stack vertically.
- Decision states stack vertically.
- Room A, B, and C stack in reading order.
- The process becomes a vertical numbered sequence.
- The room diagram becomes a compact labelled stack without horizontal scrolling.
- Forms use full-width controls and buttons with practical 44-pixel minimum targets.
- The framework dialog fits the viewport and allows internal scrolling where necessary.

All motion is progressive enhancement. `prefers-reduced-motion` disables smooth scrolling, transitions, and reveals. Every section, judgment, and form remains available when JavaScript is disabled, except the modal enhancement; the direct framework route supplies the no-JavaScript capture alternative.

## Error Handling and Routing

- Failed Netlify submissions preserve data and present inline retryable alerts.
- Invalid form controls receive `aria-invalid` and associated error text.
- A failed PDF request does not emit completion and provides a retry action.
- Storage and analytics failures are ignored without blocking either form.
- Non-GET/HEAD requests continue to bypass canonical page redirects so Netlify can intercept form POSTs.
- Query parameters remain intact through Partner Room rewrites and redirects.
- The dedicated deployment serves `/`, `/decision-architecture-framework`, the PDF, and the generated social image; unrelated application routes redirect to `/`.
- The main site continues redirecting `/partner-room` to the canonical Partner Room domain.

## Verification and Acceptance

Use test-driven changes for routing, form validation/payloads, analytics event guards, modal state helpers, page content, metadata, and static Netlify form parity. Existing main-site route tests remain part of the suite.

Before completion:

- Run lint, TypeScript checking, all tests, a production build, and `git diff --check`.
- Search source and rendered HTML for every forbidden cohort-era term, commercial fact, and public promise identified in the brief.
- Verify only the two approved CTA families appear.
- Validate the direct framework route, gated PDF flow, Partner Room subdomain rewrites, and query preservation.
- Render and inspect the PDF page by page.
- Inspect desktop, tablet, and mobile layouts, keyboard focus, modal behavior, escape handling, reduced motion, 200 percent zoom, and horizontal overflow.
- Confirm the generated social image responds as a 1200 by 630 PNG.
- Keep deployment documentation synchronized with both Netlify form schemas, optional Plausible configuration, framework asset delivery, and the real deployed-form smoke tests required after publishing.

Acceptance is met when a new visitor can correctly describe the one-company/five-investor mechanism, understand that the founder becomes silent during deliberation, distinguish decision architecture from investor role-play, download the framework after lightweight capture, and request a room without encountering legacy cohort language or unsupported financing promises.

## Assumptions

- The supplied v4 brief is the authoritative public copy and product contract.
- `feat/partner-room-v3` is the intended visual and technical baseline even though it has not yet been merged into `main`.
- Netlify Forms remains the capture system for both actions.
- Direct PDF delivery is complete for v4; outbound delivery by email remains disabled until a transactional email provider and credentials are supplied.
- Plausible remains the intended analytics provider and is configured only through deployment environment values.
- Public deployment is not part of implementation unless separately authorized.
