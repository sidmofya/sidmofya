import test from "node:test";
import assert from "node:assert/strict";

import { shouldShowMobileCta } from "../lib/partner-room-interactions.mjs";

test("shows the mobile CTA only between the hero and request form", () => {
  assert.equal(shouldShowMobileCta({ heroVisible: true, formVisible: false }), false);
  assert.equal(shouldShowMobileCta({ heroVisible: false, formVisible: false }), true);
  assert.equal(shouldShowMobileCta({ heroVisible: false, formVisible: true }), false);
});
