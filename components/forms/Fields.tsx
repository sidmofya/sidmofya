"use client";

import type { ReactNode } from "react";

export const inputBase =
  "block w-full bg-transparent border border-[var(--color-rule)] px-4 py-3 text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)]/70 focus:outline-none focus:border-[var(--color-copper)] focus:ring-1 focus:ring-[var(--color-copper)]/30 transition-colors";

export const labelBase =
  "block text-[0.9375rem] font-medium text-[var(--color-ink)] mb-2";

/** Netlify's honeypot. Hidden from sight but reachable by the bots we want to catch. */
export function Honeypot() {
  return (
    <p className="hidden">
      <label>
        Do not fill this out: <input name="bot-field" tabIndex={-1} />
      </label>
    </p>
  );
}

type FieldProps = {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  optional?: boolean;
  readOnly?: boolean;
  defaultValue?: string;
  rows?: number;
  children?: ReactNode;
};

export function Field({
  id,
  name,
  label,
  type = "text",
  required = false,
  optional = false,
  readOnly = false,
  defaultValue,
  rows,
  children,
}: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className={labelBase}>
        {label}
        {optional && (
          <span className="ml-2 font-normal text-[var(--color-ink-muted)]">
            Optional
          </span>
        )}
      </label>
      {children ??
        (rows ? (
          <textarea
            id={id}
            name={name}
            rows={rows}
            required={required}
            defaultValue={defaultValue}
            className={inputBase}
          />
        ) : (
          <input
            id={id}
            name={name}
            type={type}
            required={required}
            readOnly={readOnly}
            defaultValue={defaultValue}
            className={`${inputBase} ${readOnly ? "text-[var(--color-ink-muted)]" : ""}`}
          />
        ))}
    </div>
  );
}

/**
 * Success and error states are announced rather than signalled by colour alone,
 * and the success panel takes focus so keyboard and screen-reader users are not
 * left on a submit button that has vanished.
 */
export function FormStatus({
  tone,
  title,
  children,
}: {
  tone: "success" | "error";
  title?: string;
  children: ReactNode;
}) {
  return (
    <div
      role="status"
      tabIndex={-1}
      ref={(node) => {
        node?.focus();
      }}
      className="border-l-2 border-[var(--color-copper)] pl-6 py-2 focus:outline-none"
    >
      {title && (
        <p className="font-display text-2xl md:text-3xl text-[var(--color-ink)]">
          {title}
        </p>
      )}
      <p className={`${title ? "mt-3" : ""} text-[var(--color-ink-muted)]`}>
        {tone === "error" ? <>Something went wrong. {children}</> : children}
      </p>
    </div>
  );
}
