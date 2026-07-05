import { apiFetch, apiFetchOrNull } from "@/lib/api";
import { PaginatedResult, Post } from "@/types/post";

export async function listPublishedPosts(
  params: { page?: number; limit?: number; fresh?: boolean } = {},
): Promise<PaginatedResult<Post>> {
  const query = new URLSearchParams({
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 20),
  });
  const cacheInit: RequestInit & { next?: NextFetchRequestConfig } =
    params.fresh ? { cache: "no-store" } : { next: { revalidate: 60 } };

  return apiFetch<PaginatedResult<Post>>(
    `/posts?${query.toString()}`,
    cacheInit,
  );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return apiFetchOrNull<Post>(`/posts/${slug}`, {
    next: { revalidate: 60 },
  });
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
