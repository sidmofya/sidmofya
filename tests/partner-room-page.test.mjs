import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import path from "node:path";

const port = 3217;
const baseUrl = `http://127.0.0.1:${port}`;
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

  throw new Error("Next.js development server did not start within 60 seconds.");
}

before(async () => {
  const nextBin = path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next");
  server = spawn(process.execPath, [nextBin, "dev", "-H", "127.0.0.1", "-p", String(port)], {
    cwd: process.cwd(),
    env: { ...process.env, SITE_VARIANT: "" },
    stdio: "ignore",
  });

  await waitForServer();
});

after(() => {
  server?.kill();
});

test("renders the Partner Room page with the core commercial promise", async () => {
  const response = await fetch(`${baseUrl}/partner-room`);
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /Your Series A is decided in a room you will never be in\./);
  assert.match(html, /6 live sessions over Zoom/);
  assert.match(html, /5 rotating Partner seats/);
  assert.match(html, /\$2,500 founding price/);
});

test("preserves the existing homepage through the main route group", async () => {
  const response = await fetch(baseUrl);
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /For people building across worlds\./);
  assert.match(html, />Sid Mofya</);
});
