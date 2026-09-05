export const FRAMEWORK_FORM_NAME = "partner-room-decision-architecture";

const FRAMEWORK_URL = "https://partnerroom.sidmofya.com/downloads/how-venture-rooms-decide.pdf";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeFrameworkLead(data) {
  const firstName = String(data["first-name"] ?? "").trim();
  const email = String(data.email ?? "").trim().toLowerCase();
  const role = String(data.role ?? "").trim();
  const source = String(data.source ?? FRAMEWORK_FORM_NAME).trim() || FRAMEWORK_FORM_NAME;

  if (!firstName || !EMAIL_PATTERN.test(email)) {
    throw new Error("Expected a valid framework lead submission.");
  }

  return { firstName, email, role, source };
}

async function requireOk(response, provider) {
  if (response.ok) return;
  throw new Error(`${provider} request failed with ${response.status}.`);
}

export async function deliverFrameworkLead({
  data,
  fetchImpl = fetch,
  resendApiKey,
  hubspotAccessToken,
}) {
  const submissionIdentity = data["form-name"] ?? data.source ?? data.tag;
  if (submissionIdentity !== FRAMEWORK_FORM_NAME) return "ignored";
  if (!resendApiKey || !hubspotAccessToken) {
    throw new Error("Partner Room delivery credentials are not configured.");
  }

  const lead = normalizeFrameworkLead(data);
  const emailRequest = fetchImpl("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Partner Room <room@sidmofya.com>",
      reply_to: "sid@sidmofya.com",
      to: [lead.email],
      subject: "How Venture Rooms Decide",
      text: `${lead.firstName},\n\nYour copy of How Venture Rooms Decide is ready:\n${FRAMEWORK_URL}\n\nSid Mofya\nPartner Room / MOTIF 54`,
    }),
  }).then((response) => requireOk(response, "Resend"));

  const hubspotRequest = fetchImpl(
    "https://api.hubapi.com/crm/objects/2026-03/contacts/batch/upsert",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${hubspotAccessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: [{
          id: lead.email,
          idProperty: "email",
          properties: {
            email: lead.email,
            firstname: lead.firstName,
            partner_room_role: lead.role,
            partner_room_source: lead.source,
          },
        }],
      }),
    },
  ).then((response) => requireOk(response, "HubSpot"));

  await Promise.all([emailRequest, hubspotRequest]);
  return "delivered";
}
