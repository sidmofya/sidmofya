import Link from "next/link";
import type { ReactNode } from "react";

type CTAButtonProps = {
  href: string;
  variant?: "primary" | "secondary";
  children: ReactNode;
  className?: string;
  newTab?: boolean;
};

export default function CTAButton({
  href,
  variant = "primary",
  children,
  className = "",
  newTab = false,
}: CTAButtonProps) {
  const isExternal = href.startsWith("http") || href.startsWith("mailto:");
  const classes = `btn ${variant === "primary" ? "btn-primary" : "btn-secondary"} ${className}`;

  if (isExternal) {
    return (
      <a
        href={href}
        className={classes}
        rel={newTab ? "noopener noreferrer" : "noopener"}
        {...(newTab ? { target: "_blank" } : {})}
      >
        {children}
        {newTab && <span className="sr-only">(opens in a new tab)</span>}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
