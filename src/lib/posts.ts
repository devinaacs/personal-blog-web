import { apiFetch } from "@/lib/api";
import { PaginatedResult, Post } from "@/types/post";

export async function listPublishedPosts(
  params: { page?: number; limit?: number } = {},
): Promise<PaginatedResult<Post>> {
  const query = new URLSearchParams({
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 20),
  });

  return apiFetch<PaginatedResult<Post>>(`/posts?${query.toString()}`, {
    next: { revalidate: 60 },
  });
}
