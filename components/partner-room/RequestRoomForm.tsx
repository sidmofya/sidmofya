"use client";

import { useEffect, useRef, useState, type FormEvent, type SyntheticEvent } from "react";
import {
  ATTRIBUTION_STORAGE_KEY,
  buildRoomRequestPayload,
  captureFirstTouchAttribution,
  PARTNER_ROOM_FORM_NAME,
  validateRoomRequest,
} from "@/lib/partner-room-form.mjs";
import { createRoomRequestSubmitter } from "@/lib/partner-room-request-submission.mjs";
import { focusRoomRequestSuccess, transitionRoomRequestToSuccess } from "@/lib/partner-room-request-state.mjs";
import styles from "@/app/partner-room/partner-room.module.css";

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
  return (
    <p className={styles.fieldError} id={`${field}-error`}>
      {errors[field]}
    </p>
  );
}

export default function RequestRoomForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [pendingInvalidField, setPendingInvalidField] = useState<string | null>(null);
  const attributionRef = useRef<Record<string, string>>(emptyAttribution);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const submitterRef = useRef<((payload: Record<string, string>) => Promise<string>) | null>(null);

  if (!submitterRef.current) {
    submitterRef.current = createRoomRequestSubmitter({
      post: (payload: Record<string, string>) => fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(payload).toString(),
      }),
      onSuccess: () => transitionRoomRequestToSuccess({
        dispatchSubmitted: () => window.dispatchEvent(new CustomEvent("partner-room:request-submitted")),
        setStatus,
      }),
    });
  }

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
    focusRoomRequestSuccess(status, successRef.current);
  }, [status]);

  useEffect(() => {
    if (!pendingInvalidField) return;
    const control = formRef.current?.elements.namedItem(pendingInvalidField);
    if (control instanceof HTMLElement) control.focus();
    setPendingInvalidField(null);
  }, [errors, pendingInvalidField]);

  function clearFieldError(event: SyntheticEvent<HTMLFormElement>) {
    const target = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    if (!target.name || !errors[target.name]) return;
    setErrors((current) => {
      const next = { ...current };
      delete next[target.name];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const rawValues = Object.fromEntries(
      Array.from(new FormData(form).entries()).map(([key, value]) => [key, value.toString()]),
    );
    const validation = validateRoomRequest(rawValues);

    if (Object.keys(validation.errors).length > 0) {
      setErrors(validation.errors);
      setStatus("idle");
      const firstInvalidField = Object.keys(validation.errors)[0];
      setPendingInvalidField(firstInvalidField);
      return;
    }

    for (const fieldName of ["company-website", "deck-url"]) {
      const control = form.elements.namedItem(fieldName);
      if (control instanceof HTMLInputElement) control.value = validation.values[fieldName] ?? "";
    }

    const payload = buildRoomRequestPayload(
      validation.values,
      attributionRef.current,
      new Date().toISOString(),
    );

    setErrors({});
    setStatus("submitting");
    const submitRoomRequest = submitterRef.current;
    if (!submitRoomRequest) return;
    const outcome = await submitRoomRequest(payload);
    if (outcome === "success") setStatus("success");
    if (outcome === "error") setStatus("error");
  }

  if (status === "success") {
    return (
      <div className={styles.successState} ref={successRef} role="status" tabIndex={-1}>
        <h3>Request received.</h3>
        <p>We’ll review the company and follow up about whether Partner Room is the right fit.</p>
      </div>
    );
  }

  const describedBy = (field: string) => (errors[field] ? `${field}-error` : undefined);

  return (
    <form
      ref={formRef}
      action="/"
      method="POST"
      name={PARTNER_ROOM_FORM_NAME}
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      className={styles.requestForm}
      onInput={clearFieldError}
      onSubmit={handleSubmit}
      noValidate
    >
      <input type="hidden" name="form-name" value={PARTNER_ROOM_FORM_NAME} />
      {netlifyMetadataFields.map((field) => (
        <input key={field} type="hidden" name={field} />
      ))}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="bot-field">Leave this field empty</label>
        <input id="bot-field" name="bot-field" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formField}>
          <label htmlFor="name">Name <span aria-hidden="true">*</span></label>
          <input id="name" name="name" type="text" autoComplete="name" required aria-invalid={Boolean(errors.name)} aria-describedby={describedBy("name")} />
          <FieldError field="name" errors={errors} />
        </div>
        <div className={styles.formField}>
          <label htmlFor="email">Email <span aria-hidden="true">*</span></label>
          <input id="email" name="email" type="email" autoComplete="email" required aria-invalid={Boolean(errors.email)} aria-describedby={describedBy("email")} />
          <FieldError field="email" errors={errors} />
        </div>
        <div className={styles.formField}>
          <label htmlFor="company">Company name <span aria-hidden="true">*</span></label>
          <input id="company" name="company" type="text" autoComplete="organization" required aria-invalid={Boolean(errors.company)} aria-describedby={describedBy("company")} />
          <FieldError field="company" errors={errors} />
        </div>
        <div className={styles.formField}>
          <label htmlFor="company-website">Company website <span aria-hidden="true">*</span></label>
          <input id="company-website" name="company-website" type="text" inputMode="url" autoComplete="url" placeholder="yourcompany.com" required aria-invalid={Boolean(errors["company-website"])} aria-describedby={describedBy("company-website")} />
          <FieldError field="company-website" errors={errors} />
        </div>
        <div className={styles.formField}>
          <label htmlFor="round">What round are you preparing for? <span aria-hidden="true">*</span></label>
          <select id="round" name="round" defaultValue="" required aria-invalid={Boolean(errors.round)} aria-describedby={describedBy("round")}>
            <option value="" disabled>Select a round</option>
            <option value="Series A">Series A</option>
            <option value="Series A extension">Series A extension</option>
            <option value="Other">Other</option>
          </select>
          <FieldError field="round" errors={errors} />
        </div>
        <div className={styles.formField}>
          <label htmlFor="raise-timing">When do you expect to raise? <span aria-hidden="true">*</span></label>
          <select id="raise-timing" name="raise-timing" defaultValue="" required aria-invalid={Boolean(errors["raise-timing"])} aria-describedby={describedBy("raise-timing")}>
            <option value="" disabled>Select timing</option>
            <option value="Now / already preparing">Now / already preparing</option>
            <option value="Within 3 months">Within 3 months</option>
            <option value="3 to 6 months">3 to 6 months</option>
            <option value="6+ months">6+ months</option>
            <option value="Not sure yet">Not sure yet</option>
          </select>
          <FieldError field="raise-timing" errors={errors} />
        </div>
        <div className={styles.formField}>
          <label htmlFor="raise-amount">How much capital do you expect to raise? <span>(optional)</span></label>
          <input id="raise-amount" name="raise-amount" type="text" inputMode="text" />
        </div>
      </div>

      <div className={styles.formField}>
        <label htmlFor="investor-targets">Which investors or types of investors are you likely to approach? <span aria-hidden="true">*</span></label>
        <textarea id="investor-targets" name="investor-targets" rows={4} required aria-invalid={Boolean(errors["investor-targets"])} aria-describedby={describedBy("investor-targets")} />
        <FieldError field="investor-targets" errors={errors} />
      </div>

      <div className={`${styles.formField} ${styles.concernField}`}>
        <label htmlFor="room-concern">What do you think the investment room may struggle to believe about your company? <span aria-hidden="true">*</span></label>
        <p id="room-concern-hint">This is the most important question in the request. It becomes the starting point for the investor pre-read.</p>
        <textarea id="room-concern" name="room-concern" rows={7} required aria-invalid={Boolean(errors["room-concern"])} aria-describedby={["room-concern-hint", describedBy("room-concern")].filter(Boolean).join(" ")} />
        <FieldError field="room-concern" errors={errors} />
      </div>

      <div className={styles.formField}>
        <label htmlFor="deck-url">Deck or investor materials URL <span>(optional)</span></label>
        <input id="deck-url" name="deck-url" type="text" inputMode="url" placeholder="docsend.com/view/..." aria-invalid={Boolean(errors["deck-url"])} aria-describedby={describedBy("deck-url")} />
        <FieldError field="deck-url" errors={errors} />
      </div>

      {status === "error" && (
        <div className={styles.formError} role="alert">
          We couldn’t send your request. Your answers have been preserved. Please try again.
        </div>
      )}

      <div className={styles.formActions}>
        <button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending request…" : "Request a Room"}
        </button>
      </div>
    </form>
  );
}
