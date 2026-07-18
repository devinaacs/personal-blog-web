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

export type ContentBlock = ParagraphBlock | HeadingBlock | ListBlock | QuoteBlock;
