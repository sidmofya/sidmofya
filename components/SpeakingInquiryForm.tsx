"use client";

import { useState, type FormEvent } from "react";
import { Field, FormStatus, Honeypot, inputBase, labelBase } from "@/components/forms/Fields";
import { submitToNetlify } from "@/lib/netlify-forms";

const FORM_NAME = "speaking-inquiry";

type Status = "idle" | "submitting" | "success" | "error";

export default function SpeakingInquiryForm() {
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
        Your request has been received.
      </FormStatus>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-6" name={FORM_NAME}>
      <input type="hidden" name="form-name" value={FORM_NAME} />
      <Honeypot />

      <Field id="sp-name" name="name" label="Name" required />
      <Field id="sp-email" name="email" label="Email" type="email" required />
      <Field id="sp-org" name="organization" label="Organization" required />
      <Field id="sp-role" name="role" label="Role" optional />
      <Field id="sp-event" name="event-type" label="Type of room or event" required />
      <Field id="sp-audience" name="audience" label="Audience" optional />
      <Field
        id="sp-decision"
        name="decision"
        label="What decision or question is live?"
        rows={4}
      />

      <div>
        <label htmlFor="sp-timing" className={labelBase}>
          Timing
        </label>
        <select id="sp-timing" name="timing" className={inputBase} defaultValue="">
          <option value="" disabled>
            Select
          </option>
          <option>Date confirmed</option>
          <option>Within 3 months</option>
          <option>3–6 months out</option>
          <option>More than 6 months away</option>
          <option>Exploring</option>
        </select>
      </div>

      <Field id="sp-else" name="anything-else" label="Anything else?" rows={3} optional />

      {status === "error" && <FormStatus tone="error">Please try again.</FormStatus>}

      <button
        type="submit"
        className="btn btn-primary disabled:opacity-60"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Sending…" : "Request a briefing"}
      </button>
    </form>
  );
}
