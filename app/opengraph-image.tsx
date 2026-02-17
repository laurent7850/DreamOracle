import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "DreamOracle - Interprète de Rêves";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #0a0a2a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative stars */}
        <div
          style={{
            position: "absolute",
            top: "60px",
            left: "100px",
            fontSize: "40px",
            opacity: 0.3,
            display: "flex",
          }}
        >
          ✨
        </div>
        <div
          style={{
            position: "absolute",
            top: "120px",
            right: "150px",
            fontSize: "30px",
            opacity: 0.2,
            display: "flex",
          }}
        >
          ⭐
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "100px",
            left: "200px",
            fontSize: "35px",
            opacity: 0.25,
            display: "flex",
          }}
        >
          🌙
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            right: "120px",
            fontSize: "28px",
            opacity: 0.2,
            display: "flex",
          }}
        >
          ✨
        </div>

        {/* Moon icon */}
        <div style={{ fontSize: "80px", marginBottom: "20px", display: "flex" }}>
          🔮
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: 700,
            background: "linear-gradient(90deg, #d4af37, #f0d060, #d4af37)",
            backgroundClip: "text",
            color: "transparent",
            marginBottom: "12px",
            display: "flex",
          }}
        >
          DreamOracle
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "28px",
            color: "#a0a0d0",
            letterSpacing: "2px",
            display: "flex",
          }}
        >
          Explorez les mystères de vos rêves
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "18px",
            color: "#6b6b9a",
            marginTop: "24px",
            display: "flex",
            gap: "20px",
          }}
        >
          <span>Journal de rêves</span>
          <span style={{ color: "#d4af37" }}>•</span>
          <span>Interprétation IA</span>
          <span style={{ color: "#d4af37" }}>•</span>
          <span>Biorythme</span>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, transparent, #d4af37, #6366f1, transparent)",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
