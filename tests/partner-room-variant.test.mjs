import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import path from "node:path";

const port = 3218;
const baseUrl = `http://localhost:${port}`;
let server;

async function waitForServer() {
  const deadline = Date.now() + 60_000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseUrl, { redirect: "manual" });
      if (response.status > 0) return;
    } catch {
      // The development server is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error("Partner Room variant server did not start within 60 seconds.");
}

before(async () => {
  const nextBin = path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next");
  server = spawn(process.execPath, [nextBin, "dev", "-H", "localhost", "-p", String(port)], {
    cwd: process.cwd(),
    env: { ...process.env, SITE_VARIANT: "partner-room" },
    stdio: "ignore",
  });

  await waitForServer();
});

after(() => {
  server?.kill();
});

test("serves Partner Room at the dedicated site root and retains attribution", async () => {
  const response = await fetch(`${baseUrl}/?utm_source=linkedin&utm_campaign=founding_room`, {
    redirect: "manual",
  });
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /Your Series A is decided in a room you will never be in\./);
  assert.equal(
    new URL(response.headers.get("x-middleware-rewrite"), baseUrl).href,
    `${baseUrl}/partner-room?utm_source=linkedin&utm_campaign=founding_room`,
  );
});

test("keeps other routes off the dedicated site without losing attribution", async () => {
  const response = await fetch(`${baseUrl}/about?utm_source=referrer`, { redirect: "manual" });

  assert.equal(response.status, 307);
  assert.equal(
    new URL(response.headers.get("location"), baseUrl).href,
    `${baseUrl}/?utm_source=referrer`,
  );
});

test("canonicalizes the internal page route and retains attribution", async () => {
  const response = await fetch(`${baseUrl}/partner-room?utm_medium=invitation`, {
    redirect: "manual",
  });

  assert.equal(response.status, 307);
  assert.equal(
    new URL(response.headers.get("location"), baseUrl).href,
    `${baseUrl}/?utm_medium=invitation`,
  );
});

test("serves the social image directly on the dedicated variant", async () => {
  const response = await fetch(`${baseUrl}/partner-room/opengraph-image`);

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "image/png");
});

test("does not redirect form POST requests through page middleware", async () => {
  const response = await fetch(baseUrl, {
    method: "POST",
    redirect: "manual",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "form-name=partner-room-seat-request",
  });

  assert.notEqual(response.status, 307);
  assert.equal(response.headers.get("location"), null);
});
