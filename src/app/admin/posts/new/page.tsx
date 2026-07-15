import { redirect } from "next/navigation";

import { PostForm } from "@/components/admin/post-form";
import { createMetadata } from "@/config/metadata";
import { getAdminUser } from "@/lib/admin-session";
import { listAllPostsForAdmin } from "@/lib/posts";

export const metadata = createMetadata("/admin/posts/new", {
  title: "New Post",
  robots: { index: false, follow: false },
});

export default async function NewPostPage() {
  const user = await getAdminUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { pagination } = await listAllPostsForAdmin({ limit: 1 });
  const nextNumber = String(pagination.total + 1).padStart(3, "0");

  return <PostForm number={nextNumber} />;
}
