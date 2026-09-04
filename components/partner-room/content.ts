export type Architecture = {
  number: string;
  name: string;
  description: string;
  question: string;
};

export type RoomJudgment = {
  room: string;
  architecture: string;
  judgment: string;
  consequence: string;
};

export type NumberedItem = {
  number: string;
  title: string;
  body: readonly string[];
};

export const architectures: readonly Architecture[] = [
  {
    number: "01",
    name: "Structured Disagreement",
    description: "The room deliberately searches for the strongest case against the investment. The challenge is not to defend the company. It is to discover what the room might be collectively missing.",
    question: "What would have to be true for our enthusiasm to be wrong?",
  },
  {
    number: "02",
    name: "Collective Outlier Judgment",
    description: "The room is looking for something exceptional enough to justify being wrong in unusual ways. Consensus matters less than whether someone has seen something important before the market has.",
    question: "What might this company understand that everyone else is missing?",
  },
  {
    number: "03",
    name: "Conviction-Weighted",
    description: "Not every opinion carries equal weight. One person may know the market, technology, founder pattern or business model well enough that their judgment deserves more weight than a simple vote.",
    question: "Who has earned the right to be believed here, and what do they see?",
  },
  {
    number: "04",
    name: "Autonomous Sponsor",
    description: "One partner develops enough conviction to own the investment. The partnership may challenge the deal aggressively, but at some point the question shifts from the company to the sponsor.",
    question: "Are you willing to put your judgment behind this?",
  },
  {
    number: "05",
    name: "Collective Consensus",
    description: "The investment needs the partnership to move together. An unresolved objection can matter more than broad enthusiasm.",
    question: "What prevents this room from saying yes together?",
  },
  {
    number: "06",
    name: "Formal Institutional IC",
    description: "The decision moves through explicit governance. Evidence, risk, mandate, ownership, reserves, portfolio construction and process all enter the judgment. A good company can still fail an institutional threshold.",
    question: "Does this investment clear the institution’s actual decision bar?",
  },
] as const;

export const companyEvidence = [
  "$2.1M ARR.",
  "Strong founder-market fit.",
  "A rapidly expanding category.",
  "A technical advantage that appears genuinely difficult to reproduce.",
  "Weak retention evidence.",
  "An expensive go-to-market motion that has not yet been proven at scale.",
] as const;

export const roomJudgments: readonly RoomJudgment[] = [
  {
    room: "Room A",
    architecture: "Autonomous Sponsor",
    judgment: "Retention is unresolved. I know that. But I think the technical wedge is rare enough that I want to own finding out.",
    consequence: "The uncertainty remains. The sponsor is willing to underwrite it.",
  },
  {
    room: "Room B",
    architecture: "Collective Consensus",
    judgment: "I like the company. But if none of us can explain why retention improves as the business scales, I don’t think we can get the partnership there.",
    consequence: "Same weakness. Different consequence.",
  },
  {
    room: "Room C",
    architecture: "Formal Institutional IC",
    judgment: "We may believe the technology. But at this entry price, with this retention profile and these reserve requirements, the investment does not clear our portfolio threshold.",
    consequence: "The technology did not get worse. The founder did not tell the story badly. The room was solving a different problem.",
  },
] as const;

export const risks = [
  { title: "A storytelling problem.", description: "The evidence exists, but the case is not legible." },
  { title: "An evidence problem.", description: "The claim matters, but the proof is not yet strong enough." },
  { title: "An underwriting problem.", description: "The uncertainty is real and the question is whether the right investor is willing and structurally able to own it." },
] as const;

export const outcomes: readonly NumberedItem[] = [
  {
    number: "01",
    title: "A decision-risk memo on your company",
    body: [
      "Built from your founder-seat session.",
      "Where conviction formed. Where it broke. What the room did not believe. Which claims required stronger evidence. Which risks the room was willing to underwrite and which it was not.",
      "It is a reading of the investment case, not a prediction of what any particular firm will decide.",
    ],
  },
  {
    number: "02",
    title: "An investor map",
    body: [
      "A working view of the firms most relevant to the way your company needs to be underwritten.",
      "Which investors have backed comparable risk. What appears to have carried those decisions. What kind of decision environment you are likely to encounter. And where a credible path into the firm already exists.",
      "Where the evidence is unclear, the map says so.",
    ],
  },
  {
    number: "03",
    title: "A working model of investor judgment",
    body: [
      "After five sessions making investment decisions yourself, you stop experiencing fundraising as a sequence of meetings. You start seeing a sequence of decision systems.",
    ],
  },
  {
    number: "04",
    title: "A sharper fundraising strategy",
    body: [
      "You should enter your raise knowing:",
      "which risks your company is asking investors to underwrite; which kinds of firms are structurally suited to underwriting them; which evidence needs to exist before you enter the market; and where your case is likely to break under scrutiny.",
      "Introductions are mapped, not made. The value of the room is not access. It is better judgment before the consequential meetings begin.",
    ],
  },
] as const;

export const foundingFacts = [
  "6 founders",
  "6 live Zoom sessions",
  "Mondays and Thursdays",
  "90 minutes per session · 10:00am ET",
  "1 real company per room",
  "1 Founder seat",
  "5 rotating Partner seats",
  "A working venture investor in every room",
  "$5,000 founding price",
] as const;

export const fitCopy = {
  lead: "Partner Room is for founders preparing for an institutional Series A in roughly the next three to six months.",
  evidence: "You should already have enough company underneath the story for serious investors to disagree about it. That may mean revenue approaching the $3M range. For some companies, the relevant evidence will be different: technical milestones, usage, contracted demand, network density, regulatory progress, enterprise adoption, or another credible basis for an institutional case.",
  participation: "You should also be willing to examine five other companies with the same seriousness you want brought to yours.",
  exclusion: "Partner Room is not designed for founders still searching for the initial company thesis. And it is probably too late once your financing process is far enough advanced that the underlying investment case can no longer materially change.",
  statement: "Partner Room is built for the moment when your company is investable enough to be judged, and your raise is still early enough for that judgment to change how you show up.",
  founding: "The Founding Room is Series A only. Founders already actively in market are welcome to request a later cohort. This room is designed for the quarter before you open the round.",
} as const;

export const partnerRoomCopy = {
  hero: {
    title: "Your Series A is decided in a room you will never be in.",
    lines: ["You pitch.", "You answer the questions.", "You leave.", "Then the real decision begins."],
    body: "A group of investors sits down with your company, your evidence, their doubts, and a particular way of resolving disagreement. Most founders learn what happened next from a one-line email. Partner Room puts you inside five of those rooms as an investor, and one as the founder.",
    commercial: "Founding Room · 6 founders · 6 rooms · $5,000",
    schedule: "Mondays and Thursdays, 28 September – 15 October 2026 · 10:00am ET",
  },
  failureMode: {
    title: "The Meeting Goes Well. The Answer Is Still No.",
    paragraphs: [
      "Founders prepare for the visible part of fundraising. The deck. The story. The meeting. The objections.",
      "But the decision happens after that. Once you leave, your company enters a decision system.",
      "Someone champions it. Someone attacks the assumptions. Someone asks whether the upside is large enough to matter. Someone asks what would have to be true for the entire case to be wrong. Someone has to be willing to own the outcome.",
      "And different firms resolve those judgments differently.",
      "The same company can produce YES in one room, NO in another, and NOT YET in a third. The evidence did not change. The dispositive question did.",
      "That is the part of fundraising most founders never get to see. Partner Room is built to expose your company to those judgments while there is still time to do something about them.",
    ],
  },
  mechanism: {
    title: "Five Rooms as an Investor. One as the Founder.",
    paragraphs: [
      "Partner Room is a live simulation of how venture investment decisions get made. Six founders. Six rooms. Three weeks.",
      "Each session takes one real company as the case. The founder presents. The room questions them. Then the founder goes silent. The room decides in front of them.",
      "Five times, you sit on the other side of the table. You are given an investor role, a question you are responsible for answering, an evidence bar you have to defend, and a responsibility to the room.",
      "You argue. You test the case. You watch promising companies lose conviction over one unresolved risk. You watch uncomfortable evidence become investable because someone sees the uncertainty differently.",
      "You learn what investors notice because, for five sessions, you have to make the decision yourself. Once, the company is yours. And you hear the conversation founders normally leave the building before it begins.",
    ],
    process: ["Founder", "Questions", "Silence", "Deliberation", "Decision"],
  },
  facilitator: {
    title: "Built by someone who sat in them.",
    paragraphs: [
      "Partner Room is designed and facilitated by Sid Mofya, former Executive Director of the Draper Venture Network, an alliance of more than twenty venture firms with a combined portfolio of over 900 companies. Kauffman Fellow. Founder of MOTIF 54 Strategic Advisory.",
      "The framework comes from years spent around venture firms, founders and investment decisions, watching how apparently similar opportunities produce very different conclusions once they enter the partnership.",
      "A working venture investor also sits in every session, bringing an active investor’s judgment into the room.",
      "This is not pitch practice. The object is not to give the founder better answers. It is to see how the investment case behaves once the founder is no longer there to defend it.",
    ],
  },
  companyRisk: {
    title: "Before Your Series A Is Actually on the Line.",
    paragraphs: [
      "Your founder-seat session puts your own company through the same process. The goal is not to manufacture consensus. It is to discover where the investment case changes state.",
      "Where does conviction form? Where does it weaken? Which claims survive questioning? Which assumptions require evidence you do not yet have? What risk is the room actually being asked to underwrite? What looked important to you but barely mattered to the investors? What barely mattered to you but stopped the room?",
      "By the end, you should be able to distinguish three things founders often collapse into one:",
      "Those require different responses. Partner Room is designed to help you know which one you actually have.",
    ],
  },
  curation: {
    title: "The room is the product.",
    paragraphs: [
      "You are not only buying a seat. For five sessions, you become part of the decision environment for another founder. That means the quality of the cohort matters.",
      "We are looking for companies at the right stage, founders willing to think seriously, and enough difference across the six companies for the room to produce genuine learning.",
    ],
    confidentiality: "All participants sign a mutual NDA before the first session. Direct competitors are not seated in the same cohort. You decide what evidence enters your room.",
    preparation: "Before your founder session, the other five participants receive a short pre-read. Its starting point is the question in your application: What do you think the investment room will struggle to believe about your company? The room works best when the hardest part of the investment case is on the table from the beginning.",
  },
  founding: {
    date: "28 September – 15 October 2026",
    paragraphs: [
      "Founder-seat order is assigned after selection and shared before the first session. Everyone enters knowing when their company will be on the table and what role they hold in every other room.",
      "There is no sales call. Request a seat. If the fit is right, you will receive an invitation to enrol directly.",
    ],
  },
  request: {
    title: "Request a Seat",
    paragraphs: [
      "For founders approaching an institutional Series A.",
      "We use these answers to determine whether the timing, company and room are right for each other.",
    ],
  },
} as const;
