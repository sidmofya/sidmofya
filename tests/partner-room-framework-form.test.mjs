import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";

import {
  FRAMEWORK_FORM_NAME,
  FRAMEWORK_SOURCE,
  buildFrameworkLeadPayload,
  validateFrameworkLead,
} from "../lib/partner-room-framework-form.mjs";
import {
  createFrameworkLeadSubmitter,
  focusFrameworkLeadInvalid,
  focusFrameworkLeadSuccess,
} from "../lib/partner-room-framework-capture.mjs";
import { createFrameworkDialogController } from "../lib/partner-room-framework-dialog.mjs";
import {
  createFrameworkDownloadStarter,
  downloadFrameworkPdf,
} from "../lib/partner-room-framework-download.mjs";

test("rejects missing framework lead details", () => {
  assert.deepEqual(validateFrameworkLead({ "first-name": "", email: "", role: "" }).errors, {
    "first-name": "Please enter your first name.",
    email: "Please enter your email address.",
  });
});

test("accepts a trimmed valid lead and optional supported role", () => {
  const result = validateFrameworkLead({
    "first-name": " Amina ",
    email: " amina@example.com ",
    role: "Investor",
  });

  assert.deepEqual(result, {
    values: { "first-name": "Amina", email: "amina@example.com", role: "Investor" },
    errors: {},
  });
});

test("allows a blank role but rejects an unknown role", () => {
  assert.deepEqual(validateFrameworkLead({
    "first-name": "Amina",
    email: "amina@example.com",
    role: "",
  }).errors, {});

  assert.deepEqual(validateFrameworkLead({
    "first-name": "Amina",
    email: "amina@example.com",
    role: "Operator",
  }).errors, {
    role: "Please select a valid role.",
  });
});

test("builds the framework payload with the stable capture attribution", () => {
  const payload = buildFrameworkLeadPayload({
    "first-name": "Amina",
    email: "amina@example.com",
    role: "Investor",
    "bot-field": "",
  }, {
    "utm-source": "newsletter",
    "utm-medium": "email",
    "utm-campaign": "framework",
    "utm-content": "primary",
    "utm-term": "venture",
    "referral-url": "https://example.com/article",
    "landing-page-url": "https://partnerroom.sidmofya.com/?utm_source=newsletter",
  }, "2026-09-03T12:00:00.000Z");

  assert.deepEqual(payload, {
    "form-name": FRAMEWORK_FORM_NAME,
    "first-name": "Amina",
    email: "amina@example.com",
    role: "Investor",
    source: FRAMEWORK_SOURCE,
    tag: FRAMEWORK_SOURCE,
    "utm-source": "newsletter",
    "utm-medium": "email",
    "utm-campaign": "framework",
    "utm-content": "primary",
    "utm-term": "venture",
    "referral-url": "https://example.com/article",
    "landing-page-url": "https://partnerroom.sidmofya.com/?utm_source=newsletter",
    "submitted-at": "2026-09-03T12:00:00.000Z",
    subject: "Partner Room Decision Architecture download",
    "bot-field": "",
  });
});

test("submits one framework lead at a time and retains its values after a rejected response", async () => {
  const values = { "first-name": "Amina", email: "amina@example.com", role: "Investor" };
  const originalValues = { ...values };
  let resolvePost;
  const events = [];
  const submit = createFrameworkLeadSubmitter({
    post: () => new Promise((resolve) => { resolvePost = resolve; }),
    onSuccess: () => events.push("success"),
  });

  const first = submit(values);
  assert.equal(await submit(values), "duplicate");
  resolvePost({ ok: false });
  assert.equal(await first, "error");
  assert.deepEqual(values, originalValues);
  assert.deepEqual(events, []);
});

test("dispatches the accepted framework payload once after an OK response", async () => {
  const accepted = [];
  const submit = createFrameworkLeadSubmitter({
    post: async () => ({ ok: true }),
    onSuccess: (payload) => accepted.push(payload),
  });
  const payload = { "first-name": "Amina", email: "amina@example.com", role: "Investor" };

  assert.equal(await submit(payload), "success");
  assert.deepEqual(accepted, [payload]);
});

test("focuses only the committed invalid control and successful framework state", () => {
  const focusLog = [];
  const form = {
    elements: {
      namedItem(name) {
        return name === "email" ? { focus: () => focusLog.push("email") } : null;
      },
    },
  };
  const successTarget = { focus: () => focusLog.push("success") };

  focusFrameworkLeadInvalid("email", form);
  focusFrameworkLeadInvalid(null, form);
  focusFrameworkLeadSuccess("idle", successTarget);
  focusFrameworkLeadSuccess("success", successTarget);

  assert.deepEqual(focusLog, ["email", "success"]);
});

test("updates trigger source, restores focus, and restores scroll styles across dialog lifecycles", () => {
  const calls = [];
  const root = { style: { overflow: "clip" } };
  const body = { style: { overflow: "scroll" } };
  const dialog = {
    open: false,
    showModal() { this.open = true; calls.push("show"); },
    close() { this.open = false; calls.push("close"); },
  };
  const primary = { focus: () => calls.push("focus-primary") };
  const secondary = { focus: () => calls.push("focus-secondary") };
  const controller = createFrameworkDialogController({
    dialog,
    root,
    body,
    setSource: (source) => calls.push(`source:${source}`),
    focusInside: () => calls.push("focus-inside"),
  });

  controller.open(primary, "framework-primary");
  assert.equal(root.style.overflow, "hidden");
  assert.equal(body.style.overflow, "hidden");
  controller.open(secondary, "framework-secondary");
  controller.handleBackdropClick(dialog, {});
  assert.equal(dialog.open, true);
  controller.handleBackdropClick(dialog, dialog);
  controller.handleClose();
  assert.equal(root.style.overflow, "clip");
  assert.equal(body.style.overflow, "scroll");
  controller.open(primary, "framework-primary");
  let cancelled = false;
  controller.handleCancel({ preventDefault: () => { cancelled = true; } });
  controller.handleClose();
  assert.equal(cancelled, true);
  assert.equal(root.style.overflow, "clip");
  assert.equal(body.style.overflow, "scroll");
  controller.open(primary, "framework-primary");
  controller.dispose();

  assert.equal(root.style.overflow, "clip");
  assert.equal(body.style.overflow, "scroll");
  assert.deepEqual(calls, [
    "source:framework-primary",
    "show",
    "focus-inside",
    "source:framework-secondary",
    "focus-inside",
    "close",
    "focus-secondary",
    "source:framework-primary",
    "show",
    "focus-inside",
    "close",
    "focus-primary",
    "source:framework-primary",
    "show",
    "focus-inside",
  ]);
});

test("starts the framework download only after an OK response and completes side effects in order", async () => {
  const calls = [];
  const failed = await downloadFrameworkPdf({
    fetchPdf: async () => ({ ok: false }),
    createObjectUrl: () => { throw new Error("should not create an object URL"); },
    createLink: () => { throw new Error("should not create a link"); },
    appendLink: () => { throw new Error("should not append a link"); },
    revokeObjectUrl: () => { throw new Error("should not revoke an object URL"); },
    dispatchCompleted: () => { throw new Error("should not dispatch completion"); },
  });
  assert.equal(failed, "error");

  const link = {
    href: "",
    download: "",
    click: () => calls.push("click"),
    remove: () => calls.push("remove"),
  };
  const succeeded = await downloadFrameworkPdf({
    fetchPdf: async () => ({ ok: true, blob: async () => "pdf-blob" }),
    createObjectUrl: (blob) => { calls.push(`url:${blob}`); return "blob:framework"; },
    createLink: () => link,
    appendLink: () => calls.push("append"),
    revokeObjectUrl: (url) => calls.push(`revoke:${url}`),
    dispatchCompleted: () => calls.push("completed"),
  });
  assert.equal(succeeded, "success");
  assert.equal(link.href, "blob:framework");
  assert.equal(link.download, "how-venture-rooms-decide.pdf");
  assert.deepEqual(calls, ["url:pdf-blob", "append", "click", "remove", "revoke:blob:framework", "completed"]);
});

test("prevents duplicate download starts while an existing download is pending", async () => {
  let resolveDownload;
  const start = createFrameworkDownloadStarter({
    download: () => new Promise((resolve) => { resolveDownload = resolve; }),
  });

  const first = start();
  assert.equal(await start(), "duplicate");
  resolveDownload("success");
  assert.equal(await first, "success");
});

test("binds the capture and dialog components to the executable lifecycle seams", async () => {
  const [capture, dialog] = await Promise.all([
    readFile(path.join(process.cwd(), "components", "partner-room", "FrameworkCapture.tsx"), "utf8"),
    readFile(path.join(process.cwd(), "components", "partner-room", "FrameworkDialog.tsx"), "utf8"),
  ]);

  assert.match(capture, /createFrameworkLeadSubmitter/);
  assert.match(capture, /focusFrameworkLeadInvalid\(pendingInvalidField, formRef\.current\)/);
  assert.match(capture, /focusFrameworkLeadSuccess\(status, successRef\.current\)/);
  assert.match(capture, /createFrameworkDownloadStarter/);
  assert.match(capture, /downloadFrameworkPdf/);
  assert.match(capture, /noValidate=\{isEnhanced\}/);
  assert.match(capture, /if \(!mountedRef\.current\) return;/);
  assert.match(dialog, /createFrameworkDialogController/);
  assert.match(dialog, /controllerRef\.current\?\.handleCancel\(event\)/);
  assert.match(dialog, /controller\.dispose\(\)/);
  assert.doesNotMatch(dialog, /<FrameworkCapture key=/);
});
