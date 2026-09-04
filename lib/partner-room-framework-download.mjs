/**
 * @param {{
 *   fetchPdf: () => Promise<{ ok: boolean, blob?: () => Promise<unknown> }>,
 *   createObjectUrl: (blob: unknown) => string,
 *   createLink: () => { href: string, download: string, click: () => void, remove: () => void },
 *   appendLink: (link: unknown) => void,
 *   revokeObjectUrl: (url: string) => void,
 *   dispatchCompleted: () => void,
 * }} dependencies
 */
export async function downloadFrameworkPdf({
  fetchPdf,
  createObjectUrl,
  createLink,
  appendLink,
  revokeObjectUrl,
  dispatchCompleted,
}) {
  try {
    const response = await fetchPdf();
    if (!response.ok || !response.blob) return "error";

    const objectUrl = createObjectUrl(await response.blob());
    const link = createLink();
    link.href = objectUrl;
    link.download = "how-venture-rooms-decide.pdf";
    appendLink(link);
    link.click();
    link.remove();
    revokeObjectUrl(objectUrl);
    dispatchCompleted();
    return "success";
  } catch {
    return "error";
  }
}

/** @param {{ download: () => Promise<"success" | "error"> }} dependencies */
export function createFrameworkDownloadStarter({ download }) {
  let downloading = false;

  return async function startFrameworkDownload() {
    if (downloading) return "duplicate";
    downloading = true;
    try {
      return await download();
    } catch {
      return "error";
    } finally {
      downloading = false;
    }
  };
}
