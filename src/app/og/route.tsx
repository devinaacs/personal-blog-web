import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";
import { getSiteSettings } from "@/lib/settings";

const size = {
  width: 1200,
  height: 630,
};

const fontsDir = join(process.cwd(), "src/app/og/fonts");

async function loadFont(filename: string): Promise<ArrayBuffer> {
  const buffer = await readFile(join(fontsDir, filename));
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  ) as ArrayBuffer;
}

const HERO_LINES = [
  { text: "thoughts,", color: "#18181b", indent: 0 },
  { text: "code,", color: "#18181b", indent: 48 },
  { text: "& everything", color: "#a1a1aa", indent: 24 },
  { text: "in between", color: "#a1a1aa", indent: 96 },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? siteConfig.tagline;
  const subheading = searchParams.get("subheading") ?? siteConfig.description;
  const category = searchParams.get("category");
  const number = searchParams.get("number");
  const date = searchParams.get("date");
  const readingMinutes = searchParams.get("readingMinutes");
  const tags = searchParams.get("tags")?.split(",").filter(Boolean) ?? [];

  const isPost = Boolean(number);
  const isHome = !isPost && !searchParams.has("title");
  const eyebrow = category ?? (isHome ? "personal journal" : "blog");

  let siteName: string = siteConfig.name;
  let establishedYear: number | null = null;
  try {
    const settings = await getSiteSettings();
    siteName = settings.siteName;
    establishedYear = settings.establishedYear;
  } catch {
    // Fall back to static config if the API is unreachable.
  }

  const [geistRegular, geistBold, geistMonoRegular, geistMonoMedium] =
    await Promise.all([
      loadFont("Geist-Regular.ttf"),
      loadFont("Geist-Bold.ttf"),
      loadFont("GeistMono-Regular.ttf"),
      loadFont("GeistMono-Medium.ttf"),
    ]);

  const bg = isPost ? "#18181b" : "#fafafa";
  const fg = isPost ? "#fafafa" : "#18181b";
  const muted = isPost ? "#a1a1aa" : "#71717a";
  const borderColor = isPost ? "#3f3f46" : "#d4d4d8";

  return new ImageResponse(
    (
      <div
        style={{
          background: bg,
          color: fg,
          display: "flex",
          fontFamily: "Geist",
          height: "100%",
          padding: 64,
          position: "relative",
          width: "100%",
        }}
      >
        <svg
          height="100%"
          style={{ left: 0, position: "absolute", top: 0 }}
          width="100%"
        >
          <defs>
            <pattern
              height="400"
              id="wood-grain"
              patternUnits="userSpaceOnUse"
              width="400"
              x="0"
              y="0"
            >
              <path
                d="M0,200 Q100,195 200,200 T400,200 M0,180 Q100,175 200,180 T400,180 M0,220 Q100,225 200,220 T400,220 M0,160 Q100,165 200,160 T400,160 M0,240 Q100,235 200,240 T400,240"
                fill="none"
                opacity="0.18"
                stroke={fg}
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect fill="url(#wood-grain)" height="100%" width="100%" />
        </svg>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "space-between",
            position: "relative",
            width: "100%",
          }}
        >
          <div
            style={{ alignItems: "center", display: "flex", gap: 12, marginBottom: 28 }}
          >
            <span style={{ fontSize: 22, fontWeight: 700 }}>{siteName}</span>
            {establishedYear && (
              <span
                style={{
                  color: muted,
                  display: "flex",
                  fontFamily: "Geist Mono",
                  fontSize: 16,
                  gap: 10,
                }}
              >
                <span style={{ color: isPost ? "#71717a" : "#a1a1aa" }}>
                  {"•"}
                </span>
                est. {establishedYear}
              </span>
            )}
          </div>

          {isPost ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {number && (
                <div
                  style={{
                    alignSelf: "flex-start",
                    background: "#fafafa",
                    color: "#18181b",
                    display: "flex",
                    fontFamily: "Geist Mono",
                    fontSize: 18,
                    padding: "8px 16px",
                  }}
                >
                  No. {number}
                </div>
              )}

              <h1
                style={{
                  fontFamily: "Geist",
                  fontSize: title.length > 40 ? 58 : 78,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                  margin: 0,
                  maxWidth: 1000,
                }}
              >
                {title}
              </h1>

              <p
                style={{
                  color: muted,
                  fontSize: subheading.length > 100 ? 22 : 26,
                  lineHeight: 1.4,
                  margin: 0,
                  maxWidth: 920,
                }}
              >
                {subheading}
              </p>

              <div
                style={{
                  alignItems: "center",
                  color: muted,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 24,
                  marginTop: 8,
                }}
              >
                {date && (
                  <div
                    style={{ alignItems: "center", display: "flex", gap: 12 }}
                  >
                    <span
                      style={{ background: "#52525b", height: 1, width: 32 }}
                    />
                    <span
                      style={{
                        fontFamily: "Geist Mono",
                        fontSize: 16,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                      }}
                    >
                      {date}
                    </span>
                  </div>
                )}
                {readingMinutes && (
                  <span style={{ fontFamily: "Geist Mono", fontSize: 16 }}>
                    {readingMinutes} min read
                  </span>
                )}
                {category && (
                  <span
                    style={{
                      border: `1px solid ${borderColor}`,
                      color: "#d4d4d8",
                      display: "flex",
                      fontFamily: "Geist Mono",
                      fontSize: 16,
                      padding: "6px 14px",
                    }}
                  >
                    {category}
                  </span>
                )}
              </div>

              {tags.length > 0 && (
                <div style={{ display: "flex", gap: 16, marginTop: -4 }}>
                  {tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      style={{
                        color: "#71717a",
                        fontFamily: "Geist Mono",
                        fontSize: 16,
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <div style={{ alignItems: "center", display: "flex", gap: 14 }}>
                <span style={{ background: fg, height: 1, width: 48 }} />
                <span
                  style={{
                    color: muted,
                    fontFamily: "Geist Mono",
                    fontSize: 15,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                  }}
                >
                  {eyebrow}
                </span>
              </div>

              {isHome ? (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {HERO_LINES.map((line) => (
                    <h1
                      key={line.text}
                      style={{
                        color: line.color,
                        fontFamily: "Geist",
                        fontSize: 54,
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        lineHeight: 1.08,
                        margin: 0,
                        paddingLeft: line.indent,
                      }}
                    >
                      {line.text}
                    </h1>
                  ))}
                </div>
              ) : (
                <h1
                  style={{
                    fontFamily: "Geist",
                    fontSize: title.length > 40 ? 56 : 72,
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                    margin: 0,
                    maxWidth: 1000,
                  }}
                >
                  {title}
                </h1>
              )}

              {isHome ? (
                <div
                  style={{
                    background: "#ffffff",
                    borderLeft: "4px solid #18181b",
                    display: "flex",
                    marginTop: 4,
                    maxWidth: 640,
                    padding: "22px 28px",
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      background: "#18181b",
                      display: "flex",
                      height: 16,
                      left: -8,
                      position: "absolute",
                      top: -8,
                      width: 16,
                    }}
                  />
                  <p
                    style={{
                      color: "#3f3f46",
                      fontSize: 20,
                      fontWeight: 300,
                      lineHeight: 1.45,
                      margin: 0,
                    }}
                  >
                    {subheading.length > 140
                      ? `${subheading.slice(0, 140)}…`
                      : subheading}
                  </p>
                </div>
              ) : (
                <p
                  style={{
                    color: muted,
                    fontSize: subheading.length > 100 ? 22 : 26,
                    lineHeight: 1.4,
                    margin: 0,
                    maxWidth: 920,
                  }}
                >
                  {subheading}
                </p>
              )}
            </div>
          )}

          <div
            style={{
              alignItems: "center",
              borderTop: `1px solid ${borderColor}`,
              display: "flex",
              fontFamily: "Geist Mono",
              fontSize: 16,
              gap: 10,
              paddingTop: 20,
            }}
          >
            <span style={{ color: "#71717a" }}>{"//"}</span>
            <span style={{ color: isPost ? "#d4d4d8" : "#3f3f46" }}>
              {siteConfig.url.replace(/^https?:\/\//, "")}
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: geistRegular, weight: 400, style: "normal" },
        { name: "Geist", data: geistBold, weight: 700, style: "normal" },
        {
          name: "Geist Mono",
          data: geistMonoRegular,
          weight: 400,
          style: "normal",
        },
        {
          name: "Geist Mono",
          data: geistMonoMedium,
          weight: 500,
          style: "normal",
        },
      ],
    },
  );
}
