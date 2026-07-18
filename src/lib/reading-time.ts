import { getContentText } from "@/lib/content-blocks";
import { ContentBlock } from "@/types/content-block";

const WORDS_PER_MINUTE = 200;

export function estimateReadingMinutes(blocks: ContentBlock[]): number {
  const wordCount = getContentText(blocks).split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}
