import { ImageResponse } from "next/og";

export const alt = "PARTNER ROOM — Your Series A is decided in a room you will never be in.";
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
          padding: "62px 72px 68px",
          background: "#f6f1e8",
          color: "#1a1815",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontFamily: "Arial, sans-serif",
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          PARTNER ROOM
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          <div
            style={{
              maxWidth: 1010,
              fontSize: 70,
              letterSpacing: "-0.04em",
              lineHeight: 0.98,
            }}
          >
            Your Series A is decided in a room you will never be in.
          </div>
          <div style={{ width: 150, height: 4, background: "#a45a2a" }} />
        </div>
      </div>
    ),
    size,
  );
}
