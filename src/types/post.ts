import { Category, Tag } from "@/types/taxonomy";

export type Post = {
  id: string;
  slug: string;
  title: string;
  number: string;
  publishedAt: string;
  excerpt: string | null;
  subheading: string | null;
  quote: string | null;
  quoteAuthor: string | null;
  paragraphs: string[];
  list: string[];
  archived: boolean;
  category: Category | null;
  tags: Tag[];
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
