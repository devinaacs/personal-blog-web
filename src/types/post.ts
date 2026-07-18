import { ContentBlock } from "@/types/content-block";
import { Category, Tag } from "@/types/taxonomy";

export type Post = {
  id: string;
  slug: string;
  title: string;
  number: string;
  publishedAt: string;
  excerpt: string | null;
  content: ContentBlock[];
  archived: boolean;
  pinned: boolean;
  clapCount: number;
  shareCount: number;
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
