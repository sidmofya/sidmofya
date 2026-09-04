import styles from "@/app/partner-room/partner-room.module.css";
import { companyEvidence, partnerRoomCopy, roomJudgments } from "./content";

export default function SameCompanyDifferentRoom() {
  const copy = partnerRoomCopy.distinction;

  return (
    <section className={`${styles.section} ${styles.chamber} ${styles.sameCompanySection}`} id="same-company" aria-labelledby="same-company-title">
      <div className={`${styles.sectionGrid} ${styles.composition}`}>
        <div className={styles.sectionLabel}><span>05</span><span>{copy.label}</span></div>
        <div className={styles.readingColumnWide}>
          <h2 id="same-company-title" className={`${styles.sectionTitle} ${styles.display}`}>{copy.title}</h2>
          <p className={styles.lead}>{copy.intro}</p>
          <div className={styles.companyRoomGrid}>
            <div className={styles.companyEvidenceColumn}>
              <p className={styles.columnLabel}>{copy.company}</p>
              <ul className={styles.factList}>{companyEvidence.map((fact) => <li key={fact}>{fact}</li>)}</ul>
            </div>
            <div>
              <p className={styles.columnLabel}>{copy.rooms}</p>
              <div className={styles.roomReadings}>
                {roomJudgments.map((judgment) => (
                  <article data-room-judgment={judgment.room} key={judgment.room}>
                    <p><span>{judgment.room}</span>{judgment.architecture}</p>
                    <blockquote>{judgment.judgment}</blockquote>
                    {judgment.interpretation && <p>{judgment.interpretation}</p>}
                  </article>
                ))}
              </div>
            </div>
          </div>
          {copy.conclusion.map((paragraph, index) => <p className={index === copy.conclusion.length - 1 ? styles.lead : undefined} key={paragraph}>{paragraph}</p>)}
        </div>
      </div>
    </section>
  );
}
