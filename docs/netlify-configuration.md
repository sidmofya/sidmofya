# Netlify configuration — sidmofya.com

A runbook for the settings that live in the Netlify dashboard rather than in this
repository, and which therefore no amount of local testing will catch. Written
September 2026 as a brief for an agent with Netlify access; it works equally as a
checklist for a person.

Companion to `DEPLOY.md`, which covers first-time setup. This file covers what to
verify on a site that is already live.

There are **two Netlify sites built from this one repository**: the main site
(`sidmofya.com`) and Partner Room (`partnerroom.sidmofya.com`). They are
distinguished only by the `SITE_VARIANT` environment variable. Do not merge,
rename or delete either site.

**Do not touch the motif54.com Netlify site. It is out of scope.**

Work through Part A now. Part B only applies after the four `feat/*` branches are merged and deployed.

---

## Part A — check and fix now

### A1. Form notifications are probably broken entirely (highest priority)

`DEPLOY.md` in this repo documents an email notification wired to a form named **`work-with-me`**, notifying **`sid@motif54.com`**.

Both of those are now wrong:

- **The form no longer exists.** `/work-with-me` is a permanent redirect to `/contact` (see `next.config.ts`). The current form is named `contact`. A notification attached to `work-with-me` receives nothing.
- **The address is wrong.** The site's contact address is now `sid@sidmofya.com`, and the privacy policy tells people to email that address to have their data removed.

The live forms, exactly as named in `public/__forms.html`:

| Form name | Where it lives |
|---|---|
| `contact` | sidmofya.com/contact |
| `speaking-inquiry` | sidmofya.com/speaking |
| `work-request` | sidmofya.com/23-south |
| `kwazuri-interest` | sidmofya.com/kwazuri |
| `partner-room-seat-request` | partnerroom.sidmofya.com |
| `partner-room-decision-architecture` | partnerroom.sidmofya.com |

**Do this:**

1. On the **main** site: Site configuration → Forms → Form notifications.
2. Report every existing notification: which form, which event, which address. Say explicitly whether any is attached to `work-with-me`.
3. Delete or repoint any notification attached to `work-with-me`.
4. Ensure there is a **New form submission** email notification to `sid@sidmofya.com` for each of: `contact`, `speaking-inquiry`, `work-request`, `kwazuri-interest`.
5. Repeat on the **Partner Room** site for `partner-room-seat-request` and `partner-room-decision-architecture`.
6. Check Forms → submissions on both sites for entries received but never notified. Report roughly how many and how far back — these may be leads that were never seen.

### A2. Environment variables

Confirm and report the current value and scope of each.

**Main site (`sidmofya.com`):**

- `SITE_VARIANT` — **must not be set at all.** If it exists with any value, the main site will render Partner Room at its root. Remove it if present.
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` — should be `sidmofya.com`. Analytics silently disable themselves if it is unset.

**Partner Room site (`partnerroom.sidmofya.com`):**

- `SITE_VARIANT=partner-room` — required, and must be enabled for **Production, Deploy Previews and Branch deploys**. If it is missing from any of those scopes, that context serves the main site instead of Partner Room.
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` — should be `partnerroom.sidmofya.com`. Production only is fine.
- `RESEND_API_KEY` — required. See A3.
- `HUBSPOT_ACCESS_TOKEN` — required. See A3.

Do not print secret values back. Report only whether each exists and which deploy contexts it covers.

### A3. Partner Room framework delivery will throw if secrets are missing

`netlify/functions/partner-room-leads.mjs` runs on submissions to `partner-room-decision-architecture` and emails the field-guide PDF via Resend, then upserts the lead into HubSpot.

`lib/partner-room-lead-delivery.mjs` throws `"Partner Room delivery credentials are not configured."` if **either** `RESEND_API_KEY` or `HUBSPOT_ACCESS_TOKEN` is absent. The person gets no PDF.

**Do this:**

1. Confirm both variables exist on the Partner Room site.
2. Check the function logs for that error string and report whether it has fired, and how often.
3. In **Resend**, confirm `sidmofya.com` is a verified sending domain. The function sends `from: "Partner Room <room@sidmofya.com>"` with `reply_to: "sid@sidmofya.com"`. If the domain is unverified, every send fails.
4. Confirm `room@sidmofya.com` and `sid@sidmofya.com` both actually receive mail. `sid@sidmofya.com` is confirmed working; `room@sidmofya.com` has not been checked and is used as the sender identity.

### A4. Domains and SSL

Report, don't change unless something is broken:

- Main site serves `sidmofya.com` and `www.sidmofya.com`, both on valid SSL.
- Partner Room serves `partnerroom.sidmofya.com` on valid SSL.
- Neither site has the other's domain attached.

### A5. Confirm both sites auto-deploy from `main` (found the hard way, 6 Sep 2026)

When PR #11 merged to `main`, **sidmofya.com rebuilt automatically but
partnerroom.sidmofya.com did not.** Partner Room kept serving the previous commit
until a deploy was triggered by hand, so a merged change sat invisible in
production. Both sites build from the same repo and the same branch, so this is a
per-site setting, not a repo problem.

On **each** site — `sidmofya25` and `partnerroom-sidmofya` — check
Site configuration → Build & deploy → Continuous deployment:

1. Is the site linked to `sidmofya/sidmofya`?
2. Is the production branch `main`?
3. Are automatic builds **enabled**, not stopped or locked? A locked deploy or a
   "stopped builds" state produces exactly this symptom: green on GitHub,
   unchanged in the browser.
4. Check Deploys → the most recent entry's trigger. If deploys show
   `deploy_source: api` or "manual deploy" rather than a Git push, the GitHub
   webhook is not firing. Confirm the webhook exists and is delivering under the
   repository's Settings → Webhooks.

Establish *which* of these it is before changing anything — the fix differs, and
a single dropped webhook delivery looks identical to disconnected continuous
deployment.

Report the deploy trigger and linked branch for both sites. If Partner Room is
not wired for automatic deploys, fix it: three more packets are queued behind
this one and each will fail the same way.

**This is the highest-value check in Part A.** It is the failure mode that
silently wastes the most time, because every other signal says the change
shipped.

---

## Part B — after the four branches merge and deploy

**Packet 1 (`feat/partner-room-debrand`) merged and deployed on 6 Sep 2026**, and
B3 and B4 below were verified live: Partner Room's masthead reads `PARTNER ROOM`,
its footer links resolve to sidmofya.com, and the served field-guide PDF is
byte-identical to the rebuild with zero occurrences of MOTIF 54. The only visible
"MOTIF 54" left is the facilitator credential, which is intentional.

Still queued: `feat/speaking-board-ic`, `feat/homepage-spine-and-now`,
`feat/capability-page`. B1 and B2 still apply to those.

Once those are merged and this has been run through once, Part B stops being a
one-off and becomes the standing post-deploy checklist: forms still capture every
field, new routes resolve, cross-site links still work, and the shipped PDF is the
current one.

### B1. Confirm the two new speaking form fields are actually captured

The briefing form gained two fields: **`budget-status`** (select: Budgeted / Still scoping / Not sure) and **`prior-facilitator`** (short text, optional).

Netlify only captures fields its build-time scanner finds in `public/__forms.html`. Both are declared there and parity was verified locally — but **that can only be proven in production.**

1. After deploy, submit a real test entry at `sidmofya.com/speaking` filling in both new fields. Netlify Forms does not capture localhost submissions.
2. Open the submission in Forms → `speaking-inquiry` and confirm both field names appear **with their values**.
3. If either is missing, the deploy did not pick up `public/__forms.html` — trigger a clear-cache-and-redeploy, then resubmit.
4. Delete the test submission afterwards.

### B2. New routes should resolve

On the main site: `/now`, `/terms`, `/capability`. All three are new. `/cv.pdf` is expected to 404 until Sid supplies the file.

### B3. Partner Room legal links now point at sidmofya.com

The Partner Room footer links to `https://sidmofya.com/privacy` and `https://sidmofya.com/terms`. Load Partner Room in a browser and click both. They cross from one Netlify site to the other, so they only work once the main site has deployed `/terms`.

### B4. Confirm the debrand actually shipped

On `partnerroom.sidmofya.com`, confirm no "MOTIF 54" appears in the masthead or footer, and that `partnerroom.sidmofya.com/downloads/how-venture-rooms-decide.pdf` downloads a PDF whose page headers read "PARTNER ROOM" alone. If the old PDF is still served, purge the cache and redeploy.

The one intentional exception: the facilitator biography still reads "Founder of MOTIF 54". That is a credential and stays.

---

## Repo change worth making at the same time

`DEPLOY.md` section "Contact-form email (sid@motif54.com)" is wrong on both the form name and the address. Update it to describe the six real forms and `sid@sidmofya.com`. That is a documentation-only change — do not alter application code, form field names, or `public/__forms.html` while doing it.

---

## Report back

1. Every notification found on both sites, before and after any change.
2. Which environment variables exist, on which site, in which deploy contexts. No secret values.
3. Whether the delivery-credentials error has ever fired, and whether Resend's domain is verified.
4. Any submissions received but never notified, with rough dates.
5. Anything changed, listed one line each.
6. Anything that looked wrong but was left alone, and why.

## Do not

- Do not touch the motif54.com site.
- Do not set `SITE_VARIANT` on the main site.
- Do not rename or delete Netlify forms — renaming orphans historical submissions.
- Do not change build commands or publish directories; they come from `netlify.toml`.
- Do not merge the four `feat/*` branches. Sid decides when.
