import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "내 월급으로 강남 아파트 사려면? 😱";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: 1200,
        height: 630,
        background: "linear-gradient(135deg, #0d0d1a 0%, #1a0533 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ fontSize: 80 }}>🏙️</div>
      <div
        style={{
          fontSize: 52,
          fontWeight: 900,
          color: "#ffffff",
          textAlign: "center",
          margin: "16px 60px 8px",
          lineHeight: 1.2,
        }}
      >
        내 월급으로 강남 아파트 사려면?
      </div>
      <div style={{ fontSize: 28, color: "#a78bfa", marginTop: 8 }}>
        밥도 안 먹고 저축만 한다면... 😱
      </div>
      <div style={{ fontSize: 20, color: "#6b7280", marginTop: 36 }}>
        gangnam-apt.vercel.app
      </div>
    </div>
  );
}
