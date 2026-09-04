"use client";

import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type SyntheticEvent } from "react";
import styles from "@/app/partner-room/partner-room.module.css";
import FrameworkCapture from "./FrameworkCapture";
import { createFrameworkDialogController } from "@/lib/partner-room-framework-dialog.mjs";

export default function FrameworkDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLAnchorElement | null>(null);
  const controllerRef = useRef<ReturnType<typeof createFrameworkDialogController> | null>(null);
  const [sourceSection, setSourceSection] = useState("architectures");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const controller = createFrameworkDialogController({
      dialog,
      root: document.documentElement,
      body: document.body,
      setSource: setSourceSection,
      focusInside: () => window.requestAnimationFrame(() => {
        if (dialog.open) dialog.querySelector<HTMLInputElement>('input[name="first-name"]')?.focus();
      }),
    });
    controllerRef.current = controller;

    function openFromTrigger(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const trigger = target.closest<HTMLAnchorElement>("a[data-framework-trigger]");
      if (!trigger) return;

      event.preventDefault();
      triggerRef.current = trigger;
      controller.open(trigger, trigger.dataset.frameworkSource || "architectures");
    }

    document.addEventListener("click", openFromTrigger);
    return () => {
      document.removeEventListener("click", openFromTrigger);
      controller.dispose();
      controllerRef.current = null;
    };
  }, []);

  function closeDialog() {
    controllerRef.current?.close();
  }

  function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
    controllerRef.current?.handleCancel(event);
  }

  function handleClose() {
    controllerRef.current?.handleClose();
  }

  function handleBackdropClick(event: ReactMouseEvent<HTMLDialogElement>) {
    controllerRef.current?.handleBackdropClick(event.target, event.currentTarget);
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.frameworkDialog}
      aria-labelledby="framework-dialog-title"
      onCancel={handleCancel}
      onClose={handleClose}
      onClick={handleBackdropClick}
    >
      <div className={styles.frameworkDialogInner}>
        <div className={styles.frameworkDialogHeader}>
          <div>
            <p>PARTNER ROOM</p>
            <h2 id="framework-dialog-title">Download the Decision Architecture Framework</h2>
          </div>
          <button className={styles.frameworkDialogClose} type="button" onClick={closeDialog} aria-label="Close framework capture">
            Close
          </button>
        </div>
        <FrameworkCapture presentation="dialog" sourceSection={sourceSection} />
      </div>
    </dialog>
  );
}
