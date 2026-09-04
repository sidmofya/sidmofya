"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Field, FormStatus, Honeypot } from "@/components/forms/Fields";
import { submitToNetlify } from "@/lib/netlify-forms";

const FORM_NAME = "work-request";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Native <dialog> gives focus trapping, Escape-to-close, inertness and a
 * backdrop for free — the accessible behaviour we want, with no dependency.
 */
export default function RequestWorkModal({
  work,
  onClose,
}: {
  work: string;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    try {
      await submitToNetlify(FORM_NAME, event.currentTarget);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        // Clicking the backdrop (the dialog element itself) dismisses.
        if (event.target === dialogRef.current) dialogRef.current?.close();
      }}
      aria-labelledby="request-work-title"
      className="w-[min(34rem,calc(100vw-2rem))] bg-[var(--color-bg)] text-[var(--color-ink)] border border-[var(--color-rule)] p-0 backdrop:bg-[color-mix(in_oklab,var(--color-ink)_70%,transparent)]"
    >
      <div className="p-7 md:p-9">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="eyebrow mb-3">Request this work</p>
            <h2 id="request-work-title" className="h-card text-[var(--color-ink)]">
              {work}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close"
            className="-mr-2 -mt-2 p-2 text-[var(--color-ink-muted)] hover:text-[var(--color-copper)]"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path
                d="M4 4l10 10M14 4L4 14"
                stroke="currentColor"
                strokeWidth="1.4"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {status === "success" ? (
          <div className="mt-8">
            <FormStatus tone="success" title="Thank you.">
              Your request has been received.
            </FormStatus>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6" name={FORM_NAME}>
            <input type="hidden" name="form-name" value={FORM_NAME} />
            <Honeypot />

            <Field id="rw-name" name="name" label="Name" required />
            <Field id="rw-email" name="email" label="Email" type="email" required />
            <Field id="rw-org" name="organization" label="Organization" optional />
            <Field
              id="rw-work"
              name="work"
              label="Work requested"
              defaultValue={work}
              readOnly
            />

            {status === "error" && (
              <FormStatus tone="error">Please try again.</FormStatus>
            )}

            <button
              type="submit"
              className="btn btn-primary disabled:opacity-60"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Sending…" : "Request a copy"}
            </button>
          </form>
        )}
      </div>
    </dialog>
  );
}
