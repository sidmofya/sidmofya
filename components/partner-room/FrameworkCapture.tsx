"use client";

import { useEffect, useRef, useState, type FormEvent, type SyntheticEvent } from "react";
import styles from "@/app/partner-room/partner-room.module.css";
import {
  ATTRIBUTION_STORAGE_KEY,
  captureFirstTouchAttribution,
} from "@/lib/partner-room-form.mjs";
import {
  FRAMEWORK_FORM_NAME,
  FRAMEWORK_SOURCE,
  buildFrameworkLeadPayload,
  validateFrameworkLead,
} from "@/lib/partner-room-framework-form.mjs";

type Presentation = "dialog" | "inline";
type Status = "idle" | "submitting" | "success" | "error";
type Errors = Record<string, string>;

const emptyAttribution = {
  "utm-source": "",
  "utm-medium": "",
  "utm-campaign": "",
  "utm-content": "",
  "utm-term": "",
  "referral-url": "",
  "landing-page-url": "",
};

const netlifyMetadataFields = [
  "utm-source",
  "utm-medium",
  "utm-campaign",
  "utm-content",
  "utm-term",
  "referral-url",
  "landing-page-url",
  "submitted-at",
  "subject",
];

function FieldError({ field, errors }: { field: string; errors: Errors }) {
  if (!errors[field]) return null;
  return <p className={styles.fieldError} id={`framework-${field}-error`}>{errors[field]}</p>;
}

export default function FrameworkCapture({
  presentation,
  sourceSection,
}: {
  presentation: Presentation;
  sourceSection: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [pendingInvalidField, setPendingInvalidField] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState(false);
  const attributionRef = useRef<Record<string, string>>(emptyAttribution);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const submittingRef = useRef(false);
  const downloadingRef = useRef(false);

  useEffect(() => {
    let storedValue: string | null = null;
    try {
      storedValue = window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    } catch {
      // Storage may be unavailable in strict privacy modes.
    }

    const attribution = captureFirstTouchAttribution({
      currentUrl: window.location.href,
      referrer: document.referrer,
      storedValue,
    });
    attributionRef.current = attribution;

    try {
      window.sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution));
    } catch {
      // The in-memory first touch still accompanies this submission.
    }
  }, []);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  useEffect(() => {
    if (!pendingInvalidField) return;
    const control = formRef.current?.elements.namedItem(pendingInvalidField);
    if (control instanceof HTMLElement) control.focus();
    setPendingInvalidField(null);
  }, [errors, pendingInvalidField]);

  function clearFieldError(event: SyntheticEvent<HTMLFormElement>) {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    if (!target.name || !errors[target.name]) return;
    setErrors((current) => {
      const next = { ...current };
      delete next[target.name];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;

    const form = event.currentTarget;
    const rawValues = Object.fromEntries(
      Array.from(new FormData(form).entries()).map(([key, value]) => [key, value.toString()]),
    );
    const validation = validateFrameworkLead(rawValues);

    if (Object.keys(validation.errors).length > 0) {
      setErrors(validation.errors);
      setStatus("idle");
      setPendingInvalidField(Object.keys(validation.errors)[0]);
      return;
    }

    for (const fieldName of ["first-name", "email", "role"]) {
      const control = form.elements.namedItem(fieldName);
      if (control instanceof HTMLInputElement || control instanceof HTMLSelectElement) {
        control.value = validation.values[fieldName] ?? "";
      }
    }

    submittingRef.current = true;
    setErrors({});
    setStatus("submitting");
    try {
      const payload = buildFrameworkLeadPayload(
        validation.values,
        attributionRef.current,
        new Date().toISOString(),
      );
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(payload).toString(),
      });
      if (!response.ok) throw new Error("Netlify Forms rejected the framework lead.");

      window.dispatchEvent(new CustomEvent("partner-room:framework-lead-submitted", {
        detail: { role: validation.values.role ?? "" },
      }));
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      submittingRef.current = false;
    }
  }

  async function startDownload() {
    if (downloadingRef.current) return;

    downloadingRef.current = true;
    setDownloadError(false);
    try {
      const response = await fetch("/downloads/how-venture-rooms-decide.pdf");
      if (!response.ok) throw new Error("The framework PDF was unavailable.");

      const objectUrl = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = "how-venture-rooms-decide.pdf";
      document.body.append(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
      window.dispatchEvent(new CustomEvent("partner-room:framework-download-completed"));
    } catch {
      setDownloadError(true);
    } finally {
      downloadingRef.current = false;
    }
  }

  if (status === "success") {
    return (
      <div className={`${styles.successState} ${styles.frameworkSuccess}`} ref={successRef} role="status" tabIndex={-1}>
        <h3>The framework is ready.</h3>
        <p>Download the field guide when you’re ready.</p>
        <button className={styles.frameworkDownload} type="button" onClick={startDownload}>
          Download the framework
        </button>
        {downloadError && <p className={styles.formError} role="alert">We couldn’t start the download. Please try again.</p>}
      </div>
    );
  }

  const describedBy = (field: string) => (errors[field] ? `framework-${field}-error` : undefined);

  return (
    <form
      ref={formRef}
      action="/"
      method="POST"
      name={FRAMEWORK_FORM_NAME}
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      className={`${styles.frameworkForm} ${presentation === "dialog" ? styles.frameworkDialogForm : ""}`}
      data-framework-source-section={sourceSection}
      onInput={clearFieldError}
      onSubmit={handleSubmit}
      noValidate
    >
      <input type="hidden" name="form-name" value={FRAMEWORK_FORM_NAME} />
      <input type="hidden" name="source" value={FRAMEWORK_SOURCE} />
      <input type="hidden" name="tag" value={FRAMEWORK_SOURCE} />
      {netlifyMetadataFields.map((field) => <input key={field} type="hidden" name={field} />)}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor={`framework-bot-field-${presentation}`}>Leave this field empty</label>
        <input id={`framework-bot-field-${presentation}`} name="bot-field" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={styles.formField}>
        <label htmlFor={`framework-first-name-${presentation}`}>First name <span aria-hidden="true">*</span></label>
        <input id={`framework-first-name-${presentation}`} name="first-name" type="text" autoComplete="given-name" required aria-invalid={Boolean(errors["first-name"])} aria-describedby={describedBy("first-name")} />
        <FieldError field="first-name" errors={errors} />
      </div>
      <div className={styles.formField}>
        <label htmlFor={`framework-email-${presentation}`}>Email <span aria-hidden="true">*</span></label>
        <input id={`framework-email-${presentation}`} name="email" type="email" autoComplete="email" required aria-invalid={Boolean(errors.email)} aria-describedby={describedBy("email")} />
        <FieldError field="email" errors={errors} />
      </div>
      <div className={styles.formField}>
        <label htmlFor={`framework-role-${presentation}`}>I am a: <span>(optional)</span></label>
        <select id={`framework-role-${presentation}`} name="role" defaultValue="" aria-invalid={Boolean(errors.role)} aria-describedby={describedBy("role")}>
          <option value="">Select one</option>
          <option value="Founder">Founder</option>
          <option value="Investor">Investor</option>
          <option value="Other">Other</option>
        </select>
        <FieldError field="role" errors={errors} />
      </div>

      {status === "error" && <div className={styles.formError} role="alert">We couldn’t send your request. Your answers have been preserved. Please try again.</div>}

      <div className={styles.formActions}>
        <button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Send me the framework"}
        </button>
      </div>
    </form>
  );
}
