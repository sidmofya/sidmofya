export type NumberedItem = {
  number: string;
  title: string;
  body: readonly string[];
};

export type Architecture = {
  number: string;
  name: string;
  description: string;
  question: string;
};

export type DecisionState = {
  state: "ADVANCE" | "NOT YET" | "PASS";
  description: string;
};

export type RoomJudgment = {
  room: "ROOM A" | "ROOM B" | "ROOM C";
  architecture: string;
  judgment: string;
  interpretation?: string;
};

export const architectures: readonly Architecture[] = [
  { number: "01", name: "Structured Disagreement", description: "The room deliberately searches for the strongest case against the investment. The challenge is not to defend the company. It is to discover what the room might be collectively missing.", question: "What would have to be true for our enthusiasm to be wrong?" },
  { number: "02", name: "Collective Outlier Judgment", description: "The room is looking for something exceptional enough to justify being wrong in unusual ways. Consensus matters less than whether someone has seen something important before the market has.", question: "What might this company understand that everyone else is missing?" },
  { number: "03", name: "Conviction-Weighted", description: "Not every opinion carries equal weight. One person may know the market, technology, founder pattern or business model well enough that their judgment deserves more weight than a simple vote.", question: "Who has earned the right to be believed here, and what do they see?" },
  { number: "04", name: "Autonomous Sponsor", description: "One partner develops enough conviction to own the investment. The partnership may challenge the deal aggressively, but at some point the question shifts from the company to the sponsor.", question: "Are you willing to put your judgment behind this?" },
  { number: "05", name: "Collective Consensus", description: "The investment needs the partnership to move together. An unresolved objection can matter more than broad enthusiasm.", question: "What prevents this room from saying yes together?" },
  { number: "06", name: "Formal Institutional IC", description: "The decision moves through explicit governance. Evidence, risk, mandate, ownership, reserves, portfolio construction and process all enter the judgment. A good company can still fail an institutional threshold.", question: "Does this investment clear the institution’s actual decision bar?" },
] as const;

export const decisionStates: readonly DecisionState[] = [
  { state: "ADVANCE", description: "There is enough conviction to continue toward an investment." },
  { state: "NOT YET", description: "Something material still has to become true or be proven." },
  { state: "PASS", description: "The current investment case does not clear the bar." },
] as const;

export const mechanismStages = [
  { number: "01", title: "PRESENT", description: "Founder makes the investment case." },
  { number: "02", title: "QUESTION", description: "Investors interrogate the company and evidence." },
  { number: "03", title: "SILENCE", description: "The founder stops participating." },
  { number: "04", title: "DELIBERATE", description: "Five investors reason through the investment together." },
  { number: "05", title: "DECIDE", description: "Each investor reaches a judgment." },
  { number: "06", title: "DEBRIEF", description: "Sid surfaces what determined the room." },
] as const;

export const companyEvidence = [
  "$2.1M ARR",
  "Strong founder-market fit",
  "A rapidly expanding category",
  "A technical advantage that appears genuinely difficult to reproduce",
  "Weak retention evidence",
  "An expensive go-to-market motion that has not yet been proven at scale",
] as const;

export const roomJudgments: readonly RoomJudgment[] = [
  { room: "ROOM A", architecture: "Autonomous Sponsor", judgment: "Retention is unresolved. I know that. But I think the technical wedge is rare enough that I want to own finding out.", interpretation: "The uncertainty remains. The sponsor is willing to underwrite it." },
  { room: "ROOM B", architecture: "Collective Consensus", judgment: "I like the company. But if none of us can explain why retention improves as the business scales, I don’t think we can get the partnership there.", interpretation: "Same weakness. Different consequence." },
  { room: "ROOM C", architecture: "Formal Institutional IC", judgment: "We may believe the technology. But at this entry price, with this retention profile and these reserve requirements, the investment does not clear our portfolio threshold." },
] as const;

export const companyQuestions = [
  "Where does conviction form?",
  "Where does it weaken?",
  "Which claims survive questioning?",
  "Which assumptions require evidence you do not yet have?",
  "What risk is the room actually being asked to underwrite?",
  "What looked important to you but barely mattered to the investors?",
  "What barely mattered to you but stopped the room?",
] as const;

export const failureTypes: readonly NumberedItem[] = [
  { number: "01", title: "A storytelling problem", body: ["The evidence exists, but the case is not legible."] },
  { number: "02", title: "An evidence problem", body: ["The claim matters, but the proof is not yet strong enough."] },
  { number: "03", title: "An underwriting problem", body: ["The uncertainty is real and the question is whether the investor is willing and structurally able to own it."] },
] as const;

export const deliverables: readonly NumberedItem[] = [
  { number: "01", title: "The decision record", body: ["Where each investor landed.", "What they believed. What they did not believe. What moved during the discussion. Where the investors disagreed. Which questions changed the room. And what ultimately determined whether the company advanced, remained not yet investable, or produced a pass."] },
  { number: "02", title: "The decision-risk memo", body: ["A concise reading of where conviction formed and where it broke.", "Which claims survived scrutiny. Which assumptions remained exposed. Which risks the room was willing to underwrite and which it was not."] },
  { number: "03", title: "The “What Has to Be True” map", body: ["The conditions underneath the investment case.", "What has to be true about the market, product, economics, team, distribution, timing or other material dimensions for the company to become an exceptional investment.", "Which conditions are already evidenced.", "Which remain assumptions.", "Which matter enough to change the investment judgment."] },
] as const;

export const roomAttributes = [
  "One real company",
  "Five working venture investors",
  "A concise investor pre-read",
  "One live 90-minute room",
  "Founder presentation and questioning",
  "Investor deliberation while the founder listens",
  "Individual investment judgments",
  "Facilitated by Sid Mofya",
] as const;

export const partnerRoomCopy = {
  navigation: { brand: "MOTIF 54 / PARTNER ROOM", secondary: "How Rooms Decide", primary: "Request a Room" },
  hero: {
    eyebrow: "PARTNER ROOM",
    title: "Your Series A is decided in a room you will never be in.",
    opening: ["You pitch.", "You answer the questions.", "You leave.", "Then the real decision begins."],
    body: ["A group of investors sits down with your company, your evidence, their doubts and a particular way of resolving disagreement. Most founders learn what happened next from a one-line email.", "Partner Room changes one thing:", "you stay.", "Five venture investors evaluate your company together. Sid Mofya facilitates. You hear the questions, disagreements and judgments that normally happen after the founder leaves."],
    cta: "Request a Room",
    metadata: "One company · Five venture investors · One live decision room",
  },
  failureMode: { label: "The failure mode", title: "The Meeting Goes Well. The Answer Is Still No.", paragraphs: ["Founders prepare for the visible part of fundraising. The deck. The story. The meeting. The objections.", "But the decision happens after that. Once you leave, your company enters a decision system.", "Someone champions it. Someone attacks the assumptions. Someone asks whether the upside is large enough to matter. Someone asks what would have to be true for the entire case to be wrong. Someone has to be willing to own the outcome.", "And different firms resolve those judgments differently.", "The same company can produce YES in one room, NO in another, and NOT YET in a third.", "The evidence did not change.", "The dispositive question did.", "That is the part of fundraising most founders never get to see.", "Partner Room exposes your company to those judgments while there is still time to do something about them."] },
  mechanism: { label: "The mechanism", title: "Five Investors. Your Company. The Room Decides.", paragraphs: ["Each Partner Room is assembled around one real company: yours.", "Five working venture investors receive a concise pre-read before the session. They enter the room to reach an investment judgment, not to coach the founder.", "You present the company.", "They question you.", "Then you stop talking.", "The investors deliberate in front of you.", "They test the market, the evidence, the economics, the risks, the upside and the assumptions holding the investment case together.", "They disagree. They update. They decide what they believe and what they do not.", "During the deliberation, you do not rebut, clarify or rescue the case.", "The room has to work with the company as it understood it.", "You hear how your investment case behaves when you are no longer there to defend it."] },
  reality: ["The company is real.", "The investors are real.", "The deliberation is real.", "The only thing not on the line is the financing itself."],
  decisionDiscipline: { label: "Decision discipline", title: "Advice is easy. Judgment is harder.", paragraphs: ["Partner Room is not designed to produce five pages of suggestions.", "Each investor eventually has to answer:", "If this company were inside your investment mandate, what would you do next?", "These are judgments inside Partner Room, not offers or commitments to invest.", "What matters is not simply where each investor lands. It is why."] },
  facilitator: { label: "Who runs the room", title: "Built by someone who sat in them.", paragraphs: ["Partner Room is designed and facilitated by Sid Mofya, former Executive Director of the Draper Venture Network, an alliance of more than twenty venture firms with a combined portfolio of over 900 companies. Kauffman Fellow. Founder of MOTIF 54.", "The framework comes from years spent around venture firms, founders and investment decisions, watching how apparently similar opportunities produce very different conclusions once they enter the partnership.", "For each Partner Room, Sid convenes five working venture investors around one company.", "The objective is not to collect five identical opinions. It is to assemble enough relevant experience and difference in judgment for genuine disagreement to emerge.", "Sid facilitates the room, keeps the founder outside the deliberation itself, surfaces the questions underneath the disagreement and pushes the conversation toward judgment.", "This is not a demo day, pitch competition or advisory panel.", "The investors are there to judge the investment case as investors. They are not required to invest, make introductions, mentor the founder or manufacture consensus."], clarification: "Investor participation does not indicate investment interest." },
  architectures: { label: "How rooms decide", title: "The Room Is Real. The Framework Makes It Legible.", paragraphs: ["There is no universal investment committee.", "Different venture firms organise judgment differently.", "Even within the same firm, the effective decision system can change with the cheque size, sponsor, market, partnership and investment itself.", "Partner Room uses six recurring decision architectures as a lens for understanding what is happening underneath the deliberation.", "The participating investors are not assigned characters or instructed how to think.", "They bring their own judgment. The framework makes the structure underneath that judgment visible."] },
  frameworkPrimary: { title: "Six Ways Venture Firms Make the Same Decision Differently", paragraphs: ["The structure of the investment room changes what gets tested, who carries conviction, how disagreement gets resolved and what ultimately counts as enough evidence.", "The full Partner Room Decision Architecture Framework is a field guide to six recurring systems of venture investment judgment."], cta: "Download the Decision Architecture Framework", support: "Free field guide · PDF" },
  distinction: { label: "The distinction", title: "Same Company. Different Room.", intro: "Imagine this company:", company: "THE COMPANY", rooms: "THE ROOMS", conclusion: ["The technology did not get worse.", "The founder did not tell the story badly.", "The room was solving a different problem.", "That distinction changes which evidence you build before the raise, which risks you surface early, what questions you prepare to answer and which investment environments are structurally capable of underwriting the company."] },
  yourCompany: { label: "Your company", title: "Before Your Series A Is Actually on the Line.", paragraphs: ["Your company is the case.", "Five investors examine it as an investment while you listen.", "The objective is not to manufacture consensus or predict what every venture firm will think.", "It is to discover where the investment case changes state.", "By the end, you should be able to distinguish three things founders often collapse into one.", "Those require different responses.", "Partner Room helps you know which one you actually have."] },
  deliverables: { label: "What you leave with", title: "Judgment You Can Carry Into the Raise.", paragraphs: ["The room is the primary product.", "Everything that follows exists to make its judgment usable.", "The output is not a prediction of what a particular venture firm will decide.", "It is a much sharper picture of what your Series A case is asking investors to believe."] },
  fit: { label: "Timing and fit", title: "Who This Is For", paragraphs: ["Partner Room is designed for founders preparing for an institutional Series A.", "You should already have enough company underneath the story for serious investors to disagree about it.", "Depending on the company, that evidence might be revenue, retention, enterprise adoption, contracted demand, technical milestones, deployment performance, regulatory progress, network density, unit economics, manufacturing evidence or another credible basis for institutional investment.", "Partner Room is most useful before the financing process is far enough advanced that the underlying investment case can no longer materially change.", "It is not designed for founders still searching for the initial company thesis."], callout: "Partner Room is built for the moment when your company is investable enough to be judged, and your raise is still early enough for that judgment to change how you show up." },
  room: { label: "The room", title: "One Company. Five Investors. One Decision Room.", paragraphs: ["Each Partner Room is assembled around the company.", "The investor mix is selected for relevance to the stage, sector, business model and risks the company is asking investors to underwrite."], cta: "Request a Room", diagram: [{ label: "FOUNDER", description: "presents / answers / listens" }, { label: "5 INVESTORS", description: "question / deliberate / decide" }, { label: "SID", description: "convenes / facilitates / synthesizes" }] },
  curation: { label: "Curation and confidentiality", title: "The Room Quality is What Matters", paragraphs: ["The quality of Partner Room depends heavily on who is in it.", "Investors are selected for relevance, not celebrity.", "The aim is to assemble five people capable of forming serious independent judgments about the company and disagreeing usefully when those judgments diverge.", "We avoid material conflicts and do not knowingly seat a directly competitive or conflicted investor without the founder’s knowledge."], confidentiality: { title: "CONFIDENTIALITY", paragraphs: ["You decide what evidence enters the room.", "Materials are distributed only to invited participants for the purpose of Partner Room and should not be redistributed.", "Venture firms differ in their ability to sign NDAs. If your company requires additional confidentiality terms, those requirements need to be agreed before the room is confirmed."] }, preparation: { title: "PREPARATION", paragraphs: ["Before the room, the investors receive a concise pre-read.", "Its starting point is one question:", "What do you think the investment room will struggle to believe about your company?", "Partner Room works best when the hardest part of the investment case is on the table from the beginning."] } },
  frameworkSecondary: { title: "Not ready for a room yet?", paragraphs: ["Start with the framework behind it.", "Learn six recurring ways venture firms form conviction, resolve disagreement and make investment decisions."], cta: "Download the Decision Architecture Framework" },
  request: { label: "The request", title: "Request a Room", paragraphs: ["For founders preparing for an institutional Series A.", "We use these answers to determine whether your company is at the right moment for Partner Room and what kind of investor panel would produce the most useful judgment."] },
  footer: { tagline: "Decision rooms for consequential capital.", links: ["MOTIF 54", "Privacy", "Terms", "Decision Architecture Framework"] },
} as const;
