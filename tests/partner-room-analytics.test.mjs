import test from "node:test";
import assert from "node:assert/strict";

import { createPartnerRoomAnalytics } from "../lib/partner-room-analytics.mjs";

test("emits each application boundary and allowed section depth once", () => {
  const events = [];
  const analytics = createPartnerRoomAnalytics((name, props) => events.push({ name, props }));

  analytics.trackApplicationStart();
  analytics.trackApplicationStart();
  analytics.trackSectionDepth("mechanism");
  analytics.trackSectionDepth("mechanism");
  analytics.trackApplicationComplete();
  analytics.trackApplicationAbandon();

  assert.deepEqual(events, [
    { name: "partner_room_application_start", props: undefined },
    { name: "partner_room_section_depth", props: { section: "mechanism" } },
    { name: "partner_room_application_complete", props: undefined },
  ]);
});

test("emits abandonment only once after an application starts and before it completes", () => {
  const events = [];
  const analytics = createPartnerRoomAnalytics((name, props) => events.push({ name, props }));

  analytics.trackApplicationAbandon();
  analytics.trackApplicationStart();
  analytics.trackApplicationAbandon();
  analytics.trackApplicationAbandon();
  analytics.trackApplicationComplete();
  analytics.trackApplicationAbandon();

  assert.deepEqual(events, [
    { name: "partner_room_application_start", props: undefined },
    { name: "partner_room_application_abandon", props: undefined },
    { name: "partner_room_application_complete", props: undefined },
  ]);
});

test("tracks only the approved Partner Room section milestones", () => {
  const events = [];
  const analytics = createPartnerRoomAnalytics((name, props) => events.push({ name, props }));

  for (const section of ["mechanism", "architectures", "founding-room", "request-seat", "failure-mode"]) {
    analytics.trackSectionDepth(section);
  }

  assert.deepEqual(events, [
    { name: "partner_room_section_depth", props: { section: "mechanism" } },
    { name: "partner_room_section_depth", props: { section: "architectures" } },
    { name: "partner_room_section_depth", props: { section: "founding-room" } },
    { name: "partner_room_section_depth", props: { section: "request-seat" } },
  ]);
});

test("records CTA location without collecting application data", () => {
  const events = [];
  const analytics = createPartnerRoomAnalytics((name, props) => events.push({ name, props }));

  analytics.trackCta("architectures");

  assert.deepEqual(events, [
    { name: "partner_room_cta_click", props: { location: "architectures" } },
  ]);
});
