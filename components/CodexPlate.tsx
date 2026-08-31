"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type CodexPlateProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
};

/**
 * A Codex plate, enlargeable. The artwork carries meaningful small annotations,
 * so the visitor can open it at full scale; native <dialog> supplies Escape,
 * focus trapping and the backdrop.
 */
export default function CodexPlate({
  src,
  alt,
  width,
  height,
  priority = false,
}: CodexPlateProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="codex-plate"
        aria-label={`Enlarge: ${alt}`}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          sizes="(min-width: 1024px) 60rem, 100vw"
          className="block h-auto w-full"
        />
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === dialogRef.current) setOpen(false);
        }}
        className="codex-lightbox"
      >
        <div className="flex h-full w-full flex-col">
          <div className="flex justify-end p-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="p-3 text-[var(--color-bg)] hover:text-[var(--color-copper-soft)]"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M5 5l14 14M19 5L5 19"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-auto px-4 pb-8">
            {/* Intrinsic size, so pinch-zoom and scroll expose the annotations. */}
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              sizes="100vw"
              className="mx-auto h-auto w-full max-w-[min(100%,80rem)]"
            />
          </div>
        </div>
      </dialog>
    </>
  );
}
