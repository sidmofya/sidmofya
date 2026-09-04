# sidmofya.com

Personal front door for Sid Mofya.

## Stack

- Next.js 15 (App Router) + React 19
- Tailwind CSS v4
- Typography: Fraunces (display) + Inter (text) via `next/font/google`
- Deploy: Netlify (`@netlify/plugin-nextjs`)
- Form: Netlify Forms with email notification

## Local development

```bash
npm install
npm run dev
```

Visit http://localhost:3000.

## Build

```bash
npm run build
```

## Pages

- `/` — Home
- `/market-legibility` — Market Legibility Sprint
- `/room-to-results` — Room-to-Results Sprint
- `/ai-music-rights` — AI Music Rights & Fan Revenue Sprint
- `/work-with-me` — Request a sprint
- `/about` — About Sid

## Deploy to Netlify

This repo is configured for Netlify. `netlify.toml` pins Node 20, sets the build command, and enables `@netlify/plugin-nextjs`.

There are two ways to ship this — pick one:

### Option A — Point the existing sidmofya.com site at this repo (recommended)

This keeps the domain and DNS in place. You only swap the deploy source.

1. Log in to Netlify and open the existing **sidmofya.com** site.
2. Site settings → **Build & deploy** → **Continuous deployment** → **Link repository** (or **Manage repository**).
3. Choose GitHub, authorize, and select `sidmofya/sidmofya`. Branch: `main` (or whatever you merge `claude/sidmofya-website-v01-PCCAh` into).
4. Leave the build command and publish directory blank — `netlify.toml` provides them.
5. Click **Deploy site**. First build takes a few minutes.
6. The existing custom domain (`sidmofya.com`) stays attached, so DNS doesn't change. The new site replaces the old one at the same URL.

### Option B — New Netlify site, then transfer the domain

Use this if you want to keep the old site running until the new one is verified.

1. In Netlify: **Add new site → Import from Git → GitHub → `sidmofya/sidmofya`**.
2. Pick the branch, accept the build defaults from `netlify.toml`, click **Deploy**.
3. Test the deploy preview URL (`<random-name>.netlify.app`).
4. When ready: on the **old** sidmofya.com site, **Domain settings → Remove `sidmofya.com`**. On the **new** site, **Domain settings → Add custom domain → `sidmofya.com`**. SSL re-provisions automatically.

## Contact-form email (sid@motif54.com)

The `/work-with-me` form is wired to **Netlify Forms**. Submissions show up in the Netlify UI under **Forms → work-with-me**. To get an email per submission to `sid@motif54.com`:

1. Open the site in Netlify.
2. **Site configuration → Forms → Form notifications → Add notification**.
3. Choose **Email notification**.
4. Event: **New form submission**.
5. Form: **work-with-me**.
6. Email to notify: `sid@motif54.com`.
7. Save. You can add a custom subject line and reply-to field while you're there.

Notes about how this is wired:
- `public/__forms.html` contains a hidden static copy of the form so Netlify's build-time form-detection bot can register every field (the live form is rendered by React and would otherwise be invisible to the bot). If you add/rename a field on the React form, update `__forms.html` too.
- The React form posts to `/` with `Content-Type: application/x-www-form-urlencoded` and includes `form-name=work-with-me` — Netlify's edge intercepts those POSTs and stores the submission.
- A `bot-field` honeypot is included; real users won't see it, bots that fill it will be silently dropped.

To test the form is wired correctly: after the first deploy, submit a test entry from the live URL (not localhost — Netlify Forms only captures submissions on the deployed site). The submission should appear in the Netlify Forms UI within a few seconds and trigger the email.

## Partner Room site (partnerroom.sidmofya.com)

Partner Room is deployed from this repository as a second Netlify site. Its routes are selected by the `SITE_VARIANT` environment variable; do not set that variable on the main `sidmofya.com` project.

1. In Netlify, choose **Add new site → Import an existing project** and select this repository's `main` branch.
2. Keep the build command and publish directory from `netlify.toml`.
3. Under **Site configuration → Environment variables**, add `SITE_VARIANT=partner-room` and `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=partnerroom.sidmofya.com` for the Partner Room site only. Keep `SITE_VARIANT=partner-room` enabled for Production, Deploy Previews, and Branch deploys. Plausible is optional in Deploy Previews and Branch deploys, so `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` may be limited to Production when preview analytics are not needed.
4. Deploy once, then confirm the generated `netlify.app` URL serves Partner Room at `/`, serves `/decision-architecture-framework` and `/downloads/how-venture-rooms-decide.pdf` directly, and redirects unrelated public routes back to `/`.
5. Under **Domain management**, attach `partnerroom.sidmofya.com`. If DNS is managed elsewhere, add a CNAME from `partnerroom` to the new site's `netlify.app` hostname and wait for Netlify to provision SSL.
6. Under **Forms**, confirm both `partner-room-seat-request` and `partner-room-decision-architecture` were detected from `public/__forms.html`. If either form is missing, do not launch: verify its static detection schema matches the live form and redeploy.
7. Under **Site configuration → Forms → Form notifications**, add an email notification for new `partner-room-seat-request` submissions to `sid@cxbventures.com`.
8. Add a separate email notification for new `partner-room-decision-architecture` submissions to the appropriate operator address. This notification alerts the operator to the captured lead; the site does not send the framework to the submitter by email. Do not claim framework email delivery unless a transactional email provider and its credentials are added and verified separately.

The canonical field-guide landing page is `https://partnerroom.sidmofya.com/decision-architecture-framework`. Its public PDF is `https://partnerroom.sidmofya.com/downloads/how-venture-rooms-decide.pdf`.

When `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is configured, Plausible receives exactly these Partner Room events:

- `partner_room_request_clicked` with the non-PII `source_section` property.
- `partner_room_request_submitted` with no properties.
- `framework_download_clicked` with the non-PII `source_section` property.
- `framework_lead_submitted` with only the optional non-PII `role` property (`founder`, `investor`, or `other`).
- `framework_download_completed` with no properties.

Names, email addresses, company names, entered URLs, attribution values, and free-text form answers must not be sent to analytics.

After publishing and enabling notifications, test both forms on the deployed production domain; localhost submissions do not verify Netlify capture:

1. Submit one real room request at `https://partnerroom.sidmofya.com`. Confirm it appears under **Forms → partner-room-seat-request** and that its notification reaches `sid@cxbventures.com`.
2. Submit one real framework lead from `https://partnerroom.sidmofya.com/decision-architecture-framework`. Confirm it appears under **Forms → partner-room-decision-architecture**, its notification reaches the configured operator, and the captured submission contains both `source=partner-room-decision-architecture` and `tag=partner-room-decision-architecture`.
3. From the successful framework state, download the PDF and confirm the response is the expected field guide. This verifies direct browser delivery only; no email delivery is implied.

Treat launch as complete only after both deployed submissions, both Netlify records, the configured notifications, the framework source/tag values, and the PDF download have been verified.

Before launch, complete these browser checks with real browser controls rather than emulation alone:

- Navigate the framework dialog with hardware Tab and Shift+Tab, close it with Escape, and confirm focus returns to the exact trigger.
- Inspect the homepage, framework route, dialog, and both forms at literal 200% browser zoom with no clipping or horizontal overflow.
- Enable the operating system or browser reduced-motion preference and confirm scrolling is immediate and reveal transitions/animations are absent.

These are mandatory launch gates. Automated controller, CSS, and viewport tests support them but do not replace them.

The main production site redirects `/partner-room` to the canonical Partner Room subdomain. Local development keeps `/partner-room` directly accessible.

## Outstanding

- **Main-site OG image / favicon** — Partner Room has its own generated social image; the main site still needs dedicated assets when ready.
- **Analytics** — Partner Room conditionally loads Plausible when its site-scoped `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set; the main site has no analytics installed.
