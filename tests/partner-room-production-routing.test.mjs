import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const nextBin = path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next");
const mainPort = 3220;
const partnerPort = 3221;
const mainBaseUrl = `http://127.0.0.1:${mainPort}`;
const partnerBaseUrl = `http://127.0.0.1:${partnerPort}`;
let mainServer;
let partnerServer;
let generatedProjectFiles;

async function runNext(args, env) {
  const child = spawn(process.execPath, [nextBin, ...args], {
    cwd: process.cwd(),
    env: { ...process.env, ...env },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let output = "";
  child.stdout.on("data", (chunk) => { output += chunk; });
  child.stderr.on("data", (chunk) => { output += chunk; });

  const exitCode = await new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("exit", resolve);
  });
  assert.equal(exitCode, 0, `next ${args.join(" ")} failed:\n${output}`);
}

async function waitForServer(baseUrl) {
  const deadline = Date.now() + 60_000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseUrl, { redirect: "manual" });
      if (response.status > 0) return;
    } catch {
      // The production server is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`Production server did not start within 60 seconds: ${baseUrl}`);
}

function startNext(port, env) {
  return spawn(process.execPath, [nextBin, "start", "-H", "127.0.0.1", "-p", String(port)], {
    cwd: process.cwd(),
    env: { ...process.env, ...env },
    stdio: "ignore",
  });
}

function visibleMarkup(html) {
  return html.replace(/<script\b[\s\S]*?<\/script>/g, "");
}

before(async () => {
  generatedProjectFiles = await Promise.all(
    ["next-env.d.ts", "tsconfig.json"].map(async (file) => [file, await readFile(path.join(process.cwd(), file), "utf8")]),
  );

  const mainEnv = { SITE_VARIANT: "", NEXT_TEST_DIST_DIR: ".next-partner-room-production-main-test" };
  const partnerEnv = { SITE_VARIANT: "partner-room", NEXT_TEST_DIST_DIR: ".next-partner-room-production-variant-test" };

  await runNext(["build"], mainEnv);
  await runNext(["build"], partnerEnv);

  mainServer = startNext(mainPort, mainEnv);
  partnerServer = startNext(partnerPort, partnerEnv);
  await Promise.all([waitForServer(mainBaseUrl), waitForServer(partnerBaseUrl)]);
});

after(async () => {
  mainServer?.kill();
  partnerServer?.kill();
  await Promise.all(
    generatedProjectFiles?.map(([file, contents]) => writeFile(path.join(process.cwd(), file), contents)) ?? [],
  );
});

test("ordinary production redirects the framework route without rendering a form", async () => {
  const response = await fetch(
    `${mainBaseUrl}/decision-architecture-framework?utm_source=shared-link&utm_campaign=framework`,
    { redirect: "manual" },
  );
  const html = await response.text();

  assert.equal(response.status, 307);
  assert.equal(
    response.headers.get("location"),
    "https://partnerroom.sidmofya.com/decision-architecture-framework?utm_source=shared-link&utm_campaign=framework",
  );
  assert.doesNotMatch(html, /<form|For people building across worlds|For capital-facing work, visit/);
});

test("ordinary production also redirects the private internal framework route", async () => {
  const response = await fetch(
    `${mainBaseUrl}/partner-room/decision-architecture-framework?utm_source=internal-link`,
    { redirect: "manual" },
  );
  const html = await response.text();

  assert.equal(response.status, 307);
  assert.equal(
    response.headers.get("location"),
    "https://partnerroom.sidmofya.com/decision-architecture-framework?utm_source=internal-link",
  );
  assert.doesNotMatch(html, /<form|For people building across worlds|For capital-facing work, visit/);
});

test("Partner Room production root publishes its generated social image metadata", async () => {
  const response = await fetch(partnerBaseUrl);
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /property="og:image" content="https:\/\/partnerroom\.sidmofya\.com\/partner-room\/opengraph-image"/);
  assert.match(html, /name="twitter:image" content="https:\/\/partnerroom\.sidmofya\.com\/partner-room\/opengraph-image"/);
});

test("Partner Room production serves the public framework page without main-site chrome", async () => {
  const response = await fetch(
    `${partnerBaseUrl}/decision-architecture-framework?utm_source=shared-link`,
    { redirect: "manual" },
  );
  const html = await response.text();
  const visibleHtml = visibleMarkup(html);

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("location"), null);
  assert.equal(response.headers.get("x-middleware-rewrite"), null);
  assert.equal((visibleHtml.match(/<main\b/g) ?? []).length, 1);
  assert.match(visibleHtml, /name="partner-room-decision-architecture"/);
  assert.match(
    html,
    /<link rel="canonical" href="https:\/\/partnerroom\.sidmofya\.com\/decision-architecture-framework"\/?/,
  );
  assert.doesNotMatch(visibleHtml, /name="work-with-me"|name="partner-room-seat-request"/);
  assert.doesNotMatch(visibleHtml, /For people building across worlds|For capital-facing work, visit/);
});
