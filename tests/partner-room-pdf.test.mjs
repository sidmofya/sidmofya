import test from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import { promisify } from "node:util";
import { resolvePythonInterpreter } from "../scripts/run_partner_room_python.mjs";

const execFileAsync = promisify(execFile);
const outputs = [
  "output/pdf/how-venture-rooms-decide.pdf",
  "public/downloads/how-venture-rooms-decide.pdf",
];
const pythonLauncher = "scripts/run_partner_room_python.mjs";

async function sha256(filePath) {
  const contents = await readFile(filePath);
  return createHash("sha256").update(contents).digest("hex");
}

test("publishes one verified field guide as byte-identical archival and public PDFs", async () => {
  for (const output of outputs) {
    assert.ok((await stat(output)).size > 50_000, `${output} should exceed 50 KB`);
  }

  assert.equal(await sha256(outputs[0]), await sha256(outputs[1]));
  await execFileAsync(process.execPath, [
    pythonLauncher,
    "scripts/verify_partner_room_framework.py",
    outputs[0],
  ]);
});

test("an explicit Partner Room Python override takes precedence", async () => {
  const attempted = [];
  const selected = await resolvePythonInterpreter({
    env: {
      PARTNER_ROOM_PYTHON: "C:\\tools\\partner-room-python.exe",
      PYTHON_PATH: "C:\\tools\\legacy-python.exe",
      USERPROFILE: "C:\\Users\\example",
    },
    platform: "win32",
    probe: async (candidate) => {
      attempted.push(candidate);
      return true;
    },
  });

  assert.equal(selected, "C:\\tools\\partner-room-python.exe");
  assert.deepEqual(attempted, ["C:\\tools\\partner-room-python.exe"]);
});

test("the legacy PYTHON_PATH override remains supported", async () => {
  const selected = await resolvePythonInterpreter({
    env: { PYTHON_PATH: "/opt/partner-room/python" },
    platform: "linux",
    probe: async (candidate) => candidate === "/opt/partner-room/python",
  });

  assert.equal(selected, "/opt/partner-room/python");
});

test("Windows discovery finds the Codex bundled interpreter under USERPROFILE", async () => {
  const expected =
    "C:\\Users\\example\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\python\\python.exe";
  const attempted = [];
  const selected = await resolvePythonInterpreter({
    env: { USERPROFILE: "C:\\Users\\example" },
    platform: "win32",
    probe: async (candidate) => {
      attempted.push(candidate);
      return candidate === expected;
    },
  });

  assert.equal(selected, expected);
  assert.deepEqual(attempted, [expected]);
});

test("POSIX discovery finds the Codex bundled interpreter under HOME", async () => {
  const expected =
    "/home/example/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3";
  const selected = await resolvePythonInterpreter({
    env: { HOME: "/home/example" },
    platform: "linux",
    probe: async (candidate) => candidate === expected,
  });

  assert.equal(selected, expected);
});

test("discovery falls back from unavailable bundled Python and python3 to python", async () => {
  const attempted = [];
  const selected = await resolvePythonInterpreter({
    env: { HOME: "/home/example" },
    platform: "linux",
    probe: async (candidate) => {
      attempted.push(candidate);
      return candidate === "python";
    },
  });

  assert.equal(selected, "python");
  assert.deepEqual(attempted.slice(-2), ["python3", "python"]);
});

test("discovery failure explains the required packages and override", async () => {
  await assert.rejects(
    resolvePythonInterpreter({
      env: {},
      platform: "linux",
      probe: async () => false,
    }),
    (error) => {
      assert.match(error.message, /PARTNER_ROOM_PYTHON/);
      assert.match(error.message, /reportlab, pypdf, and pdfplumber/);
      assert.match(error.message, /pip install reportlab pypdf pdfplumber/);
      return true;
    },
  );
});

test("mutation regressions enforce PDF section locality and order", async () => {
  await execFileAsync(process.execPath, [
    pythonLauncher,
    "tests/partner-room-framework-verifier.test.py",
  ]);
});
