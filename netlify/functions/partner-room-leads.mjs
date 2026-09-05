import { deliverFrameworkLead } from "../../lib/partner-room-lead-delivery.mjs";

const handler = {
  async formSubmitted(event) {
    await deliverFrameworkLead({
      data: event.data,
      resendApiKey: Netlify.env.get("RESEND_API_KEY"),
      hubspotAccessToken: Netlify.env.get("HUBSPOT_ACCESS_TOKEN"),
    });
  },
};

export default handler;
