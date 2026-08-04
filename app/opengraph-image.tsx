import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Jarvis Studios — web, app, SaaS, CRM, and marketing/design for growing businesses.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// next/og (satori) only supports TTF/OTF, not the WOFF2 Clash Display files
// self-hosted elsewhere on the site — falls back to a bold system sans here
// rather than shipping a second font format just for this one image.
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "80px",
          backgroundColor: "#141414",
          backgroundImage:
            "radial-gradient(circle at 78% 32%, rgba(0,173,239,0.28), transparent 55%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 12,
              backgroundColor: "#00ADEF",
              color: "#141414",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            JS
          </div>
          <div
            style={{
              display: "flex",
              color: "#8A8A8A",
              fontSize: 24,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Jarvis Studios
          </div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 48,
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.1,
            color: "#FFFFFF",
            maxWidth: 900,
          }}
        >
          Web, app, and SaaS builds for growing businesses
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 28,
            color: "#E4E4E4",
            maxWidth: 760,
          }}
        >
          Development, design, and CRM — one studio, start to launch.
        </div>
      </div>
    ),
    size
  );
}
