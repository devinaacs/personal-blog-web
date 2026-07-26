import { ContentBlock } from "@/types/content-block";

export function getBlockText(block: ContentBlock): string {
  switch (block.type) {
    case "paragraph":
    case "heading":
    case "quote":
      return block.text;
    case "list":
      return block.items.join(" ");
    case "image":
      return block.caption ?? block.alt;
    case "table":
      return [block.headers.join(" "), ...block.rows.map((row) => row.join(" "))].join(
        " ",
      );
  }
}

export function getContentText(blocks: ContentBlock[]): string {
  return blocks.map(getBlockText).join(" ");
}

export function getFirstParagraphText(blocks: ContentBlock[]): string {
  return blocks.find((block) => block.type === "paragraph")?.text ?? "";
}
