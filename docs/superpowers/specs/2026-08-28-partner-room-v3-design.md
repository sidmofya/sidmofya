# Partner Room v3 Design

## Summary

Rebuild the existing Partner Room surface at `partnerroom.sidmofya.com` as a single long-form decision-room experience for the Founding Room running 28 September through 15 October 2026. The page must explain the six-room mechanism within 30 seconds, make different investment decision architectures legible, and lead qualified Series A founders to one action: Request a Seat.

The existing Next.js 15 application, Partner Room subdomain routing, Netlify Forms submission flow, and first-touch attribution remain in place. The current Partner Room page, styling, content contract, social metadata, and limited client enhancements will be replaced or reorganized to match the v3 brief.

## Experience and Visual System

- Use only the existing MOTIF 54 tokens: paper and elevated paper neutrals, ink and muted ink, rule, copper, and copper-soft. Remove the separate `--pr-*` palette.
- Keep most of the page light, quiet, and editorial. Invert the same paper/ink tokens for three dark chamber moments: the product reveal, Same Company. Different Room, and the Founding Room. No new decorative colors are introduced; validation states may use a functionally necessary accessible error color.
- Continue using Fraunces for decisive display statements and Inter for reading and institutional metadata. Keep prose at roughly 680-760px and major compositions within 1100-1200px.
- Use rules, spacing, alignment, and type scale instead of rounded cards, imagery, gradients, glow, dashboard motifs, or luxury ornament. Omit Sid's portrait for launch.
- Keep the header minimal and sticky: `MOTIF 54 / PARTNER ROOM` and `Request a Seat`. Remove the obstructive mobile floating CTA. Preserve a visible skip link and strong focus states.

## Page Structure and Content

Compose the page from focused server-rendered sections, backed by a Partner Room content module rather than inline arrays and prose. The ordered narrative is:

1. Hero
2. The Failure Mode
3. The Mechanism
4. Who Runs the Room
5. Six Decision Architectures
6. Same Company. Different Room.
7. What Happens to Your Company, including the three-risk framework
8. What You Leave With
9. Timing and Fit
10. The Founding Room
11. Curation and Confidentiality
12. Request a Seat
13. Footer

The approved v3 PDF is the editorial source of truth. Where the design brief supplies exact language, that language is mandatory and overrides the current page. Commercial facts are fixed at six founders, six rooms, three weeks, 90 minutes per room, one Founder seat, five rotating Partner seats, one working venture investor in every room, $5,000, 28 September-15 October 2026, Mondays and Thursdays at 10:00am ET, and a response within 48 hours.

Reusable presentation units include `SiteHeader`, `Hero`, `SectionIntro`, `FailureMode`, `DecisionSequence`, `Facilitator`, `ArchitectureIndex`, `ArchitectureSection`, `SameCompanyDifferentRoom`, `RiskFramework`, `OutcomeList`, `FitSection`, `FoundingRoom`, `CurationSection`, `SeatRequestForm`, and `SiteFooter`. These may be grouped into a small number of files when their boundaries remain clear; the page file should only compose sections.

Structured data covers the six architectures, company evidence, three room judgments, three risks, four outcomes, Founding Room docket facts, fit criteria, curation rules, and form fields. No substantive content is hidden behind interaction.

## Key Visual Moments and Motion

- **Hero:** Fill most of the first viewport with the primary proposition, four sequential lines, the mechanism promise, one CTA, and the complete program metadata. Use no image.
- **Mechanism:** Render `FOUNDER -> QUESTIONS -> SILENCE -> DELIBERATION -> DECISION` as a procedural docket. Give “The founder goes silent” and “The room decides in front of them” separate visual weight.
- **Architectures:** Use a vertical sequence with a desktop sticky numbered rail. The active number updates as sections enter view. Mobile renders the complete sequence without sticky behavior.
- **Same Company:** Keep company evidence fixed in a desktop column while the three room judgments pass alongside it. Mobile repeats or retains a compact evidence block above a simple sequence so comparison remains immediate. No carousel or click requirement.
- **Founding Room:** Present dates and participation terms as a typographic institutional docket, followed by the single permitted “There is no sales call” statement and CTA.

Motion is progressive enhancement only: short opacity/vertical reveals, active-index changes, and sticky positioning. Use CSS and the existing browser APIs rather than an animation library. All content is visible and intelligible without JavaScript, and `prefers-reduced-motion` disables animated transitions and smooth scrolling.

The only CTA placements are the header, hero, immediately after the architecture sequence, the Founding Room, and the final form submit. Visible link copy is `Request a Seat`; the submit copy is `Request My Seat`. The footer does not repeat the CTA.

## Application, Analytics, and Interfaces

### Seat request

Keep the existing custom Netlify form and URL-encoded POST contract. Required visible fields are name, email, company name, company website, round, expected raise timing, likely investors or investor types, and the central “struggle to believe” response. Deck or investor materials remains an optional URL; there is no upload.

The round selector offers `Series A` and `Other`. The expected timing options remain structured, with 3-6 months visually aligned to the stated fit. The central diagnostic textarea is the largest control and includes the v3 supporting sentence. Submission success moves focus to a confirmation state; validation and network errors preserve answers and remain associated with the relevant controls.

Keep the hidden Netlify detection form in exact schema parity with the live form. Preserve UTM, referrer, landing URL, submission time, subject, and honeypot fields. No checkout, Calendly, mailing-list, or secondary CTA is added.

### Plausible

Load Plausible only on the Partner Room surface and route all analytics through a small client-side adapter so page components do not depend directly on the vendor API. Track:

- `partner_room_cta_click` with CTA location;
- `partner_room_application_start` once, on first meaningful field interaction;
- `partner_room_application_complete` after a successful Netlify response;
- `partner_room_application_abandon` once when a started, incomplete form is left;
- `partner_room_section_depth` once for each milestone: mechanism, architectures, founding room, and application.

First-touch source data continues to accompany the form submission. Analytics must not include field answers or other personally identifiable information. If Plausible is blocked or unavailable, the page and form continue normally.

### Metadata

- Title: `Partner Room — See How Your Series A Gets Decided`
- Description: `Partner Room puts six Series A founders inside the investment decision process: five rooms as an investor, one as the founder.`
- Open Graph headline: `Your Series A is decided in a room you will never be in.`
- Open Graph support: `Five rooms as an investor. One as the founder.`

Generate a 1200x630 typographic Open Graph image using only the MOTIF 54 tokens and no stock imagery.

## Failure Modes and Accessibility

- Interactions must not obscure content, trap focus, require hover, or create horizontal overflow.
- Sticky architecture and company treatments are desktop enhancements and switch off before they impair narrow or short viewports.
- Form submission remains idempotent at the UI level by blocking double submission. Network failure produces a retryable inline alert without clearing the form.
- Every form control has a persistent label, required state, associated hint/error text, and visible keyboard focus. Heading order and landmark structure remain semantic.
- Maintain WCAG AA contrast, 44px minimum practical CTA targets, reduced-motion support, and text-only equivalents for every visual sequence.
- Preserve Partner Room root rewriting, canonicalization, attribution query strings, social-image routing, and the main sidmofya.com pages unchanged.

## Verification and Acceptance

- Update unit/integration contracts for the $5,000 price, dates, exact metadata, Series A/Other round options, section ordering, mandatory v3 statements, and the single occurrence of “no sales call.”
- Test form normalization, validation, payload construction, double-submit prevention, success focus, retry behavior, attribution, and live/static Netlify schema parity.
- Test analytics event guards and properties without contacting Plausible: single application start, no abandonment before interaction or after success, one event per depth milestone, and CTA location values.
- Verify dedicated-site and main-site routing tests continue to pass, including POST handling and query preservation.
- Run lint, typecheck, the full test suite, and a production build.
- Inspect desktop, tablet, and mobile renderings for hierarchy, sticky boundaries, comparison clarity, form usability, focus visibility, and overflow. Repeat with reduced motion enabled and JavaScript disabled.
- Run Lighthouse against the production build, addressing regressions in performance, accessibility, best practices, and SEO. Avoid adding a large animation dependency or unoptimized imagery.

Acceptance is met when a visitor can explain the six-founder/five-investor-seat/one-founder-seat mechanism after 30 seconds, the same-company comparison visibly proves that decision environments change outcomes, the page cannot reasonably be mistaken for a course or SaaS product, $5,000 reads as the price of consequential judgment, and Request a Seat is the only meaningful next action.

## Assumptions

- The supplied v3 PDF is approved verbatim copy; layout may break prose into shorter units without rewriting it.
- Plausible is the selected analytics provider; its production domain/site configuration will be supplied through deployment configuration rather than hard-coded secrets.
- Netlify Forms remains the submission system and `sid@cxbventures.com` remains the operational notification destination configured in Netlify.
- The first release does not name participating investors, show investor logos, include a portrait, accept file uploads, or add secondary pages.
- Existing MOTIF 54 fonts and tokens are authoritative; no separate Partner Room brand system is created.
