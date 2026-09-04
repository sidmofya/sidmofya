import test from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const outputs = [
  "output/pdf/how-venture-rooms-decide.pdf",
  "public/downloads/how-venture-rooms-decide.pdf",
];
const pythonPath = process.env.PYTHON_PATH ?? "python";

async function sha256(filePath) {
  const contents = await readFile(filePath);
  return createHash("sha256").update(contents).digest("hex");
}

test("publishes one verified field guide as byte-identical archival and public PDFs", async () => {
  for (const output of outputs) {
    assert.ok((await stat(output)).size > 50_000, `${output} should exceed 50 KB`);
  }

  assert.equal(await sha256(outputs[0]), await sha256(outputs[1]));
  await execFileAsync(pythonPath, ["scripts/verify_partner_room_framework.py", outputs[0]]);
});
