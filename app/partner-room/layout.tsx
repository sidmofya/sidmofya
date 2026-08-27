import styles from "./partner-room.module.css";

export default function PartnerRoomLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell} data-partner-room>
      <a className={styles.skipLink} href="#partner-room-main">
        Skip to content
      </a>
      {children}
    </div>
  );
}
