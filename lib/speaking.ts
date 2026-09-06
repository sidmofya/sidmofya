/**
 * Rooms Sid has actually stood in, and what people said afterwards. Declared
 * once and consumed by both /speaking and the homepage's "Rooms held" block so
 * the two can never drift apart — the same arrangement bodies-of-work.ts uses.
 */
export type Testimonial = {
  quote: string;
  name: string;
  title: string;
};

export const venues: string[] = [
  "MIT",
  "African Diaspora Investment Symposium",
  "Draper Venture Network LP Day",
  "Zambia US Roadshow",
  "DRC Investment Forum",
  "Mobile World Congress (4YFN)",
  "TEC de Monterrey",
  "Deutsche Bank",
  "Telefonica",
];

/** Append an entry to add a quote. No markup change needed on either page. */
export const testimonials: Testimonial[] = [
  {
    quote:
      "Sid spoke at our annual summit and absolutely delivered. He brought original thinking that actually shifted how people in the room see opportunities, not just the usual talking points you hear at every conference. His frameworks on sovereignty and global capital flows hit hard. We had LPs and founders coming up afterward asking for intros. What makes Sid different is he doesn't just present information, he changes how you think about entire markets. Would book him again in a heartbeat.",
    name: "Alon Goren",
    title: "DGH Ventures",
  },
  {
    quote:
      "Sid moderated a high-level conversation on investment in Africa for us, holding a room that included Zambia's Ambassador to the US and the Minister of Transport. He kept a demanding panel focused and made the substance land for the audience. A real asset to any serious convening.",
    name: "Rajen Ranchhod",
    title: "Honorary Consul of Zambia to the State of California",
  },
  {
    quote:
      "Sid moderated one of the most engaged sessions at ADIS. He drew real substance out of Tammy and Eva and kept the room with him from start to finish. I'd have him back without hesitation.",
    name: "Almaz Negash",
    title: "CEO & Founder, African Diaspora Network",
  },
];

/** The homepage shows one quote; /speaking shows the set. */
export const featuredTestimonial = testimonials[1];
