/**
 * @param {{
 *   post: (payload: Record<string, string>) => Promise<{ ok: boolean }>,
 *   onSuccess: () => void,
 * }} dependencies
 */
export function createRoomRequestSubmitter({ post, onSuccess }) {
  let submitting = false;

  return async function submitRoomRequest(payload) {
    if (submitting) return "duplicate";

    submitting = true;
    try {
      const response = await post(payload);
      if (!response.ok) return "error";
      onSuccess();
      return "success";
    } catch {
      return "error";
    } finally {
      submitting = false;
    }
  };
}
