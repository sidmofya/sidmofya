import styles from "./partner-room.module.css";
import PartnerRoomEnhancements from "@/components/partner-room/PartnerRoomEnhancements";
import PartnerRoomSections, { SeatLink } from "@/components/partner-room/PartnerRoomSections";

export default function PartnerRoomPage() {
  return (
    <>
      <header className={styles.siteHeader}>
        <div className={styles.headerInner}>
          <a className={styles.brand} href="#partner-room-main" aria-label="Partner Room home">
            MOTIF 54 <span aria-hidden="true">/</span> PARTNER ROOM
          </a>
          <SeatLink location="nav" />
        </div>
      </header>
      <main id="partner-room-main"><PartnerRoomSections /></main>
      <PartnerRoomEnhancements />
      <footer className={styles.siteFooter}>
        <div>
          <p className={styles.brand}>MOTIF 54 / PARTNER ROOM</p>
          <p>Decision rooms for consequential capital.</p>
        </div>
        <div className={styles.footerLinks}><a href="https://motif54.com" rel="noopener">MOTIF 54</a></div>
      </footer>
    </>
  );
}
