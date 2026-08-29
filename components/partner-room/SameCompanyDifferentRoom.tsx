import styles from "@/app/partner-room/partner-room.module.css";
import { companyEvidence, roomJudgments } from "./content";

export default function SameCompanyDifferentRoom() {
  return (
    <section className={`${styles.section} ${styles.chamber} ${styles.sameCompanySection}`} id="same-company" aria-labelledby="same-company-title">
      <div className={`${styles.sectionGrid} ${styles.composition}`}>
        <div className={styles.sectionLabel}><span>05</span><span>The distinction</span></div>
        <div className={styles.readingColumnWide}>
          <h2 id="same-company-title" className={`${styles.sectionTitle} ${styles.display}`}>Same Company. Different Room.</h2>
          <p className={styles.lead}>Imagine this company:</p>
          <div className={styles.companyRoomGrid}>
            <div>
              <p className={styles.columnLabel}>The company</p>
              <ul className={styles.factList}>{companyEvidence.map((fact) => <li key={fact}>{fact}</li>)}</ul>
            </div>
            <div>
              <p className={styles.columnLabel}>The rooms</p>
              <div className={styles.roomReadings}>
                {roomJudgments.map((judgment) => (
                  <article data-room-judgment={judgment.room} key={judgment.room}>
                    <p><span>{judgment.room}</span>{judgment.architecture}</p>
                    <p>{judgment.judgment}</p>
                    <p>{judgment.consequence}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
          <p className={styles.lead}>That distinction changes which investors you approach, which evidence you build before the raise, what risks you surface early, and where you spend your time.</p>
        </div>
      </div>
    </section>
  );
}
