/**
 * @param {{ post: (payload: Record<string, string>) => Promise<{ ok: boolean }>, onSuccess: (payload: Record<string, string>) => void }} dependencies
 */
export function createFrameworkLeadSubmitter({ post, onSuccess }) {
  let submitting = false;

  return async function submitFrameworkLead(payload) {
    if (submitting) return "duplicate";

    submitting = true;
    try {
      const response = await post(payload);
      if (!response.ok) return "error";
      onSuccess(payload);
      return "success";
    } catch {
      return "error";
    } finally {
      submitting = false;
    }
  };
}

/**
 * @param {string | null} field
 * @param {{ elements?: { namedItem?: (name: string) => unknown } } | null} form
 */
export function focusFrameworkLeadInvalid(field, form) {
  if (!field) return;
  const control = form?.elements?.namedItem?.(field);
  if (control && typeof control === "object" && "focus" in control && typeof control.focus === "function") {
    control.focus();
  }
}

/** @param {string} status @param {{ focus?: () => void } | null} target */
export function focusFrameworkLeadSuccess(status, target) {
  if (status === "success") target?.focus?.();
}
