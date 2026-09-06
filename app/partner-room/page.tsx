import styles from "./partner-room.module.css";
import PartnerRoomSections, { RoomLink } from "@/components/partner-room/PartnerRoomSections";
import { partnerRoomCopy } from "@/components/partner-room/content";

export default function PartnerRoomPage() {
  const { footer, navigation } = partnerRoomCopy;

  return (
    <>
      <header className={styles.siteHeader}>
        <div className={styles.headerInner}>
          <a className={styles.brand} href="#partner-room-main" aria-label={navigation.brand}>{navigation.brand}</a>
          <a className={styles.headerSecondary} href="#how-rooms-decide">{navigation.secondary}</a>
          <RoomLink sourceSection="nav" />
        </div>
      </header>
      <main id="partner-room-main"><PartnerRoomSections /></main>
      <footer className={styles.siteFooter}>
        <div>
          <p className={styles.brand}>{navigation.brand}</p>
          <p>{footer.tagline}</p>
        </div>
        <nav className={styles.footerLinks} aria-label={navigation.brand}>
          <a href="https://sidmofya.com" rel="noopener">{footer.links[0]}</a>
          <a href="/decision-architecture-framework">{footer.links[3]}</a>
          <a href="https://sidmofya.com/privacy" rel="noopener">{footer.links[1]}</a>
          <a href="https://sidmofya.com/terms" rel="noopener">{footer.links[2]}</a>
        </nav>
      </footer>
    </>
  );
}
