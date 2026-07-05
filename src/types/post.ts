export type Post = {
  id: string;
  slug: string;
  title: string;
  number: string;
  publishedAt: string;
  subheading: string | null;
  quote: string | null;
  quoteAuthor: string | null;
  paragraphs: string[];
  list: string[];
  createdAt: string;
  updatedAt: string;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type PaginatedResult<T> = {
  items: T[];
  pagination: PaginationMeta;
};
