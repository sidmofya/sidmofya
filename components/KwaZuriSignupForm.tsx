"use client";

import { useState, type FormEvent } from "react";
import { Field, FormStatus, Honeypot } from "@/components/forms/Fields";
import { submitToNetlify } from "@/lib/netlify-forms";
import { siteConfig } from "@/lib/site";

const FORM_NAME = "kwazuri-interest";

type Status = "idle" | "submitting" | "success" | "error";

export default function KwaZuriSignupForm() {
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
        You&rsquo;re on the list.
      </FormStatus>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-5" name={FORM_NAME}>
      <input type="hidden" name="form-name" value={FORM_NAME} />
      {/* Keeps KwaZuri permission scoped to what the visitor signed up for. */}
      <input type="hidden" name="tag" value={siteConfig.kwazuriSignupTag} />
      <Honeypot />

      <Field id="kz-email" name="email" label="Email address" type="email" required />

      {status === "error" && <FormStatus tone="error">Please try again.</FormStatus>}

      <button
        type="submit"
        className="btn btn-primary disabled:opacity-60"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Sending…" : "Alert me →"}
      </button>
    </form>
  );
}
