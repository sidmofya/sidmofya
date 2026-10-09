import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

/**
 * Netlify only captures fields its build-time scanner finds in
 * public/__forms.html (see the header comment in lib/netlify-forms.ts). A
 * field added to a live React form but not mirrored there is silently dropped
 * from submissions — no error, no failing request, no visible symptom. These
 * tests fail the build instead.
 */

/** Netlify's own routing field, never a data field. */
const IGNORED_FIELDS = new Set(["form-name"]);

/**
 * Shared wrappers such as `<Field />` pass the caller's `name` prop straight
 * through, so only their own literal fields (the honeypot) count here.
 */
const SHARED_FIELDS = { path: "components/forms/Fields.tsx", literalsOnly: true };

const FORMS = [
  { form: "speaking-inquiry", sources: ["components/SpeakingInquiryForm.tsx", SHARED_FIELDS] },
  { form: "work-request", sources: ["components/RequestWorkModal.tsx", SHARED_FIELDS] },
  { form: "kwazuri-interest", sources: ["components/KwaZuriSignupForm.tsx", SHARED_FIELDS] },
  { form: "contact", sources: ["components/ContactForm.tsx", SHARED_FIELDS] },
  { form: "partner-room-seat-request", sources: ["components/partner-room/RequestRoomForm.tsx"] },
  { form: "partner-room-decision-architecture", sources: ["components/partner-room/FrameworkCapture.tsx"] },
];

const normalizeSource = (source) => (typeof source === "string" ? { path: source, literalsOnly: false } : source);

const readSource = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

/**
 * Yields every opening tag in a JSX/HTML source as `{ tag, attributes }`,
 * tracking quotes and JSX braces so expressions containing `>` (arrow
 * functions, comparisons) do not end a tag early.
 */
function* openingTags(source) {
  const tagStart = /<([A-Za-z][\w.]*)/g;
  let match;
  while ((match = tagStart.exec(source)) !== null) {
    let depth = 0;
    let quote = null;
    let index = tagStart.lastIndex;
    while (index < source.length) {
      const char = source[index];
      if (quote) {
        if (char === quote) quote = null;
      } else if (char === '"' || char === "'" || char === "`") {
        quote = char;
      } else if (char === "{") {
        depth += 1;
      } else if (char === "}") {
        depth -= 1;
      } else if (char === ">" && depth === 0) {
        break;
      }
      index += 1;
    }
    yield { tag: match[1], attributes: source.slice(tagStart.lastIndex, index) };
    tagStart.lastIndex = index;
  }
}

/** Pulls the string literals out of `const <identifier> = [ "a", "b" ];`. */
function arrayLiteralValues(source, identifier) {
  const declaration = new RegExp(String.raw`const\s+${identifier}\s*(?::[^=]+)?=\s*\[([^\]]*)\]`).exec(source);
  if (!declaration) return null;
  return [...declaration[1].matchAll(/["']([^"']+)["']/g)].map((entry) => entry[1]);
}

/**
 * Resolves `name={identifier}` for the two shapes this codebase uses: a map
 * over a const array of field names, and a const string.
 */
function resolveIdentifier(source, identifier) {
  const mapped = new RegExp(String.raw`(\w+)\s*\.map\(\s*\(?\s*${identifier}\b`).exec(source);
  if (mapped) {
    const values = arrayLiteralValues(source, mapped[1]);
    if (values) return values;
  }
  const literal = new RegExp(String.raw`const\s+${identifier}\s*(?::[^=]+)?=\s*["']([^"']+)["']`).exec(source);
  if (literal) return [literal[1]];
  return null;
}

/** Every field name a source renders, ignoring the `<form>` element's own name. */
function componentFieldNames(source, { path, literalsOnly }) {
  const names = new Set();
  for (const { tag, attributes } of openingTags(source)) {
    if (tag === "form") continue;

    const literal = /(?:^|\s)name="([^"]+)"/.exec(attributes);
    if (literal) {
      names.add(literal[1]);
      continue;
    }

    const expression = /(?:^|\s)name=\{([^}]+)\}/.exec(attributes);
    if (!expression || literalsOnly) continue;

    const identifier = expression[1].trim();
    const resolved = /^[A-Za-z_$][\w$]*$/.test(identifier) ? resolveIdentifier(source, identifier) : null;
    assert.ok(resolved, `Could not resolve \`name={${identifier}}\` in ${path}; teach this test how to resolve it.`);
    for (const value of resolved) names.add(value);
  }
  return names;
}

/** Field names declared for each form in the Netlify detection mirror. */
function declaredFormFields(html) {
  const forms = new Map();
  for (const match of html.matchAll(/<form\b([^>]*)>([\s\S]*?)<\/form>/g)) {
    const name = /name="([^"]+)"/.exec(match[1]);
    if (!name) continue;
    forms.set(name[1], new Set([...match[2].matchAll(/name="([^"]+)"/g)].map((field) => field[1])));
  }
  return forms;
}

const declared = declaredFormFields(await readFile(new URL("../public/__forms.html", import.meta.url), "utf8"));

test("public/__forms.html declares every form the site submits to", () => {
  assert.deepEqual(FORMS.map(({ form }) => form).filter((form) => !declared.has(form)), []);
});

for (const { form, sources } of FORMS) {
  const paths = sources.map((source) => normalizeSource(source).path);

  test(`${form}: every field rendered by the component is declared in __forms.html`, async () => {
    const declaredFields = declared.get(form);
    assert.ok(declaredFields, `public/__forms.html declares no form named "${form}"`);

    const rendered = new Set();
    for (const source of sources.map(normalizeSource)) {
      for (const name of componentFieldNames(await readSource(source.path), source)) {
        rendered.add(name);
      }
    }
    assert.ok(rendered.size > 0, `No field names found in ${paths.join(", ")}`);

    const missing = [...rendered].filter((name) => !IGNORED_FIELDS.has(name) && !declaredFields.has(name)).sort();
    assert.deepEqual(
      missing,
      [],
      `${paths.join(", ")} render field(s) missing from the "${form}" form in public/__forms.html: ${missing.join(", ")}. Netlify silently drops undeclared fields from submissions.`,
    );
  });
}
