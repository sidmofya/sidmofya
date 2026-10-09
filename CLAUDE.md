# sidmofya.com — Project Context

This file adds project-specific context on top of the global Boris Whisperer
configuration in `~/.claude/CLAUDE.md`, which sets the working style, quality
bar and decision checkpoints. Nothing here repeats it.

## What This Is

sidmofya.com is Sid Mofya's personal front door. Sid is a Zambian builder,
writer and former venture executive based in Silicon Valley, working across
capital, infrastructure and story. The site introduces him, sells two live
offers, and points to three bodies of work:

- **Build — MOTIF 54** (external, motif54.com): African energy, minerals, AI
  infrastructure, capital and institutional decision-making.
- **Publish — 23° South** (`/23-south`): writing and frameworks.
- **Imagine — KwaZuri** (`/kwazuri`): a living African storyworld.

The two things a visitor can actually buy:

- **Partner Room** (partnerroom.sidmofya.com): five venture investors reach a
  judgment on a founder's company while the founder listens.
- **Speaking and executive briefings** (`/speaking`): the Sovereign Stack, and
  facilitation for boards and investment committees.

The same repository serves both sidmofya.com and the Partner Room subdomain.

## What Success Looks Like

Fit, not volume:

- Qualified Partner Room seat requests from founders who are raising.
- Speaking and briefing inquiries from conveners, boards and investment
  committees.
- A bid lead at an implementing contractor can confirm in thirty seconds that
  Sid fits a technical proposal, using the capability statement on `/about`.

## Tech Stack

- **Framework**: Next.js 15 (App Router), React 19, TypeScript (strict)
- **Styling**: Tailwind CSS v4; design tokens in `app/globals.css`
- **Type**: Fraunces (display) and Inter (text) via `next/font/google`
- **Motion**: GSAP, Lenis and two React Bits components, all behind
  `components/motion/MotionProvider.tsx`; every animation respects
  reduced-motion
- **Hosting**: Netlify with `@netlify/plugin-nextjs`. Two Netlify sites build
  from this repo: the main site and Partner Room (`SITE_VARIANT` selects it)
- **Forms**: Netlify Forms; Partner Room leads also go through
  `netlify/functions/partner-room-leads.mjs`
- **Documents**: Python (reportlab) scripts generate the PDFs

Merging to `main` deploys to the live site. Nothing is live until then.

## Key Files

| File | What it does |
|------|-------------|
| `lib/site.ts` | External URLs and the contact email. Never hardcode these elsewhere. |
| `lib/bodies-of-work.ts` | The three bodies of work, shared by the homepage and `/about`. |
| `lib/now-entries.ts` | The `/now` page. Update `nowLastUpdated` with every edit. |
| `lib/now.ts` | The short "Now" snapshot at the bottom of `/about`. |
| `lib/speaking.ts` | Venues and testimonials, shared by `/speaking` and the homepage. |
| `data/profile.json` | Roles, assignments, sectors, qualifications. Source for both PDFs below. |
| `scripts/generate_capability_statement.py` | Builds the public capability statement into `public/downloads/`. |
| `scripts/generate_cv.py` | Builds the one-page CV into `output/cv/`. Private: sent on request. |
| `components/Nav.tsx`, `components/Footer.tsx` | The menu carries the offers; the footer carries the fuller map. |
| `app/(main)/` | Main-site pages. |
| `app/partner-room/`, `components/partner-room/` | The Partner Room site. |
| `middleware.ts`, `lib/partner-room-routing.mjs` | Decide which site a request gets, by hostname. |
| `public/__forms.html` | Static copy of every form so Netlify can detect them. Do not delete. |
| `next.config.ts` | Permanent redirects for every retired URL. |

## Common Tasks

- **Editing profile facts** (roles, languages, assignments): edit
  `data/profile.json`, then run `npm run build:capability` and
  `npm run build:cv`, and commit the regenerated PDFs. The CV must stay on one
  page; its script fails loudly if it overflows.
- **Updating `/now`**: edit `lib/now-entries.ts` only. Six entries is the
  ceiling; retire entries rather than archive them.
- **Adding a testimonial or venue**: append to `lib/speaking.ts`.
- **Adding or renaming a form field**: change the React form and
  `public/__forms.html` together. Netlify silently drops fields that are
  missing from the static copy. Forms only capture on the deployed site, not
  on localhost.
- **Retiring a page**: remove it, drop it from `app/sitemap.ts`, and add a
  permanent redirect in `next.config.ts`. Old URLs are never left to 404.
- **Regenerating the Partner Room field guide**: `npm run build:framework`,
  then `npm run verify:framework`.
- **Before opening a PR**: `npm test` and `npm run typecheck`.

## Decision Checklist

Always ask before:

- Changing what appears in the menu or footer
- Publishing anything from the CV: it names clients the public capability
  statement deliberately anonymises
- Naming a client in `data/profile.json` assignments, which flows straight
  into the public PDF
- Changing Partner Room positioning, pricing or the seat-request flow
- Changing how requests are routed between the two sites
- Installing an npm package
- Merging to `main`, since that deploys

## Off-Limits Without Asking

- Copying the CV, or any file from `output/`, into `public/`
- Removing or renaming entries in `public/__forms.html`
- Removing a redirect from `next.config.ts`
- Editing `netlify.toml` or Netlify environment settings
- Rewording testimonials in `lib/speaking.ts`: they are other people's words
