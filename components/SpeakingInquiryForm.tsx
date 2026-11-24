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

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="sp-name" name="name" label="Name" required />
        <Field id="sp-email" name="email" label="Email" type="email" required />
      </div>
      <Field id="sp-org" name="organization" label="Organization" required />

      <div>
        <label htmlFor="sp-offer" className={labelBase}>What are you interested in?</label>
        <select id="sp-offer" name="offer" className={inputBase} defaultValue="" required>
          <option value="" disabled>Select</option>
          <option>The Sovereign Stack</option>
          <option>The Next Scarcity</option>
          <option>The Decision Room</option>
          <option>Not sure yet</option>
        </select>
      </div>

      <Field
        id="sp-event"
        name="event-type"
        label="Type of gathering"
        optional
      />
      <Field
        id="sp-decision"
        name="decision"
        label="Who will be in the room, and what should the conversation accomplish?"
        rows={4}
        required
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="sp-timing" className={labelBase}>Timing</label>
          <select id="sp-timing" name="timing" className={inputBase} defaultValue="">
            <option value="">Select (optional)</option>
            <option>Date confirmed</option>
            <option>Within 3 months</option>
            <option>3–6 months out</option>
            <option>More than 6 months away</option>
            <option>Exploring</option>
          </select>
        </div>
        <div>
          <label htmlFor="sp-budget-status" className={labelBase}>Budget status</label>
          <select id="sp-budget-status" name="budget-status" className={inputBase} defaultValue="">
            <option value="">Select (optional)</option>
            <option>Budgeted</option>
            <option>Still scoping</option>
            <option>Not sure</option>
          </select>
        </div>
      </div>

      {status === "error" && <FormStatus tone="error">Please try again.</FormStatus>}

      <button
        type="submit"
        className="btn btn-primary disabled:opacity-60"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Sending…" : "Send inquiry"}
      </button>
    </form>
  );
}
