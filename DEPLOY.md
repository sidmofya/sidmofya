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
3. Under **Site configuration → Environment variables**, add `SITE_VARIANT=partner-room` for Production, Deploy Previews, and Branch deploys.
4. Deploy once, then confirm the generated `netlify.app` URL serves Partner Room at `/` and redirects every other public route back to `/`.
5. Under **Domain management**, attach `partnerroom.sidmofya.com`. If DNS is managed elsewhere, add a CNAME from `partnerroom` to the new site's `netlify.app` hostname and wait for Netlify to provision SSL.
6. Under **Forms**, confirm `partner-room-seat-request` was detected from `public/__forms.html`.
7. Under **Site configuration → Forms → Form notifications**, add an email notification for new `partner-room-seat-request` submissions to `sid@cxbventures.com`.

After the production domain and notification are active, submit one real request at `https://partnerroom.sidmofya.com`. Treat the launch as complete only after the request appears in Netlify Forms and the notification reaches `sid@cxbventures.com`.

The main production site redirects `/partner-room` to the canonical Partner Room subdomain. Local development keeps `/partner-room` directly accessible.

## Outstanding

- **Main-site OG image / favicon** — Partner Room has its own generated social image; the main site still needs dedicated assets when ready.
- **Analytics** — none installed; add Plausible / Fathom / Netlify Analytics when ready.
