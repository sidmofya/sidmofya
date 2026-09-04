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
import {
  createFrameworkLeadSubmitter,
  focusFrameworkLeadInvalid,
  focusFrameworkLeadSuccess,
} from "@/lib/partner-room-framework-capture.mjs";
import {
  createFrameworkDownloadStarter,
  downloadFrameworkPdf,
} from "@/lib/partner-room-framework-download.mjs";

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
  const [isEnhanced, setIsEnhanced] = useState(false);
  const attributionRef = useRef<Record<string, string>>(emptyAttribution);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);
  const submitterRef = useRef<((payload: Record<string, string>) => Promise<string>) | null>(null);
  const downloadStarterRef = useRef<(() => Promise<string>) | null>(null);

  if (!submitterRef.current) {
    submitterRef.current = createFrameworkLeadSubmitter({
      post: (payload: Record<string, string>) => fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(payload).toString(),
      }),
      onSuccess: (payload: Record<string, string>) => {
        if (!mountedRef.current) return;
        window.dispatchEvent(new CustomEvent("partner-room:framework-lead-submitted", {
          detail: { role: payload.role ?? "" },
        }));
        setStatus("success");
      },
    });
  }

  if (!downloadStarterRef.current) {
    downloadStarterRef.current = createFrameworkDownloadStarter({
      download: () => downloadFrameworkPdf({
        fetchPdf: () => fetch("/downloads/how-venture-rooms-decide.pdf"),
        createObjectUrl: (blob) => URL.createObjectURL(blob as Blob),
        createLink: () => document.createElement("a"),
        appendLink: (link) => document.body.append(link as Node),
        revokeObjectUrl: (url) => URL.revokeObjectURL(url),
        dispatchCompleted: () => {
          if (mountedRef.current) {
            window.dispatchEvent(new CustomEvent("partner-room:framework-download-completed"));
          }
        },
      }),
    });
  }

  useEffect(() => {
    mountedRef.current = true;
    setIsEnhanced(true);
    return () => {
      mountedRef.current = false;
    };
  }, []);

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
    focusFrameworkLeadSuccess(status, successRef.current);
  }, [status]);

  useEffect(() => {
    if (!pendingInvalidField) return;
    focusFrameworkLeadInvalid(pendingInvalidField, formRef.current);
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
    if (!isEnhanced) return;
    event.preventDefault();

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

    setErrors({});
    setStatus("submitting");
    const submitFrameworkLead = submitterRef.current;
    if (!submitFrameworkLead) return;
    const outcome = await submitFrameworkLead(buildFrameworkLeadPayload(
      validation.values,
      attributionRef.current,
      new Date().toISOString(),
    ));
    if (mountedRef.current && outcome === "error") setStatus("error");
  }

  async function startDownload() {
    setDownloadError(false);
    const startFrameworkDownload = downloadStarterRef.current;
    if (!startFrameworkDownload) return;
    const outcome = await startFrameworkDownload();
    if (mountedRef.current && outcome === "error") setDownloadError(true);
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
      noValidate={isEnhanced}
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
