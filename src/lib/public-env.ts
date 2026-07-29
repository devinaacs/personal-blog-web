// Direct `process.env.NEXT_PUBLIC_*` access so Next.js can inline the value
// at build time without pulling the zod-validated `env` (lib/env.ts) — and
// the `zod` dependency it drags in — into client bundles that only need
// this one public URL (e.g. post-article.tsx's share link, used inside the
// admin post editor's client-side preview).
export const NEXT_PUBLIC_APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
