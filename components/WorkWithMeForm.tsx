"use client";

import { useState, type FormEvent } from "react";

const inputBase =
  "block w-full bg-transparent border border-[var(--color-rule)] px-4 py-3 text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)]/70 focus:outline-none focus:border-[var(--color-copper)] focus:ring-1 focus:ring-[var(--color-copper)]/30 transition-colors";

const labelBase = "block text-[0.9375rem] font-medium text-[var(--color-ink)] mb-2";

const fieldsetLabel = "block text-[0.9375rem] font-medium text-[var(--color-ink)] mb-3";

const FORM_NAME = "work-with-me";

function encode(data: Record<string, string>) {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
}

type Status = "idle" | "submitting" | "success" | "error";

export default function WorkWithMeForm() {
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
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="border-l-2 border-[var(--color-copper)] pl-6 py-2">
        <p className="font-display text-2xl md:text-3xl text-[var(--color-ink)]">Thank you.</p>
        <p className="mt-3 text-[var(--color-ink-muted)] lede">
          I review requests for fit and will respond if there is a clear match.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
      name={FORM_NAME}
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      method="POST"
    >
      {/* Netlify form metadata + honeypot (visually hidden) */}
      <input type="hidden" name="form-name" value={FORM_NAME} />
      <p className="hidden">
        <label>
          Don&rsquo;t fill this out if you&rsquo;re human: <input name="bot-field" />
        </label>
      </p>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className={labelBase}>
            Name
          </label>
          <input id="name" name="name" type="text" required className={inputBase} />
        </div>
        <div>
          <label htmlFor="email" className={labelBase}>
            Email
          </label>
          <input id="email" name="email" type="email" required className={inputBase} />
        </div>
        <div>
          <label htmlFor="organization" className={labelBase}>
            Organization
          </label>
          <input id="organization" name="organization" type="text" className={inputBase} />
        </div>
        <div>
          <label htmlFor="role" className={labelBase}>
            Role
          </label>
          <input id="role" name="role" type="text" className={inputBase} />
        </div>
      </div>

      <fieldset>
        <legend className={fieldsetLabel}>Which sprint are you interested in?</legend>
        <div className="space-y-2">
          {[
            "Market Legibility Sprint",
            "Room-to-Results Sprint",
            "ReInvention Sprint",
            "Not sure",
          ].map((option) => (
            <label
              key={option}
              className="flex items-center gap-3 cursor-pointer text-[var(--color-ink)]"
            >
              <input
                type="radio"
                name="sprint"
                value={option}
                className="accent-[var(--color-copper)] w-4 h-4"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="message" className={labelBase}>
          What are you trying to make clear, design, protect, or move?
        </label>
        <textarea id="message" name="message" rows={5} required className={inputBase} />
      </div>

      <div>
        <label htmlFor="stakes" className={labelBase}>
          What is at stake?
        </label>
        <textarea id="stakes" name="stakes" rows={3} className={inputBase} />
      </div>

      <div>
        <label htmlFor="involved" className={labelBase}>
          Who else is involved?
        </label>
        <textarea id="involved" name="involved" rows={2} className={inputBase} />
      </div>

      <div>
        <label htmlFor="valuable" className={labelBase}>
          What would make this valuable?
        </label>
        <textarea id="valuable" name="valuable" rows={3} className={inputBase} />
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="timing" className={labelBase}>
            Timing
          </label>
          <select id="timing" name="timing" className={inputBase} defaultValue="">
            <option value="" disabled>
              Select…
            </option>
            <option>Urgent</option>
            <option>Next 30 days</option>
            <option>Exploring</option>
          </select>
        </div>
        <div>
          <label htmlFor="budget" className={labelBase}>
            Budget range
          </label>
          <select id="budget" name="budget" className={inputBase} defaultValue="">
            <option value="" disabled>
              Select…
            </option>
            <option>Under $2,500</option>
            <option>$2,500–$5,000</option>
            <option>$5,000–$10,000</option>
            <option>$10,000–$25,000</option>
            <option>Not sure</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="anything-else" className={labelBase}>
          Anything else I should know?
        </label>
        <textarea id="anything-else" name="anything-else" rows={3} className={inputBase} />
      </div>

      {status === "error" && (
        <div className="border-l-2 border-[var(--color-copper)] pl-4 py-2 text-[var(--color-ink)]">
          Something went wrong sending your request. Please try again, or email{" "}
          <a href="mailto:sid@motif54.com" className="link-copper">
            sid@motif54.com
          </a>{" "}
          directly.
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          className="btn btn-primary disabled:opacity-60"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Sending…" : "Send request"}
        </button>
        <p className="mt-4 text-[0.8125rem] text-[var(--color-ink-muted)]">
          By sending you agree to be contacted by Sid about your request.
        </p>
      </div>
    </form>
  );
}
