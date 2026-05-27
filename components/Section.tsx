import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  id?: string;
  className?: string;
  divider?: boolean;
};

export default function Section({ children, id, className = "", divider = false }: SectionProps) {
  return (
    <section
      id={id}
      className={`px-6 md:px-10 py-20 md:py-28 ${divider ? "border-t border-[var(--color-rule)]" : ""} ${className}`}
    >
      <div className="mx-auto max-w-[72rem]">{children}</div>
    </section>
  );
}
