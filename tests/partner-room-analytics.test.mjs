import test from "node:test";
import assert from "node:assert/strict";

import { createPartnerRoomAnalytics } from "../lib/partner-room-analytics.mjs";

test("emits exactly the approved Partner Room conversion events", () => {
  const events = [];
  const analytics = createPartnerRoomAnalytics((name, props) => events.push({ name, props }));

  analytics.trackRequestClick("hero");
  analytics.trackRequestSubmitted();
  analytics.trackFrameworkClick("framework-primary");
  analytics.trackFrameworkLead("Investor");
  analytics.trackFrameworkDownload();

  assert.deepEqual(events, [
    { name: "partner_room_request_clicked", props: { source_section: "hero" } },
    { name: "partner_room_request_submitted", props: undefined },
    { name: "framework_download_clicked", props: { source_section: "framework-primary" } },
    { name: "framework_lead_submitted", props: { role: "investor" } },
    { name: "framework_download_completed", props: undefined },
  ]);
});

test("records every valid request and framework click but rejects unknown sources", () => {
  const events = [];
  const analytics = createPartnerRoomAnalytics((name, props) => events.push({ name, props }));

  analytics.trackRequestClick("nav");
  analytics.trackRequestClick("nav");
  analytics.trackRequestClick("unknown");
  analytics.trackFrameworkClick("framework-secondary");
  analytics.trackFrameworkClick("framework-secondary");
  analytics.trackFrameworkClick("architectures");

  assert.deepEqual(events, [
    { name: "partner_room_request_clicked", props: { source_section: "nav" } },
    { name: "partner_room_request_clicked", props: { source_section: "nav" } },
    { name: "framework_download_clicked", props: { source_section: "framework-secondary" } },
    { name: "framework_download_clicked", props: { source_section: "framework-secondary" } },
  ]);
});

test("emits successful submission and download boundaries only once", () => {
  const events = [];
  const analytics = createPartnerRoomAnalytics((name, props) => events.push({ name, props }));

  analytics.trackRequestSubmitted();
  analytics.trackRequestSubmitted();
  analytics.trackFrameworkLead("Founder");
  analytics.trackFrameworkLead("Other");
  analytics.trackFrameworkDownload();
  analytics.trackFrameworkDownload();

  assert.deepEqual(events, [
    { name: "partner_room_request_submitted", props: undefined },
    { name: "framework_lead_submitted", props: { role: "founder" } },
    { name: "framework_download_completed", props: undefined },
  ]);
});

test("keeps framework lead properties to an optional normalized approved role", () => {
  const events = [];
  const analytics = createPartnerRoomAnalytics((name, props) => events.push({ name, props }));

  analytics.trackFrameworkLead("");

  assert.deepEqual(events, [
    { name: "framework_lead_submitted", props: undefined },
  ]);

  const unknownRoleEvents = [];
  createPartnerRoomAnalytics((name, props) => unknownRoleEvents.push({ name, props }))
    .trackFrameworkLead("Operator");

  assert.deepEqual(unknownRoleEvents, [
    { name: "framework_lead_submitted", props: undefined },
  ]);
});
