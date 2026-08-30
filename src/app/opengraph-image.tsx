import { ImageResponse } from "next/og";
import { siteDescription } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#faf7f2",
          color: "#1c1712",
        }}
      >
        <div
          style={{
            fontSize: 140,
            fontWeight: 800,
            letterSpacing: -4,
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          Nasji Culture
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 28,
            color: "#6b5f4f",
            maxWidth: 900,
            textAlign: "center",
          }}
        >
          {siteDescription}
        </div>
      </div>
    ),
    { ...size }
  );
}
