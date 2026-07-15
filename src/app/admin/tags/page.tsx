import { redirect } from "next/navigation";

import { TagManager } from "@/components/admin/tag-manager";
import { createMetadata } from "@/config/metadata";
import { getAdminUser } from "@/lib/admin-session";
import { listTags } from "@/lib/tags";

export const metadata = createMetadata("/admin/tags", {
  title: "Manage Tags",
  robots: { index: false, follow: false },
});

export default async function AdminTagsPage() {
  const user = await getAdminUser();

  if (!user) {
    redirect("/admin/login");
  }

  const tags = await listTags();

  return (
    <div className="min-h-screen bg-zinc-100">
      <TagManager tags={tags} />
    </div>
  );
}
