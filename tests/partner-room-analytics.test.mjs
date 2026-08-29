import test from "node:test";
import assert from "node:assert/strict";

import {
  createPartnerRoomAnalytics,
  isSectionDepthQualified,
  reconcileArchitectureIntersections,
  selectActiveArchitecture,
  toArchitectureIntersection,
} from "../lib/partner-room-analytics.mjs";

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

test("qualifies section depth only at or above 25 percent intersection", () => {
  assert.equal(isSectionDepthQualified({ isIntersecting: true, intersectionRatio: 0.249 }), false);
  assert.equal(isSectionDepthQualified({ isIntersecting: false, intersectionRatio: 1 }), false);
  assert.equal(isSectionDepthQualified({ isIntersecting: true, intersectionRatio: 0.25 }), true);
});

test("maintains and deterministically resolves active architectures across observer batches", () => {
  let visibleArchitectures = new Map();

  visibleArchitectures = reconcileArchitectureIntersections(visibleArchitectures, [
    { architecture: "01", isIntersecting: true, intersectionRatio: 0.5 },
  ]);
  assert.equal(selectActiveArchitecture(visibleArchitectures), "01");

  visibleArchitectures = reconcileArchitectureIntersections(visibleArchitectures, [
    { architecture: "02", isIntersecting: true, intersectionRatio: 0.8 },
  ]);
  assert.equal(selectActiveArchitecture(visibleArchitectures), "02");

  visibleArchitectures = reconcileArchitectureIntersections(visibleArchitectures, [
    { architecture: "02", isIntersecting: false, intersectionRatio: 0 },
  ]);
  assert.equal(selectActiveArchitecture(visibleArchitectures), "01");

  visibleArchitectures = reconcileArchitectureIntersections(visibleArchitectures, [
    { architecture: "01", isIntersecting: false, intersectionRatio: 0 },
  ]);
  assert.equal(selectActiveArchitecture(visibleArchitectures), undefined);
});

test("adapts prototype-backed observer values without spreading entry fields", () => {
  const observerEntry = Object.create({
    get isIntersecting() {
      return true;
    },
    get intersectionRatio() {
      return 0.75;
    },
  });

  assert.deepEqual({ ...observerEntry }, {});
  assert.deepEqual(toArchitectureIntersection(observerEntry, "03"), {
    architecture: "03",
    isIntersecting: true,
    intersectionRatio: 0.75,
  });
});
