import styles from "@/app/partner-room/partner-room.module.css";
import { mechanismStages } from "./content";

export default function RoomMechanism() {
  return (
    <ol className={styles.process} aria-label="Partner Room decision process">
      {mechanismStages.map((stage) => (
        <li className={styles.processStep} key={stage.number} data-process-stage={stage.number}>
          <span className={styles.processNumber} aria-hidden="true">{stage.number}</span>
          <h3>{stage.title}</h3>
          <p>{stage.description}</p>
        </li>
      ))}
    </ol>
  );
}
