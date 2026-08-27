import styles from "./partner-room.module.css";

const architectures = [
  {
    number: "01",
    title: "Structured Disagreement",
    description:
      "The room is designed to expose the strongest argument against the investment.",
    preface: "The question is not simply:",
    firstQuestion: "Why should we invest?",
    bridge: "It is:",
    question: "What would have to be true for our enthusiasm to be wrong?",
  },
  {
    number: "02",
    title: "Collective Outlier Judgment",
    description:
      "The room is searching for something exceptional enough to justify being wrong in unusual ways. Consensus can be less important than the quality of the insight.",
    question: "What might this company see that everyone else is missing?",
  },
  {
    number: "03",
    title: "Conviction-Weighted",
    description:
      "Not every opinion carries equal weight. One Partner may understand the market deeply enough to carry more epistemic authority than the rest of the room.",
    question: "Who has earned the right to be believed here, and why?",
  },
  {
    number: "04",
    title: "Autonomous Sponsor",
    description:
      "The investment depends heavily on one Partner developing sufficient conviction to own the decision. The room tests the sponsor as much as the company.",
    question: "Are you willing to put your judgment behind this?",
  },
  {
    number: "05",
    title: "Collective Consensus",
    description:
      "The investment must survive the concerns of the whole partnership. A single unresolved objection may matter enormously.",
    question: "What would prevent this room from moving together?",
  },
  {
    number: "06",
    title: "Formal Institutional IC",
    description:
      "The decision passes through a more explicit governance process. Evidence, risk, mandate, ownership, reserves and portfolio construction may all enter the decision.",
    question: "Does this investment clear the institution’s actual decision threshold?",
  },
];

const companyFacts = [
  "$2.1M ARR",
  "strong founder-market fit",
  "a rapidly growing category",
  "weak retention evidence",
  "a compelling technical advantage",
  "an expensive go-to-market motion that has not yet been proven at scale",
];

const roomReadings = [
  "One room may see an asymmetric opportunity.",
  "Another may see unresolved distribution risk.",
  "Another may ask whether the founder has earned enough evidence yet.",
  "Another may decide the technical advantage is sufficiently rare that the uncertainty is worth underwriting.",
];

const outcomes = [
  {
    title: "A model of how investors actually decide",
    copy: "You begin to see fundraising as a sequence of decision systems rather than a sequence of presentations.",
  },
  {
    title: "A different view of your own company",
    copy: "You discover which claims create conviction and which require evidence you do not yet have.",
  },
  {
    title: "A map of your decision risks",
    copy: "You see the objections that can kill an investment after an apparently excellent meeting.",
  },
  {
    title: "Better investor selection",
    copy: "You become more capable of asking:",
    question: "Which decision environment is structurally suited to this company?",
    contrast: "rather than simply:",
    secondQuestion: "Which investor can I get a meeting with?",
  },
  {
    title: "A rehearsal you cannot get from pitch practice",
    copy: "Because the most valuable part happens after you stop talking.",
  },
];

function SeatLink({ location, children }: { location: string; children: React.ReactNode }) {
  return (
    <a className={styles.primaryCta} href="#request-seat" data-cta-location={location}>
      {children}
    </a>
  );
}

function SectionLabel({ number, children }: { number: string; children: React.ReactNode }) {
  return (
    <div className={styles.sectionLabel}>
      <span>{number}</span>
      <span>{children}</span>
    </div>
  );
}

export default function PartnerRoomPage() {
  return (
    <>
      <header className={styles.siteHeader}>
        <div className={styles.headerInner}>
          <a className={styles.brand} href="#partner-room-main" aria-label="Partner Room home">
            MOTIF 54 <span aria-hidden="true">/</span> PARTNER ROOM
          </a>
          <SeatLink location="nav">Request a Seat</SeatLink>
        </div>
      </header>

      <main id="partner-room-main">
        <section className={styles.hero} aria-labelledby="partner-room-title">
          <div className={styles.heroInner}>
            <p className={styles.heroLabel}>Partner Room</p>
            <h1 id="partner-room-title">Your Series A is decided in a room you will never be in.</h1>
            <div className={styles.heroCopy}>
              <p>You pitch.</p>
              <p>You answer the questions.</p>
              <p>You leave.</p>
              <p className={styles.heroTurn}>Then the real decision begins.</p>
              <p>
                A group of investors sits down with your company, your evidence, their doubts,
                their competing interpretations, and a particular way of deciding what deserves
                conviction.
              </p>
              <p className={styles.heroPromise}>
                Partner Room lets you rehearse that room before you raise.
              </p>
            </div>
            <div className={styles.heroAction}>
              <SeatLink location="hero">Request a Seat</SeatLink>
              <p>Six founders. Six investment decision architectures. Six live rooms.</p>
            </div>
            <p className={styles.commercialLine}>Founding Room · 6 seats · $2,500</p>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="pitch-input-title">
          <div className={styles.sectionGrid}>
            <SectionLabel number="01">The pitch is only the input</SectionLabel>
            <div className={styles.readingColumn}>
              <h2 id="pitch-input-title" className={styles.visuallyHidden}>
                The Pitch Is Only the Input
              </h2>
              <p>Founders spend enormous amounts of time preparing for the part of fundraising they can see.</p>
              <div className={styles.shortLines} aria-label="The visible parts of fundraising">
                <p>The deck.</p>
                <p>The story.</p>
                <p>The meeting.</p>
                <p>The objections.</p>
              </div>
              <p className={styles.lead}>But the investment decision happens after that.</p>
              <p>Once you leave, your company enters a decision system.</p>
              <div className={styles.deliberationList}>
                <p>Someone champions the deal.</p>
                <p>Someone attacks the assumptions.</p>
                <p>Someone asks whether the upside is large enough.</p>
                <p>Someone tests the evidence.</p>
                <p>Someone worries about what has not been proven.</p>
                <p>Someone may have the authority to stop the investment.</p>
              </div>
              <p>And every firm has a different way of resolving those judgments.</p>
              <p>The same company can produce:</p>
              <div className={styles.decisionStack} aria-label="Yes, no, or not yet">
                <span>YES in one room.</span>
                <span>NO in another.</span>
                <span>NOT YET in a third.</span>
              </div>
              <p>Not because one room is necessarily smarter.</p>
              <p>Because they are deciding differently.</p>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="enter-room-title">
          <div className={styles.sectionGrid}>
            <SectionLabel number="02">The mechanism</SectionLabel>
            <div className={styles.readingColumnWide}>
              <h2 id="enter-room-title" className={styles.sectionTitle}>Enter the Partner Room</h2>
              <div className={styles.readingColumn}>
                <p>Partner Room is a live simulation laboratory for founders preparing to raise institutional venture capital.</p>
                <div className={styles.notList}>
                  <p>It is not pitch coaching.</p>
                  <p>It is not fundraising advice.</p>
                  <p>It is not a course on how venture capital works.</p>
                </div>
                <p>You spend six sessions inside six different investment decision architectures.</p>
                <p>Each session begins with a real company.</p>
                <p>The founder presents.</p>
                <p>The founder answers questions.</p>
                <p>Then the founder goes silent.</p>
                <p className={styles.lead}>The Partners deliberate.</p>
                <p>You examine the evidence.</p>
                <p>You argue the case.</p>
                <p>You decide what matters.</p>
                <p>You discover what changes when the same company enters a different decision system.</p>
                <p>And eventually, your company enters the room too.</p>
              </div>
              <div className={styles.process} aria-label="Founder to investment decision process">
                {["Founder", "Questions", "Silence", "Deliberation", "Decision"].map((step, index) => (
                  <div className={styles.processStep} key={step}>
                    <span className={styles.processNumber}>{String(index + 1).padStart(2, "0")}</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.seatsSection}`} aria-labelledby="six-title">
          <div className={styles.sectionGrid}>
            <SectionLabel number="03">Change your seat</SectionLabel>
            <div className={styles.readingColumnWide}>
              <h2 id="six-title" className={styles.sixTitle}>
                <span>6 Founders</span>
                <span>6 Rooms</span>
                <span>6 Decisions</span>
              </h2>
              <p className={styles.lead}>Every founder occupies two kinds of seat.</p>
              <div className={styles.seatGrid}>
                <article>
                  <p className={styles.seatNumber}>01</p>
                  <h3>The Founder Seat</h3>
                  <p>Once during the room, your company becomes the case.</p>
                  <p>You present the evidence.</p>
                  <p>The Partners question you.</p>
                  <p>Then you listen while they make the decision without you.</p>
                  <p>You hear where conviction forms.</p>
                  <p>Where it collapses.</p>
                  <p>What they believe.</p>
                  <p>What they do not believe.</p>
                  <p>What you thought mattered that did not.</p>
                  <p>And what mattered far more than you realized.</p>
                </article>
                <article>
                  <p className={styles.seatNumber}>02</p>
                  <h3>The Partner Seat</h3>
                  <p>In the other five sessions, you become one of the investors.</p>
                  <p>You are given a specific role in the decision.</p>
                  <p>A specific question to answer.</p>
                  <p>A specific evidence bar.</p>
                  <p>A specific responsibility to the room.</p>
                  <p>You are no longer trying to persuade investors.</p>
                  <p>You are learning to think like one.</p>
                  <p className={styles.lead}>That change of seat is the point.</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="architectures-title">
          <div className={styles.sectionGrid}>
            <SectionLabel number="04">How rooms decide</SectionLabel>
            <div className={styles.readingColumnWide}>
              <h2 id="architectures-title" className={styles.sectionTitle}>The Six Decision Architectures</h2>
              <p className={styles.sectionIntro}>There is no universal investment committee.</p>
              <p className={styles.sectionIntro}>Different firms organize judgment differently.</p>
              <p className={styles.sectionIntro}>Inside Partner Room, you will experience six recurring architectures.</p>
              <div className={styles.architectureList}>
                {architectures.map((architecture) => (
                  <article className={styles.architecture} key={architecture.number}>
                    <div className={styles.architectureHeading}>
                      <span>{architecture.number}</span>
                      <h3>{architecture.title}</h3>
                    </div>
                    <p>{architecture.description}</p>
                    {architecture.preface && <p className={styles.questionPreface}>{architecture.preface}</p>}
                    {architecture.firstQuestion && <p className={styles.firstQuestion}>{architecture.firstQuestion}</p>}
                    {architecture.bridge && <p className={styles.questionPreface}>{architecture.bridge}</p>}
                    <p className={styles.architectureQuestion}>{architecture.question}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.sameCompanySection}`} aria-labelledby="same-company-title">
          <div className={styles.sectionGrid}>
            <SectionLabel number="05">The distinction</SectionLabel>
            <div className={styles.readingColumnWide}>
              <h2 id="same-company-title" className={styles.sectionTitle}>Same Company. Different Room.</h2>
              <p className={styles.lead}>Imagine your company has:</p>
              <div className={styles.companyRoomGrid}>
                <div>
                  <p className={styles.columnLabel}>The company</p>
                  <ul className={styles.factList}>
                    {companyFacts.map((fact) => <li key={fact}>{fact}</li>)}
                  </ul>
                </div>
                <div>
                  <p className={styles.columnLabel}>The rooms</p>
                  <div className={styles.roomReadings}>
                    {roomReadings.map((reading, index) => (
                      <p key={reading}><span>{String(index + 1).padStart(2, "0")}</span>{reading}</p>
                    ))}
                  </div>
                </div>
              </div>
              <div className={styles.distinction}>
                <p>The company did not change.</p>
                <p>The decision architecture did.</p>
              </div>
              <p className={styles.lead}>Understanding that distinction changes how you prepare to raise.</p>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="outcomes-title">
          <div className={styles.sectionGrid}>
            <SectionLabel number="06">The outcome</SectionLabel>
            <div className={styles.readingColumnWide}>
              <h2 id="outcomes-title" className={styles.sectionTitle}>What You Leave With</h2>
              <p className={styles.outcomeLead}>Not a better pitch. Something more useful.</p>
              <div className={styles.outcomeList}>
                {outcomes.map((outcome, index) => (
                  <article key={outcome.title}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{outcome.title}</h3>
                      <p>{outcome.copy}</p>
                      {outcome.question && <p className={styles.outcomeQuestion}>{outcome.question}</p>}
                      {outcome.contrast && <p>{outcome.contrast}</p>}
                      {outcome.secondQuestion && <p className={styles.outcomeQuestion}>{outcome.secondQuestion}</p>}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="who-title">
          <div className={styles.sectionGrid}>
            <SectionLabel number="07">Timing and fit</SectionLabel>
            <div className={styles.readingColumnWide}>
              <h2 id="who-title" className={styles.sectionTitle}>Who This Is For</h2>
              <p>Partner Room is designed for founders who:</p>
              <ul className={styles.fitList}>
                <li>expect to raise an institutional Seed or Series A within roughly the next six months;</li>
                <li>are already preparing for or actively conducting that raise;</li>
                <li>have enough company evidence to support a serious investment discussion;</li>
                <li>want to understand investor judgment, not merely improve presentation technique;</li>
                <li>are willing to examine other companies as seriously as they want their own examined.</li>
              </ul>
              <blockquote className={styles.fitStatement}>
                Partner Room is designed for the moment when your company is investable enough to be judged, but your raise is still early enough for that judgment to change how you show up in partner meetings.
              </blockquote>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.foundingSection}`} aria-labelledby="founding-title">
          <div className={styles.sectionGrid}>
            <SectionLabel number="08">The first room</SectionLabel>
            <div className={styles.readingColumnWide}>
              <h2 id="founding-title" className={styles.sectionTitle}>The Founding Room</h2>
              <div className={styles.foundingFacts} aria-label="Founding Room facts">
                <p><span>01</span>6 founders</p>
                <p><span>02</span>6 live sessions over Zoom</p>
                <p><span>03</span>1 real company per session</p>
                <p><span>04</span>1 Founder seat</p>
                <p><span>05</span>5 rotating Partner seats</p>
                <p><span>06</span>$2,500 founding price</p>
              </div>
              <div className={styles.foundingCopy}>
                <p>Every participant is selected because the quality of the room depends on the quality of the people inside it.</p>
                <p className={styles.lead}>There is no sales call. Request a seat and, if accepted, you’ll receive an invitation to enroll directly.</p>
              </div>
              <SeatLink location="founding-room">Request a Seat</SeatLink>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="curation-title">
          <div className={styles.sectionGrid}>
            <SectionLabel number="09">Curation</SectionLabel>
            <div className={styles.readingColumn}>
              <h2 id="curation-title" className={styles.sectionTitle}>Why Request Rather Than Simply Buy?</h2>
              <p>Because you are not merely purchasing access.</p>
              <p>You become part of the decision environment for five other founders.</p>
              <p>The room needs companies at the right stage, participants willing to think seriously, and enough diversity for the simulations to be useful.</p>
              <p className={styles.lead}>Curation is part of the product.</p>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.requestSection}`} id="request-seat" aria-labelledby="request-seat-title">
          <div className={styles.sectionGrid}>
            <SectionLabel number="10">The request</SectionLabel>
            <div className={styles.readingColumnWide}>
              <h2 id="request-seat-title" className={styles.sectionTitle} tabIndex={-1}>Request a Seat</h2>
              <div className={styles.requestIntro}>
                <p>Partner Room is for founders approaching an institutional Seed or Series A.</p>
                <p>We use these answers only to determine whether the timing and room are right for you.</p>
              </div>
              <div id="partner-room-form" />
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.siteFooter}>
        <div>
          <p className={styles.brand}>MOTIF 54 / PARTNER ROOM</p>
          <p>Decision rooms for consequential capital.</p>
        </div>
        <div className={styles.footerLinks}>
          <SeatLink location="footer">Request a Seat</SeatLink>
          <a href="https://motif54.com" rel="noopener">MOTIF 54</a>
        </div>
      </footer>
    </>
  );
}
