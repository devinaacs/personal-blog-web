"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Archive,
  ArchiveRestore,
  Edit,
  Pin,
  PinOff,
  Trash2,
  Users,
} from "lucide-react";

import { getPostExcerpt } from "@/lib/posts";
import { Post } from "@/types/post";

const MAX_PINNED_POSTS = 3;

type Filter = "active" | "archived" | "all";

export function AdminPostList({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [archivingId, setArchivingId] = useState<string | null>(null);
  const [pinningId, setPinningId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("active");

  const archivedCount = posts.filter((post) => post.archived).length;
  const activeCount = posts.filter((post) => !post.archived).length;
  const pinnedCount = posts.filter((post) => post.pinned).length;
  const visiblePosts = useMemo(() => {
    if (filter === "all") return posts;
    if (filter === "archived") return posts.filter((post) => post.archived);
    return posts.filter((post) => !post.archived);
  }, [posts, filter]);

  async function handleDelete(post: Post) {
    if (!confirm(`Delete "${post.title}"? This can't be undone.`)) {
      return;
    }

    setDeletingId(post.id);

    try {
      const response = await fetch(`/api/admin/posts/${post.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const body = (await response.json()) as { message?: string };

        alert(body.message ?? "Failed to delete post");
        return;
      }

      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  async function handleToggleArchive(post: Post) {
    setArchivingId(post.id);

    try {
      const response = await fetch(`/api/admin/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ archived: !post.archived }),
      });

      if (!response.ok) {
        const body = (await response.json()) as { message?: string };

        alert(body.message ?? "Failed to update post");
        return;
      }

      router.refresh();
    } finally {
      setArchivingId(null);
    }
  }

  async function handleTogglePin(post: Post) {
    setPinningId(post.id);

    try {
      const response = await fetch(`/api/admin/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pinned: !post.pinned }),
      });

      if (!response.ok) {
        const body = (await response.json()) as { message?: string };

        alert(body.message ?? "Failed to update post");
        return;
      }

      router.refresh();
    } finally {
      setPinningId(null);
    }
  }

  if (posts.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="mb-4 text-6xl">📝</div>
        <p className="mb-2 text-xl text-zinc-600">No posts yet</p>
        <p className="font-mono text-sm text-zinc-500">
          Click &quot;New Post&quot; to create your first one
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        {(["active", "archived", "all"] as const).map((option) => (
          <button
            className={`px-3 py-1.5 font-mono text-xs uppercase transition-colors ${
              filter === option
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
            key={option}
            onClick={() => setFilter(option)}
            type="button"
          >
            {option} (
            {option === "active"
              ? activeCount
              : option === "archived"
                ? archivedCount
                : posts.length}
            )
          </button>
        ))}
      </div>

      {visiblePosts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-zinc-500">No posts in this view</p>
        </div>
      ) : (
        visiblePosts.map((post) => (
          <div
            className={`group border-2 p-4 transition-all sm:p-6 ${
              post.archived
                ? "border-zinc-200 bg-zinc-50 opacity-60"
                : "border-zinc-200 hover:border-zinc-900"
            }`}
            key={post.id}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div className="grow">
                <div className="mb-2 flex items-center gap-3">
                  <span className="bg-zinc-900 px-2 py-1 font-mono text-xs text-white">
                    No. {post.number}
                  </span>
                  <time className="font-mono text-xs tracking-wider text-zinc-500 uppercase">
                    {format(new Date(post.publishedAt), "MMM d, yyyy")}
                  </time>
                  {post.pinned && (
                    <span className="flex items-center gap-1 border border-zinc-900 bg-zinc-900 px-2 py-1 font-mono text-xs tracking-wider text-white uppercase">
                      <Pin size={12} />
                      Pinned
                    </span>
                  )}
                  {post.archived && (
                    <span className="border border-zinc-400 px-2 py-1 font-mono text-xs tracking-wider text-zinc-500 uppercase">
                      Archived
                    </span>
                  )}
                </div>

                <h3 className="mb-2 text-xl leading-tight font-bold text-zinc-900">
                  {post.title}
                </h3>

                <p className="line-clamp-2 text-sm text-zinc-600">
                  {getPostExcerpt(post).slice(0, 150)}
                </p>

                <div className="mt-2 flex items-center gap-4 font-mono text-xs text-zinc-500">
                  <span>👏 {post.clapCount.toLocaleString()}</span>
                  <span>🔗 {post.shareCount.toLocaleString()}</span>
                </div>

                {(post.category ?? post.tags.length > 0) && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {post.category && (
                      <span className="border border-zinc-900 px-2 py-0.5 font-mono text-xs text-zinc-900">
                        {post.category.name}
                      </span>
                    )}
                    {post.tags.map((tag) => (
                      <span
                        className="bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-600"
                        key={tag.id}
                      >
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:shrink-0 sm:flex-nowrap sm:transition-opacity md:opacity-0 md:group-hover:opacity-100">
                <Link
                  className="border-2 border-zinc-900 p-2 text-zinc-900 transition-colors hover:bg-zinc-900 hover:text-white"
                  href={`/admin/posts/${post.id}/engagement`}
                  title="View who clapped or shared"
                >
                  <Users size={18} />
                </Link>

                <button
                  className="border-2 border-zinc-900 p-2 text-zinc-900 transition-colors hover:bg-zinc-900 hover:text-white disabled:opacity-50"
                  disabled={
                    pinningId === post.id ||
                    (!post.pinned && pinnedCount >= MAX_PINNED_POSTS)
                  }
                  onClick={() => handleTogglePin(post)}
                  title={
                    post.pinned
                      ? "Unpin post"
                      : pinnedCount >= MAX_PINNED_POSTS
                        ? `Only ${MAX_PINNED_POSTS} posts can be pinned at once`
                        : "Pin post"
                  }
                  type="button"
                >
                  {post.pinned ? <PinOff size={18} /> : <Pin size={18} />}
                </button>

                <button
                  className="border-2 border-zinc-900 p-2 text-zinc-900 transition-colors hover:bg-zinc-900 hover:text-white disabled:opacity-50"
                  disabled={archivingId === post.id}
                  onClick={() => handleToggleArchive(post)}
                  title={post.archived ? "Unarchive post" : "Archive post"}
                  type="button"
                >
                  {post.archived ? (
                    <ArchiveRestore size={18} />
                  ) : (
                    <Archive size={18} />
                  )}
                </button>

                <Link
                  className="border-2 border-zinc-900 p-2 text-zinc-900 transition-colors hover:bg-zinc-900 hover:text-white"
                  href={`/admin/posts/${post.id}/edit`}
                  title="Edit post"
                >
                  <Edit size={18} />
                </Link>

                <button
                  className="border-2 border-red-600 p-2 text-red-600 transition-colors hover:bg-red-600 hover:text-white disabled:opacity-50"
                  disabled={deletingId === post.id}
                  onClick={() => handleDelete(post)}
                  title="Delete post"
                  type="button"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
