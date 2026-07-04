"use client";

import { useState, type FormEvent } from "react";

const FORM_NAME = "sovereign-geometry-waitlist";

const inputBase =
  "block w-full bg-transparent border border-[var(--color-rule)] px-4 py-3 text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)]/70 focus:outline-none focus:border-[var(--color-copper)] focus:ring-1 focus:ring-[var(--color-copper)]/30 transition-colors";

const labelBase = "block text-[0.9375rem] font-medium text-[var(--color-ink)] mb-2";

type Status = "idle" | "submitting" | "success" | "error";

function encode(data: Record<string, string>) {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
}

export default function SovereignGeometryWaitlistForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const body: Record<string, string> = { "form-name": FORM_NAME };

    formData.forEach((value, key) => {
      body[key] = value.toString();
    });

    setStatus("submitting");

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode(body),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="border-l-2 border-[var(--color-copper)] pl-6 py-2">
        <p className="font-display text-2xl md:text-3xl text-[var(--color-ink)]">Thank you.</p>
        <p className="mt-3 text-[var(--color-ink-muted)]">You are on the first readers list.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
      name={FORM_NAME}
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      method="POST"
    >
      <input type="hidden" name="form-name" value={FORM_NAME} />
      <p className="hidden">
        <label>
          Do not fill this out: <input name="bot-field" />
        </label>
      </p>

      <div>
        <label htmlFor="sg-name" className={labelBase}>
          Name
        </label>
        <input id="sg-name" name="name" type="text" required className={inputBase} />
      </div>

      <div>
        <label htmlFor="sg-email" className={labelBase}>
          Email
        </label>
        <input id="sg-email" name="email" type="email" required className={inputBase} />
      </div>

      {status === "error" && (
        <div className="border-l-2 border-[var(--color-copper)] pl-4 py-2 text-[var(--color-ink)]">
          Something went wrong. Please try again.
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primary disabled:opacity-60"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Joining..." : "Join the first readers"}
      </button>
    </form>
  );
}
