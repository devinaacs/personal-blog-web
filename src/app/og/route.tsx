import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";

export const runtime = "edge";

const size = {
  width: 1200,
  height: 630,
};

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? siteConfig.tagline;
  const subheading = searchParams.get("subheading") ?? siteConfig.description;
  const label = searchParams.has("title") ? "blog" : siteConfig.tagline;

  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#050505",
        color: "#f5f0e8",
        display: "flex",
        fontFamily: "serif",
        height: "100%",
        justifyContent: "center",
        padding: 56,
        width: "100%",
      }}
    >
      <div
        style={{
          backgroundColor: "#070707",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "38px 38px",
          border: "2px solid rgba(216, 173, 120, 0.82)",
          boxShadow: "0 28px 70px rgba(0,0,0,0.65)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          overflow: "hidden",
          padding: "48px 72px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(180deg, rgba(5,5,5,0.18), rgba(5,5,5,0.82))",
            height: "100%",
            left: 0,
            position: "absolute",
            top: 0,
            width: "100%",
          }}
        />

        <div
          style={{
            border: "1px solid rgba(216, 173, 120, 0.35)",
            color: "#d8ad78",
            display: "flex",
            fontFamily: "sans-serif",
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: "0.24em",
            padding: "16px 24px",
            position: "relative",
            textTransform: "uppercase",
            width: "max-content",
          }}
        >
          {siteConfig.name}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginTop: 28,
            position: "relative",
          }}
        >
          <p
            style={{
              color: "rgba(216, 173, 120, 0.82)",
              fontFamily: "sans-serif",
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: "0.18em",
              margin: 0,
              textTransform: "uppercase",
            }}
          >
            {label}
          </p>
          <h1
            style={{
              color: "#f5f0e8",
              fontSize: title.length > 40 ? 64 : 92,
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 0.98,
              margin: 0,
              maxWidth: 880,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              color: "#aaa39b",
              fontFamily: "sans-serif",
              fontSize: subheading.length > 100 ? 26 : 31,
              lineHeight: 1.35,
              margin: 0,
              maxWidth: 910,
            }}
          >
            {subheading}
          </p>
          <div
            style={{
              alignItems: "center",
              border: "1px solid rgba(216, 173, 120, 0.3)",
              color: "#d8ad78",
              display: "flex",
              fontFamily: "monospace",
              fontSize: 24,
              marginTop: 12,
              padding: "18px 24px",
              width: "max-content",
            }}
          >
            {siteConfig.url.replace(/^https?:\/\//, "")}
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
