export const MAX_CLAPS_PER_READER = 50;

export const SHARE_PLATFORMS = [
  "copy-link",
  "twitter",
  "facebook",
  "linkedin",
  "whatsapp",
  "email",
] as const;

export type SharePlatform = (typeof SHARE_PLATFORMS)[number];
