import { partnerRoomCopy } from "./content";
import styles from "@/app/partner-room/partner-room.module.css";

export default function RoomDiagram() {
  return (
    <div className={styles.roomDiagram} aria-label="Partner Room participants">
      {partnerRoomCopy.room.diagram.map((group) => (
        <div className={styles.roomDiagramGroup} data-room-role={group.label} key={group.label}>
          <p className={styles.roomDiagramLabel}>{group.label}</p>
          {group.label === "5 INVESTORS" && (
            <div className={styles.investorNodes} aria-hidden="true">
              {[1, 2, 3, 4, 5].map((node) => <span key={node} />)}
            </div>
          )}
          <p className={styles.roomDiagramDescription}>{group.description}</p>
        </div>
      ))}
    </div>
  );
}
