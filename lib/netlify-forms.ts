/**
 * Netlify Forms plumbing. Forms are declared in public/__forms.html so the
 * build-time detection bot can see them; every field name used here must also
 * appear there or Netlify silently drops it from submissions.
 */

export function encode(data: Record<string, string>) {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
}

export async function postEncodedForm(
  body: string,
  fetchImpl: typeof fetch = fetch,
) {
  const response = await fetchImpl("/__forms.html", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) throw new Error(`HTTP ${response.status}`);
}

/** Posts a form's fields back to the origin for Netlify to capture. */
export async function submitToNetlify(formName: string, form: HTMLFormElement) {
  const body: Record<string, string> = { "form-name": formName };

  new FormData(form).forEach((value, key) => {
    body[key] = value.toString();
  });

  await postEncodedForm(encode(body));
}
