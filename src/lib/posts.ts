import { adminApiFetch } from "@/lib/admin-api";
import { apiFetch, apiFetchOrNull } from "@/lib/api";
import { PaginatedResult, Post } from "@/types/post";

export function getPostExcerpt(post: Post): string {
  if (post.excerpt) {
    return post.excerpt;
  }

  return `${post.paragraphs[0]?.slice(0, 200) ?? ""}...`;
}

export async function listPublishedPosts(
  params: {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
  } = {},
): Promise<PaginatedResult<Post>> {
  const query = new URLSearchParams({
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 20),
  });
  if (params.category) query.set("category", params.category);
  if (params.tag) query.set("tag", params.tag);

  return apiFetch<PaginatedResult<Post>>(`/posts?${query.toString()}`);
}

export async function listAllPostsForAdmin(
  params: { page?: number; limit?: number } = {},
): Promise<PaginatedResult<Post>> {
  const query = new URLSearchParams({
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 20),
  });

  return adminApiFetch<PaginatedResult<Post>>(
    `/posts/admin?${query.toString()}`,
  );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return apiFetchOrNull<Post>(`/posts/${slug}`);
}

export async function getSurroundingPosts(
  currentSlug: string,
): Promise<{ prev: Post | null; next: Post | null }> {
  const { items } = await listPublishedPosts({ limit: 100 });
  const currentIndex = items.findIndex((post) => post.slug === currentSlug);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: items[currentIndex - 1] ?? null,
    next: items[currentIndex + 1] ?? null,
  };
}
