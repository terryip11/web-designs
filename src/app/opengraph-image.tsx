import { ImageResponse } from "next/og";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/seo/metadata";

export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
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
          padding: "64px 72px",
          background:
            "linear-gradient(145deg, #09090b 0%, #1e1b4b 45%, #4c1d95 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.2"
            >
              <path d="M12 2 2 7l10 5 10-5-10-5Z" />
              <path d="m2 17 10 5 10-5" />
              <path d="m2 12 10 5 10-5" />
            </svg>
          </div>
          <div style={{ display: "flex" }}>{SITE_NAME}</div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            maxWidth: 900,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.1,
            }}
          >
            <div style={{ display: "flex" }}>選介面、配設計</div>
            <div style={{ display: "flex" }}>組出你的專屬方案</div>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              lineHeight: 1.45,
              color: "rgba(255,255,255,0.82)",
            }}
          >
            {DEFAULT_DESCRIPTION}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "rgba(255,255,255,0.55)",
          }}
        >
          {SITE_TAGLINE} · HKD 參考報價 · 完整 Demo 展示
        </div>
      </div>
    ),
    { ...size }
  );
}
