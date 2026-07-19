import { adminApiFetch } from "@/lib/admin-api";
import { PaginatedResult, Post } from "@/types/post";

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
