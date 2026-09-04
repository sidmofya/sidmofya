/**
 * @param {{ style: { overflow: string } }} root
 * @param {{ style: { overflow: string } }} body
 */
export function lockFrameworkDialogScroll(root, body) {
  const rootOverflow = root.style.overflow;
  const bodyOverflow = body.style.overflow;
  root.style.overflow = "hidden";
  body.style.overflow = "hidden";

  return () => {
    root.style.overflow = rootOverflow;
    body.style.overflow = bodyOverflow;
  };
}

/**
 * @param {{
 *   dialog: { open: boolean, showModal: () => void, close: () => void },
 *   root: { style: { overflow: string } },
 *   body: { style: { overflow: string } },
 *   setSource: (source: string) => void,
 *   focusInside: () => void,
 * }} dependencies
 */
export function createFrameworkDialogController({ dialog, root, body, setSource, focusInside }) {
  let trigger = null;
  let restoreScroll = null;

  function restore() {
    restoreScroll?.();
    restoreScroll = null;
  }

  const controller = {
    open(nextTrigger, source) {
      trigger = nextTrigger;
      setSource(source);
      if (!dialog.open) {
        dialog.showModal();
        restoreScroll = lockFrameworkDialogScroll(root, body);
      }
      focusInside();
    },
    close() {
      if (dialog.open) dialog.close();
      else restore();
    },
    handleCancel(event) {
      event.preventDefault();
      controller.close();
    },
    handleClose() {
      restore();
      trigger?.focus?.();
    },
    handleBackdropClick(target, currentTarget) {
      if (target === currentTarget) controller.close();
    },
    dispose() {
      restore();
    },
  };

  return controller;
}
