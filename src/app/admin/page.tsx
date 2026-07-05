import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Settings } from "lucide-react";

import { AdminLogoutButton } from "@/components/admin/admin-logout-button";
import { AdminPostList } from "@/components/admin/admin-post-list";
import { WoodTexture } from "@/components/shared/wood-texture";
import { createMetadata } from "@/config/metadata";
import { getAdminUser } from "@/lib/admin-session";
import { listPublishedPosts } from "@/lib/posts";

export const metadata = createMetadata("/admin", {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
});

function countWords(paragraphs: string[]): number {
  return paragraphs.join(" ").split(/\s+/).filter(Boolean).length;
}

export default async function AdminDashboardPage() {
  const user = await getAdminUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { items: posts, pagination } = await listPublishedPosts({
    limit: 100,
  });
  const totalWords = posts.reduce(
    (sum, post) => sum + countWords(post.paragraphs),
    0,
  );

  return (
    <div className="relative min-h-screen bg-zinc-100">
      <WoodTexture />

      <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-900">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6">
          <div>
            <h1 className="mb-1 text-2xl font-bold text-white sm:text-3xl">
              Admin Dashboard
            </h1>
            <p className="font-mono text-sm text-zinc-400">
              {"// manage your blog posts"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              className="flex flex-1 items-center justify-center gap-2 bg-white px-4 py-3 font-bold text-zinc-900 transition-colors hover:bg-zinc-200 sm:flex-none sm:px-6"
              href="/admin/posts/new"
            >
              <Plus size={20} />
              New Post
            </Link>

            <Link
              className="flex items-center gap-2 border border-zinc-700 bg-zinc-800 px-4 py-3 text-white transition-colors hover:bg-zinc-700"
              href="/admin/settings"
            >
              <Settings size={18} />
              <span className="font-mono text-sm">Settings</span>
            </Link>

            <AdminLogoutButton />
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <div className="border-l-4 border-zinc-900 bg-white p-6">
            <div className="mb-2 text-4xl font-bold text-zinc-900">
              {pagination.total}
            </div>
            <div className="font-mono text-sm text-zinc-600">Total Posts</div>
          </div>

          <div className="bg-zinc-900 p-6 text-white">
            <div className="mb-2 text-4xl font-bold">∞</div>
            <div className="font-mono text-sm text-zinc-400">Ideas Brewing</div>
          </div>

          <div className="border-2 border-zinc-900 bg-white p-6">
            <div className="mb-2 text-4xl font-bold text-zinc-900">
              {totalWords.toLocaleString()}
            </div>
            <div className="font-mono text-sm text-zinc-600">Total Words</div>
          </div>
        </div>

        <div className="bg-white">
          <div className="h-2 bg-zinc-900" />

          <div className="p-4 sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-zinc-900">All Posts</h2>
              <span className="font-mono text-sm text-zinc-500">
                {pagination.total} {pagination.total === 1 ? "post" : "posts"}
              </span>
            </div>

            <AdminPostList posts={posts} />
          </div>
        </div>
      </div>
    </div>
  );
}
