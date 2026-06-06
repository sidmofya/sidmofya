# sidmofya.com — Project Context

This file adds project-specific context. The global Boris Whisperer configuration
(technical co-founder behavior, /brainstorm, /spec, /quality-check commands) lives
in ~/.claude/CLAUDE.md and applies automatically.

---

## What This Is

sidmofya.com is the professional home of Sid Mofya — a strategic advisor who helps
founders, investors, and leadership teams navigate complex transitions: market positioning,
organizational design, capital moves, and creative economy challenges. The site is the
primary channel for attracting qualified clients, building authority in the Sovereign Stack
space (AI, energy, minerals, compute, capital, culture, coordination), and generating
speaking invitations.

## What Success Looks Like

Qualified inbound inquiries from the right people — founders, conveners, or investors
who have a specific problem that matches one of Sid's sprints. Not volume; fit.
Secondary: speaking invitations. Tertiary: authority signals that make Sid's work
legible to institutional and investor audiences.

## Tech Stack

- **Framework**: Next.js 15 (App Router), React 19
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript (strict)
- **Deployment**: Netlify (with @netlify/plugin-nextjs)
- **Forms**: Netlify Forms (serverless, no custom backend)
- **Package manager**: npm

## The Four Offers

Sid has four consulting sprints. Two are public; two are hidden (referral/invitation only).

| Slug | Title | Visible | Who It's For |
|------|-------|---------|--------------|
| `market-legibility` | Market Legibility Sprint | Yes | Founders/advisors whose real edge crosses categories and the market can't yet buy them |
| `room-to-results` | Room-to-Results Sprint | Yes | Conveners responsible for a room (event, roundtable, summit) that needs to produce real outcomes |
| `reinvention` | ReInvention Sprint | Hidden — referral only | Mid-career professionals standing between who they've been and what they're becoming |
| `ai-music-rights` | AI Music Rights & Fan Revenue Sprint | Hidden — invitation only | Artists, managers, collectives navigating AI, rights, consent, and fan revenue |

## Key Files

| File | What it does |
|------|-------------|
| `lib/offers.ts` | All four offer definitions — title, copy, deliverables, best-fit, not-fit, CTAs. Edit here to change any offer content. |
| `lib/pattern-cognition.ts` | 150+ YouTube shorts organized by 6 categories: Africa & Capital, Africa & Development, AI & Creative Practice, Inner Practice, Strategy & Decisions, Money & Meaning. Add new videos here. |
| `app/page.tsx` | Home page — hero, speaking section, offers grid, Pattern Cognition video gallery |
| `app/[slug]/page.tsx` | Each offer gets its own page, driven by the offer data in lib/offers.ts |
| `app/work-with-me/page.tsx` | Lead capture form (Netlify Forms) |
| `components/WorkWithMeForm.tsx` | The actual form component — client-side React |
| `components/Nav.tsx` | Navigation — always ask before changing what appears here |
| `public/__forms.html` | Hidden file required by Netlify to detect forms — do not delete |

## Common Tasks

**Adding or editing an offer**: Edit `lib/offers.ts`. The page is generated automatically.
Never change an offer's `slug` — it breaks the URL.

**Adding a video**: Edit `lib/pattern-cognition.ts`. Add a `{ title, id, category }` object
to the array. The `id` is the YouTube video ID (the part after `?v=` or in the short URL).
Valid categories: `africa-capital`, `africa-dev`, `ai`, `inner`, `strategy`, `money`.

**Adding a new page**: Create `app/[your-slug]/page.tsx`. Ask before adding it to the nav.

**Changing form fields**: Edit `components/WorkWithMeForm.tsx`. Also update
`public/__forms.html` to match — Netlify reads that file to detect the form shape.

## Decision Checklist

Always ask before:
- Changing the navigation (Nav.tsx)
- Changing a hidden offer to visible (or vice versa)
- Changing the slug of any offer (breaks existing URLs)
- Installing a new npm package
- Adding any page to the public navigation
- Changing the work-with-me form fields (requires updating both the component and __forms.html)

## Off-Limits Without Asking

- Changing pricing, deliverables, or positioning copy inside lib/offers.ts
- Making the `reinvention` or `ai-music-rights` offers publicly visible
- Removing or editing `public/__forms.html`
- Changing deployment configuration in `netlify.toml`
