import { adminApiFetch } from "@/lib/admin-api";
import { PostEngagement } from "@/types/engagement";

export async function getPostEngagement(postId: string): Promise<PostEngagement> {
  return adminApiFetch<PostEngagement>(`/posts/id/${postId}/engagement`);
}
