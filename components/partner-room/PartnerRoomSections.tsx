import styles from "@/app/partner-room/partner-room.module.css";
import DecisionArchitectures from "./DecisionArchitectures";
import RoomDiagram from "./RoomDiagram";
import RoomMechanism from "./RoomMechanism";
import SameCompanyDifferentRoom from "./SameCompanyDifferentRoom";
import {
  companyQuestions,
  decisionStates,
  deliverables,
  failureTypes,
  partnerRoomCopy,
  roomAttributes,
} from "./content";

export function RoomLink({ sourceSection, children = partnerRoomCopy.navigation.primary }: { sourceSection: string; children?: React.ReactNode }) {
  return <a className={styles.primaryCta} href="#request-room" data-request-source={sourceSection}>{children}</a>;
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
      <div className={`${styles.sectionGrid} ${styles.composition}`}>
        <SectionLabel number={number}>{label}</SectionLabel>
        <div className={styles.readingColumnWide}>
          <h2 id={titleId} className={`${styles.sectionTitle} ${styles.display}`} tabIndex={id === "request-room" ? -1 : undefined}>{title}</h2>
          {children}
        </div>
      </div>
    </section>
  );
}

function FrameworkLink({ source, children }: { source: string; children: React.ReactNode }) {
  return <a className={styles.primaryCta} href="/decision-architecture-framework" data-framework-trigger data-framework-source={source}>{children}</a>;
}

export default function PartnerRoomSections() {
  const copy = partnerRoomCopy;

  return (
    <>
      <section className={styles.hero} id="partner-room-hero" aria-labelledby="partner-room-title">
        <div className={styles.heroInner}>
          <p className={styles.heroLabel}>{copy.hero.eyebrow}</p>
          <h1 className={styles.display} id="partner-room-title">{copy.hero.title}</h1>
          <div className={styles.heroCopy}>
            {copy.hero.opening.map((paragraph, index) => <p className={index === 3 ? styles.heroTurn : undefined} key={paragraph}>{paragraph}</p>)}
            {copy.hero.body.map((paragraph, index) => <p className={index === 2 ? styles.heroPromise : undefined} key={paragraph}>{paragraph}</p>)}
          </div>
          <div className={styles.heroAction}>
            <RoomLink sourceSection="hero">{copy.hero.cta}</RoomLink>
            <p>{copy.hero.metadata}</p>
          </div>
        </div>
      </section>

      <CopySection id="failure-mode" number="01" label={copy.failureMode.label} title={copy.failureMode.title}>
        {copy.failureMode.paragraphs.map((paragraph, index) => <p className={index === 4 || index === 6 ? styles.lead : undefined} key={paragraph}>{paragraph}</p>)}
      </CopySection>

      <CopySection id="mechanism" number="02" label={copy.mechanism.label} title={copy.mechanism.title} className={`${styles.section} ${styles.chamber}`}>
        {copy.mechanism.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <RoomMechanism />
      </CopySection>

      <aside className={`${styles.section} ${styles.chamber}`} aria-label="Partner Room reality">
        <blockquote className={`${styles.fitStatement} ${styles.composition}`}>
          {copy.reality.map((line) => <p key={line}>{line}</p>)}
        </blockquote>
      </aside>

      <CopySection id="decision-discipline" number="" label={copy.decisionDiscipline.label} title={copy.decisionDiscipline.title}>
        {copy.decisionDiscipline.paragraphs.slice(0, 3).map((paragraph, index) => <p className={index === 2 ? styles.lead : undefined} key={paragraph}>{paragraph}</p>)}
        <ul className={styles.outcomeList} aria-label={copy.decisionDiscipline.title}>
          {decisionStates.map((decision) => <li data-decision-state={decision.state} key={decision.state}><strong>{decision.state}</strong><p>{decision.description}</p></li>)}
        </ul>
        {copy.decisionDiscipline.paragraphs.slice(3).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </CopySection>

      <CopySection id="who-runs-room" number="03" label={copy.facilitator.label} title={copy.facilitator.title}>
        {copy.facilitator.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <p className={styles.lead}>{copy.facilitator.clarification}</p>
      </CopySection>

      <DecisionArchitectures />

      <CopySection id="decision-architecture-framework" number="" label="" title={copy.frameworkPrimary.title}>
        {copy.frameworkPrimary.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <FrameworkLink source="framework-primary">{copy.frameworkPrimary.cta}</FrameworkLink>
        <p>{copy.frameworkPrimary.support}</p>
      </CopySection>

      <SameCompanyDifferentRoom />

      <CopySection id="your-company" number="06" label={copy.yourCompany.label} title={copy.yourCompany.title}>
        {copy.yourCompany.paragraphs.slice(0, 4).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <ul>{companyQuestions.map((question) => <li key={question}>{question}</li>)}</ul>
        <p>{copy.yourCompany.paragraphs[4]}</p>
        <div className={styles.outcomeList}>
          {failureTypes.map((failure) => <article data-failure-type={failure.number} key={failure.number}><span>{failure.number}</span><div><h3>{failure.title}</h3>{failure.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></article>)}
        </div>
        {copy.yourCompany.paragraphs.slice(5).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </CopySection>

      <CopySection id="deliverables" number="07" label={copy.deliverables.label} title={copy.deliverables.title}>
        {copy.deliverables.paragraphs.slice(0, 2).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <div className={styles.outcomeList}>
          {deliverables.map((deliverable) => <article data-deliverable={deliverable.number} key={deliverable.number}><span>{deliverable.number}</span><div><h3>{deliverable.title}</h3>{deliverable.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></article>)}
        </div>
        {copy.deliverables.paragraphs.slice(2).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </CopySection>

      <CopySection id="fit" number="08" label={copy.fit.label} title={copy.fit.title}>
        {copy.fit.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <blockquote className={styles.fitStatement}>{copy.fit.callout}</blockquote>
      </CopySection>

      <CopySection id="room" number="09" label={copy.room.label} title={copy.room.title} className={`${styles.section} ${styles.chamber}`}>
        <ul className={styles.foundingFacts}>{roomAttributes.map((attribute) => <li data-room-attribute={attribute} key={attribute}>{attribute}</li>)}</ul>
        {copy.room.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <RoomDiagram />
        <RoomLink sourceSection="room">{copy.room.cta}</RoomLink>
      </CopySection>

      <CopySection id="curation" number="10" label={copy.curation.label} title={copy.curation.title}>
        {copy.curation.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <h3>{copy.curation.confidentiality.title}</h3>
        {copy.curation.confidentiality.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <h3>{copy.curation.preparation.title}</h3>
        {copy.curation.preparation.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </CopySection>

      <CopySection id="framework-secondary" number="" label="" title={copy.frameworkSecondary.title}>
        {copy.frameworkSecondary.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <FrameworkLink source="framework-secondary">{copy.frameworkSecondary.cta}</FrameworkLink>
      </CopySection>

      <CopySection id="request-room" number="11" label={copy.request.label} title={copy.request.title} className={`${styles.section} ${styles.requestSection}`}>
        <div className={styles.requestIntro}>{copy.request.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      </CopySection>
    </>
  );
}
