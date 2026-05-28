export type OfferSlug =
  | "market-legibility"
  | "room-to-results"
  | "reinvention"
  | "ai-music-rights";

export type Offer = {
  slug: OfferSlug;
  title: string;
  hidden?: boolean;
  cardFor: string;
  cardLabel: string;
  cardCopy: string;
  cardDeliverables: string[];
  cardCta: string;
  subhead: string;
  pressure: string[];
  betterQuestion: {
    not: string;
    instead: string;
  };
  whatHappens: {
    intro: string;
    points: string[];
    note?: string;
  };
  deliverables: string[];
  bestFitIntro: string;
  bestFit: string[];
  notFitIntro: string;
  notFit: string[];
  ctaNote?: string;
  finalCta: {
    headline: string;
    copy: string;
  };
};

export const offers: Offer[] = [
  {
    slug: "market-legibility",
    title: "Market Legibility Sprint",
    cardLabel: "I need the market to understand what I do.",
    cardFor: "For founders, advisors, and operators whose real edge crosses categories.",
    cardCopy:
      "You are not unclear because you lack depth. You are unclear because the market does not yet know how to buy what you actually are. This sprint turns your non-linear story into a clear buyer, funded pain, signature offer, and outreach narrative.",
    cardDeliverables: [
      "buyer map",
      "funded pain statement",
      "category claim",
      "signature offer",
      "one-page sales asset",
      "warm outreach script",
    ],
    cardCta: "Explore Market Legibility",
    subhead: "For founders, advisors, and operators whose real edge crosses categories.",
    pressure: [
      "You are not starting from zero. You have experience, taste, insight, relationships, and a real body of work.",
      "But the market still struggles to answer: What do you actually do? Who is this for? Why now? What problem do you solve? How do I buy it? Why you?",
      "When the story is too complex, people may admire it without acting on it.",
      "Admiration does not pay. Legibility does.",
    ],
    betterQuestion: {
      not: "How do I explain everything I am?",
      instead:
        "What part of my complexity is commercially alive right now, for whom, and in what form can they buy it?",
    },
    whatHappens: {
      intro: "A focused sprint to translate your non-linear story into a market-facing offer.",
      points: [
        "who has the funded pain",
        "what they already know hurts",
        "why your background creates trust",
        "what category you should claim",
        "what offer should be sold first",
        "what language makes the offer easier to understand",
        "who to contact first",
      ],
    },
    deliverables: [
      "buyer map",
      "funded pain statement",
      "one-line category claim",
      "signature offer structure",
      "offer promise",
      "one-page sales asset",
      "LinkedIn authority post angles",
      "warm outreach script",
      "7-day action plan",
    ],
    bestFitIntro: "This sprint is for:",
    bestFit: [
      "founders with cross-category experience",
      "advisors moving into premium work",
      "creators with commercial potential",
      "operators leaving institutional roles",
      "consultants whose real edge is under-translated",
      "diaspora builders",
      "spiritual or creative entrepreneurs who need market clarity",
      "people who are too coherent internally and too confusing externally",
    ],
    notFitIntro: "This is not for:",
    notFit: [
      "beginners with no real body of work",
      "people looking only for self-discovery",
      "people unwilling to choose a buyer",
      "people who want a beautiful brand but no sales path",
      "people who want to remain mysterious to the market",
    ],
    finalCta: {
      headline: "Make the work easier to buy.",
      copy: "Tell me what you are trying to make legible and what commercial decision is in front of you.",
    },
  },
  {
    slug: "room-to-results",
    title: "Room-to-Results Sprint",
    cardLabel: "I need a room to produce real outcomes.",
    cardFor: "For conveners responsible for a room that needs to matter after everyone leaves.",
    cardCopy:
      "You have the event, roundtable, summit, demo day, salon, or investor room. The question is whether it will produce trust, follow-up, commitments, deals, or durable relationships. This sprint designs the room before the room happens.",
    cardDeliverables: [
      "room thesis",
      "participant map",
      "conversation architecture",
      "matchmaking logic",
      "follow-up system",
      "outcome report structure",
    ],
    cardCta: "Explore Room-to-Results",
    subhead: "For people responsible for a room that needs to matter after everyone leaves.",
    pressure: [
      "A room is not an outcome.",
      "You can gather impressive people and still leave with no movement.",
      "No follow-up. No commitments. No deals. No trust carried forward. No clear next step.",
      "The room may feel good in the moment, but the value disappears by the next morning.",
      "That is expensive.",
    ],
    betterQuestion: {
      not: "How do we get people in the room?",
      instead:
        "What must this room produce, and how should it be designed before anyone arrives?",
    },
    whatHappens: {
      intro: "A focused sprint to design the room as an instrument.",
      points: [
        "the true purpose of the room",
        "who belongs and who does not",
        "what conversation must happen",
        "what should be decided before the room",
        "what should happen during the room",
        "which relationships matter most",
        "what follow-up must be designed in advance",
        "how outcomes will be captured and reported",
      ],
    },
    deliverables: [
      "room thesis",
      "participant map",
      "outcome map",
      "pre-read or provocation memo",
      "conversation architecture",
      "matchmaking logic",
      "follow-up operating system",
      "sponsor or funder outcome report structure",
      "optional deal-room structure",
    ],
    bestFitIntro: "This sprint is for:",
    bestFit: [
      "investor forums",
      "founder demo days",
      "salons",
      "roundtables",
      "cultural gatherings",
      "university convenings",
      "diaspora investment events",
      "accelerator programs",
      "foundation-backed ecosystem events",
      "creative economy rooms",
      "capital and culture gatherings",
      "rooms where trust, money, or commitment needs to move",
    ],
    notFitIntro: "This is not for:",
    notFit: [
      "events that only need moderation",
      "networking for its own sake",
      "vanity panels",
      "events with no outcome owner",
      "rooms where optics matter more than consequences",
      "event operations, ticketing, venue, catering, AV, or production",
    ],
    finalCta: {
      headline: "Design the outcome before the room happens.",
      copy: "Tell me what room you are responsible for, who will be there, and what needs to be true after everyone leaves.",
    },
  },
  {
    slug: "reinvention",
    title: "ReInvention Sprint",
    cardLabel: "I need to find my next true move.",
    cardFor:
      "For mid-career professionals standing between who they have been and what they are becoming.",
    cardCopy:
      "You may not be lost. You may be between maps. The old role, title, sector, or identity no longer holds the full truth of who you are. But the next move is not yet clear enough to explain, choose, or act on. This sprint helps you turn transition into direction.",
    cardDeliverables: [
      "transition diagnosis",
      "next-chapter thesis",
      "strengths and pattern map",
      "opportunity territory map",
      "positioning narrative",
      "30-day next-move plan",
    ],
    cardCta: "Explore ReInvention",
    subhead:
      "For mid-career professionals standing between who they have been and what they are becoming.",
    pressure: [
      "Something is ending.",
      "Maybe the role still works on paper, but not in your body.",
      "Maybe you have succeeded inside a path you no longer want to continue.",
      "Maybe your career makes sense to other people, but less and less to you.",
      "Maybe you are carrying experience, wisdom, relationships, and capability, but cannot yet see the next form.",
      "The question is not simply: What job should I take next?",
      "The deeper question is: What is my next chapter asking me to become, and how do I move toward it without blowing up the life I have built?",
    ],
    betterQuestion: {
      not: "How do I reinvent myself from scratch?",
      instead:
        "What parts of me are still true, what parts have expired, and what next move can honor both my practical life and my deeper direction?",
    },
    whatHappens: {
      intro: "A focused sprint to turn transition into a clear next move.",
      points: [
        "what is ending",
        "what is still alive",
        "what you are carrying from the old chapter",
        "what patterns have followed you across roles and seasons",
        "what you no longer want to optimize for",
        "what kind of work, room, role, or offer may fit the next chapter",
        "what options are real now",
        "what move to make in the next 30 days",
      ],
      note: "This is not generic career coaching. It is structured discernment for people with enough life behind them to know that the next move must be both practical and true.",
    },
    deliverables: [
      "transition diagnosis — exit, expansion, return, integration, recovery, or recommitment",
      "next-chapter thesis — what your next season is about",
      "pattern map — recurring strengths, instincts, relationships, environments",
      "expired identity list — titles, ambitions, narratives no longer leading",
      "opportunity territory map — roles, projects, offers, institutions, communities, paths",
      "positioning narrative — language for the transition without sounding confused or apologetic",
      "30-day next-move plan — people to contact, experiments, decisions, signals",
    ],
    bestFitIntro: "This sprint is for:",
    bestFit: [
      "mid-career professionals considering a major next move",
      "executives and operators who no longer want the obvious path",
      "founders between ventures",
      "professionals leaving institutions",
      "people returning to creative, spiritual, or entrepreneurial parts of themselves",
      "diaspora professionals carrying multiple worlds",
      "people who have succeeded but feel summoned toward something more true",
      "people who need a next move that supports family life, income, and inner alignment",
    ],
    notFitIntro: "This is not for:",
    notFit: [
      "people looking for generic resume help",
      "people who only want job-search tactics",
      "people in acute crisis who need therapeutic support",
      "people unwilling to make choices",
      "people who want reinvention as fantasy but not action",
      "people who need someone else to give them permission to live",
    ],
    finalCta: {
      headline: "Find the next true move.",
      copy: "Tell me what is ending, what is calling, and what decision you are facing. I will recommend the right sprint or say plainly if there is not a fit.",
    },
  },
  {
    slug: "ai-music-rights",
    title: "AI Music Rights & Fan Revenue Sprint",
    hidden: true,
    cardLabel: "I need to protect creative work and grow fan revenue.",
    cardFor:
      "For artists, managers, collectives, and music organizations navigating AI, rights, consent, remixing, and fan participation.",
    cardCopy:
      "AI is changing what fans can remix, what platforms can monetize, and what artists must protect. This sprint helps you decide what to protect, what to license, what fans can do, and where new revenue might emerge.",
    cardDeliverables: [
      "AI rights position map",
      "consent policy",
      "fan remix ladder",
      "monetization concept",
      "90-day action plan",
    ],
    cardCta: "Explore AI Music Rights",
    subhead:
      "For artists, managers, collectives, and music organizations navigating AI, rights, consent, remixing, and fan participation.",
    pressure: [
      "AI is changing the boundary around music.",
      "Fans can remix. Platforms can generate. Voices can be cloned. Catalogs can become training material. Artists can be copied, extended, imitated, or invited into new forms of participation.",
      "The question is not whether AI touches music. It already does.",
      "The question is what you will protect, what you will allow, what you will license, and what kind of fan relationship you want to build.",
    ],
    betterQuestion: {
      not: "Is AI good or bad for music?",
      instead: "How do we protect creative control while creating permissioned fan revenue?",
    },
    whatHappens: {
      intro:
        "A focused sprint to map your position before platforms, tools, fans, or partners define it for you.",
      points: [
        "what parts of your work need protection",
        "what uses should require consent",
        "what fan participation could be welcomed",
        "what AI-enabled experiences could create revenue",
        "what should never be allowed",
        "what needs legal review",
        "what can be tested in 90 days",
      ],
      note: "This is not legal advice. It is commercial and strategic readiness. Legal review should be handled by qualified counsel.",
    },
    deliverables: [
      "AI rights position map",
      "consent / no-consent policy draft",
      "voice, likeness, and style risk map",
      "fan remix ladder",
      "licensing opportunity map",
      "superfan revenue concept",
      "platform / terms-of-service review checklist",
      "90-day action plan",
    ],
    bestFitIntro: "This sprint is for:",
    bestFit: [
      "independent artists",
      "artist managers",
      "boutique labels",
      "artist collectives",
      "music schools",
      "creator accelerators",
      "music business programs",
      "arts organizations",
      "teams with multiple artists asking what AI means for rights, consent, and revenue",
    ],
    notFitIntro: "This is not for:",
    notFit: [
      "people looking for legal opinions",
      "artists with no commercial intent",
      "AI gimmick projects",
      "unauthorized voice cloning",
      "exploitative fan schemes",
      "platforms seeking to bypass artist consent",
      "anyone trying to monetize creative work without permission",
    ],
    ctaNote: "This sprint is currently available by invitation or direct referral.",
    finalCta: {
      headline: "Protect control. Create permissioned fan revenue.",
      copy: "Tell me what music, artist roster, catalog, or creative community you are trying to protect and grow.",
    },
  },
];

export const visibleOffers = offers.filter((o) => !o.hidden);

export function getOffer(slug: OfferSlug): Offer {
  const offer = offers.find((o) => o.slug === slug);
  if (!offer) throw new Error(`Unknown offer: ${slug}`);
  return offer;
}
