import { ImageResponse } from "next/og";

export const alt = "MOTIF 54 / Partner Room — Your Series A is decided in a room you will never be in.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "66px 72px",
          background: "#0A0A0C",
          color: "#F4F4F2",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontFamily: "Arial, sans-serif",
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          <span>MOTIF 54</span>
          <span style={{ color: "#817F88" }}>/</span>
          <span>Partner Room</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          <div
            style={{
              maxWidth: 930,
              fontSize: 64,
              letterSpacing: "-0.035em",
              lineHeight: 1.02,
            }}
          >
            Your Series A is decided in a room you will never be in.
          </div>
          <div style={{ width: 160, height: 4, background: "#D08A5A" }} />
        </div>

        <div
          style={{
            display: "flex",
            gap: "34px",
            fontFamily: "Arial, sans-serif",
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          <span>6 Founders</span>
          <span style={{ color: "#817F88" }}>6 Rooms</span>
          <span style={{ color: "#817F88" }}>6 Decisions</span>
        </div>
      </div>
    ),
    size,
  );
}
