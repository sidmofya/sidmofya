import assert from "node:assert/strict";
import test from "node:test";

import {
  deliverFrameworkLead,
  FRAMEWORK_FORM_NAME,
} from "../lib/partner-room-lead-delivery.mjs";

test("ignores submissions from other Netlify forms", async () => {
  const calls = [];
  const result = await deliverFrameworkLead({
    data: { "form-name": "contact", email: "founder@example.com" },
    fetchImpl: async (...args) => {
      calls.push(args);
      return new Response(null, { status: 200 });
    },
    resendApiKey: "resend-key",
    hubspotAccessToken: "hubspot-key",
  });

  assert.equal(result, "ignored");
  assert.deepEqual(calls, []);
});

test("emails the framework and upserts the HubSpot contact", async () => {
  const calls = [];
  const result = await deliverFrameworkLead({
    data: {
      "first-name": "  Ada  ",
      email: " ADA@example.com ",
      role: "Founder",
      source: FRAMEWORK_FORM_NAME,
      tag: FRAMEWORK_FORM_NAME,
    },
    fetchImpl: async (url, options) => {
      calls.push({ url, options });
      return new Response(null, { status: 200 });
    },
    resendApiKey: "resend-key",
    hubspotAccessToken: "hubspot-key",
  });

  assert.equal(result, "delivered");
  assert.equal(calls.length, 2);

  const resend = calls.find((call) => call.url === "https://api.resend.com/emails");
  assert.equal(resend.options.headers.Authorization, "Bearer resend-key");
  assert.deepEqual(JSON.parse(resend.options.body), {
    from: "Partner Room <room@sidmofya.com>",
    reply_to: "sid@sidmofya.com",
    to: ["ada@example.com"],
    subject: "How Venture Rooms Decide",
    text: "Ada,\n\nYour copy of How Venture Rooms Decide is ready:\nhttps://partnerroom.sidmofya.com/downloads/how-venture-rooms-decide.pdf\n\nSid Mofya\nPartner Room",
  });

  const hubspot = calls.find((call) => call.url.includes("api.hubapi.com"));
  assert.equal(hubspot.url, "https://api.hubapi.com/crm/objects/2026-03/contacts/batch/upsert");
  assert.equal(hubspot.options.headers.Authorization, "Bearer hubspot-key");
  assert.deepEqual(JSON.parse(hubspot.options.body), {
    inputs: [{
      id: "ada@example.com",
      idProperty: "email",
      properties: {
        email: "ada@example.com",
        firstname: "Ada",
        partner_room_role: "Founder",
        partner_room_source: FRAMEWORK_FORM_NAME,
      },
    }],
  });
});

test("rejects malformed framework submissions without calling providers", async () => {
  let called = false;
  await assert.rejects(
    deliverFrameworkLead({
      data: { "form-name": FRAMEWORK_FORM_NAME, email: "not-an-email" },
      fetchImpl: async () => {
        called = true;
        return new Response(null, { status: 200 });
      },
      resendApiKey: "resend-key",
      hubspotAccessToken: "hubspot-key",
    }),
    /valid framework lead/,
  );
  assert.equal(called, false);
});

test("reports provider failures so Netlify can retry and log them", async () => {
  await assert.rejects(
    deliverFrameworkLead({
      data: {
        "form-name": FRAMEWORK_FORM_NAME,
        "first-name": "Ada",
        email: "ada@example.com",
        role: "Investor",
      },
      fetchImpl: async (url) => new Response("provider error", {
        status: url.includes("resend") ? 422 : 200,
      }),
      resendApiKey: "resend-key",
      hubspotAccessToken: "hubspot-key",
    }),
    /Resend request failed with 422/,
  );
});
