import Link from "next/link";
import { format } from "date-fns";
import { Pin } from "lucide-react";

import { getPostExcerpt } from "@/lib/posts";
import { Post } from "@/types/post";

export function BlogCard({ post }: { post: Post }) {
  const excerpt = getPostExcerpt(post);
  const date = format(new Date(post.publishedAt), "MMM d, yyyy").toLowerCase();

  return (
    <Link
      className="group relative block cursor-pointer overflow-hidden border border-zinc-200 bg-white transition-all duration-300 hover:border-zinc-900"
      href={`/blog/${post.slug}`}
    >
      {post.pinned && (
        <div className="absolute top-0 left-0 z-10 flex items-center gap-1 bg-zinc-900 px-3 py-1 font-mono text-xs text-white">
          <Pin size={12} />
          Pinned
        </div>
      )}

      <div className="absolute top-0 right-0 bg-zinc-900 px-3 py-1 font-mono text-xs text-white">
        {post.number}
      </div>

      <div className="flex h-full flex-col p-6 md:p-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px w-8 bg-zinc-300 transition-all group-hover:w-12" />
          <time className="font-mono text-xs tracking-wider text-zinc-500 uppercase">
            {date}
          </time>
          {post.category && (
            <span className="border border-zinc-300 px-2 py-0.5 font-mono text-xs tracking-wider text-zinc-600 uppercase">
              {post.category.name}
            </span>
          )}
        </div>

        <h3 className="mb-4 text-xl leading-tight font-bold text-zinc-900 md:text-2xl">
          {post.title}
        </h3>

        <p className="grow text-base leading-relaxed text-zinc-600">{excerpt}</p>

        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                className="border border-dashed border-zinc-300 px-2 py-0.5 font-mono text-xs text-zinc-500"
                key={tag.id}
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        <div className="mt-6 flex items-center gap-2 text-zinc-900 transition-all group-hover:gap-4">
          <span className="font-mono text-sm">read</span>
          <div className="h-px grow bg-zinc-900 opacity-0 transition-opacity group-hover:opacity-100" />
          <span className="text-xl">→</span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-0 w-0 border-b-[20px] border-l-[20px] border-b-zinc-900 border-l-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  );
}
