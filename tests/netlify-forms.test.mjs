import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

async function importNetlifyForms() {
  const source = await readFile(new URL("../lib/netlify-forms.ts", import.meta.url), "utf8");
  const javascript = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(javascript).toString("base64")}`);
}

test("posts encoded form submissions to Netlify's static detector endpoint", async () => {
  const { postEncodedForm } = await importNetlifyForms();
  const calls = [];
  const fetchImpl = async (...args) => {
    calls.push(args);
    return { ok: true };
  };

  await postEncodedForm("form-name=contact&email=sid%40sidmofya.com", fetchImpl);

  assert.deepEqual(calls, [[
    "/__forms.html",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "form-name=contact&email=sid%40sidmofya.com",
    },
  ]]);
});
