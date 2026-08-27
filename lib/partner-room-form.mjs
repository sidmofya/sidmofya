export const PARTNER_ROOM_FORM_NAME = "partner-room-seat-request";
export const ATTRIBUTION_STORAGE_KEY = "partner-room:first-touch";

const ROUND_OPTIONS = new Set(["Seed", "Series A", "Other"]);
const RAISE_TIMING_OPTIONS = new Set([
  "Raising now",
  "Within 3 months",
  "Within 3–6 months",
  "More than 6 months away",
]);

const ATTRIBUTION_FIELDS = [
  "utm-source",
  "utm-medium",
  "utm-campaign",
  "utm-content",
  "utm-term",
  "referral-url",
  "landing-page-url",
];

/** @param {unknown} value */
export function normalizeHttpUrl(value) {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) return { value: "", valid: true };

  const hasScheme = /^[a-z][a-z\d+.-]*:/i.test(trimmed);
  const candidate = hasScheme ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(candidate);
    const valid = (url.protocol === "http:" || url.protocol === "https:") && Boolean(url.hostname);
    return { value: valid ? url.href : trimmed, valid };
  } catch {
    return { value: trimmed, valid: false };
  }
}

/**
 * @param {Record<string, unknown>} values
 * @returns {{ values: Record<string, string>, errors: Record<string, string> }}
 */
export function validateSeatRequest(values) {
  const normalizedValues = Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, String(value ?? "").trim()]),
  );
  const errors = {};

  if (!normalizedValues.name) errors.name = "Please enter your name.";

  if (!normalizedValues.email) {
    errors.email = "Please enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedValues.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!normalizedValues.company) errors.company = "Please enter your company name.";

  if (!normalizedValues["company-website"]) {
    errors["company-website"] = "Please enter your company website.";
  } else {
    const companyWebsite = normalizeHttpUrl(normalizedValues["company-website"]);
    if (companyWebsite.valid) {
      normalizedValues["company-website"] = companyWebsite.value;
    } else {
      errors["company-website"] = "Please enter a valid company website URL.";
    }
  }

  if (!ROUND_OPTIONS.has(normalizedValues.round)) {
    errors.round = "Please tell us which round you are preparing for.";
  }

  if (!RAISE_TIMING_OPTIONS.has(normalizedValues["raise-timing"])) {
    errors["raise-timing"] = "Please tell us when you expect to raise.";
  }

  if (!normalizedValues["investor-targets"]) {
    errors["investor-targets"] =
      "Please tell us which investors you are likely to approach.";
  }

  if (!normalizedValues["room-concern"]) {
    errors["room-concern"] =
      "Please tell us what the investment room may struggle to believe.";
  }

  if (normalizedValues["deck-url"]) {
    const deckUrl = normalizeHttpUrl(normalizedValues["deck-url"]);
    if (deckUrl.valid) {
      normalizedValues["deck-url"] = deckUrl.value;
    } else {
      errors["deck-url"] = "Please enter a valid deck or investor materials URL.";
    }
  }

  return { values: normalizedValues, errors };
}

/** @param {unknown} value */
function isAttribution(value) {
  if (!value || typeof value !== "object") return false;
  return ATTRIBUTION_FIELDS.every((field) => typeof value[field] === "string");
}

/**
 * @param {{ currentUrl: string, referrer: string, storedValue: string | null }} input
 * @returns {Record<string, string>}
 */
export function captureFirstTouchAttribution({ currentUrl, referrer, storedValue }) {
  if (storedValue) {
    try {
      const stored = JSON.parse(storedValue);
      if (isAttribution(stored)) return stored;
    } catch {
      // Fall through and rebuild attribution from the current visit.
    }
  }

  const url = new URL(currentUrl);
  return {
    "utm-source": url.searchParams.get("utm_source") ?? "",
    "utm-medium": url.searchParams.get("utm_medium") ?? "",
    "utm-campaign": url.searchParams.get("utm_campaign") ?? "",
    "utm-content": url.searchParams.get("utm_content") ?? "",
    "utm-term": url.searchParams.get("utm_term") ?? "",
    "referral-url": referrer,
    "landing-page-url": currentUrl,
  };
}

/**
 * @param {Record<string, string>} values
 * @param {Record<string, string>} attribution
 * @param {string} submittedAt
 * @returns {Record<string, string>}
 */
export function buildSeatRequestPayload(values, attribution, submittedAt) {
  return {
    "form-name": PARTNER_ROOM_FORM_NAME,
    name: values.name,
    email: values.email,
    company: values.company,
    "company-website": values["company-website"],
    round: values.round,
    "raise-timing": values["raise-timing"],
    "investor-targets": values["investor-targets"],
    "room-concern": values["room-concern"],
    "deck-url": values["deck-url"] ?? "",
    "utm-source": attribution["utm-source"] ?? "",
    "utm-medium": attribution["utm-medium"] ?? "",
    "utm-campaign": attribution["utm-campaign"] ?? "",
    "utm-content": attribution["utm-content"] ?? "",
    "utm-term": attribution["utm-term"] ?? "",
    "referral-url": attribution["referral-url"] ?? "",
    "landing-page-url": attribution["landing-page-url"] ?? "",
    "submitted-at": submittedAt,
    subject: `Partner Room seat request — ${values.company}`,
    "bot-field": values["bot-field"] ?? "",
  };
}
