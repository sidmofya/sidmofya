import styles from "@/app/partner-room/partner-room.module.css";
import { architectures, partnerRoomCopy } from "./content";

export default function DecisionArchitectures() {
  const copy = partnerRoomCopy.architectures;

  return (
    <section className={styles.section} id="how-rooms-decide" aria-labelledby="how-rooms-decide-title">
      <div className={`${styles.sectionGrid} ${styles.composition}`}>
        <div className={styles.sectionLabel}><span>04</span><span>{copy.label}</span></div>
        <div className={styles.readingColumnWide}>
          <h2 id="how-rooms-decide-title" className={`${styles.sectionTitle} ${styles.display}`}>{copy.title}</h2>
          {copy.paragraphs.map((paragraph) => <p className={styles.sectionIntro} key={paragraph}>{paragraph}</p>)}
          <div className={styles.architectureList}>
            {architectures.map((architecture) => (
              <article className={styles.architecture} id={`architecture-${architecture.number}`} data-architecture={architecture.number} aria-labelledby={`architecture-${architecture.number}-title`} key={architecture.number}>
                <div className={styles.architectureHeading}>
                  <span className={styles.architectureRailNumber} aria-hidden="true">{architecture.number}</span>
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
