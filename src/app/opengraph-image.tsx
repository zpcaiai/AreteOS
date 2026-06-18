import { ImageResponse } from "next/og";

export const alt = "Arete — Human Development OS";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #111827 0%, #020617 60%, #0b1220 100%)",
          color: "#f8fafc",
        }}>
        <div style={{ fontSize: 132, fontWeight: 700, letterSpacing: 10 }}>ARETE</div>
        <div style={{ fontSize: 42, color: "#94a3b8", marginTop: 8 }}>Become who you are.</div>
        <div style={{ fontSize: 28, color: "#818cf8", marginTop: 28, letterSpacing: 2 }}>
          Human Development OS · 人类发展操作系统
        </div>
      </div>
    ),
    { ...size },
  );
}
