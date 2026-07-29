export type BlockAlign = "left" | "center" | "right" | "justify";

export type ParagraphBlock = {
  type: "paragraph";
  text: string;
  align?: BlockAlign;
};

export type HeadingBlock = {
  type: "heading";
  text: string;
  align?: BlockAlign;
};

export type ListBlock = {
  type: "list";
  items: string[];
  align?: BlockAlign;
};

export type QuoteBlock = {
  type: "quote";
  text: string;
  author?: string;
  align?: BlockAlign;
};

export type ImageBlock = {
  type: "image";
  url: string;
  alt: string;
  caption?: string;
  align?: BlockAlign;
};

export type TableBlock = {
  type: "table";
  headers: string[];
  rows: string[][];
  align?: BlockAlign;
};

export type ContentBlock =
  | ParagraphBlock
  | HeadingBlock
  | ListBlock
  | QuoteBlock
  | ImageBlock
  | TableBlock;
