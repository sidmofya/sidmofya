import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";

import {
  buildRoomRequestPayload,
  captureFirstTouchAttribution,
  normalizeHttpUrl,
  validateRoomRequest,
} from "../lib/partner-room-form.mjs";
import { createRoomRequestSubmitter } from "../lib/partner-room-request-submission.mjs";

const validValues = {
  name: "Amina Founder",
  email: "amina@example.com",
  company: "Signal Works",
  "company-website": "signalworks.example",
  round: "Series A extension",
  "raise-timing": "3 to 6 months",
  "raise-amount": "$8M",
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
  const result = validateRoomRequest({
    name: "",
    email: "",
    company: "",
    "company-website": "",
    round: "",
    "raise-timing": "",
    "raise-amount": "",
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
  const result = validateRoomRequest(values);

  assert.equal(result.values.email, "not-an-email");
  assert.equal(result.values["company-website"], "https://");
  assert.equal(result.values["deck-url"], "ftp://files.example.com/deck.pdf");
  assert.deepEqual(result.errors, {
    email: "Please enter a valid email address.",
    "company-website": "Please enter a valid company website URL.",
    "deck-url": "Please enter a valid deck or investor materials URL.",
  });
});

test("allows only the approved round and raise-timing choices", () => {
  const result = validateRoomRequest({
    ...validValues,
    round: "Seed",
    "raise-timing": "Within 3–6 months",
  });

  assert.deepEqual(result.errors, {
    round: "Please tell us which round you are preparing for.",
    "raise-timing": "Please tell us when you expect to raise.",
  });
});

test("accepts every approved round and raise-timing choice", () => {
  const rounds = ["Series A", "Series A extension", "Other"];
  const timings = [
    "Now / already preparing",
    "Within 3 months",
    "3 to 6 months",
    "6+ months",
    "Not sure yet",
  ];

  for (const round of rounds) {
    for (const timing of timings) {
      assert.deepEqual(validateRoomRequest({ ...validValues, round, "raise-timing": timing }).errors, {});
    }
  }
});

test("keeps raise amount optional and normalizes valid website and deck values", () => {
  const result = validateRoomRequest({ ...validValues, "raise-amount": "  " });

  assert.deepEqual(result.errors, {});
  assert.equal(result.values["raise-amount"], "");
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
  const validation = validateRoomRequest(validValues);
  const attribution = captureFirstTouchAttribution({
    currentUrl: "https://partnerroom.sidmofya.com/?utm_source=linkedin",
    referrer: "https://www.linkedin.com/",
    storedValue: null,
  });

  assert.deepEqual(
    buildRoomRequestPayload(
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
      round: "Series A extension",
      "raise-timing": "3 to 6 months",
      "raise-amount": "$8M",
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
      subject: "Partner Room request — Signal Works",
      "bot-field": "",
    },
  );
});

test("keeps the static Partner Room form in exact parity with every request payload key", async () => {
  const publicForms = await readFile(path.join(process.cwd(), "public", "__forms.html"), "utf8");
  const partnerRoomForm = publicForms.match(
    /<form\s+name="partner-room-seat-request"[\s\S]*?<\/form>/,
  )?.[0];
  const sovereignGeometryForm = publicForms.match(
    /<form\s+name="sovereign-geometry-waitlist"[\s\S]*?<\/form>/,
  )?.[0];
  const validation = validateRoomRequest(validValues);
  const payload = buildRoomRequestPayload(validation.values, {}, "2026-09-03T00:00:00.000Z");

  assert.ok(partnerRoomForm, "the Partner Room detection form should exist");
  const staticFieldNames = Array.from(
    partnerRoomForm.matchAll(/<(?:input|select|textarea)\b[^>]*\bname="([^"]+)"/g),
    ([, name]) => name,
  ).sort();

  assert.deepEqual(staticFieldNames, Object.keys(payload).sort());
  assert.match(partnerRoomForm, /name="form-name" value="partner-room-seat-request"/);
  assert.match(partnerRoomForm, /name="raise-amount"/);
  assert.ok(sovereignGeometryForm, "unrelated static forms should remain present");
  assert.doesNotMatch(sovereignGeometryForm, /partner-room-seat-request|raise-amount/);
});

test("submits once, preserves the payload after failed responses, and dispatches only after OK", async () => {
  let resolvePost;
  const postedPayloads = [];
  const successEvents = [];
  const payload = { ...validValues, "raise-amount": " $8M " };
  const submitter = createRoomRequestSubmitter({
    post: (candidate) => new Promise((resolve) => {
      postedPayloads.push(candidate);
      resolvePost = resolve;
    }),
    onSuccess: () => successEvents.push("partner-room:request-submitted"),
  });

  const firstSubmission = submitter(payload);
  assert.equal(await submitter(payload), "duplicate");
  assert.equal(postedPayloads.length, 1);
  assert.deepEqual(successEvents, []);

  resolvePost({ ok: true });
  assert.equal(await firstSubmission, "success");
  assert.deepEqual(successEvents, ["partner-room:request-submitted"]);

  const failedPayload = { ...payload };
  const failedSubmitter = createRoomRequestSubmitter({
    post: async () => ({ ok: false }),
    onSuccess: () => successEvents.push("unexpected-success"),
  });

  assert.equal(await failedSubmitter(failedPayload), "error");
  assert.deepEqual(failedPayload, payload);
  assert.deepEqual(successEvents, ["partner-room:request-submitted"]);
});

test("uses a post-commit pending invalid field effect and retains answers on failure", async () => {
  const source = await readFile(
    path.join(process.cwd(), "components", "partner-room", "RequestRoomForm.tsx"),
    "utf8",
  );

  assert.match(source, /const \[pendingInvalidField, setPendingInvalidField\] = useState<string \| null>\(null\)/);
  assert.match(source, /const formRef = useRef<HTMLFormElement>\(null\)/);
  assert.match(source, /useEffect\(\(\) => \{[\s\S]*?formRef\.current\?\.elements\.namedItem\(pendingInvalidField\)[\s\S]*?control\.focus\(\)[\s\S]*?setPendingInvalidField\(null\)[\s\S]*?\}, \[errors, pendingInvalidField\]\)/);
  assert.match(source, /setErrors\(validation\.errors\);[\s\S]*?setPendingInvalidField\(firstInvalidField\);/);
  assert.match(source, /aria-invalid=\{Boolean\(errors\.name\)\}/);
  assert.match(source, /setStatus\("error"\)/);
  assert.doesNotMatch(source, /\.reset\(/);
});

test("renders and focuses a programmatic success status after an accepted request", async () => {
  const source = await readFile(
    path.join(process.cwd(), "components", "partner-room", "RequestRoomForm.tsx"),
    "utf8",
  );

  assert.match(source, /const successRef = useRef<HTMLDivElement>\(null\)/);
  assert.match(source, /useEffect\(\(\) => \{\s*if \(status === "success"\) successRef\.current\?\.focus\(\);?\s*\}, \[status\]\)/);
  assert.match(source, /<div className=\{styles\.successState\} ref=\{successRef\} role="status" tabIndex=\{-1\}>/);
});
