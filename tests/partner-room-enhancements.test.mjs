import test from "node:test";
import assert from "node:assert/strict";

import { createPartnerRoomAnalytics } from "../lib/partner-room-analytics.mjs";
import {
  emitPlausible,
  installPartnerRoomEventRouting,
} from "../lib/partner-room-enhancements.mjs";

function createEventTarget() {
  const listeners = new Map();

  return {
    addEventListener(name, listener) {
      const handlers = listeners.get(name) ?? new Set();
      handlers.add(listener);
      listeners.set(name, handlers);
    },
    removeEventListener(name, listener) {
      listeners.get(name)?.delete(listener);
    },
    dispatchEvent(event) {
      for (const listener of listeners.get(event.type) ?? []) listener(event);
    },
  };
}

function createAnchor({ selector, dataset, href }) {
  return {
    dataset,
    getAttribute(name) {
      return name === "href" ? href : null;
    },
    closest(candidate) {
      return candidate === selector ? this : null;
    },
  };
}

test("emits Plausible events with and without a second argument exactly", () => {
  const calls = [];
  const plausible = (...args) => calls.push(args);

  emitPlausible(plausible, "partner_room_request_clicked", { source_section: "hero" });
  emitPlausible(plausible, "partner_room_request_submitted");

  assert.deepEqual(calls, [
    ["partner_room_request_clicked", { props: { source_section: "hero" } }],
    ["partner_room_request_submitted"],
  ]);
});

test("routes delegated click and boundary events without collecting form values", () => {
  const document = createEventTarget();
  const window = {
    ...createEventTarget(),
    history: { replaceState: (...args) => historyCalls.push(args) },
  };
  const historyCalls = [];
  const focusCalls = [];
  const scrollCalls = [];
  let reducedMotion = false;
  const requestSection = { scrollIntoView: (options) => scrollCalls.push(options) };
  const requestHeading = { focus: (options) => focusCalls.push(options) };
  const getElementById = (id) => ({
    "request-room": requestSection,
    "request-room-title": requestHeading,
  })[id] ?? null;
  const calls = [];
  const analytics = createPartnerRoomAnalytics((name, props) => emitPlausible(
    (...args) => calls.push(args),
    name,
    props,
  ));
  const cleanup = installPartnerRoomEventRouting({
    document: { ...document, getElementById },
    window,
    analytics,
    prefersReducedMotion: () => reducedMotion,
  });
  const request = createAnchor({
    selector: "a[data-request-source]",
    dataset: { requestSource: "hero" },
    href: "#request-room",
  });
  const framework = createAnchor({
    selector: "[data-framework-trigger]",
    dataset: { frameworkSource: "architectures" },
    href: "/decision-architecture-framework",
  });
  const prevented = [];

  document.dispatchEvent({ type: "click", target: request, preventDefault: () => prevented.push("first") });
  reducedMotion = true;
  document.dispatchEvent({ type: "click", target: request, preventDefault: () => prevented.push("second") });
  document.dispatchEvent({ type: "click", target: framework, preventDefault: () => prevented.push("framework") });
  window.dispatchEvent({ type: "partner-room:request-submitted" });
  window.dispatchEvent({ type: "partner-room:framework-lead-submitted", detail: { role: "Investor" } });
  window.dispatchEvent({ type: "partner-room:framework-download-completed" });

  assert.deepEqual(calls, [
    ["partner_room_request_clicked", { props: { source_section: "hero" } }],
    ["partner_room_request_clicked", { props: { source_section: "hero" } }],
    ["framework_download_clicked", { props: { source_section: "architectures" } }],
    ["partner_room_request_submitted"],
    ["framework_lead_submitted", { props: { role: "investor" } }],
    ["framework_download_completed"],
  ]);
  assert.deepEqual(prevented, ["first", "second"]);
  assert.deepEqual(focusCalls, [{ preventScroll: true }, { preventScroll: true }]);
  assert.deepEqual(scrollCalls, [
    { behavior: "smooth", block: "start" },
    { behavior: "auto", block: "start" },
  ]);
  assert.deepEqual(historyCalls, [
    [null, "", "#request-room"],
    [null, "", "#request-room"],
  ]);

  cleanup();
  document.dispatchEvent({ type: "click", target: framework, preventDefault() {} });
  window.dispatchEvent({ type: "partner-room:framework-download-completed" });
  assert.equal(calls.length, 6);
});
