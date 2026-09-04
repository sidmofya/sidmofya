"use client";

import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type SyntheticEvent } from "react";
import styles from "@/app/partner-room/partner-room.module.css";
import FrameworkCapture from "./FrameworkCapture";

export default function FrameworkDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLAnchorElement | null>(null);
  const [sourceSection, setSourceSection] = useState("framework-primary");
  const [captureKey, setCaptureKey] = useState(0);

  useEffect(() => {
    function openFromTrigger(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const trigger = target.closest<HTMLAnchorElement>("a[data-framework-trigger]");
      if (!trigger) return;

      event.preventDefault();
      triggerRef.current = trigger;
      setSourceSection(trigger.dataset.frameworkSource || "framework-primary");
      setCaptureKey((current) => current + 1);

      const dialog = dialogRef.current;
      if (!dialog || dialog.open) return;
      dialog.showModal();
      window.requestAnimationFrame(() => {
        dialog.querySelector<HTMLInputElement>('input[name="first-name"]')?.focus();
      });
    }

    document.addEventListener("click", openFromTrigger);
    return () => document.removeEventListener("click", openFromTrigger);
  }, []);

  function closeDialog() {
    if (dialogRef.current?.open) dialogRef.current.close();
  }

  function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault();
    closeDialog();
  }

  function handleClose() {
    triggerRef.current?.focus();
  }

  function handleBackdropClick(event: ReactMouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) closeDialog();
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
        <FrameworkCapture key={captureKey} presentation="dialog" sourceSection={sourceSection} />
      </div>
    </dialog>
  );
}
