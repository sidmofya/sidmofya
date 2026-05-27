# sidmofya.com

Personal front door for Sid Mofya — the culture register of the work. v0.1.

## Stack

- Next.js 15 (App Router) + React 19
- Tailwind CSS v4
- Typography: Fraunces (display) + Inter (text) via `next/font/google`
- Deploy: Netlify (`@netlify/plugin-nextjs`)

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
- `/work-with-me` — Request a sprint (client-side form, no backend in v0.1)
- `/about` — About Sid

## Deploy (Netlify)

Connect this repo to a Netlify site. No environment variables required for v0.1. `netlify.toml` is configured.

## Outstanding for next iteration

- **54 Worlds URL** — footer link and About card currently point to `#`.
- **Form backend** — `WorkWithMeForm` currently shows a client-side success message only. To wire to Netlify Forms, add `data-netlify="true"` to the `<form>` and add a hidden `form-name` input matching `name="work-with-me"`.
- **Analytics** — none installed; add Plausible / Fathom / Netlify Analytics when ready.
- **OG image** — `public/` is empty; add `og.png` + favicon.
