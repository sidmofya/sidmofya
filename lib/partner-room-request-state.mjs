/**
 * @param {{ dispatchSubmitted: () => void, setStatus: (status: "success") => void }} dependencies
 */
export function transitionRoomRequestToSuccess({ dispatchSubmitted, setStatus }) {
  dispatchSubmitted();
  setStatus("success");
}

/**
 * @param {string} status
 * @param {{ focus?: () => void } | null} target
 */
export function focusRoomRequestSuccess(status, target) {
  if (status === "success") target?.focus?.();
}
