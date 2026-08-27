import test from "node:test";
import assert from "node:assert/strict";

import {
  buildPartnerRoomUrl,
  resolvePartnerRoomRoute,
} from "../lib/partner-room-routing.mjs";

test("preserves attribution parameters when building route destinations", () => {
  assert.equal(
    buildPartnerRoomUrl({
      requestUrl:
        "https://sidmofya.com/partner-room?utm_source=linkedin&utm_campaign=founding_room",
      url: "https://partnerroom.sidmofya.com/",
    }).href,
    "https://partnerroom.sidmofya.com/?utm_source=linkedin&utm_campaign=founding_room",
  );

  assert.equal(
    buildPartnerRoomUrl({
      requestUrl: "https://partnerroom.sidmofya.com/?utm_source=referrer",
      pathname: "/partner-room",
    }).href,
    "https://partnerroom.sidmofya.com/partner-room?utm_source=referrer",
  );
});

test("rewrites the Partner Room site root to its internal route", () => {
  assert.deepEqual(
    resolvePartnerRoomRoute({
      hostname: "partner-room-preview.netlify.app",
      pathname: "/",
      method: "GET",
      siteVariant: "partner-room",
    }),
    { type: "rewrite", pathname: "/partner-room" },
  );
});

test("recognizes the production Partner Room host without the variant flag", () => {
  assert.deepEqual(
    resolvePartnerRoomRoute({
      hostname: "partnerroom.sidmofya.com",
      pathname: "/",
      method: "GET",
      siteVariant: undefined,
    }),
    { type: "rewrite", pathname: "/partner-room" },
  );
});

test("keeps non-Partner Room pages off the dedicated site", () => {
  assert.deepEqual(
    resolvePartnerRoomRoute({
      hostname: "partner-room-preview.netlify.app",
      pathname: "/about",
      method: "GET",
      siteVariant: "partner-room",
    }),
    { type: "redirect", pathname: "/" },
  );
});

test("canonicalizes the internal route to root on the dedicated site", () => {
  assert.deepEqual(
    resolvePartnerRoomRoute({
      hostname: "partner-room-preview.netlify.app",
      pathname: "/partner-room",
      method: "GET",
      siteVariant: "partner-room",
    }),
    { type: "redirect", pathname: "/" },
  );
});

test("allows the internal route while fulfilling a root rewrite", () => {
  assert.deepEqual(
    resolvePartnerRoomRoute({
      hostname: "partner-room-preview.netlify.app",
      pathname: "/partner-room",
      method: "GET",
      siteVariant: "partner-room",
      isInternalRewrite: true,
    }),
    { type: "next" },
  );
});

test("allows the Partner Room social image route on the dedicated site", () => {
  assert.deepEqual(
    resolvePartnerRoomRoute({
      hostname: "partnerroom.sidmofya.com",
      pathname: "/partner-room/opengraph-image",
      method: "GET",
      siteVariant: "partner-room",
    }),
    { type: "next" },
  );
});

test("redirects the internal Partner Room route to the dedicated production domain", () => {
  assert.deepEqual(
    resolvePartnerRoomRoute({
      hostname: "sidmofya.com",
      pathname: "/partner-room",
      method: "GET",
      siteVariant: undefined,
    }),
    { type: "redirect", url: "https://partnerroom.sidmofya.com/" },
  );
});

test("keeps the internal Partner Room route available on localhost", () => {
  assert.deepEqual(
    resolvePartnerRoomRoute({
      hostname: "localhost",
      pathname: "/partner-room",
      method: "GET",
      siteVariant: undefined,
    }),
    { type: "next" },
  );
});

test("does not route form POST requests through page middleware", () => {
  assert.deepEqual(
    resolvePartnerRoomRoute({
      hostname: "partnerroom.sidmofya.com",
      pathname: "/",
      method: "POST",
      siteVariant: "partner-room",
    }),
    { type: "next" },
  );
});
