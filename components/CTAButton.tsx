import Link from "next/link";
import type { ReactNode } from "react";

type CTAButtonProps = {
  href: string;
  variant?: "primary" | "secondary";
  children: ReactNode;
  className?: string;
};

export default function CTAButton({ href, variant = "primary", children, className = "" }: CTAButtonProps) {
  const isExternal = href.startsWith("http") || href.startsWith("mailto:");
  const classes = `btn ${variant === "primary" ? "btn-primary" : "btn-secondary"} ${className}`;

  if (isExternal) {
    return (
      <a href={href} className={classes} rel="noopener">
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
