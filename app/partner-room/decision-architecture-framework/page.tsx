import type { Metadata } from "next";
import styles from "@/app/partner-room/partner-room.module.css";
import FrameworkCapture from "@/components/partner-room/FrameworkCapture";
import { partnerRoomCopy } from "@/components/partner-room/content";

export const metadata: Metadata = {
  title: "Decision Architecture Framework | Partner Room",
  description: "The full Partner Room Decision Architecture Framework is a field guide to six recurring systems of venture investment judgment.",
};

export default function DecisionArchitectureFrameworkPage() {
  const framework = partnerRoomCopy.frameworkPrimary;

  return (
    <main className={styles.frameworkRoute}>
      <header className={styles.frameworkRouteHeader}>
        <a className={styles.brand} href="/partner-room">MOTIF 54 / PARTNER ROOM</a>
        <a href="/partner-room">Back to Partner Room</a>
      </header>
      <section className={styles.frameworkRouteContent} aria-labelledby="framework-route-title">
        <p className={styles.sectionLabel}>PARTNER ROOM</p>
        <h1 className={styles.display} id="framework-route-title">{framework.title}</h1>
        {framework.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <p className={styles.frameworkSupport}>{framework.support}</p>
        <FrameworkCapture presentation="inline" sourceSection="framework-route" />
      </section>
    </main>
  );
}
