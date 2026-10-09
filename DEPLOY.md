# Deploying sidmofya.com

How this repository gets from a merged change to the live sites. For settings
that live only in the Netlify dashboard, and how to audit them, see
`docs/netlify-configuration.md`.

## Two sites, one repository

| Site | Domain | Netlify project | Serves |
|---|---|---|---|
| Main | `sidmofya.com`, `www.sidmofya.com` | `sidmofya25` | Everything under `app/(main)/` |
| Partner Room | `partnerroom.sidmofya.com` | `partnerroom-sidmofya` | `app/partner-room/` only |

Both build from the `main` branch with the same command. The only thing that
tells them apart is the `SITE_VARIANT` environment variable, read by
`middleware.ts` and `lib/partner-room-routing.mjs`.

**Merging to `main` deploys both sites.** Pull requests get a deploy preview on
each. A failed build does not replace the live site; the previous deploy keeps
serving.

Partner Room has, at least once, failed to rebuild automatically after a merge
while the main site did. After any merge that touches Partner Room, confirm its
latest deploy in Netlify matches the merged commit.

## Stack

- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS v4
- Fraunces (display) and Inter (text) via `next/font/google`
- GSAP and Lenis for motion, loaded on the main site only
- Netlify with `@netlify/plugin-nextjs`; `netlify.toml` pins Node 20 and sets
  the build command and publish directory
- Netlify Forms, plus one Netlify Function for Partner Room lead delivery
- Plausible analytics, only when configured

## Local development

```bash
npm install
```

```bash
npm run dev
```

Visit http://localhost:3000. Partner Room is at
http://localhost:3000/partner-room in development; in production that path
redirects to the subdomain.

Before opening a pull request:

```bash
npm test
```

```bash
npm run typecheck
```

## Pages

Main site:

- `/` — Home
- `/about` — Bio, bodies of work, background, and the capability statement download
- `/speaking` — Speaking and executive briefings, with the inquiry form
- `/now` — What is currently live
- `/23-south` — Writing and frameworks, with the work-request form
- `/kwazuri` — The KwaZuri storyworld, with the interest sign-up
- `/contact` — Contact form
- `/privacy`, `/terms` — Legal pages, also linked from Partner Room
- `/patterncognition` — Video gallery; not in the menu or sitemap

Partner Room site:

- `/` — The Partner Room page and seat-request form
- `/decision-architecture-framework` — Field-guide landing page and lead form
- `/downloads/how-venture-rooms-decide.pdf` — The field guide

Every other path on the Partner Room site redirects to its `/`.

Retired URLs (`/capability`, `/work-with-me`, `/market-legibility`,
`/room-to-results`, `/briefings`, `/sovereigngeometry`, `/reinvention`,
`/ai-music-rights`) are permanent redirects in `next.config.ts`. Do not remove
them: they may be indexed or linked externally.

## Environment variables

Set in Netlify under **Site configuration → Environment variables**. None are
stored in this repository.

| Variable | Main site | Partner Room site |
|---|---|---|
| `SITE_VARIANT` | **Must not be set.** Any value makes the main site render Partner Room at its root. | `partner-room`, enabled for Production, Deploy Previews and Branch deploys |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | `sidmofya.com` | `partnerroom.sidmofya.com` (Production only is fine) |
| `RESEND_API_KEY` | Not used | Required |
| `HUBSPOT_ACCESS_TOKEN` | Not used | Required |

Analytics switch themselves off silently when `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is
unset.

## Forms

Six forms are live, all through Netlify Forms:

| Form name | Where it lives |
|---|---|
| `contact` | sidmofya.com/contact |
| `speaking-inquiry` | sidmofya.com/speaking |
| `work-request` | sidmofya.com/23-south |
| `kwazuri-interest` | sidmofya.com/kwazuri |
| `partner-room-seat-request` | partnerroom.sidmofya.com |
| `partner-room-decision-architecture` | partnerroom.sidmofya.com/decision-architecture-framework |

How they are wired:

- `public/__forms.html` holds a hidden static copy of every form, because
  Netlify detects forms at build time and cannot see the React ones. **A field
  missing from that file is silently dropped from submissions.** Change the
  React form and the static copy together.
- Each form has a `bot-field` honeypot.
- Netlify captures submissions only on a deployed site, never on localhost.
- Both Netlify projects list all six forms, because both build from the same
  `__forms.html`. Older forms from earlier versions of the site are also still
  listed. Do not delete or rename any of them in Netlify: that discards or
  orphans their submissions.

Each live form should have a **New form submission** email notification to
`sid@sidmofya.com`, set under **Site configuration → Forms → Form
notifications** on the site where the form lives.

### Partner Room field-guide delivery

A submission to `partner-room-decision-architecture` also triggers
`netlify/functions/partner-room-leads.mjs`, which:

1. emails the field-guide PDF to the person through Resend, from
   `Partner Room <room@sidmofya.com>` with replies going to `sid@sidmofya.com`;
2. adds or updates the contact in HubSpot.

If either `RESEND_API_KEY` or `HUBSPOT_ACCESS_TOKEN` is missing, the function
fails and the person receives nothing, even though Netlify still records the
submission. `sidmofya.com` must be a verified sending domain in Resend.

## Analytics

When configured, Plausible receives page views on both sites and exactly these
Partner Room events:

- `partner_room_request_clicked`, with the `source_section` property
- `partner_room_request_submitted`
- `framework_download_clicked`, with the `source_section` property
- `framework_lead_submitted`, with only the optional `role` property
  (`founder`, `investor` or `other`)
- `framework_download_completed`

Names, email addresses, company names, entered URLs, attribution values and
free-text answers must never be sent to analytics.

## Generated documents

The PDFs are built locally by Python scripts and committed. Netlify does not
build them, so a data change without a rebuild ships a stale document.

| Document | Command | Output | Public |
|---|---|---|---|
| Capability statement | `npm run build:capability` | `public/downloads/sid-mofya-capability-statement.pdf` | Yes, linked from `/about` |
| CV | `npm run build:cv` | `output/cv/sid-mofya-cv.pdf` | No, sent on request |
| Partner Room field guide | `npm run build:framework`, then `npm run verify:framework` | `public/downloads/how-venture-rooms-decide.pdf` | Yes |

The capability statement and CV both read `data/profile.json`; rebuild both
after editing it. The CV names clients the capability statement anonymises, so
nothing in `output/` is ever copied into `public/`.

The scripts need Python with `reportlab`, `pypdf` and `pdfplumber`. Set
`PARTNER_ROOM_PYTHON` to an interpreter that has them if the default is not
found.

## After every deploy

1. Open the changed pages on the live domain, not only the preview.
2. If a form changed, submit a real test entry on the live site, confirm every
   field arrives with its value in Netlify under **Forms**, then delete the
   test entry.
3. If Partner Room changed, confirm its deploy picked up the merged commit.
4. If a PDF changed, download it from the live URL and confirm it is the new
   one. If the old file is still served, clear the cache and redeploy.
5. If a page was retired, confirm its old URL redirects.

## Setting up a site from scratch

Only needed if a Netlify project has to be recreated.

1. In Netlify, **Add new site → Import an existing project**, choose
   `sidmofya/sidmofya` and the `main` branch.
2. Leave the build command and publish directory blank; `netlify.toml`
   provides them.
3. Add the environment variables for that site from the table above.
4. Deploy, then test on the generated `netlify.app` URL. For Partner Room,
   confirm `/` serves Partner Room, the framework page and PDF load directly,
   and unrelated paths redirect to `/`.
5. Under **Domain management**, attach the domain. If DNS is managed
   elsewhere, point a CNAME at the site's `netlify.app` hostname and wait for
   SSL.
6. Under **Forms**, confirm the forms were detected, then add the email
   notifications.
7. Submit a real test entry through each form on the production domain.

## Known gaps

- The main site has no favicon and no dedicated social-sharing image; shared
  links use the portrait photo. Partner Room has its own generated image.
