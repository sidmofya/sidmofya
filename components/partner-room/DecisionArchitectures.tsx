import styles from "@/app/partner-room/partner-room.module.css";
import { architectures } from "./content";

export default function DecisionArchitectures() {
  return (
    <section className={styles.section} id="architectures" aria-labelledby="architectures-title">
      <div className={styles.sectionGrid}>
        <div className={styles.sectionLabel}><span>04</span><span>How rooms decide</span></div>
        <div className={styles.readingColumnWide}>
          <h2 id="architectures-title" className={styles.sectionTitle}>Six Recurring Decision Architectures</h2>
          <p className={styles.sectionIntro}>There is no universal investment committee.</p>
          <p className={styles.sectionIntro}>Different firms organise judgment differently.</p>
          <p className={styles.sectionIntro}>Even within the same firm, the effective decision system can change with the cheque size, the sponsor, the market, the partnership and the investment itself.</p>
          <p className={styles.sectionIntro}>Partner Room works through six recurring architectures. Each changes what the room is trying to resolve.</p>
          <div className={styles.architectureList}>
            {architectures.map((architecture) => (
              <article
                className={styles.architecture}
                id={`architecture-${architecture.number}`}
                data-architecture={architecture.number}
                aria-labelledby={`architecture-${architecture.number}-title`}
                key={architecture.number}
              >
                <div className={styles.architectureHeading}>
                  <span aria-hidden="true">{architecture.number}</span>
                  <h3 id={`architecture-${architecture.number}-title`}>{architecture.name}</h3>
                </div>
                <p>{architecture.description}</p>
                <p className={styles.architectureQuestion}>{architecture.question}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
