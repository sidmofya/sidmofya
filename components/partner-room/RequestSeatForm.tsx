"use client";

import { useEffect, useRef, useState, type FormEvent, type SyntheticEvent } from "react";
import {
  ATTRIBUTION_STORAGE_KEY,
  buildSeatRequestPayload,
  captureFirstTouchAttribution,
  PARTNER_ROOM_FORM_NAME,
  validateSeatRequest,
} from "@/lib/partner-room-form.mjs";
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

function FieldError({ field, errors }: { field: string; errors: Errors }) {
  if (!errors[field]) return null;
  return (
    <p className={styles.fieldError} id={`${field}-error`}>
      {errors[field]}
    </p>
  );
}

export default function RequestSeatForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const attributionRef = useRef<Record<string, string>>(emptyAttribution);
  const submittingRef = useRef(false);
  const successRef = useRef<HTMLDivElement>(null);

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
    if (submittingRef.current) return;

    const form = event.currentTarget;
    const rawValues = Object.fromEntries(
      Array.from(new FormData(form).entries()).map(([key, value]) => [key, value.toString()]),
    );
    const validation = validateSeatRequest(rawValues);

    if (Object.keys(validation.errors).length > 0) {
      setErrors(validation.errors);
      setStatus("idle");
      const firstInvalidField = Object.keys(validation.errors)[0];
      const control = form.elements.namedItem(firstInvalidField);
      if (control instanceof HTMLElement) control.focus();
      return;
    }

    for (const fieldName of ["company-website", "deck-url"]) {
      const control = form.elements.namedItem(fieldName);
      if (control instanceof HTMLInputElement) control.value = validation.values[fieldName] ?? "";
    }

    const payload = buildSeatRequestPayload(
      validation.values,
      attributionRef.current,
      new Date().toISOString(),
    );

    submittingRef.current = true;
    setErrors({});
    setStatus("submitting");

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(payload).toString(),
      });
      if (!response.ok) throw new Error(`Seat request failed with HTTP ${response.status}`);
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      submittingRef.current = false;
    }
  }

  if (status === "success") {
    return (
      <div className={styles.successState} ref={successRef} role="status" tabIndex={-1}>
        <h3>Request Received</h3>
        <p>Thank you.</p>
        <p>I review every request personally because each founder becomes part of the room for everyone else.</p>
        <p>You’ll receive a response within 48 hours.</p>
        <p>If there is a strong fit, that response will include an invitation to enroll directly.</p>
      </div>
    );
  }

  const describedBy = (field: string) => (errors[field] ? `${field}-error` : undefined);

  return (
    <form
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
            <option value="Seed">Seed</option>
            <option value="Series A">Series A</option>
            <option value="Other">Other</option>
          </select>
          <FieldError field="round" errors={errors} />
        </div>
        <div className={styles.formField}>
          <label htmlFor="raise-timing">When do you expect to raise? <span aria-hidden="true">*</span></label>
          <select id="raise-timing" name="raise-timing" defaultValue="" required aria-invalid={Boolean(errors["raise-timing"])} aria-describedby={describedBy("raise-timing")}>
            <option value="" disabled>Select timing</option>
            <option value="Raising now">Raising now</option>
            <option value="Within 3 months">Within 3 months</option>
            <option value="Within 3–6 months">Within 3–6 months</option>
            <option value="More than 6 months away">More than 6 months away</option>
          </select>
          <FieldError field="raise-timing" errors={errors} />
        </div>
      </div>

      <div className={styles.formField}>
        <label htmlFor="investor-targets">Which investors or types of investors are you likely to approach? <span aria-hidden="true">*</span></label>
        <textarea id="investor-targets" name="investor-targets" rows={4} required aria-invalid={Boolean(errors["investor-targets"])} aria-describedby={describedBy("investor-targets")} />
        <FieldError field="investor-targets" errors={errors} />
      </div>

      <div className={`${styles.formField} ${styles.concernField}`}>
        <label htmlFor="room-concern">What do you think the investment room may struggle to believe about your company? <span aria-hidden="true">*</span></label>
        <p id="room-concern-hint">This is the most important question in the request.</p>
        <textarea id="room-concern" name="room-concern" rows={7} required aria-invalid={Boolean(errors["room-concern"])} aria-describedby={["room-concern-hint", describedBy("room-concern")].filter(Boolean).join(" ")} />
        <FieldError field="room-concern" errors={errors} />
      </div>

      <div className={styles.formField}>
        <label htmlFor="deck-url">Deck or investor materials URL — optional</label>
        <input id="deck-url" name="deck-url" type="text" inputMode="url" placeholder="docsend.com/view/…" aria-invalid={Boolean(errors["deck-url"])} aria-describedby={describedBy("deck-url")} />
        <FieldError field="deck-url" errors={errors} />
      </div>

      {status === "error" && (
        <div className={styles.formError} role="alert">
          We couldn’t send your request. Your answers have been preserved. Please try again.
        </div>
      )}

      <div className={styles.formActions}>
        <button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending Request…" : "Request My Seat"}
        </button>
        <p>6 seats · $2,500 · Response within 48 hours</p>
      </div>
    </form>
  );
}
