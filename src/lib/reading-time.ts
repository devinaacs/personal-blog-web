const WORDS_PER_MINUTE = 200;

export function estimateReadingMinutes(paragraphs: string[]): number {
  const wordCount = paragraphs.join(" ").split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}
