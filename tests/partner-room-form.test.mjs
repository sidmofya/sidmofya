import test from "node:test";
import assert from "node:assert/strict";

import {
  buildSeatRequestPayload,
  captureFirstTouchAttribution,
  normalizeHttpUrl,
  validateSeatRequest,
} from "../lib/partner-room-form.mjs";

const validValues = {
  name: "Amina Founder",
  email: "amina@example.com",
  company: "Signal Works",
  "company-website": "signalworks.example",
  round: "Series A",
  "raise-timing": "Within 3–6 months",
  "investor-targets": "Institutional venture funds focused on climate software.",
  "room-concern": "Whether our retention evidence is strong enough.",
  "deck-url": "docsend.com/view/example",
};

test("normalizes a bare domain to an HTTPS URL", () => {
  assert.deepEqual(normalizeHttpUrl(" signalworks.example "), {
    value: "https://signalworks.example/",
    valid: true,
  });
});

test("rejects non-HTTP URL protocols", () => {
  assert.deepEqual(normalizeHttpUrl("javascript:alert(1)"), {
    value: "javascript:alert(1)",
    valid: false,
  });
});

test("allows an optional URL to remain blank", () => {
  assert.deepEqual(normalizeHttpUrl(""), { value: "", valid: true });
});

test("returns human-readable errors for every missing required answer", () => {
  const result = validateSeatRequest({
    name: "",
    email: "",
    company: "",
    "company-website": "",
    round: "",
    "raise-timing": "",
    "investor-targets": "",
    "room-concern": "",
    "deck-url": "",
  });

  assert.deepEqual(result.errors, {
    name: "Please enter your name.",
    email: "Please enter your email address.",
    company: "Please enter your company name.",
    "company-website": "Please enter your company website.",
    round: "Please tell us which round you are preparing for.",
    "raise-timing": "Please tell us when you expect to raise.",
    "investor-targets": "Please tell us which investors you are likely to approach.",
    "room-concern": "Please tell us what the investment room may struggle to believe.",
  });
});

test("rejects malformed email and URL values without changing the answers", () => {
  const values = {
    ...validValues,
    email: "not-an-email",
    "company-website": "https://",
    "deck-url": "ftp://files.example.com/deck.pdf",
  };
  const result = validateSeatRequest(values);

  assert.equal(result.values.email, "not-an-email");
  assert.equal(result.values["company-website"], "https://");
  assert.equal(result.values["deck-url"], "ftp://files.example.com/deck.pdf");
  assert.deepEqual(result.errors, {
    email: "Please enter a valid email address.",
    "company-website": "Please enter a valid company website URL.",
    "deck-url": "Please enter a valid deck or investor materials URL.",
  });
});

test("rejects retired Seed round and Raising now timing choices", () => {
  const result = validateSeatRequest({
    ...validValues,
    round: "Seed",
    "raise-timing": "Raising now",
  });

  assert.deepEqual(result.errors, {
    round: "Please tell us which round you are preparing for.",
    "raise-timing": "Please tell us when you expect to raise.",
  });
});

test("normalizes valid website and deck values before submission", () => {
  const result = validateSeatRequest(validValues);

  assert.deepEqual(result.errors, {});
  assert.equal(result.values["company-website"], "https://signalworks.example/");
  assert.equal(result.values["deck-url"], "https://docsend.com/view/example");
});

test("captures first-touch UTM values, referrer, and landing URL", () => {
  const result = captureFirstTouchAttribution({
    currentUrl:
      "https://partnerroom.sidmofya.com/?utm_source=linkedin&utm_medium=social&utm_campaign=founding_room&utm_content=post&utm_term=series_a",
    referrer: "https://www.linkedin.com/",
    storedValue: null,
  });

  assert.deepEqual(result, {
    "utm-source": "linkedin",
    "utm-medium": "social",
    "utm-campaign": "founding_room",
    "utm-content": "post",
    "utm-term": "series_a",
    "referral-url": "https://www.linkedin.com/",
    "landing-page-url":
      "https://partnerroom.sidmofya.com/?utm_source=linkedin&utm_medium=social&utm_campaign=founding_room&utm_content=post&utm_term=series_a",
  });
});

test("preserves valid stored first-touch attribution for the session", () => {
  const stored = {
    "utm-source": "founder-direct",
    "utm-medium": "invitation",
    "utm-campaign": "founding_room",
    "utm-content": "email",
    "utm-term": "",
    "referral-url": "",
    "landing-page-url": "https://partnerroom.sidmofya.com/?utm_source=founder-direct",
  };

  assert.deepEqual(
    captureFirstTouchAttribution({
      currentUrl: "https://partnerroom.sidmofya.com/?utm_source=linkedin",
      referrer: "https://www.linkedin.com/",
      storedValue: JSON.stringify(stored),
    }),
    stored,
  );
});

test("falls back to current attribution when session storage is malformed", () => {
  const result = captureFirstTouchAttribution({
    currentUrl: "https://partnerroom.sidmofya.com/?utm_source=referrer",
    referrer: "https://example.com/invite",
    storedValue: "{not-json",
  });

  assert.equal(result["utm-source"], "referrer");
  assert.equal(result["referral-url"], "https://example.com/invite");
});

test("builds the exact Netlify notification payload", () => {
  const validation = validateSeatRequest(validValues);
  const attribution = captureFirstTouchAttribution({
    currentUrl: "https://partnerroom.sidmofya.com/?utm_source=linkedin",
    referrer: "https://www.linkedin.com/",
    storedValue: null,
  });

  assert.deepEqual(
    buildSeatRequestPayload(
      validation.values,
      attribution,
      "2026-08-27T17:30:00.000Z",
    ),
    {
      "form-name": "partner-room-seat-request",
      name: "Amina Founder",
      email: "amina@example.com",
      company: "Signal Works",
      "company-website": "https://signalworks.example/",
      round: "Series A",
      "raise-timing": "Within 3–6 months",
      "investor-targets": "Institutional venture funds focused on climate software.",
      "room-concern": "Whether our retention evidence is strong enough.",
      "deck-url": "https://docsend.com/view/example",
      "utm-source": "linkedin",
      "utm-medium": "",
      "utm-campaign": "",
      "utm-content": "",
      "utm-term": "",
      "referral-url": "https://www.linkedin.com/",
      "landing-page-url": "https://partnerroom.sidmofya.com/?utm_source=linkedin",
      "submitted-at": "2026-08-27T17:30:00.000Z",
      subject: "Partner Room seat request — Signal Works",
      "bot-field": "",
    },
  );
});
