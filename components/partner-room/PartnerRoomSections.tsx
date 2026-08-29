import styles from "@/app/partner-room/partner-room.module.css";
import RequestSeatForm from "./RequestSeatForm";
import { fitCopy, foundingFacts, outcomes, partnerRoomCopy, risks } from "./content";
import DecisionArchitectures from "./DecisionArchitectures";
import SameCompanyDifferentRoom from "./SameCompanyDifferentRoom";

export function SeatLink({ location, children = "Request a Seat" }: { location: string; children?: React.ReactNode }) {
  return <a className={styles.primaryCta} href="#request-seat" data-cta-location={location}>{children}</a>;
}

function SectionLabel({ number, children }: { number: string; children: React.ReactNode }) {
  return <div className={styles.sectionLabel}><span>{number}</span><span>{children}</span></div>;
}

function CopySection({
  id,
  number,
  label,
  title,
  children,
  className = styles.section,
}: {
  id: string;
  number: string;
  label: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  const titleId = `${id}-title`;
  return (
    <section className={className} id={id} aria-labelledby={titleId}>
      <div className={styles.sectionGrid}>
        <SectionLabel number={number}>{label}</SectionLabel>
        <div className={styles.readingColumnWide}>
          <h2 id={titleId} className={styles.sectionTitle}>{title}</h2>
          {children}
        </div>
      </div>
    </section>
  );
}

export default function PartnerRoomSections() {
  const { hero, failureMode, mechanism, facilitator, companyRisk, curation, founding, request } = partnerRoomCopy;

  return (
    <>
      <section className={styles.hero} id="partner-room-hero" aria-labelledby="partner-room-title">
        <div className={styles.heroInner}>
          <p className={styles.heroLabel}>Partner Room</p>
          <h1 id="partner-room-title">{hero.title}</h1>
          <div className={styles.heroCopy}>
            {hero.lines.map((line, index) => <p className={index === 3 ? styles.heroTurn : undefined} key={line}>{line}</p>)}
            <p className={styles.heroPromise}>{hero.body}</p>
          </div>
          <div className={styles.heroAction}>
            <SeatLink location="hero" />
            <p>{hero.schedule}</p>
          </div>
          <p className={styles.commercialLine}>{hero.commercial}</p>
        </div>
      </section>

      <CopySection id="failure-mode" number="01" label="The failure mode" title={failureMode.title}>
        {failureMode.paragraphs.map((paragraph, index) => <p className={index === 4 ? styles.lead : undefined} key={paragraph}>{paragraph}</p>)}
      </CopySection>

      <CopySection id="mechanism" number="02" label="The mechanism" title={mechanism.title}>
        {mechanism.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <ol className={styles.process} aria-label="Founder to investment decision process">
          {mechanism.process.map((step, index) => <li className={styles.processStep} key={step}><span className={styles.processNumber}>{String(index + 1).padStart(2, "0")}</span><span>{step}</span></li>)}
        </ol>
      </CopySection>

      <CopySection id="who-runs-room" number="03" label="Who runs the room" title={facilitator.title}>
        {facilitator.paragraphs.map((paragraph, index) => <p className={index === 2 ? styles.lead : undefined} key={paragraph}>{paragraph}</p>)}
      </CopySection>

      <DecisionArchitectures />
      <div className={styles.heroAction}><SeatLink location="architectures" /></div>
      <SameCompanyDifferentRoom />

      <CopySection id="company-risk" number="06" label="What happens to your company" title={companyRisk.title}>
        {companyRisk.paragraphs.slice(0, 3).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <div className={styles.outcomeList}>
          {risks.map((risk, index) => <article key={risk.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{risk.title}</h3><p>{risk.description}</p></div></article>)}
        </div>
        <p>{companyRisk.paragraphs[3]}</p>
      </CopySection>

      <CopySection id="outcomes" number="07" label="What you leave with" title="Judgment you can carry into the raise.">
        <div className={styles.outcomeList}>
          {outcomes.map((outcome) => <article key={outcome.number}><span>{outcome.number}</span><div><h3>{outcome.title}</h3>{outcome.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></article>)}
        </div>
      </CopySection>

      <CopySection id="fit" number="08" label="Timing and fit" title="Who This Is For">
        <p>{fitCopy.lead}</p>
        <p>{fitCopy.evidence}</p>
        <p>{fitCopy.participation}</p>
        <p>{fitCopy.exclusion}</p>
        <blockquote className={styles.fitStatement}>{fitCopy.statement}</blockquote>
        <p className={styles.lead}>{fitCopy.founding}</p>
      </CopySection>

      <CopySection id="founding-room" number="09" label="The Founding Room" title="The Founding Room" className={`${styles.section} ${styles.foundingSection}`}>
        <p className={styles.lead}>{founding.date}</p>
        <div className={styles.foundingFacts} aria-label="Founding Room facts">
          {foundingFacts.map((fact, index) => <p key={fact}><span>{String(index + 1).padStart(2, "0")}</span>{fact}</p>)}
        </div>
        <div className={styles.foundingCopy}>
          {founding.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <SeatLink location="founding-room" />
      </CopySection>

      <CopySection id="curation" number="10" label="Curation and confidentiality" title={curation.title}>
        {curation.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <p className={styles.lead}>Confidentiality</p>
        <p>{curation.confidentiality}</p>
        <p className={styles.lead}>Preparation</p>
        <p>{curation.preparation}</p>
      </CopySection>

      <CopySection id="request-seat" number="11" label="The request" title={request.title} className={`${styles.section} ${styles.requestSection}`}>
        <div className={styles.requestIntro}>{request.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        <RequestSeatForm />
      </CopySection>
    </>
  );
}
