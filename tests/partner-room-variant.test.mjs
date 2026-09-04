import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const port = 3218;
const baseUrl = `http://localhost:${port}`;
let server;
let generatedProjectFiles;

async function preserveGeneratedProjectFiles() {
  generatedProjectFiles = await Promise.all(
    ["next-env.d.ts", "tsconfig.json"].map(async (file) => [file, await readFile(path.join(process.cwd(), file), "utf8")]),
  );
}

async function restoreGeneratedProjectFiles() {
  await Promise.all(
    generatedProjectFiles?.map(([file, contents]) => writeFile(path.join(process.cwd(), file), contents)) ?? [],
  );
}

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
  await preserveGeneratedProjectFiles();
  const nextBin = path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next");
  server = spawn(process.execPath, [nextBin, "dev", "-H", "localhost", "-p", String(port)], {
    cwd: process.cwd(),
    env: { ...process.env, SITE_VARIANT: "partner-room", NEXT_TEST_DIST_DIR: ".next-partner-room-variant-test" },
    stdio: "ignore",
  });

  await waitForServer();
});

after(async () => {
  server?.kill();
  await restoreGeneratedProjectFiles();
});

test("serves Partner Room at the dedicated site root and retains attribution", async () => {
  const response = await fetch(`${baseUrl}/?utm_source=linkedin&utm_campaign=founding_room`, {
    redirect: "manual",
  });
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /Your Series A is decided in a room you will never be in\./);
  assert.doesNotMatch(html, /For people building across worlds\./);
  assert.equal(response.headers.get("x-middleware-rewrite"), null);
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

test("rejects a forged internal-rewrite header on the framework route", async () => {
  const response = await fetch(`${baseUrl}/partner-room/decision-architecture-framework?utm_source=forged`, {
    redirect: "manual",
    headers: { "x-partner-room-internal-rewrite": "1" },
  });

  assert.equal(response.status, 307);
  assert.equal(
    new URL(response.headers.get("location"), baseUrl).href,
    `${baseUrl}/?utm_source=forged`,
  );
});

test("serves the social image directly on the dedicated variant", async () => {
  const response = await fetch(`${baseUrl}/partner-room/opengraph-image`);

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "image/png");
});

test("serves the canonical framework page directly without dropping attribution", async () => {
  const response = await fetch(`${baseUrl}/decision-architecture-framework?utm_source=shared-link`, {
    redirect: "manual",
  });
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("x-middleware-rewrite"), null);
  assert.match(html, /<title>Decision Architecture Framework \| Partner Room<\/title>/);
  assert.match(html, /href="\/">Back to Partner Room</);
  assert.match(html, /Six Ways Venture Firms Make the Same Decision Differently/);
  assert.match(html, /name="partner-room-decision-architecture"/);
  assert.doesNotMatch(html, /The Meeting Goes Well\. The Answer Is Still No\./);
});

test("serves the exact framework PDF without redirecting", async () => {
  const response = await fetch(`${baseUrl}/downloads/how-venture-rooms-decide.pdf`, {
    redirect: "manual",
  });

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "application/pdf");
  assert.equal(response.headers.get("location"), null);
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
