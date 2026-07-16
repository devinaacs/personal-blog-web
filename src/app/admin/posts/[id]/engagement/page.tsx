import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";

import { createMetadata } from "@/config/metadata";
import { adminApiFetch, AdminApiError } from "@/lib/admin-api";
import { getAdminUser } from "@/lib/admin-session";
import { getPostEngagement } from "@/lib/engagement";
import { Post } from "@/types/post";

export const metadata = createMetadata("/admin/posts/engagement", {
  title: "Post Engagement",
  robots: { index: false, follow: false },
});

function shortenReaderId(readerId: string): string {
  return `reader-${readerId.slice(0, 8)}`;
}

export default async function PostEngagementPage({
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

  const engagement = await getPostEngagement(id);

  return (
    <div className="min-h-screen bg-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-900 px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <Link
            className="mb-4 inline-flex items-center gap-2 font-mono text-sm text-zinc-400 transition-colors hover:text-white"
            href="/admin"
          >
            <ArrowLeft size={16} />
            Back to dashboard
          </Link>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            {post.title}
          </h1>
          <p className="font-mono text-sm text-zinc-400">
            {"// clap & share activity"}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-8 grid gap-6 sm:grid-cols-2">
          <div className="border-l-4 border-zinc-900 bg-white p-6">
            <div className="mb-2 text-4xl font-bold text-zinc-900">
              {engagement.clapCount.toLocaleString()}
            </div>
            <div className="font-mono text-sm text-zinc-600">
              Total Claps ({engagement.clappers.length}{" "}
              {engagement.clappers.length === 1 ? "reader" : "readers"})
            </div>
          </div>

          <div className="border-l-4 border-zinc-900 bg-white p-6">
            <div className="mb-2 text-4xl font-bold text-zinc-900">
              {engagement.shareCount.toLocaleString()}
            </div>
            <div className="font-mono text-sm text-zinc-600">
              Total Shares ({engagement.sharers.length} events)
            </div>
          </div>
        </div>

        <div className="mb-8 bg-white">
          <div className="h-2 bg-zinc-900" />
          <div className="p-4 sm:p-8">
            <h2 className="mb-4 text-xl font-bold text-zinc-900">
              Readers who clapped
            </h2>

            {engagement.clappers.length === 0 ? (
              <p className="text-zinc-500">No claps yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b-2 border-zinc-200 font-mono text-xs text-zinc-500 uppercase">
                      <th className="py-2 pr-4">Reader</th>
                      <th className="py-2 pr-4">Claps</th>
                      <th className="py-2 pr-4">First clap</th>
                      <th className="py-2 pr-4">Last clap</th>
                      <th className="py-2">Browser</th>
                    </tr>
                  </thead>
                  <tbody>
                    {engagement.clappers.map((clapper) => (
                      <tr className="border-b border-zinc-100" key={clapper.id}>
                        <td className="py-3 pr-4 font-mono text-xs text-zinc-700">
                          {shortenReaderId(clapper.readerId)}
                        </td>
                        <td className="py-3 pr-4 font-bold text-zinc-900">
                          {clapper.count}/50
                        </td>
                        <td className="py-3 pr-4 whitespace-nowrap text-zinc-600">
                          {format(
                            new Date(clapper.createdAt),
                            "MMM d, yyyy HH:mm",
                          )}
                        </td>
                        <td className="py-3 pr-4 whitespace-nowrap text-zinc-600">
                          {format(
                            new Date(clapper.updatedAt),
                            "MMM d, yyyy HH:mm",
                          )}
                        </td>
                        <td className="max-w-xs truncate py-3 text-xs text-zinc-500">
                          {clapper.userAgent ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white">
          <div className="h-2 bg-zinc-900" />
          <div className="p-4 sm:p-8">
            <h2 className="mb-4 text-xl font-bold text-zinc-900">
              Readers who shared
            </h2>

            {engagement.sharers.length === 0 ? (
              <p className="text-zinc-500">No shares yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b-2 border-zinc-200 font-mono text-xs text-zinc-500 uppercase">
                      <th className="py-2 pr-4">Reader</th>
                      <th className="py-2 pr-4">Platform</th>
                      <th className="py-2 pr-4">When</th>
                      <th className="py-2">Browser</th>
                    </tr>
                  </thead>
                  <tbody>
                    {engagement.sharers.map((sharer) => (
                      <tr className="border-b border-zinc-100" key={sharer.id}>
                        <td className="py-3 pr-4 font-mono text-xs text-zinc-700">
                          {shortenReaderId(sharer.readerId)}
                        </td>
                        <td className="py-3 pr-4 text-zinc-900 capitalize">
                          {sharer.platform.replace("-", " ")}
                        </td>
                        <td className="py-3 pr-4 whitespace-nowrap text-zinc-600">
                          {format(
                            new Date(sharer.createdAt),
                            "MMM d, yyyy HH:mm",
                          )}
                        </td>
                        <td className="max-w-xs truncate py-3 text-xs text-zinc-500">
                          {sharer.userAgent ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
