export type ParagraphBlock = {
  type: "paragraph";
  text: string;
};

export type HeadingBlock = {
  type: "heading";
  text: string;
};

export type ListBlock = {
  type: "list";
  items: string[];
};

export type QuoteBlock = {
  type: "quote";
  text: string;
  author?: string;
};

export type ImageBlock = {
  type: "image";
  url: string;
  alt: string;
  caption?: string;
};

export type TableBlock = {
  type: "table";
  headers: string[];
  rows: string[][];
};

export type ContentBlock =
  | ParagraphBlock
  | HeadingBlock
  | ListBlock
  | QuoteBlock
  | ImageBlock
  | TableBlock;
