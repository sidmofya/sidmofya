export const FRAMEWORK_FORM_NAME = "partner-room-decision-architecture";
export const FRAMEWORK_SOURCE = "partner-room-decision-architecture";

const ROLE_OPTIONS = new Set(["", "Founder", "Investor", "Other"]);

/**
 * @param {Record<string, unknown>} values
 * @returns {{ values: Record<string, string>, errors: Record<string, string> }}
 */
export function validateFrameworkLead(values) {
  const normalizedValues = Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, String(value ?? "").trim()]),
  );
  const errors = {};

  if (!normalizedValues["first-name"]) {
    errors["first-name"] = "Please enter your first name.";
  }

  if (!normalizedValues.email) {
    errors.email = "Please enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedValues.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!ROLE_OPTIONS.has(normalizedValues.role ?? "")) {
    errors.role = "Please select a valid role.";
  }

  return { values: normalizedValues, errors };
}

/**
 * @param {Record<string, string>} values
 * @param {Record<string, string>} attribution
 * @param {string} submittedAt
 * @returns {Record<string, string>}
 */
export function buildFrameworkLeadPayload(values, attribution, submittedAt) {
  return {
    "form-name": FRAMEWORK_FORM_NAME,
    "first-name": values["first-name"],
    email: values.email,
    role: values.role ?? "",
    source: FRAMEWORK_SOURCE,
    tag: FRAMEWORK_SOURCE,
    "utm-source": attribution["utm-source"] ?? "",
    "utm-medium": attribution["utm-medium"] ?? "",
    "utm-campaign": attribution["utm-campaign"] ?? "",
    "utm-content": attribution["utm-content"] ?? "",
    "utm-term": attribution["utm-term"] ?? "",
    "referral-url": attribution["referral-url"] ?? "",
    "landing-page-url": attribution["landing-page-url"] ?? "",
    "submitted-at": submittedAt,
    subject: "Partner Room Decision Architecture download",
    "bot-field": values["bot-field"] ?? "",
  };
}
