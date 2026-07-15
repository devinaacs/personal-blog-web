import { notFound, redirect } from "next/navigation";

import { PostForm } from "@/components/admin/post-form";
import { createMetadata } from "@/config/metadata";
import { adminApiFetch, AdminApiError } from "@/lib/admin-api";
import { getAdminUser } from "@/lib/admin-session";
import { listCategories } from "@/lib/categories";
import { listTags } from "@/lib/tags";
import { Post } from "@/types/post";

export const metadata = createMetadata("/admin/posts/edit", {
  title: "Edit Post",
  robots: { index: false, follow: false },
});

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getAdminUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { id } = await params;

  let post: Post;

  try {
    post = await adminApiFetch<Post>(`/posts/id/${id}`);
  } catch (error) {
    if (error instanceof AdminApiError && error.status === 404) {
      notFound();
    }

    throw error;
  }

  const [categories, tags] = await Promise.all([
    listCategories(),
    listTags(),
  ]);

  return (
    <PostForm
      categories={categories}
      initialPost={post}
      number={post.number}
      postId={post.id}
      tags={tags}
    />
  );
}
