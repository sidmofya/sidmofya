import test from "node:test";
import assert from "node:assert/strict";

import {
  FRAMEWORK_FORM_NAME,
  FRAMEWORK_SOURCE,
  buildFrameworkLeadPayload,
  validateFrameworkLead,
} from "../lib/partner-room-framework-form.mjs";

test("rejects missing framework lead details", () => {
  assert.deepEqual(validateFrameworkLead({ "first-name": "", email: "", role: "" }).errors, {
    "first-name": "Please enter your first name.",
    email: "Please enter your email address.",
  });
});

test("accepts a trimmed valid lead and optional supported role", () => {
  const result = validateFrameworkLead({
    "first-name": " Amina ",
    email: " amina@example.com ",
    role: "Investor",
  });

  assert.deepEqual(result, {
    values: { "first-name": "Amina", email: "amina@example.com", role: "Investor" },
    errors: {},
  });
});

test("allows a blank role but rejects an unknown role", () => {
  assert.deepEqual(validateFrameworkLead({
    "first-name": "Amina",
    email: "amina@example.com",
    role: "",
  }).errors, {});

  assert.deepEqual(validateFrameworkLead({
    "first-name": "Amina",
    email: "amina@example.com",
    role: "Operator",
  }).errors, {
    role: "Please select a valid role.",
  });
});

test("builds the framework payload with the stable capture attribution", () => {
  const payload = buildFrameworkLeadPayload({
    "first-name": "Amina",
    email: "amina@example.com",
    role: "Investor",
    "bot-field": "",
  }, {
    "utm-source": "newsletter",
    "utm-medium": "email",
    "utm-campaign": "framework",
    "utm-content": "primary",
    "utm-term": "venture",
    "referral-url": "https://example.com/article",
    "landing-page-url": "https://partnerroom.sidmofya.com/?utm_source=newsletter",
  }, "2026-09-03T12:00:00.000Z");

  assert.deepEqual(payload, {
    "form-name": FRAMEWORK_FORM_NAME,
    "first-name": "Amina",
    email: "amina@example.com",
    role: "Investor",
    source: FRAMEWORK_SOURCE,
    tag: FRAMEWORK_SOURCE,
    "utm-source": "newsletter",
    "utm-medium": "email",
    "utm-campaign": "framework",
    "utm-content": "primary",
    "utm-term": "venture",
    "referral-url": "https://example.com/article",
    "landing-page-url": "https://partnerroom.sidmofya.com/?utm_source=newsletter",
    "submitted-at": "2026-09-03T12:00:00.000Z",
    subject: "Partner Room Decision Architecture download",
    "bot-field": "",
  });
});
