"use client";

import { useState, type FormEvent } from "react";
import { Field, FormStatus, Honeypot } from "@/components/forms/Fields";
import { submitToNetlify } from "@/lib/netlify-forms";

const FORM_NAME = "contact";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

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

  if (status === "success") {
    return (
      <FormStatus tone="success" title="Thank you.">
        Your message has been received.
      </FormStatus>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-6" name={FORM_NAME}>
      <input type="hidden" name="form-name" value={FORM_NAME} />
      <Honeypot />

      <Field id="c-name" name="name" label="Name" required />
      <Field id="c-email" name="email" label="Email" type="email" required />
      <Field id="c-message" name="message" label="Message" rows={5} required />

      {status === "error" && <FormStatus tone="error">Please try again.</FormStatus>}

      <button
        type="submit"
        className="btn btn-primary disabled:opacity-60"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Sending…" : "Send"}
      </button>
    </form>
  );
}
